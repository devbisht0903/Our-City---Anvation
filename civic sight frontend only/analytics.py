"""
OurCity analytics engine
===========================
Pure-Python/pandas logic (no Streamlit, no database) so every function is unit-testable.

Pipeline (see analyze_portfolio):
  1. Earned Value metrics  -> CPI / SPI / cost + schedule variance / projected final cost
  2. Milestone delay table -> days late vs planned date
  3. Spend forensics       -> robust z-score spikes + duplicate invoices
  4. Isolation Forest      -> portfolio-level "this project looks unlike the others"
  5. Rule-based flags      -> human-readable reasons for every red flag
  6. Composite risk score  -> 0-100 -> Healthy / Watch / Red flag
  7. Participatory priority-> risk x citizen upvotes x sector impact
  8. Plain-language summary-> template (offline) with optional LLM
"""
from __future__ import annotations

import json
import math
import os
import re
from dataclasses import dataclass, field
from datetime import date
from typing import Any

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# Fixed "today" so the synthetic demo is reproducible (change to date.today() for live data).
AS_OF = date(2026, 10, 8)

# ----------------------------------------------------------------------------- configuration
CFG: dict[str, float] = dict(
    overrun_warn=0.10,      # projected final cost >10% above allocation -> warning
    overrun_crit=0.25,      # >25% -> critical
    underspend_gap=25.0,    # spend% lags time% by >25 pts -> underspend flag
    gap_warn=20.0,          # spend% - progress% > 20 pts -> warning
    gap_crit=30.0,          # > 30 pts -> critical
    delay_warn=30,          # milestone >=30 days late -> warning
    delay_crit=90,          # >=90 days late -> critical
    spi_warn=0.85,
    spi_crit=0.70,
    neg_warn=0.50,          # share of negative citizen reports
    neg_crit=0.70,
    min_reports=3,
    spike_mz=3.5,           # modified z-score threshold (Iglewicz-Hoaglin)
    spike_ratio=2.5,        # ...and invoice must be >2.5x the median invoice
    dup_window_days=30,
    watch_band=30,
    red_band=60,
)

# How much a failing project hurts citizens, used for participatory prioritisation.
SECTOR_IMPACT: dict[str, float] = {
    "Healthcare": 1.30, "Water": 1.25, "Schools": 1.20,
    "Roads": 1.10, "Transit": 1.00, "Parks": 0.80,
}

NEG_THRESHOLD = -0.15   # sentiment score below this = negative report
POS_THRESHOLD = 0.15

# ----------------------------------------------------------------------------- formatting helpers
def fmt_inr(x: float) -> str:
    """Format rupees the way citizens read them (Cr = crore, L = lakh)."""
    sign, x = ("-" if x < 0 else ""), abs(x)
    if x >= 1e7:
        return f"{sign}₹{x / 1e7:.2f} Cr"
    if x >= 1e5:
        return f"{sign}₹{x / 1e5:.1f} L"
    return f"{sign}₹{x:,.0f}"


def _d(x: Any) -> date:
    """Coerce str / Timestamp / date into a plain date."""
    return pd.Timestamp(x).date()


# ----------------------------------------------------------------------------- sentiment (offline lexicon)
_POS = set("""good great excellent helpful regular quality clean faster happy satisfied improved smooth
progress well timely useful thank thanks appreciate safe organised organized proper neat""".split())
_NEG = set("""stopped abandoned delay delayed delays poor cracks cracked dangerous unsafe wasted waste stolen
corruption bribe bribery nobody bad dust noise pending incomplete leak leaking broken ignored complaint
complaints accident flooding flooded misuse shoddy substandard unattended garbage mess worse stuck""".split())
_NEGATORS = {"no", "not", "never", "without"}
_TOKEN = re.compile(r"[a-z']+")


def score_sentiment(text: str) -> float:
    """Lexicon sentiment in [-1, 1]. Dependency-free so the demo works offline."""
    toks = _TOKEN.findall(text.lower())
    total, hits = 0, 0
    for i, t in enumerate(toks):
        val = 1 if t in _POS else -1 if t in _NEG else 0
        if val:
            if i > 0 and toks[i - 1] in _NEGATORS:
                val = -val
            total += val
            hits += 1
    return 0.0 if hits == 0 else total / hits


