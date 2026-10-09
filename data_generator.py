"""
Synthetic data generator for OurCity (deterministic: same seed -> same city).

Produces four DataFrames: projects, milestones, spend (invoice ledger), reports (citizen issues).
The first three projects are hand-crafted for the final demo:
    CS-001  HEALTHY       on budget, on schedule, happy citizens
    CS-002  PROBLEMATIC   ~85% projected overrun, 100-day slip, duplicate invoice, spend spike, angry citizens
    CS-003  BORDERLINE    "Watch" - shows the score is graded, not binary
The other 22 are randomly drawn from healthy / watch / bad / stalled profiles.
"""
from __future__ import annotations

from datetime import date, timedelta

import numpy as np
import pandas as pd

from analytics import AS_OF, score_sentiment

SEED = 42
CITY_CENTER = (12.9716, 77.5946)   # change to your city's lat/lon

SECTORS = ["Roads", "Water", "Schools", "Healthcare", "Parks", "Transit"]
NOUNS = {
    "Roads": ["Arterial Road Resurfacing", "Footpath Upgrade", "Junction Improvement", "Flyover Repair"],
    "Water": ["Pipeline Replacement", "Stormwater Drain", "Lake Rejuvenation", "Treatment Plant Upgrade"],
    "Schools": ["Government School Block", "Smart Classrooms", "School Toilet Blocks"],
    "Healthcare": ["Primary Health Centre", "Diagnostic Lab", "Ambulance Bay"],
    "Parks": ["Community Park", "Playground Upgrade", "Jogging Track"],
    "Transit": ["Bus Depot", "Bus Shelters", "Feeder Bus Stop Upgrade"],
}
VENDORS = ["Apex Infra Pvt Ltd", "Bharat Civil Works", "Metro Builders", "GreenLeaf Contractors",
           "Sunrise Constructions", "Nirmaan Projects", "Delta Engineering", "Vistara Infra"]
MILESTONES = [("Survey & design", 5), ("Approvals & tendering", 10), ("Groundwork", 20),
              ("Main construction", 40), ("Finishing & testing", 15), ("Handover", 10)]
INVOICE_NOTES = ["Mobilisation advance", "Running bill", "Material supply", "Labour payment",
                 "Equipment hire", "Milestone payment"]
CATEGORIES = ["Delay", "Quality", "Safety", "Corruption / misuse of funds", "Nuisance", "Suggestion"]

NEG_TEXT = [
    "Work has stopped for weeks and the site is unattended. Money is being wasted.",
    "Poor quality work, cracks are already visible. Looks like corruption.",
    "Dust and noise all day with no barricades. It is dangerous for children.",
    "Project is badly delayed and nobody explains why. Complaints are ignored.",
    "Leaking pipes and broken road edges after the work. Shoddy finish.",
    "No progress for months. Residents are stuck with the mess.",
]
NEU_TEXT = [
    "Please share the expected completion date for this project.",
    "Traffic diversion near the site is unclear. Signboards would help.",
    "Work is going on but the timeline is not displayed publicly.",
]
POS_TEXT = [
    "Good progress here. The team is regular and helpful.",
    "Site is clean and well managed. Quality looks great.",
    "Work finished faster than expected. Very happy with the timely progress.",
]


def _showcase_specs() -> list[dict]:
    c = CITY_CENTER
    return [
        dict(project_id="CS-001", showcase="HEALTHY", name="Community Health Centre - Ward 7", sector="Healthcare",
             vendor="Nirmaan Projects", allocated=8e7, start=date(2025, 11, 1), end=date(2027, 1, 31),
             progress=76, cost_factor=0.97, delay_days=-2, n_reports=6, neg=0.0, pos=0.75, upvotes=4,
             lat=c[0] + 0.020, lon=c[1] - 0.030,
             description="New 30-bed primary health centre. On budget, on schedule."),
        dict(project_id="CS-002", showcase="PROBLEMATIC", name="Riverside Flyover & Drainage Corridor", sector="Roads",
             vendor="Apex Infra Pvt Ltd", allocated=12e7, start=date(2025, 12, 1), end=date(2027, 3, 31),
             progress=35, cost_factor=1.85, delay_days=100, inject_dup=True, inject_spike=True,
             n_reports=9, neg=0.85, pos=0.0, upvotes=25, lat=c[0] - 0.015, lon=c[1] + 0.025,
             description="Flyover with stormwater drainage. Severe overrun, long delay, angry residents."),
        dict(project_id="CS-003", showcase="BORDERLINE", name="Ward 14 Arterial Road Resurfacing", sector="Roads",
             vendor="Metro Builders", allocated=15e7, start=date(2025, 12, 15), end=date(2027, 2, 15),
             progress=55, cost_factor=1.28, delay_days=35, n_reports=6, neg=0.40, pos=0.20, upvotes=8,
             lat=c[0] + 0.035, lon=c[1] + 0.010,
             description="Resurfacing of a busy arterial road. Starting to slip."),
    ]


