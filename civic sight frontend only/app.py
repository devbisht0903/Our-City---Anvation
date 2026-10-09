"""
OurCity dashboard.   Run:  streamlit run app.py

Pages:  Overview  |  Project detail  |  Citizen portal  |  Compare (final demo)
Sidebar: Demo mode (presenter notes), Officer mode (change report status), live audit-chain status, reset.
"""
from __future__ import annotations

import uuid
from pathlib import Path

import pandas as pd
import streamlit as st

import analytics as an
import charts
import db
import report
from analytics import fmt_inr
from data_generator import CATEGORIES

st.set_page_config(page_title="OurCity", page_icon="🏛️", layout="wide")
UPLOADS = Path("uploads")
UPLOADS.mkdir(exist_ok=True)
PAGES = ["Overview", "Project detail", "Citizen portal", "Compare (final demo)"]
STATUS_ICON = {"Healthy": "🟢", "Watch": "🟠", "Red flag": "🔴"}
SEV_ICON = {"critical": "🔴", "warning": "🟠", "info": "🔵"}


# ----------------------------------------------------------------------------- shared plumbing
@st.cache_resource
def get_conn():
    conn = db.connect()
    db.init_schema(conn)
    db.seed_if_empty(conn)
    return conn


@st.cache_data(show_spinner="Analysing projects...")
def run_analysis(version: tuple):
    """`version` is part of the cache key: new report / vote / audit entry -> fresh analysis."""
    return an.analyze_portfolio(db.get_frames(get_conn()))


def chart(fig, key: str) -> None:
    """Single place to adapt to Streamlit's plotly_chart sizing API changes."""
    try:
        st.plotly_chart(fig, use_container_width=True, key=key)
    except TypeError:
        st.plotly_chart(fig, width="stretch", key=key)


def table(df: pd.DataFrame, **kw) -> None:
    try:
        st.dataframe(df, use_container_width=True, hide_index=True, **kw)
    except TypeError:
        st.dataframe(df, width="stretch", hide_index=True, **kw)


def note(text: str) -> None:
    """Presenter note, shown only when Demo mode is on."""
    if st.session_state.get("demo_mode"):
        st.info("🎤 **Say this:** " + text)


def flash() -> None:
    if "flash" in st.session_state:
        st.success(st.session_state.pop("flash"))


def goto(pid: str) -> None:       # button callback: jump to a project
    st.session_state["nav"] = "Project detail"
    st.session_state["selected_pid"] = pid


def pid_label(details):
    return lambda pid: f"{STATUS_ICON[details[pid].status]} {pid} · {details[pid].name}"


# ----------------------------------------------------------------------------- page 1: overview
def page_overview(portfolio: pd.DataFrame, details: dict) -> None:
    st.title("🏛️ OurCity")
    st.caption("Public projects and public money, explained in plain language. All data is synthetic.")
    note("Every pin is a real public project. Red means money, time or citizens say something is wrong. "
         "The score is explainable - click any project to see exactly why.")
    c1, c2 = st.columns(2)
    sectors = c1.multiselect("Sector", sorted(portfolio["sector"].unique()), default=sorted(portfolio["sector"].unique()))
    statuses = c2.multiselect("Health status", list(STATUS_ICON), default=list(STATUS_ICON))
    view = portfolio[portfolio["sector"].isin(sectors) & portfolio["status"].isin(statuses)]
    if view.empty:
        st.warning("No projects match these filters.")
        return
    k = st.columns(5)
    k[0].metric("Projects", len(view))
    k[1].metric("🔴 Red flags", int((view["status"] == "Red flag").sum()))
    k[2].metric("🟠 Watch", int((view["status"] == "Watch").sum()))
    k[3].metric("Total budget", fmt_inr(view["allocated"].sum()))
    k[4].metric("Spent so far", fmt_inr(view["spent"].sum()),
                f"{view['spent'].sum() / view['allocated'].sum() * 100:.0f}% of budget", delta_color="off")
    left, right = st.columns([3, 2])
    with left:
        st.subheader("Where is the problem?")
        try:
            from streamlit_folium import st_folium
            st_folium(charts.risk_map(view), height=470, use_container_width=True, returned_objects=[])
        except Exception:
            st.map(view.rename(columns={"lon": "longitude", "lat": "latitude"}))
    with right:
        st.subheader("What should be fixed first?")
        note("This is participatory prioritisation: risk, multiplied by citizen upvotes, weighted by how much "
             "the sector matters to daily life.")
        top = view.sort_values("priority_rank").head(8)
        table(top[["priority_rank", "project_id", "name", "status", "risk_score", "open_upvotes", "priority"]]
              .rename(columns={"priority_rank": "#", "project_id": "ID", "risk_score": "risk", "open_upvotes": "votes"}))
        pid = st.selectbox("Open a project", top["project_id"], format_func=pid_label(details), key="overview_pick")
        st.button("Open project detail →", on_click=goto, args=(pid,))
    chart(charts.quadrant(view), "quad")