def sentiment_label(score: float) -> str:
    return "negative" if score < NEG_THRESHOLD else "positive" if score > POS_THRESHOLD else "neutral"


# ----------------------------------------------------------------------------- 1. earned value
def compute_earned_value(allocated: float, start: Any, end: Any, pct_complete: float,
                         actual_spend: float, as_of: Any = AS_OF) -> dict[str, float]:
    """
    Earned Value Management in plain terms:
      PV (planned value)  = budget x share of time that should have elapsed
      EV (earned value)   = budget x share of work actually done
      AC (actual cost)    = money actually spent
      CPI = EV / AC  (<1 means we pay more than the work is worth)
      SPI = EV / PV  (<1 means we are behind schedule)
      EAC = allocated / CPI  (projected final cost if the trend continues)
    """
    start, end, as_of = _d(start), _d(end), _d(as_of)
    total_days = max((end - start).days, 1)
    planned_frac = float(np.clip((as_of - start).days / total_days, 0, 1))
    progress_frac = float(np.clip(pct_complete / 100.0, 0, 1))
    pv, ev, ac = allocated * planned_frac, allocated * progress_frac, float(actual_spend)
    cpi = ev / ac if ac > 0 else 1.0
    spi = ev / pv if pv > 0 else 1.0
    eac = allocated / cpi if cpi > 0 else allocated * 5
    eac = min(eac, allocated * 5)
    planned_pct = planned_frac * 100
    spend_pct = ac / allocated * 100 if allocated else 0.0
    return dict(
        pv=pv, ev=ev, ac=ac, cpi=cpi, spi=spi, cv=ev - ac, sv=ev - pv, eac=eac,
        planned_pct=planned_pct, progress_pct=progress_frac * 100, spend_pct=spend_pct,
        overrun_pct=(eac / allocated - 1) * 100 if allocated else 0.0,
        spend_rate=spend_pct / max(planned_pct, 1.0),
    )


# ----------------------------------------------------------------------------- 2. milestone delays
DELAY_COLUMNS = ["seq", "name", "planned_date", "actual_date", "delay_days", "state"]


def milestone_delays(ms: pd.DataFrame, as_of: Any = AS_OF) -> pd.DataFrame:
    """Per-milestone delay in days (positive = late, negative = early)."""
    as_of = _d(as_of)
    rows, found_current = [], False
    for r in ms.sort_values("seq").itertuples(index=False):
        planned = _d(r.planned_date)
        if not pd.isna(r.actual_date):                      # finished
            actual = _d(r.actual_date)
            delay = (actual - planned).days
            state = "Completed late" if delay > 7 else "Completed on time"
        elif planned < as_of:                               # should be done, is not
            actual, delay, state = None, (as_of - planned).days, "Overdue"
        else:                                               # still in the future
            actual, delay = None, 0
            state = "Upcoming" if found_current else "In progress"
            found_current = True
        rows.append(dict(seq=int(r.seq), name=r.name, planned_date=planned,
                         actual_date=actual, delay_days=int(delay), state=state))
    return pd.DataFrame(rows, columns=DELAY_COLUMNS)