def _random_specs(rng: np.random.Generator, n: int, as_of: date) -> list[dict]:
    profiles = ["healthy"] * 13 + ["watch"] * 5 + ["bad"] * 3 + ["stalled"] * 1
    profiles = (profiles + ["healthy"] * n)[:n]
    rng.shuffle(profiles)
    specs = []
    for i, prof in enumerate(profiles):
        sector = SECTORS[i % len(SECTORS)]
        dur = int(rng.integers(300, 700))
        e = float(rng.uniform(0.25, 0.85))
        start = as_of - timedelta(days=int(dur * e))
        planned = e * 100
        base = dict(project_id=f"CS-{i + 4:03d}", showcase="", sector=sector, start=start,
                    end=start + timedelta(days=dur), vendor=str(rng.choice(VENDORS)),
                    allocated=float(rng.uniform(2, 40)) * 1e7,
                    name=f"{rng.choice(NOUNS[sector])} - Ward {int(rng.integers(1, 40))}",
                    lat=CITY_CENTER[0] + float(rng.normal(0, 0.05)), lon=CITY_CENTER[1] + float(rng.normal(0, 0.05)),
                    description=f"{prof.capitalize()} profile (synthetic).")
        if prof == "healthy":
            base.update(progress=planned + rng.uniform(-4, 6), cost_factor=rng.uniform(0.93, 1.05),
                        delay_days=int(rng.integers(-3, 10)), n_reports=int(rng.integers(2, 7)),
                        neg=0.10, pos=0.55, upvotes=3)
        elif prof == "watch":
            base.update(progress=planned - rng.uniform(8, 15), cost_factor=rng.uniform(1.12, 1.28),
                        delay_days=int(rng.integers(25, 55)), n_reports=int(rng.integers(3, 7)),
                        neg=0.40, pos=0.20, upvotes=8)
        elif prof == "bad":
            base.update(progress=planned - rng.uniform(18, 30), cost_factor=rng.uniform(1.4, 1.8),
                        delay_days=int(rng.integers(70, 140)), n_reports=int(rng.integers(4, 9)),
                        neg=0.75, pos=0.05, upvotes=15,
                        inject_dup=bool(rng.random() < 0.5), inject_spike=bool(rng.random() < 0.5))
        else:  # stalled: little money spent, little done
            base.update(progress=planned - rng.uniform(20, 28), cost_factor=rng.uniform(0.5, 0.6),
                        delay_days=int(rng.integers(60, 100)), n_reports=int(rng.integers(3, 6)),
                        neg=0.50, pos=0.10, upvotes=10)
        base["progress"] = float(np.clip(base["progress"], 5, 95))
        specs.append(base)
    return specs