# ----------------------------------------------------------------------------- page 2: detail
def page_detail(portfolio: pd.DataFrame, details: dict, conn) -> None:
    flash()
    pid = st.selectbox("Project", list(details), key="selected_pid", format_func=pid_label(details))
    a = details[pid]
    frames = db.get_frames(conn)
    proj = frames["projects"].set_index("project_id").loc[pid]
    spend, reps = frames["spend"].query("project_id == @pid"), frames["reports"].query("project_id == @pid")

    st.header(a.name)
    st.markdown(f"**{a.sector}** · {pid} · vendor *{proj['vendor']}* — {an.citizen_verdict(a)}")
    note("Start with the one-line verdict, then the plain-English summary. Numbers below prove it.")

    c = st.columns([2, 1, 1])
    mode = c[0].radio("Explanation", ["Simple", "Detailed"], horizontal=True)
    use_llm = c[1].checkbox("Rewrite with AI", help="Needs ANTHROPIC_API_KEY. Falls back to offline template.")
    lang = c[2].selectbox("Language", ["English", "Hindi", "Kannada", "Tamil", "Telugu"]) if use_llm else "English"
    summary, source = an.generate_summary(a, mode.lower(), use_llm, lang)
    if use_llm and source == "template":
        st.caption("AI summary unavailable (no key or no network) - showing the offline template.")
    st.markdown(summary)
    st.caption(f"Summary source: {source}")

    m = st.columns(5)
    m[0].metric("Allocated", fmt_inr(a.allocated))
    m[1].metric("Spent", fmt_inr(a.ev["ac"]), f"{a.ev['spend_pct']:.0f}% of budget", delta_color="off")
    m[2].metric("Work done", f"{a.ev['progress_pct']:.0f}%", f"{a.ev['progress_pct'] - a.ev['planned_pct']:+.0f} pts vs plan")
    m[3].metric("Projected final", fmt_inr(a.ev["eac"]), f"{a.ev['overrun_pct']:+.0f}%", delta_color="inverse")
    m[4].metric("Risk score", f"{a.risk_score:.0f}/100", a.status, delta_color="off")

    t1, t2, t3, t4 = st.tabs(["💰 Budget & time", "🚩 Flags & why", "🗣️ Citizens", "🔗 Audit trail"])
    with t1:
        g = st.columns([2, 1, 1])
        with g[0]:
            chart(charts.budget_bar(a), f"bud_{pid}")
        with g[1]:
            chart(charts.gauge(a.ev["cpi"], "CPI · cost efficiency"), f"cpi_{pid}")
        with g[2]:
            chart(charts.gauge(a.ev["spi"], "SPI · schedule efficiency"), f"spi_{pid}")
        chart(charts.gantt(a, proj["planned_start"]), f"gantt_{pid}")
        chart(charts.spend_chart(spend, a, proj["planned_start"], proj["planned_end"]), f"spend_{pid}")
    with t2:
        note("Each flag is a rule or model finding with a reason that quotes the real numbers - no black box.")
        if not a.flags:
            st.success("No red flags detected. Money and progress are in step.")
        for f in a.flags:
            st.markdown(f"{SEV_ICON[f.severity]} **{f.title}** — {f.reason}")
        chart(charts.risk_breakdown(a), f"risk_{pid}")
        st.markdown("**Milestones**")
        table(a.delays.rename(columns={"seq": "#", "name": "Milestone", "planned_date": "Planned",
                                       "actual_date": "Actual", "delay_days": "Delay (days)", "state": "State"}))
    with t3:
        st.write(f"{a.n_reports} reports · {a.neg_ratio * 100:.0f}% negative · {a.open_upvotes} open upvotes")
        for r in reps.sort_values("upvotes", ascending=False).head(6).itertuples():
            st.markdown(f"- {an.sentiment_label(r.sentiment)} · *{r.category}* · 👍 {r.upvotes} · {r.status}: “{r.text}”")
        st.caption("Add or upvote reports in the Citizen portal.")
    with t4:
        audit_tab(conn, pid, spend, a)

    ok = db.verify_chain(conn)["ok"]
    st.download_button("⬇️ Download one-page report (HTML → print to PDF)",
                       report.build_report_html(a, summary, reps, ok), file_name=f"ourcity_{pid}.html", mime="text/html")