# ----------------------------------------------------------------------------- 3. spend forensics
def spend_anomalies(spend: pd.DataFrame) -> dict[str, list[dict]]:
    """Detect (a) sudden spend spikes via modified z-score and (b) duplicate invoices."""
    out: dict[str, list[dict]] = {"spikes": [], "duplicates": []}
    if len(spend) < 4:
        return out
    amt = spend["amount"].to_numpy(dtype=float)
    med = float(np.median(amt))
    mad = float(np.median(np.abs(amt - med))) or float(np.mean(np.abs(amt - med))) or 1.0
    mz = 0.6745 * (amt - med) / mad
    for r, z in zip(spend.itertuples(index=False), mz):
        if z > CFG["spike_mz"] and r.amount > CFG["spike_ratio"] * med:
            out["spikes"].append(dict(
                invoice_id=r.invoice_id, date=pd.Timestamp(r.date), amount=float(r.amount),
                multiple=float(r.amount / med),
                reason=f"Invoice {r.invoice_id} of {fmt_inr(r.amount)} is {r.amount / med:.1f}x the typical invoice ({fmt_inr(med)})."))
    s = spend.assign(_amt=spend["amount"].round(0), _dt=pd.to_datetime(spend["date"]))
    for (vendor, amount), g in s.groupby(["vendor", "_amt"]):
        if len(g) >= 2 and (g["_dt"].max() - g["_dt"].min()).days <= CFG["dup_window_days"]:
            out["duplicates"].append(dict(
                vendor=vendor, amount=float(amount), invoice_ids=list(g["invoice_id"]),
                dates=[d for d in g["_dt"]],
                reason=f"{vendor} billed exactly {fmt_inr(amount)} twice within "
                       f"{(g['_dt'].max() - g['_dt'].min()).days} days ({', '.join(g['invoice_id'])})."))
    for inv, g in spend.groupby("invoice_id"):
        if len(g) > 1:
            out["duplicates"].append(dict(vendor=g['vendor'].iloc[0], amount=float(g['amount'].iloc[0]),
                                          invoice_ids=[inv], dates=list(pd.to_datetime(g['date'])),
                                          reason=f"Invoice number {inv} appears {len(g)} times."))
    return out


# ----------------------------------------------------------------------------- 4. ML anomaly layer
ML_FEATURES = ["cpi", "spi", "spend_rate", "delay_days", "neg_ratio"]
FEATURE_LABELS = {
    "cpi": "cost efficiency (CPI)", "spi": "schedule efficiency (SPI)",
    "spend_rate": "spend rate vs time elapsed", "delay_days": "milestone delay in days",
    "neg_ratio": "share of negative citizen reports",
}


def detect_ml_anomalies(feat: pd.DataFrame, contamination: float = 0.12, seed: int = 42) -> pd.DataFrame:
    """
    Isolation Forest over the portfolio. Returns columns: ml_score (0-1, higher = stranger),
    ml_flag (bool) and ml_reason (text naming the feature that deviates most).
    """
    out = pd.DataFrame(index=feat.index, data=dict(ml_score=0.0, ml_flag=False, ml_reason=""))
    if len(feat) < 8:                                       # too few projects for a forest
        return out
    X = feat[ML_FEATURES].astype(float).fillna(0.0)
    Xs = StandardScaler().fit_transform(X)
    iso = IsolationForest(n_estimators=200, contamination=contamination, random_state=seed).fit(Xs)
    raw = -iso.decision_function(Xs)
    out["ml_score"] = (raw - raw.min()) / (raw.max() - raw.min() + 1e-9)
    out["ml_flag"] = iso.predict(Xs) == -1
    med, std = X.median(), X.std(ddof=0).replace(0, 1.0)
    z = (X - med) / std
    for idx in out.index[out["ml_flag"]]:
        f = z.loc[idx].abs().idxmax()
        out.loc[idx, "ml_reason"] = (
            f"Statistically unusual versus the other {len(feat) - 1} projects, mainly because of "
            f"{FEATURE_LABELS[f]} = {X.loc[idx, f]:.2f} (portfolio median {med[f]:.2f}).")
    return out


# ----------------------------------------------------------------------------- result container
@dataclass
class Flag:
    code: str
    severity: str          # "critical" | "warning" | "info"
    title: str
    reason: str


SEV_RANK = {"critical": 3, "warning": 2, "info": 1}


@dataclass
class ProjectAnalysis:
    project_id: str
    name: str
    sector: str
    allocated: float
    ev: dict[str, float]
    delays: pd.DataFrame
    spend_anoms: dict[str, list[dict]]
    n_reports: int
    neg_ratio: float
    open_upvotes: int
    top_issue: dict | None
    max_delay: int
    worst_milestone: str
    ml_score: float = 0.0
    ml_flag: bool = False
    ml_reason: str = ""
    flags: list[Flag] = field(default_factory=list)
    components: dict[str, float] = field(default_factory=dict)
    risk_score: float = 0.0
    status: str = "Healthy"
    priority: float = 0.0
    priority_rank: int = 0