def _build_project(spec: dict, rng: np.random.Generator, as_of: date) -> dict[str, list[dict]]:
    pid, start, end = spec["project_id"], spec["start"], spec["end"]
    alloc, progress = float(spec["allocated"]), float(spec["progress"])
    total_days, elapsed = (end - start).days, max((as_of - start).days, 1)

    # ---- milestones: completed ones carry an accumulating delay -------------------------------
    ms, cum = [], 0
    for seq, (mname, w) in enumerate(MILESTONES, 1):
        cum += w
        ms.append(dict(project_id=pid, seq=seq, name=mname, weight=w, _cum=cum, actual_date=None,
                       planned_date=start + timedelta(days=round(total_days * cum / 100))))
    done = [m for m in ms if m["_cum"] <= progress + 1e-9]
    for j, m in enumerate(done):
        delay = round(spec["delay_days"] * (j + 1) / len(done))
        if abs(spec["delay_days"]) >= 20:
            delay += int(rng.integers(-2, 3))
        m["actual_date"] = min(max(m["planned_date"] + timedelta(days=delay), start), as_of)

    # ---- invoice ledger: total spend = earned value x cost factor ------------------------------
    ac = alloc * progress / 100 * spec["cost_factor"]
    n = int(np.clip(elapsed // 25, 6, 18))
    spike = bool(spec.get("inject_spike")) and n >= 10
    dup = bool(spec.get("inject_dup")) and n >= 10
    med0 = ac / n
    spike_amt, dup_amt = 4.5 * med0, 1.35 * med0
    n_normal = n - int(spike) - int(dup)
    normal_total = ac - (spike_amt if spike else 0) - (2 * dup_amt if dup else 0)
    ramp = 0.7 + 0.6 * np.linspace(0, 1, n_normal)
    w = rng.lognormal(0, 0.3, n_normal) * ramp
    normal = iter(np.round(w / w.sum() * normal_total))
    dates = [min(start + timedelta(days=int(elapsed * (i + 1) / n)), as_of) for i in range(n)]
    rows = []
    for i in range(n):
        if spike and i == n - 3:
            amt, note = round(spike_amt), "Equipment hire (lump sum)"
        elif dup and i == n // 2:
            amt, note = round(dup_amt), "Material supply"
        else:
            amt, note = float(next(normal)), str(rng.choice(INVOICE_NOTES))
        rows.append(dict(project_id=pid, date=dates[i], vendor=spec["vendor"], amount=float(amt), description=note))
        if dup and i == n // 2:   # same vendor, same amount, 3 days later
            rows.append(dict(project_id=pid, date=min(dates[i] + timedelta(days=3), as_of), vendor=spec["vendor"],
                             amount=float(round(dup_amt)), description="Material supply"))
    rows.sort(key=lambda r: r["date"])
    for k, r in enumerate(rows, 1):
        r["invoice_id"] = f"INV-{pid[-3:]}-{k:03d}"

    # ---- citizen reports ----------------------------------------------------------------------
    reports = []
    for _ in range(int(spec["n_reports"])):
        u = rng.random()
        if u < spec["neg"]:
            text, scale = str(rng.choice(NEG_TEXT)), 1.5
            cat = str(rng.choice(["Delay", "Quality", "Safety", "Corruption / misuse of funds", "Nuisance"]))
        elif u < spec["neg"] + spec["pos"]:
            text, scale, cat = str(rng.choice(POS_TEXT)), 0.3, "Suggestion"
        else:
            text, scale, cat = str(rng.choice(NEU_TEXT)), 0.5, "Suggestion"
        reports.append(dict(
            project_id=pid, created=(as_of - timedelta(days=int(rng.integers(1, 120)))).isoformat() + "T12:00:00",
            category=cat, text=text, sentiment=score_sentiment(text),
            upvotes=int(rng.poisson(spec["upvotes"] * scale)),
            status=str(rng.choice(["Open", "Acknowledged", "Resolved"], p=[0.5, 0.3, 0.2])),
            lat=float(spec["lat"] + rng.normal(0, 0.002)), lon=float(spec["lon"] + rng.normal(0, 0.002)), photo=None))

    iso = lambda d: None if d is None else d.isoformat()
    for m in ms:
        m.pop("_cum")
        m["planned_date"], m["actual_date"] = iso(m["planned_date"]), iso(m["actual_date"])
    for r in rows:
        r["date"] = iso(r["date"])
    project = dict(project_id=pid, name=spec["name"], sector=spec["sector"], lat=float(spec["lat"]),
                   lon=float(spec["lon"]), vendor=spec["vendor"], allocated=alloc, planned_start=iso(start),
                   planned_end=iso(end), pct_complete=round(progress, 1), showcase=spec["showcase"],
                   description=spec["description"])
    return dict(project=[project], milestones=ms, spend=rows, reports=reports)


def generate_all(seed: int = SEED, as_of: date = AS_OF, n_projects: int = 25) -> dict[str, pd.DataFrame]:
    """Build the whole synthetic city."""
    rng = np.random.default_rng(seed)
    specs = _showcase_specs() + _random_specs(rng, n_projects - 3, as_of)
    acc: dict[str, list[dict]] = dict(project=[], milestones=[], spend=[], reports=[])
    for spec in specs:
        for key, rows in _build_project(spec, rng, as_of).items():
            acc[key].extend(rows)
    return dict(projects=pd.DataFrame(acc["project"]), milestones=pd.DataFrame(acc["milestones"]),
                spend=pd.DataFrame(acc["spend"]), reports=pd.DataFrame(acc["reports"]))


if __name__ == "__main__":
    data = generate_all()
    for name, df in data.items():
        print(f"{name}: {len(df)} rows")
    print(data["projects"][["project_id", "name", "sector", "allocated", "pct_complete", "showcase"]].head(6))