def audit_tab(conn, pid: str, spend: pd.DataFrame, a) -> None:
    note("This log is hash-chained. Watch what happens when someone quietly edits a spending record.")
    ver = db.verify_chain(conn)
    bad = {i["id"] for i in ver["issues"]}
    if ver["ok"]:
        st.success(f"✅ Audit chain intact — {ver['checked']} entries verified with SHA-256.")
    else:
        st.error(f"❌ TAMPERING DETECTED — {len(bad)} record(s) no longer match their cryptographic fingerprint.")
    b1, b2 = st.columns(2)
    if b1.button("😈 Simulate an insider editing a spend record"):
        eid = db.latest_entry(conn, pid, "SPEND_UPDATE")
        if eid:
            st.session_state["tamper"] = (eid, db.tamper_entry(conn, eid))
            st.rerun()
    if "tamper" in st.session_state and b2.button("↩️ Restore original record"):
        db.restore_entry(conn, *st.session_state.pop("tamper"))
        st.rerun()
    log = db.audit_frame(conn, pid).sort_values("id", ascending=False).head(40)
    log["integrity"] = log["id"].map(lambda i: "❌ altered" if i in bad else "✅")
    log["hash"], log["prev_hash"] = log["hash"].str[:12], log["prev_hash"].str[:12]
    table(log[["id", "ts", "event_type", "actor", "payload", "prev_hash", "hash", "integrity"]])

    with st.expander("🧾 Officer tools: record a payment or progress update (audited)"):
        with st.form(f"officer_{pid}"):
            amt = st.number_input("New invoice amount (₹)", min_value=0.0, step=100000.0)
            desc = st.text_input("Description", "Running bill")
            pct = st.slider("Work completed (%)", 0, 100, int(a.ev["progress_pct"]))
            if st.form_submit_button("Record update"):
                if amt > 0:
                    vendor = spend["vendor"].iloc[-1] if len(spend) else "Unknown vendor"
                    db.record_spend(conn, pid, amt, vendor, desc)
                if int(pct) != int(a.ev["progress_pct"]):
                    db.update_progress(conn, pid, pct)
                st.session_state["flash"] = "Update recorded and appended to the audit chain."
                st.rerun()


# ----------------------------------------------------------------------------- page 3: citizen portal
def _upvote(rid: int) -> None:
    db.upvote(get_conn(), rid)
    st.session_state.setdefault("voted", set()).add(rid)


def _set_status(rid: int) -> None:
    db.set_report_status(get_conn(), rid, st.session_state[f"status_{rid}"])