# ----------------------------------------------------------------------------- 5. rule-based flags
def _is_underspend(ev: dict[str, float]) -> bool:
    return ev["planned_pct"] >= 30 and ev["spend_pct"] < ev["planned_pct"] - CFG["underspend_gap"]


def build_flags(a: ProjectAnalysis) -> list[Flag]:
    """Every flag carries a plain-English reason that quotes the real numbers."""
    ev, flags = a.ev, []
    # Budget deviation: overspend (projected) ---------------------------------------------------
    over = ev["overrun_pct"] / 100
    if ev["ac"] > a.allocated:
        flags.append(Flag("BUDGET_EXCEEDED", "critical", "Budget already exceeded",
                          f"Spent {fmt_inr(ev['ac'])} against an allocation of {fmt_inr(a.allocated)}."))
    elif over > CFG["overrun_warn"]:
        sev = "critical" if over > CFG["overrun_crit"] else "warning"
        flags.append(Flag("BUDGET_OVERRUN", sev, "Budget overrun projected",
                          f"At the current cost efficiency (CPI {ev['cpi']:.2f}) the final cost is projected at "
                          f"{fmt_inr(ev['eac'])}, {ev['overrun_pct']:.0f}% above the {fmt_inr(a.allocated)} allocation."))
    # Budget deviation: underspend --------------------------------------------------------------
    if _is_underspend(ev):
        flags.append(Flag("UNDERSPEND", "warning", "Underspending - work may have stalled",
                          f"Only {ev['spend_pct']:.0f}% of the budget is spent although {ev['planned_pct']:.0f}% of the "
                          f"time has passed. Money is not reaching the site, or billing is hidden."))
    # Spend vs progress mismatch ----------------------------------------------------------------
    gap = ev["spend_pct"] - ev["progress_pct"]
    if gap > CFG["gap_warn"]:
        sev = "critical" if gap > CFG["gap_crit"] else "warning"
        flags.append(Flag("SPEND_PROGRESS_GAP", sev, "Spending runs ahead of progress",
                          f"{ev['spend_pct']:.0f}% of the budget is spent but only {ev['progress_pct']:.0f}% of the work "
                          f"is complete (gap {gap:.0f} points)."))
    # Delayed milestones ------------------------------------------------------------------------
    if a.max_delay >= CFG["delay_warn"]:
        sev = "critical" if a.max_delay >= CFG["delay_crit"] else "warning"
        late = int((a.delays["delay_days"] >= CFG["delay_warn"]).sum())
        flags.append(Flag("MILESTONE_DELAY", sev, "Delayed milestones",
                          f"'{a.worst_milestone}' is {a.max_delay} days behind plan; {late} milestone(s) are "
                          f"30+ days late."))
    if ev["spi"] < CFG["spi_warn"]:
        sev = "critical" if ev["spi"] < CFG["spi_crit"] else "warning"
        flags.append(Flag("SCHEDULE_SLIP", sev, "Behind schedule overall",
                          f"Schedule efficiency (SPI) is {ev['spi']:.2f}: only {ev['progress_pct']:.0f}% of the work is "
                          f"done where {ev['planned_pct']:.0f}% was planned."))
    # Spend forensics ---------------------------------------------------------------------------
    for s in a.spend_anoms["spikes"]:
        flags.append(Flag("SPEND_SPIKE", "warning", "Sudden spend spike", s["reason"]))
    for d in a.spend_anoms["duplicates"]:
        flags.append(Flag("DUPLICATE_INVOICE", "critical", "Possible duplicate invoice", d["reason"]))
    # Citizen voice -----------------------------------------------------------------------------
    if a.n_reports >= CFG["min_reports"] and a.neg_ratio >= CFG["neg_warn"]:
        sev = "critical" if a.neg_ratio >= CFG["neg_crit"] else "warning"
        flags.append(Flag("CITIZEN_NEGATIVE", sev, "Citizens report problems",
                          f"{a.neg_ratio * 100:.0f}% of {a.n_reports} citizen reports are negative."))
    # ML layer ----------------------------------------------------------------------------------
    if a.ml_flag:
        flags.append(Flag("ML_ANOMALY", "info", "Flagged by anomaly model (Isolation Forest)", a.ml_reason))
    return sorted(flags, key=lambda f: -SEV_RANK[f.severity])


