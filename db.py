"""
SQLite persistence + tamper-evident audit trail.

Audit design (hash chain):
    hash_n = SHA256( hash_{n-1} | timestamp | project | event | actor | canonical_json(payload) )
Every entry commits to the whole history before it. Editing ANY past row (e.g. lowering a spend
figure) makes its recomputed hash differ from the stored one, and re-hashing that row would break
the next row's prev_hash link. verify_chain() reports exactly which entries no longer check out.
"""
from __future__ import annotations

import hashlib
import json
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd

import analytics as an
from data_generator import generate_all

DB_PATH = Path(os.environ.get("CIVICSIGHT_DB", "civicsight.db"))
GENESIS = "0" * 64

SCHEMA = """
CREATE TABLE IF NOT EXISTS projects(
  project_id TEXT PRIMARY KEY, name TEXT, sector TEXT, lat REAL, lon REAL, vendor TEXT, allocated REAL,
  planned_start TEXT, planned_end TEXT, pct_complete REAL, showcase TEXT, description TEXT);
CREATE TABLE IF NOT EXISTS milestones(
  project_id TEXT, seq INTEGER, name TEXT, weight REAL, planned_date TEXT, actual_date TEXT,
  PRIMARY KEY(project_id, seq));
CREATE TABLE IF NOT EXISTS spend(
  id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT, date TEXT, invoice_id TEXT, vendor TEXT,
  amount REAL, description TEXT);
CREATE TABLE IF NOT EXISTS reports(
  report_id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT, created TEXT, category TEXT, text TEXT,
  sentiment REAL, upvotes INTEGER DEFAULT 0, status TEXT DEFAULT 'Open', lat REAL, lon REAL, photo TEXT);
CREATE TABLE IF NOT EXISTS audit_log(
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, project_id TEXT, event_type TEXT, actor TEXT,
  payload TEXT, prev_hash TEXT, hash TEXT);
"""
TABLES = ["projects", "milestones", "spend", "reports", "audit_log"]