def page_citizen(portfolio: pd.DataFrame, details: dict, conn) -> None:
    flash()
    st.title("🗣️ Citizen portal")
    note("Citizens do not just read - they report, vote, and watch whether anyone responds.")
    tab_new, tab_track = st.tabs(["📝 Report an issue", "📋 Issue tracker"])
    with tab_new:
        with st.form("report_form", clear_on_submit=True):
            pid = st.selectbox("Project", list(details), format_func=pid_label(details), key="rep_pid")
            cat = st.selectbox("Category", CATEGORIES)
            text = st.text_area("What did you see?", max_chars=600, placeholder="e.g. Work has stopped for 3 weeks...")
            c1, c2 = st.columns(2)
            lat = c1.number_input("Latitude (optional)", value=0.0, format="%.5f")
            lon = c2.number_input("Longitude (optional)", value=0.0, format="%.5f")
            photo = st.file_uploader("Photo (optional)", type=["jpg", "jpeg", "png"])
            if st.form_submit_button("Submit report"):
                if len(text.strip()) < 10:
                    st.warning("Please describe the issue in at least 10 characters.")
                else:
                    path = None
                    if photo is not None:
                        path = str(UPLOADS / f"{uuid.uuid4().hex}_{Path(photo.name).name}")
                        Path(path).write_bytes(photo.getbuffer())
                    rid = db.add_report(conn, pid, cat, text, lat or None, lon or None, path)
                    st.session_state["flash"] = (f"Thank you - report #{rid} filed. Detected tone: "
                                                 f"{an.sentiment_label(an.score_sentiment(text))}. It now feeds the project's risk score.")
                    st.rerun()
    with tab_track:
        f = st.columns(3)
        proj_f = f[0].selectbox("Project", ["All"] + list(details), format_func=lambda x: x if x == "All" else pid_label(details)(x))
        stat_f = f[1].multiselect("Status", ["Open", "Acknowledged", "Resolved"], default=["Open", "Acknowledged"])
        sort_f = f[2].selectbox("Sort by", ["Most upvoted", "Newest"])
        reps = db.get_frames(conn)["reports"]
        reps = reps[reps["status"].isin(stat_f)]
        if proj_f != "All":
            reps = reps[reps["project_id"] == proj_f]
        reps = reps.sort_values("upvotes" if sort_f == "Most upvoted" else "created", ascending=False).head(25)
        officer = st.session_state.get("officer_mode", False)
        voted = st.session_state.get("voted", set())
        if reps.empty:
            st.info("No issues match.")
        for r in reps.itertuples():
            with st.container(border=True):
                a, b = st.columns([5, 1])
                tone = an.sentiment_label(r.sentiment)
                a.markdown(f"**{details[r.project_id].name}** · *{r.category}* · {tone} · {r.status}  \n{r.text}")
                if r.photo and Path(r.photo).exists():
                    a.image(r.photo, width=180)
                b.button(f"👍 {r.upvotes}", key=f"up_{r.report_id}", disabled=r.report_id in voted,
                         on_click=_upvote, args=(int(r.report_id),))
                if officer:
                    opts = ["Open", "Acknowledged", "Resolved"]
                    a.selectbox("Set status (officer)", opts, index=opts.index(r.status),
                                key=f"status_{r.report_id}", on_change=_set_status, args=(int(r.report_id),))