# ----------------------------------------------------------------------------- 6. composite risk score
def risk_components(a: ProjectAnalysis) -> dict[str, float]:
    """Transparent 0-100 score: cost 35 + schedule 30 + citizens 15 + ML 10 + integrity 10."""
    ev = a.ev
    cost = float(np.clip((1 - ev["cpi"]) / 0.5, 0, 1)) * 35
    if _is_underspend(ev):
        cost = max(cost, 8.0)
    sched = max(float(np.clip(a.max_delay / 120, 0, 1)), float(np.clip((1 - ev["spi"]) / 0.5, 0, 1))) * 30
    citizens = a.neg_ratio * 15 if a.n_reports >= 2 else 0.0
    ml = a.ml_score * (10 if a.ml_flag else 3)
    integrity = min(10.0, 5.0 * len(a.spend_anoms["duplicates"]) + 5.0 * len(a.spend_anoms["spikes"]))
    return {"Cost": round(cost, 1), "Schedule": round(sched, 1), "Citizen sentiment": round(citizens, 1),
            "Anomaly model": round(ml, 1), "Spend integrity": round(integrity, 1)}


def risk_band(score: float) -> str:
    return "Red flag" if score >= CFG["red_band"] else "Watch" if score >= CFG["watch_band"] else "Healthy"


# ----------------------------------------------------------------------------- orchestration
def analyze_portfolio(frames: dict[str, pd.DataFrame], as_of: Any = AS_OF
                      ) -> tuple[pd.DataFrame, dict[str, ProjectAnalysis]]:
    """Run the whole pipeline. Returns (portfolio table, {project_id: ProjectAnalysis})."""
    proj, ms, sp, rp = (frames[k] for k in ("projects", "milestones", "spend", "reports"))
    partial: dict[str, ProjectAnalysis] = {}
    feats = []
    for p in proj.itertuples(index=False):
        pid = p.project_id
        psp = sp[sp["project_id"] == pid]
        ev = compute_earned_value(p.allocated, p.planned_start, p.planned_end, p.pct_complete,
                                  float(psp["amount"].sum()), as_of)
        delays = milestone_delays(ms[ms["project_id"] == pid], as_of)
        prp = rp[rp["project_id"] == pid]
        n = len(prp)
        ratio = float((prp["sentiment"] < NEG_THRESHOLD).sum() / n) if n else 0.0
        open_r = prp[prp["status"] != "Resolved"].sort_values("upvotes", ascending=False)
        top = None
        open_neg = open_r[open_r["sentiment"] < NEG_THRESHOLD]
        if len(open_neg):
            t = open_neg.iloc[0]
            top = dict(text=t["text"], upvotes=int(t["upvotes"]), category=t["category"])
        max_delay = int(max(0, delays["delay_days"].max())) if len(delays) else 0
        worst = delays.loc[delays["delay_days"].idxmax(), "name"] if max_delay > 0 else ""
        partial[pid] = ProjectAnalysis(
            project_id=pid, name=p.name, sector=p.sector, allocated=float(p.allocated), ev=ev,
            delays=delays, spend_anoms=spend_anomalies(psp), n_reports=n, neg_ratio=ratio,
            open_upvotes=int(open_r["upvotes"].sum()) if len(open_r) else 0, top_issue=top,
            max_delay=max_delay, worst_milestone=worst)
        feats.append(dict(project_id=pid, cpi=min(ev["cpi"], 2.5), spi=min(ev["spi"], 2.5),
                          spend_rate=ev["spend_rate"], delay_days=max_delay, neg_ratio=ratio))
    ml = detect_ml_anomalies(pd.DataFrame(feats).set_index("project_id"))
    for pid, a in partial.items():
        a.ml_score, a.ml_flag, a.ml_reason = float(ml.loc[pid, "ml_score"]), bool(ml.loc[pid, "ml_flag"]), ml.loc[pid, "ml_reason"]
        a.flags = build_flags(a)
        a.components = risk_components(a)
        a.risk_score = round(min(100.0, sum(a.components.values())), 1)
        a.status = risk_band(a.risk_score)
    # 7. Participatory priority = risk x (1 + ln(1 + open upvotes)) x sector impact
    raw = {pid: a.risk_score * (1 + math.log1p(a.open_upvotes)) * SECTOR_IMPACT.get(a.sector, 1.0)
           for pid, a in partial.items()}
    top_raw = max(raw.values()) or 1.0
    for rank, pid in enumerate(sorted(raw, key=raw.get, reverse=True), 1):
        partial[pid].priority = round(raw[pid] / top_raw * 100, 1)
        partial[pid].priority_rank = rank
    rows = []
    for p in proj.itertuples(index=False):
        a = partial[p.project_id]
        rows.append(dict(
            project_id=a.project_id, name=a.name, sector=a.sector, lat=p.lat, lon=p.lon, vendor=p.vendor,
            showcase=p.showcase, allocated=a.allocated, spent=a.ev["ac"], progress_pct=a.ev["progress_pct"],
            planned_pct=a.ev["planned_pct"], cpi=a.ev["cpi"], spi=a.ev["spi"], eac=a.ev["eac"],
            overrun_pct=a.ev["overrun_pct"], max_delay=a.max_delay, neg_ratio=a.neg_ratio,
            n_reports=a.n_reports, open_upvotes=a.open_upvotes, risk_score=a.risk_score, status=a.status,
            priority=a.priority, priority_rank=a.priority_rank, n_flags=len(a.flags),
            top_flag=a.flags[0].title if a.flags else "None"))
    return pd.DataFrame(rows), partial


