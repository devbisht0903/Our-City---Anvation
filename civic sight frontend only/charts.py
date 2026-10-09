"""Plotly / Folium figure builders. Each function takes analysis objects and returns a figure."""
from __future__ import annotations

from datetime import date

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

from analytics import AS_OF, ProjectAnalysis, fmt_inr

STATUS_COLORS = {"Healthy": "#2e9e5b", "Watch": "#f0a202", "Red flag": "#d64545"}
_LAYOUT = dict(margin=dict(l=10, r=10, t=40, b=10), font=dict(size=13))


def budget_bar(a: ProjectAnalysis) -> go.Figure:
    """Allocated vs spent vs value of work done vs projected final cost."""
    ev = a.ev
    df = pd.DataFrame({
        "Measure": ["Allocated budget", "Spent so far", "Value of work done", "Projected final cost"],
        "Amount": [a.allocated, ev["ac"], ev["ev"], ev["eac"]]})
    df["Label"] = df["Amount"].map(fmt_inr)
    fig = px.bar(df, x="Amount", y="Measure", orientation="h", text="Label", color="Measure",
                 color_discrete_map={"Allocated budget": "#8aa1b1", "Spent so far": "#d64545",
                                     "Value of work done": "#2e9e5b", "Projected final cost": "#f0a202"})
    fig.update_layout(showlegend=False, height=290, title="Budget: money in vs work out", **_LAYOUT)
    fig.update_yaxes(autorange="reversed", title=None)
    fig.update_xaxes(title=None, showticklabels=False)
    fig.update_traces(textposition="outside", cliponaxis=False)
    return fig


def gauge(value: float, title: str) -> go.Figure:
    """CPI / SPI dial: <0.85 red, 0.85-0.95 amber, >=0.95 green. 1.0 = exactly on plan."""
    fig = go.Figure(go.Indicator(
        mode="gauge+number", value=min(value, 1.5), number=dict(valueformat=".2f"), title=dict(text=title),
        gauge=dict(axis=dict(range=[0, 1.5]), bar=dict(color="#333"),
                   steps=[dict(range=[0, 0.85], color="#f4b6b6"), dict(range=[0.85, 0.95], color="#fde3a7"),
                          dict(range=[0.95, 1.5], color="#bfe5c9")],
                   threshold=dict(line=dict(color="black", width=3), value=1.0))))
    fig.update_layout(height=230, margin=dict(l=20, r=20, t=50, b=10))
    return fig


def gantt(a: ProjectAnalysis, start, as_of: date = AS_OF) -> go.Figure:
    """Planned vs actual bars per milestone, so slippage is visible at a glance."""
    start, today = pd.Timestamp(start), pd.Timestamp(as_of)
    rows, prev_planned, prev_actual = [], start, start
    for m in a.delays.itertuples(index=False):
        p_end = pd.Timestamp(m.planned_date)
        rows.append(dict(Milestone=m.name, Start=prev_planned, End=max(p_end, prev_planned + pd.Timedelta(days=1)),
                         Series="Planned"))
        if pd.notna(m.actual_date):
            a_end, label = pd.Timestamp(m.actual_date), ("Actual (late)" if m.state == "Completed late" else "Actual (on time)")
        elif m.state in ("Overdue", "In progress"):
            a_end, label = today, "Actual (still open)"
        else:
            a_end = None
        if a_end is not None:
            rows.append(dict(Milestone=m.name, Start=prev_actual, End=max(a_end, prev_actual + pd.Timedelta(days=1)),
                             Series=label))
            prev_actual = a_end
        prev_planned = p_end
    fig = px.timeline(pd.DataFrame(rows), x_start="Start", x_end="End", y="Milestone", color="Series",
                      color_discrete_map={"Planned": "#b8c4cc", "Actual (on time)": "#2e9e5b",
                                          "Actual (late)": "#d64545", "Actual (still open)": "#f0a202"})
    fig.update_yaxes(autorange="reversed", title=None)
    fig.update_layout(barmode="group", height=330, title="Timeline: planned vs actual", **_LAYOUT)
    fig.add_shape(type="line", x0=today, x1=today, y0=0, y1=1, yref="paper", line=dict(dash="dot", color="black"))
    fig.add_annotation(x=today, y=1.02, yref="paper", text="today", showarrow=False)
    return fig