# ----------------------------------------------------------------------------- page 4: compare
def page_compare(portfolio: pd.DataFrame, details: dict, conn) -> None:
    st.title("⚖️ Normal vs Problematic — side by side")
    note("Same dashboard, two projects. Left: money and progress move together. Right: every red flag fires, "
         "and citizens are already telling us.")
    ids = list(details)

    def default(tag: str) -> int:
        hit = portfolio.index[portfolio["showcase"] == tag]
        return int(hit[0]) if len(hit) else 0
    sel = st.columns(2)
    pa = sel[0].selectbox("Normal project", ids, index=default("HEALTHY"), format_func=pid_label(details), key="cmp_a")
    pb = sel[1].selectbox("Problematic project", ids, index=default("PROBLEMATIC"), format_func=pid_label(details), key="cmp_b")
    frames = db.get_frames(conn)
    cols = st.columns(2)
    for col, pid, tag in zip(cols, (pa, pb), ("a", "b")):
        a = details[pid]
        proj = frames["projects"].set_index("project_id").loc[pid]
        reps = frames["reports"].query("project_id == @pid")
        with col:
            st.subheader(f"{STATUS_ICON[a.status]} {a.name}")
            st.markdown(an.citizen_verdict(a))
            st.markdown(an.template_summary(a, "simple"))
            chart(charts.budget_bar(a), f"cmp_bud_{tag}")
            g = st.columns(2)
            with g[0]:
                chart(charts.gauge(a.ev["cpi"], "CPI"), f"cmp_cpi_{tag}")
            with g[1]:
                chart(charts.gauge(a.ev["spi"], "SPI"), f"cmp_spi_{tag}")
            chart(charts.gantt(a, proj["planned_start"]), f"cmp_gantt_{tag}")
            st.markdown("**Red flags**")
            for f in a.flags or []:
                st.markdown(f"{SEV_ICON[f.severity]} **{f.title}** — {f.reason}")
            if not a.flags:
                st.success("None")
            st.markdown("**Citizens**")
            st.write(f"{a.n_reports} reports · {a.neg_ratio * 100:.0f}% negative · {a.open_upvotes} open upvotes")
    ra, rb = details[pa], details[pb]
    st.subheader("Deviation scoreboard")
    rows = [("Risk score", f"{ra.risk_score:.0f}", f"{rb.risk_score:.0f}"),
            ("Budget spent vs work done", f"{ra.ev['spend_pct']:.0f}% vs {ra.ev['progress_pct']:.0f}%", f"{rb.ev['spend_pct']:.0f}% vs {rb.ev['progress_pct']:.0f}%"),
            ("Projected overrun", f"{ra.ev['overrun_pct']:+.0f}%", f"{rb.ev['overrun_pct']:+.0f}%"),
            ("Worst milestone delay", f"{ra.max_delay} days", f"{rb.max_delay} days"),
            ("CPI / SPI", f"{ra.ev['cpi']:.2f} / {ra.ev['spi']:.2f}", f"{rb.ev['cpi']:.2f} / {rb.ev['spi']:.2f}"),
            ("Negative citizen reports", f"{ra.neg_ratio * 100:.0f}%", f"{rb.neg_ratio * 100:.0f}%"),
            ("Red flags raised", str(len(ra.flags)), str(len(rb.flags))),
            ("Fix-first priority rank", f"#{ra.priority_rank}", f"#{rb.priority_rank}")]
    table(pd.DataFrame(rows, columns=["Measure", ra.name, rb.name]))


# ----------------------------------------------------------------------------- main
def main() -> None:
    conn = get_conn()
    portfolio, details = run_analysis(db.data_version(conn))
    worst = portfolio.sort_values("risk_score", ascending=False)["project_id"].iloc[0]
    st.session_state.setdefault("selected_pid", worst)
    with st.sidebar:
        st.markdown("## 🏛️ OurCity")
        st.radio("Go to", PAGES, key="nav")
        st.checkbox("🎤 Demo mode (presenter notes)", key="demo_mode")
        st.checkbox("👮 Officer mode (change issue status)", key="officer_mode")
        ver = db.verify_chain(conn)
        (st.success if ver["ok"] else st.error)(
            f"Audit chain {'intact' if ver['ok'] else 'BROKEN'} · {ver['checked']} entries")
        if st.button("♻️ Reset demo data"):
            db.reset_all(conn)
            for k in ("tamper", "voted", "flash"):
                st.session_state.pop(k, None)
            st.cache_data.clear()
            st.rerun()
    page = st.session_state["nav"]
    if page == PAGES[0]:
        page_overview(portfolio, details)
    elif page == PAGES[1]:
        page_detail(portfolio, details, conn)
    elif page == PAGES[2]:
        page_citizen(portfolio, details, conn)
    else:
        page_compare(portfolio, details, conn)


main()