# ----------------------------------------------------------------------------- 8. plain-language summaries
VERDICTS = {
    "Healthy": "✅ Healthy - money and work are moving together.",
    "Watch": "🟠 Watch - gaps are opening between plan and reality; keep an eye on it.",
    "Red flag": "🔴 Red flag - spending, schedule or citizen complaints need urgent answers.",
}


def citizen_verdict(a: ProjectAnalysis) -> str:
    return VERDICTS[a.status]


def _facts(a: ProjectAnalysis) -> dict:
    ev = a.ev
    return dict(
        project=a.name, sector=a.sector, status=a.status, risk_score=a.risk_score,
        allocated=fmt_inr(a.allocated), spent=fmt_inr(ev["ac"]), spend_pct=round(ev["spend_pct"]),
        progress_pct=round(ev["progress_pct"]), time_elapsed_pct=round(ev["planned_pct"]),
        cpi=round(ev["cpi"], 2), spi=round(ev["spi"], 2), projected_final_cost=fmt_inr(ev["eac"]),
        projected_overrun_pct=round(ev["overrun_pct"]), worst_milestone=a.worst_milestone,
        worst_delay_days=a.max_delay, citizen_reports=a.n_reports,
        negative_share_pct=round(a.neg_ratio * 100), top_citizen_issue=a.top_issue,
        flags=[dict(title=f.title, severity=f.severity, reason=f.reason) for f in a.flags],
        priority_rank=a.priority_rank)


def _money_sentence(a: ProjectAnalysis) -> str:
    ev, budget = a.ev, fmt_inr(a.allocated)
    if ev["spend_pct"] - ev["progress_pct"] > CFG["gap_warn"]:
        return (f"Of the {budget} budget, {ev['spend_pct']:.0f}% ({fmt_inr(ev['ac'])}) is already spent, but only "
                f"{ev['progress_pct']:.0f}% of the work is done. If this continues the project will cost about "
                f"{fmt_inr(ev['eac'])} ({ev['overrun_pct']:+.0f}% versus plan).")
    if _is_underspend(ev):
        return (f"Only {ev['spend_pct']:.0f}% of the {budget} budget is spent although {ev['planned_pct']:.0f}% of the "
                f"time has passed, so work may have stalled.")
    if ev["overrun_pct"] > CFG["overrun_warn"] * 100:
        return (f"Spending ({ev['spend_pct']:.0f}% of the {budget} budget) is running ahead of progress "
                f"({ev['progress_pct']:.0f}% complete). At this efficiency the final cost would be about "
                f"{fmt_inr(ev['eac'])} ({ev['overrun_pct']:+.0f}% versus plan).")
    return (f"Spending ({ev['spend_pct']:.0f}% of the {budget} budget) is in step with progress "
            f"({ev['progress_pct']:.0f}% complete).")


