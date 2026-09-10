#!/usr/bin/env python3
"""Read-only structural checks for the TUS Astra Markdown workflow.

Python >= 3.10, standard library only. This checks records, not the truth of
claims, test execution, medical approvals, permissions, or live agent state.
No repository command is executed and no file is modified.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
from dataclasses import dataclass, field
from pathlib import Path
import re
import sys

ID_RE = re.compile(r"TUS-\d{3,}\Z")
OPEN_STATES = {"queued", "ready", "active", "review", "blocked"}
OUTCOMES = {"done", "cancelled", "superseded"}
BACKLOG_HEADER = ["ID", "Durum", "Öncelik", "Risk", "Bağımlılıklar", "Kart", "Başlık"]
CLOSED_HEADER = ["ID", "Sonuç", "Tarih", "Kayıt", "Özet"]
EVIDENCE_HEADER = ["Criterion", "Result", "Evidence"]
PLACEHOLDERS = {"", "-", "—", "NONE", "UNKNOWN", "UNVERIFIED", "UNRESOLVED", "TBD", "TODO", "PENDING", "NOT_RUN"}


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    open_count: int = 0
    closed_count: int = 0

    @property
    def ok(self) -> bool:
        return not self.errors

    def as_dict(self) -> dict[str, object]:
        return {
            "ok": self.ok,
            "open_count": self.open_count,
            "closed_count": self.closed_count,
            "errors": self.errors,
            "scope": "structural_only_not_evidence_truth_or_product_tests",
        }


def load_text(path: Path, report: Report) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        report.errors.append(f"Cannot read {path}: {exc}")
        return None


def cells(line: str) -> list[str]:
    return [value.strip().strip("`") for value in line.strip().strip("|").split("|")]


def parse_table(text: str, header: list[str], label: str, report: Report) -> list[list[str]]:
    """Read the first table matching an exact header; reject malformed rows."""
    lines = text.splitlines()
    start = next((i for i, line in enumerate(lines) if line.strip().startswith("|") and cells(line) == header), None)
    if start is None:
        report.errors.append(f"{label}: expected table header not found")
        return []
    rows: list[list[str]] = []
    for line_no, line in enumerate(lines[start + 1:], start + 2):
        if not line.strip().startswith("|"):
            break
        values = cells(line)
        if values and all(re.fullmatch(r":?-+:?", v) for v in values):
            continue
        if not line.strip().endswith("|") or len(values) != len(header):
            report.errors.append(f"{label}:{line_no}: expected {len(header)} table cells (no pipes inside cells)")
            continue
        rows.append(values)
    return rows


def existing_inside(root: Path, relative: str, report: Report, label: str) -> Path | None:
    """Resolve symlinks and reject path traversal/outside-root references."""
    raw = Path(relative)
    if raw.is_absolute():
        report.errors.append(f"{label}: absolute path is not allowed: {relative}")
        return None
    try:
        path = (root / raw).resolve()
        if not path.is_relative_to(root):
            report.errors.append(f"{label}: path escapes project root: {relative}")
            return None
        if not path.is_file():
            report.errors.append(f"{label}: missing file: {relative}")
            return None
        return path
    except (OSError, RuntimeError, ValueError) as exc:
        report.errors.append(f"{label}: invalid path {relative}: {exc}")
        return None


def field_value(text: str, name: str) -> str:
    found = re.search(rf"^{re.escape(name)}:[ \t]*([^\r\n]*)$", text, re.MULTILINE)
    return found.group(1).strip() if found else ""


def placeholder(value: str) -> bool:
    return value.strip().upper() in PLACEHOLDERS or bool(re.fullmatch(r"<[^>]*>", value.strip()))


def section(text: str, heading: str) -> str:
    found = re.search(rf"^## {re.escape(heading)}\s*$\n(.*?)(?=^## |\Z)", text, re.MULTILINE | re.DOTALL)
    return found.group(1).strip() if found else ""


def check_closure(root: Path, row: list[str], report: Report) -> None:
    task_id, outcome, day, reference, _summary = row
    try:
        dt.date.fromisoformat(day)
    except ValueError:
        report.errors.append(f"{task_id}: closure date is not ISO YYYY-MM-DD")
    path = existing_inside(root, reference, report, f"{task_id} closure")
    if path is None:
        return
    text = load_text(path, report)
    if text is None:
        return
    if field_value(text, "Task-ID") != task_id:
        report.errors.append(f"{task_id}: closure Task-ID mismatch")
    if field_value(text, "Outcome") != outcome:
        report.errors.append(f"{task_id}: closure Outcome mismatch")
    if outcome != "done":
        if placeholder(section(text, "Reason")):
            report.errors.append(f"{task_id}: non-completion closure requires a Reason section")
        return
    if field_value(text, "Accepted-on") != day:
        report.errors.append(f"{task_id}: Accepted-on must match the archive date")
    for name in ("Target", "Accepted-by"):
        if placeholder(field_value(text, name)):
            report.errors.append(f"{task_id}: closure requires a real {name} field")
    risk = field_value(text, "Risk")
    review_mode = field_value(text, "Review-mode")
    if risk not in {"R0", "R1", "R2"}:
        report.errors.append(f"{task_id}: closure must retain Risk R0/R1/R2")
    if review_mode not in {"self-review", "independent-context", "human-review"}:
        report.errors.append(f"{task_id}: closure requires a valid Review-mode")
    if risk in {"R1", "R2"} and review_mode == "self-review":
        report.errors.append(f"{task_id}: R1/R2 cannot close with self-review alone")
    evidence = parse_table(text, EVIDENCE_HEADER, f"{task_id} evidence", report)
    if not evidence:
        report.errors.append(f"{task_id}: done requires acceptance evidence rows")
    seen: set[str] = set()
    for criterion, result, proof in evidence:
        if criterion in seen:
            report.errors.append(f"{task_id}: duplicate acceptance criterion {criterion}")
        seen.add(criterion)
        if result not in {"PASS", "N/A"}:
            report.errors.append(f"{task_id}: done criterion {criterion} has non-passing result {result}")
        if placeholder(proof):
            report.errors.append(f"{task_id}: {criterion} lacks evidence/reason")
    card = existing_inside(root, f"project/astra/tasks/{task_id}.md", report, task_id)
    if card is not None:
        card_text = load_text(card, report)
        required = set(re.findall(r"^-\s+(AC\d+):", card_text or "", re.MULTILINE))
        if not required:
            report.errors.append(f"{task_id}: task card has no machine-readable AC criteria")
        for missing in sorted(required - seen):
            report.errors.append(f"{task_id}: missing acceptance evidence for {missing}")
    for heading in ("Verification", "Review", "Residual work"):
        value = section(text, heading)
        if not value or (heading != "Residual work" and placeholder(value)):
            report.errors.append(f"{task_id}: missing closure section {heading}")


def check_workspace(root: Path) -> Report:
    root = root.resolve()
    report = Report()
    base = root / "project/astra"
    texts: dict[str, str] = {}
    for filename in ("BACKLOG.md", "CLOSED.md", "RUNTIME.md", "STATE.md"):
        path = existing_inside(root, f"project/astra/{filename}", report, filename)
        if path is not None:
            text = load_text(path, report)
            if text is not None:
                texts[filename] = text
    if "BACKLOG.md" not in texts or "CLOSED.md" not in texts:
        return report
    backlog = parse_table(texts["BACKLOG.md"], BACKLOG_HEADER, "BACKLOG", report)
    closed = parse_table(texts["CLOSED.md"], CLOSED_HEADER, "CLOSED", report)
    report.open_count, report.closed_count = len(backlog), len(closed)
    opened: dict[str, list[str]] = {}
    archived: dict[str, list[str]] = {}
    for label, rows, target in (("BACKLOG", backlog, opened), ("CLOSED", closed, archived)):
        for row in rows:
            task_id = row[0]
            if not ID_RE.fullmatch(task_id):
                report.errors.append(f"{label}: invalid task ID {task_id}")
                continue
            if task_id in target:
                report.errors.append(f"{label}: duplicate task ID {task_id}")
            target[task_id] = row
    for duplicate in sorted(opened.keys() & archived.keys()):
        report.errors.append(f"{duplicate}: appears in both BACKLOG and CLOSED; reconcile interrupted closure")
    known = set(opened) | set(archived)
    graph: dict[str, list[str]] = {}
    for task_id, row in opened.items():
        _id, status, priority, risk, dependency_cell, card_reference, title = row
        if status not in OPEN_STATES:
            report.errors.append(f"{task_id}: invalid open status {status}; terminal states belong in CLOSED")
        if priority not in {"P0", "P1", "P2"}:
            report.errors.append(f"{task_id}: invalid priority {priority}")
        if risk not in {"R0", "R1", "R2"}:
            report.errors.append(f"{task_id}: invalid risk {risk}")
        if not title:
            report.errors.append(f"{task_id}: empty title")
        expected_card = f"project/astra/tasks/{task_id}.md"
        if card_reference != expected_card:
            report.errors.append(f"{task_id}: task card must use canonical path {expected_card}")
        card = existing_inside(root, card_reference, report, task_id)
        if card is not None:
            content = load_text(card, report)
            if content is not None and not re.search(rf"^#\s+{re.escape(task_id)}\b", content, re.MULTILINE):
                report.errors.append(f"{task_id}: task card heading ID mismatch")
        deps = [] if dependency_cell in {"", "-", "—"} else [d.strip() for d in dependency_cell.split(",")]
        if len(set(deps)) != len(deps):
            report.errors.append(f"{task_id}: duplicate dependency")
        graph[task_id] = [d for d in deps if d in opened]
        for dep in deps:
            if not ID_RE.fullmatch(dep) or dep not in known:
                report.errors.append(f"{task_id}: unknown dependency {dep}")
            if dep == task_id:
                report.errors.append(f"{task_id}: self dependency")
            if status in {"ready", "active", "review"}:
                if dep not in archived or archived[dep][1] != "done":
                    report.errors.append(f"{task_id}: {status} requires done dependency {dep}")
    # DFS over open dependencies catches cycles even when all affected work is queued.
    visited: set[str] = set()
    on_stack: set[str] = set()
    def visit(node: str, chain: list[str]) -> None:
        if node in on_stack:
            report.errors.append("Dependency cycle: " + " -> ".join(chain + [node]))
            return
        if node in visited:
            return
        on_stack.add(node)
        for dep in graph.get(node, []):
            visit(dep, chain + [node])
        on_stack.remove(node)
        visited.add(node)
    for node in graph:
        visit(node, [])
    cap_raw = field_value(texts.get("RUNTIME.md", ""), "Max-in-flight-tasks")
    try:
        cap = int(cap_raw)
        if cap < 1:
            raise ValueError
        inflight = sum(row[1] in {"active", "review"} for row in opened.values())
        if inflight > cap:
            report.errors.append(f"In-flight task limit exceeded: {inflight} > {cap}")
    except ValueError:
        report.errors.append("RUNTIME: Max-in-flight-tasks must be a positive integer")
    for task_id, row in archived.items():
        if row[1] not in OUTCOMES:
            report.errors.append(f"{task_id}: invalid closed outcome {row[1]}")
        check_closure(root, row, report)
    for card in (base / "tasks").glob("TUS-*.md"):
        if card.stem not in known:
            report.errors.append(f"Orphan task card: {card.name} has no BACKLOG/CLOSED row")
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Repository/package root")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable result")
    args = parser.parse_args(argv)
    result = check_workspace(args.root)
    if args.json:
        print(json.dumps(result.as_dict(), ensure_ascii=False, indent=2))
    else:
        print(f"{'PASS' if result.ok else 'FAIL'}: workflow structure; {result.open_count} open, {result.closed_count} closed")
        for error in result.errors:
            print(f"- {error}")
        print("This result does not verify product tests, evidence truth, medical approval, or agent permissions.")
    return 0 if result.ok else 1


if __name__ == "__main__":
    sys.exit(main())