def spend_chart(spend: pd.DataFrame, a: ProjectAnalysis, start, end) -> go.Figure:
    """Cumulative spend vs the straight-line plan, with anomalous invoices circled."""
    s = spend.sort_values("date").assign(cum=lambda d: d["amount"].cumsum())
    fig = go.Figure()
    fig.add_scatter(x=[start, end], y=[0, a.allocated], mode="lines", name="Planned spend (budget burn)",
                    line=dict(dash="dash", color="#8aa1b1"))
    fig.add_scatter(x=s["date"], y=s["cum"], mode="lines+markers", name="Actual cumulative spend",
                    line=dict(color="#d64545"))
    fig.add_scatter(x=[pd.Timestamp(AS_OF)], y=[a.ev["ev"]], mode="markers", name="Value of work done",
                    marker=dict(size=13, color="#2e9e5b", symbol="diamond"))
    for kind, color, items in (("Spike", "#7a1fa2", a.spend_anoms["spikes"]),
                               ("Duplicate", "#e8590c", a.spend_anoms["duplicates"])):
        pts = []
        for it in items:
            ids = it.get("invoice_ids") or [it.get("invoice_id")]
            pts += list(s[s["invoice_id"].isin(ids)].index)
        if pts:
            fig.add_scatter(x=s.loc[pts, "date"], y=s.loc[pts, "cum"], mode="markers", name=f"{kind} invoice",
                            marker=dict(size=14, color="rgba(0,0,0,0)", line=dict(width=3, color=color)))
    fig.add_hline(y=a.allocated, line_dash="dot", line_color="#555", annotation_text="Allocated budget")
    fig.update_layout(height=330, title="Spending over time", yaxis_title="₹", legend=dict(orientation="h", y=-0.2), **_LAYOUT)
    return fig


def risk_breakdown(a: ProjectAnalysis) -> go.Figure:
    """Why the score is what it is - one bar per component."""
    df = pd.DataFrame(dict(Component=list(a.components), Points=list(a.components.values())))
    fig = px.bar(df, x="Points", y="Component", orientation="h", text="Points",
                 color_discrete_sequence=[STATUS_COLORS[a.status]])
    fig.update_layout(height=330, title=f"Risk score {a.risk_score:.0f}/100 - what drives it", **_LAYOUT)
    fig.update_yaxes(autorange="reversed", title=None)
    fig.update_xaxes(title="points (max: cost 35, schedule 30, citizens 15, model 10, integrity 10)")
    return fig


def quadrant(portfolio: pd.DataFrame) -> go.Figure:
    """Portfolio view: bottom-left = over budget AND behind schedule."""
    fig = px.scatter(portfolio, x="spi", y="cpi", color="status", size="allocated", hover_name="name",
                     color_discrete_map=STATUS_COLORS, hover_data=dict(allocated=False, risk_score=True))
    fig.add_hline(y=1, line_dash="dot")
    fig.add_vline(x=1, line_dash="dot")
    fig.update_layout(height=380, title="Portfolio: cost efficiency (CPI) vs schedule efficiency (SPI)",
                      xaxis_title="SPI (right = ahead of schedule)", yaxis_title="CPI (up = under budget)", **_LAYOUT)
    return fig


def risk_map(portfolio: pd.DataFrame):
    """Folium map, pins coloured by health status, popup with the key numbers."""
    import folium
    m = folium.Map(location=[portfolio["lat"].mean(), portfolio["lon"].mean()], zoom_start=11, tiles="cartodbpositron")
    for r in portfolio.itertuples(index=False):
        html = (f"<b>{r.name}</b><br>{r.sector} - <b>{r.status}</b> (risk {r.risk_score:.0f})<br>"
                f"Spent {r.spent / r.allocated * 100:.0f}% of budget, {r.progress_pct:.0f}% done<br>"
                f"CPI {r.cpi:.2f} | SPI {r.spi:.2f} | worst delay {r.max_delay} d<br>ID: {r.project_id}")
        folium.CircleMarker([r.lat, r.lon], radius=9 + r.risk_score / 12, color="#222", weight=1, fill=True,
                            fill_color=STATUS_COLORS[r.status], fill_opacity=0.85,
                            popup=folium.Popup(html, max_width=300), tooltip=f"{r.project_id} - {r.status}").add_to(m)
    legend = ("<div style='position:fixed;bottom:20px;left:20px;z-index:9999;background:white;padding:8px 12px;"
              "border:1px solid #999;border-radius:6px;font-size:13px'>"
              + "".join(f"<span style='color:{c}'>●</span> {k}<br>" for k, c in STATUS_COLORS.items()) + "</div>")
    m.get_root().html.add_child(folium.Element(legend))
    return m