def _schedule_sentence(a: ProjectAnalysis) -> str:
    if a.max_delay >= CFG["delay_warn"]:
        return f"The milestone \"{a.worst_milestone}\" is {a.max_delay} days behind schedule."
    if a.max_delay > 0:
        return f"The slowest milestone is only {a.max_delay} days behind, which is within tolerance."
    return "All milestones are on or ahead of schedule."


def _citizen_sentence(a: ProjectAnalysis) -> str:
    if a.n_reports == 0:
        return "No citizen reports have been filed yet."
    s = f"Citizens filed {a.n_reports} report(s); {a.neg_ratio * 100:.0f}% are negative."
    if a.top_issue:
        s += f" Most-supported open complaint ({a.top_issue['upvotes']} upvotes): \"{a.top_issue['text']}\""
    return s


def template_summary(a: ProjectAnalysis, mode: str = "simple") -> str:
    """Offline summary that always quotes real numbers. mode = 'simple' | 'detailed'."""
    head = f"**{a.name}** ({a.sector}) is rated **{a.status}** (risk {a.risk_score:.0f}/100)."
    if mode == "simple":
        parts = [head, _money_sentence(a), _schedule_sentence(a), _citizen_sentence(a)]
        if a.flags and a.status != "Healthy":
            parts.append(f"Biggest concern: {a.flags[0].title.lower()}.")
        return " ".join(parts)
    ev = a.ev
    lines = [head, "",
             f"**Money.** {_money_sentence(a)} Cost efficiency (CPI) is {ev['cpi']:.2f}: every ₹1 spent has bought "
             f"₹{ev['cpi']:.2f} of work. Cost variance is {fmt_inr(ev['cv'])}.",
             f"**Time.** {_schedule_sentence(a)} Schedule efficiency (SPI) is {ev['spi']:.2f}; "
             f"{ev['progress_pct']:.0f}% complete versus {ev['planned_pct']:.0f}% planned.",
             f"**Citizens.** {_citizen_sentence(a)}"]
    if a.flags:
        lines += ["", "**Red flags raised:**"] + [f"- *{f.title}* ({f.severity}): {f.reason}" for f in a.flags]
    else:
        lines += ["", "No red flags were raised."]
    lines += ["", f"**Priority.** Ranked #{a.priority_rank} for attention (priority score {a.priority:.0f}/100), "
                  f"combining risk, {a.open_upvotes} open citizen upvotes and the {a.sector.lower()} sector's impact."]
    return "\n".join(lines)


def _llm_summary(a: ProjectAnalysis, mode: str, language: str) -> str | None:
    """Optional LLM rewrite. Returns None on any problem so callers fall back to the template."""
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        return None
    try:
        import anthropic  # optional dependency
        client = anthropic.Anthropic(api_key=key)
        msg = client.messages.create(
            model=os.getenv("CIVICSIGHT_LLM_MODEL", "claude-sonnet-5-5"), max_tokens=600,
            system=("You explain public-project health to ordinary citizens in plain language. Use ONLY the facts "
                    "and numbers provided; never invent figures. Be neutral and non-accusatory: describe "
                    "deviations, do not allege wrongdoing. 'simple' = 3-4 sentences; 'detailed' = short markdown "
                    "sections for money, time, citizens, and what to watch."),
            messages=[dict(role="user", content=f"Mode: {mode}\nLanguage: {language}\nFacts:\n{json.dumps(_facts(a), default=str)}")])
        text = "".join(b.text for b in msg.content if getattr(b, "type", "") == "text").strip()
        return text or None
    except Exception:
        return None


def generate_summary(a: ProjectAnalysis, mode: str = "simple", use_llm: bool = False,
                     language: str = "English") -> tuple[str, str]:
    """Return (summary_text, source) where source is 'LLM' or 'template'."""
    if use_llm or language != "English":
        text = _llm_summary(a, mode, language)
        if text:
            return text, "LLM"
    return template_summary(a, mode), "template"