# ----------------------------------------------------------------------------- connection / setup
def connect(path: str | Path | None = None) -> sqlite3.Connection:
    conn = sqlite3.connect(str(path or DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    conn.commit()


def reset_all(conn: sqlite3.Connection) -> None:
    """Wipe everything and re-seed (the 'reset demo' button)."""
    for t in TABLES:
        conn.execute(f"DROP TABLE IF EXISTS {t}")
    conn.commit()
    init_schema(conn)
    seed_if_empty(conn)


# ----------------------------------------------------------------------------- audit chain
def _canonical(payload: dict) -> str:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str)


def _hash(prev: str, ts: str, project_id: str, event: str, actor: str, payload_json: str) -> str:
    return hashlib.sha256("|".join([prev, ts, project_id, event, actor, payload_json]).encode()).hexdigest()


def append_audit(conn: sqlite3.Connection, project_id: str, event_type: str, actor: str,
                 payload: dict, ts: str | None = None, commit: bool = True) -> int:
    """Append-only: there is deliberately no update/delete function for audit rows."""
    row = conn.execute("SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1").fetchone()
    prev = row["hash"] if row else GENESIS
    ts = ts or datetime.now().isoformat(timespec="seconds")
    pj = _canonical(payload)
    cur = conn.execute(
        "INSERT INTO audit_log(ts,project_id,event_type,actor,payload,prev_hash,hash) VALUES(?,?,?,?,?,?,?)",
        (ts, project_id, event_type, actor, pj, prev, _hash(prev, ts, project_id, event_type, actor, pj)))
    if commit:
        conn.commit()
    return int(cur.lastrowid)


def verify_chain(conn: sqlite3.Connection) -> dict[str, Any]:
    """Recompute every hash. Returns {ok, checked, issues:[{id, project_id, reason}]}."""
    issues, prev, n = [], GENESIS, 0
    for r in conn.execute("SELECT * FROM audit_log ORDER BY id"):
        n += 1
        if r["prev_hash"] != prev:
            issues.append(dict(id=r["id"], project_id=r["project_id"], reason="link to previous entry is broken"))
        expected = _hash(r["prev_hash"], r["ts"], r["project_id"], r["event_type"], r["actor"], r["payload"])
        if expected != r["hash"]:
            issues.append(dict(id=r["id"], project_id=r["project_id"], reason="content does not match its hash"))
        prev = r["hash"]
    return dict(ok=not issues, checked=n, issues=issues)


def audit_frame(conn: sqlite3.Connection, project_id: str | None = None) -> pd.DataFrame:
    q, args = "SELECT * FROM audit_log", ()
    if project_id:
        q, args = q + " WHERE project_id=?", (project_id,)
    return pd.read_sql_query(q + " ORDER BY id", conn, params=args)


def latest_entry(conn: sqlite3.Connection, project_id: str, event_type: str) -> int | None:
    r = conn.execute("SELECT id FROM audit_log WHERE project_id=? AND event_type=? ORDER BY id DESC LIMIT 1",
                     (project_id, event_type)).fetchone()
    return int(r["id"]) if r else None


def tamper_entry(conn: sqlite3.Connection, entry_id: int) -> str:
    """DEMO ONLY: edit a stored record behind the chain's back (simulates a corrupt insider)."""
    row = conn.execute("SELECT payload FROM audit_log WHERE id=?", (entry_id,)).fetchone()
    original = row["payload"]
    data = json.loads(original)
    if "amount" in data:
        data["amount"] = round(float(data["amount"]) * 0.1)   # "make the invoice look 90% smaller"
    else:
        data["tampered"] = True
    conn.execute("UPDATE audit_log SET payload=? WHERE id=?", (_canonical(data), entry_id))
    conn.commit()
    return original


def restore_entry(conn: sqlite3.Connection, entry_id: int, original_payload: str) -> None:
    conn.execute("UPDATE audit_log SET payload=? WHERE id=?", (original_payload, entry_id))
    conn.commit()


# ----------------------------------------------------------------------------- seeding
def seed_if_empty(conn: sqlite3.Connection, seed: int | None = None) -> None:
    """Load synthetic data and replay it into the audit log in chronological order."""
    if conn.execute("SELECT COUNT(*) FROM projects").fetchone()[0]:
        return
    data = generate_all() if seed is None else generate_all(seed)
    for table, df in (("projects", data["projects"]), ("milestones", data["milestones"]),
                      ("spend", data["spend"]), ("reports", data["reports"])):
        df = df.astype(object).where(df.notna(), None)
        cols = list(df.columns)
        conn.executemany(f"INSERT INTO {table}({','.join(cols)}) VALUES({','.join('?' * len(cols))})",
                         df.itertuples(index=False, name=None))
    conn.commit()

    events: list[tuple] = []   # (ts, order, project_id, event, actor, payload)
    for p in data["projects"].itertuples(index=False):
        events.append((f"{p.planned_start}T08:00:00", 0, p.project_id, "PROJECT_CREATED", "system",
                       dict(name=p.name, allocated=float(p.allocated), vendor=p.vendor)))
        events.append((f"{p.planned_start}T08:30:00", 1, p.project_id, "STATUS_CHANGE", "system",
                       dict(old="Planned", new="In Progress")))
    cumulative: dict[str, float] = {}
    for s in data["spend"].sort_values("date", kind="stable").itertuples(index=False):
        cumulative[s.project_id] = cumulative.get(s.project_id, 0.0) + float(s.amount)
        events.append((f"{s.date}T10:00:00", 2, s.project_id, "SPEND_UPDATE", "finance-officer",
                       dict(invoice_id=s.invoice_id, amount=float(s.amount), cumulative_spend=round(cumulative[s.project_id]),
                            vendor=s.vendor)))
    for m in data["milestones"].itertuples(index=False):
        if pd.notna(m.actual_date):
            delay = (pd.Timestamp(m.actual_date) - pd.Timestamp(m.planned_date)).days
            events.append((f"{m.actual_date}T12:00:00", 3, m.project_id, "MILESTONE_COMPLETED", "site-engineer",
                           dict(milestone=m.name, planned=m.planned_date, actual=m.actual_date, delay_days=int(delay))))
    for ts, _, pid, ev, actor, payload in sorted(events, key=lambda e: (e[0], e[1], e[2])):
        append_audit(conn, pid, ev, actor, payload, ts=ts, commit=False)
    conn.commit()


# ----------------------------------------------------------------------------- reads
def get_frames(conn: sqlite3.Connection) -> dict[str, pd.DataFrame]:
    """All tables as DataFrames with proper datetime columns."""
    f = {t: pd.read_sql_query(f"SELECT * FROM {t}", conn) for t in ("projects", "milestones", "spend", "reports")}
    for df, cols in ((f["projects"], ["planned_start", "planned_end"]), (f["milestones"], ["planned_date", "actual_date"]),
                     (f["spend"], ["date"]), (f["reports"], ["created"])):
        for c in cols:
            df[c] = pd.to_datetime(df[c])
    return f


def data_version(conn: sqlite3.Connection) -> tuple:
    """Cheap fingerprint used as a cache key so the dashboard recomputes only when data changes."""
    r = conn.execute("SELECT (SELECT COUNT(*) FROM audit_log), (SELECT COUNT(*) FROM reports), "
                     "(SELECT COALESCE(SUM(upvotes),0) FROM reports)").fetchone()
    return tuple(r)


# ----------------------------------------------------------------------------- writes (all audited)
def add_report(conn: sqlite3.Connection, project_id: str, category: str, text: str,
               lat: float | None = None, lon: float | None = None, photo: str | None = None) -> int:
    sent = an.score_sentiment(text)
    cur = conn.execute(
        "INSERT INTO reports(project_id,created,category,text,sentiment,upvotes,status,lat,lon,photo) "
        "VALUES(?,?,?,?,?,0,'Open',?,?,?)",
        (project_id, datetime.now().isoformat(timespec="seconds"), category, text.strip(), sent, lat, lon, photo))
    rid = int(cur.lastrowid)
    append_audit(conn, project_id, "CITIZEN_REPORT", "citizen",
                 dict(report_id=rid, category=category, sentiment=an.sentiment_label(sent)), commit=False)
    conn.commit()
    return rid


def upvote(conn: sqlite3.Connection, report_id: int) -> None:
    conn.execute("UPDATE reports SET upvotes = upvotes + 1 WHERE report_id=?", (report_id,))
    conn.commit()


def set_report_status(conn: sqlite3.Connection, report_id: int, status: str, actor: str = "officer") -> None:
    r = conn.execute("SELECT project_id, status FROM reports WHERE report_id=?", (report_id,)).fetchone()
    if not r or r["status"] == status:
        return
    conn.execute("UPDATE reports SET status=? WHERE report_id=?", (status, report_id))
    append_audit(conn, r["project_id"], "REPORT_STATUS_CHANGE", actor,
                 dict(report_id=report_id, old=r["status"], new=status), commit=False)
    conn.commit()


def record_spend(conn: sqlite3.Connection, project_id: str, amount: float, vendor: str,
                 description: str, on: str | None = None) -> str:
    """Officer records a new invoice; ledger row + audit entry are written together."""
    day = on or datetime.now().date().isoformat()
    n = conn.execute("SELECT COUNT(*) FROM spend WHERE project_id=?", (project_id,)).fetchone()[0]
    inv = f"INV-{project_id[-3:]}-{n + 1:03d}"
    conn.execute("INSERT INTO spend(project_id,date,invoice_id,vendor,amount,description) VALUES(?,?,?,?,?,?)",
                 (project_id, day, inv, vendor, float(amount), description))
    total = conn.execute("SELECT SUM(amount) FROM spend WHERE project_id=?", (project_id,)).fetchone()[0]
    append_audit(conn, project_id, "SPEND_UPDATE", "finance-officer",
                 dict(invoice_id=inv, amount=float(amount), cumulative_spend=round(total), vendor=vendor), commit=False)
    conn.commit()
    return inv


def update_progress(conn: sqlite3.Connection, project_id: str, new_pct: float) -> None:
    old = conn.execute("SELECT pct_complete FROM projects WHERE project_id=?", (project_id,)).fetchone()[0]
    conn.execute("UPDATE projects SET pct_complete=? WHERE project_id=?", (float(new_pct), project_id))
    append_audit(conn, project_id, "PROGRESS_UPDATE", "site-engineer",
                 dict(old_pct=old, new_pct=float(new_pct)), commit=False)
    conn.commit()