"""Synthetic workflow fixtures; these are NOT product or multi-agent tests."""
from __future__ import annotations

import hashlib
import importlib.util
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
CHECKER = ROOT / "tools/astra/check_workflow.py"
spec = importlib.util.spec_from_file_location("astra_workflow_checker", CHECKER)
assert spec and spec.loader
workflow = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = workflow
spec.loader.exec_module(workflow)


def markdown_table(header: list[str], rows: list[list[str]]) -> str:
    return "\n".join("| " + " | ".join(row) + " |" for row in [header, ["---"] * len(header), *rows]) + "\n"


class WorkflowTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.base = self.root / "project/astra"
        (self.base / "tasks").mkdir(parents=True)
        (self.base / "closures").mkdir()
        (self.base / "STATE.md").write_text("# Synthetic test state\n", encoding="utf-8")
        (self.base / "RUNTIME.md").write_text("Max-in-flight-tasks: 2\n", encoding="utf-8")
        self.open: list[list[str]] = []
        self.closed: list[list[str]] = []
        self.add_task("TUS-001")

    def add_task(self, task_id: str, status: str = "queued", deps: str = "-", risk: str = "R0") -> None:
        self.open.append([task_id, status, "P0", risk, deps, f"project/astra/tasks/{task_id}.md", "Synthetic task"])
        (self.base / "tasks" / f"{task_id}.md").write_text(
            f"# {task_id} · Synthetic test only\n\n- AC1: First synthetic criterion.\n- AC2: Second synthetic criterion.\n",
            encoding="utf-8",
        )

    def save(self) -> None:
        (self.base / "BACKLOG.md").write_text(markdown_table(workflow.BACKLOG_HEADER, self.open), encoding="utf-8")
        (self.base / "CLOSED.md").write_text(markdown_table(workflow.CLOSED_HEADER, self.closed), encoding="utf-8")

    def result(self):
        self.save()
        return workflow.check_workspace(self.root)

    def assert_error(self, expected: str) -> None:
        result = self.result()
        self.assertFalse(result.ok)
        self.assertTrue(any(expected in error for error in result.errors), result.errors)

    def close(self, task_id: str = "TUS-001", outcome: str = "done", risk: str = "R0", review: str = "self-review") -> Path:
        self.open = [row for row in self.open if row[0] != task_id]
        self.closed.append([task_id, outcome, "2026-09-10", f"project/astra/closures/{task_id}.md", "Synthetic outcome"])
        path = self.base / "closures" / f"{task_id}.md"
        text = f"""# Synthetic closure — never real project evidence
Task-ID: {task_id}
Outcome: {outcome}
Risk: {risk}
Review-mode: {review}
Target: synthetic-fixture-snapshot
Accepted-by: synthetic-reviewer
Accepted-on: 2026-09-10

## Acceptance evidence

| Criterion | Result | Evidence |
|---|---|---|
| AC1 | PASS | Synthetic test fixture observation 1. |
| AC2 | PASS | Synthetic test fixture observation 2. |

## Verification
Synthetic record for parser behavior only.

## Review
Synthetic record; no actual model or human review claimed.

## Residual work
NONE

## Reason
Synthetic cancellation or supersession rationale.
"""
        path.write_text(text, encoding="utf-8")
        return path

    def edit(self, path: Path, old: str, new: str) -> None:
        text = path.read_text(encoding="utf-8")
        self.assertIn(old, text)
        path.write_text(text.replace(old, new), encoding="utf-8")

    def test_valid_queued_backlog(self):
        self.assertTrue(self.result().ok)

    def test_duplicate_open_id(self):
        self.open.append(self.open[0].copy())
        self.assert_error("duplicate task ID")

    def test_done_not_allowed_in_open_backlog(self):
        self.open[0][1] = "done"
        self.assert_error("invalid open status")

    def test_unknown_dependency(self):
        self.open[0][4] = "TUS-999"
        self.assert_error("unknown dependency")

    def test_dependency_cycle_detected_while_queued(self):
        self.open[0][4] = "TUS-002"
        self.add_task("TUS-002", deps="TUS-001")
        self.assert_error("Dependency cycle")

    def test_self_dependency(self):
        self.open[0][4] = "TUS-001"
        self.assert_error("self dependency")

    def test_ready_requires_completed_dependencies(self):
        self.add_task("TUS-002", "ready", "TUS-001")
        self.assert_error("ready requires done dependency")

    def test_cancelled_does_not_satisfy_dependency(self):
        self.close(outcome="cancelled")
        self.add_task("TUS-002", "ready", "TUS-001")
        self.assert_error("ready requires done dependency")

    def test_wip_limit_includes_review(self):
        self.open[0][1] = "active"
        self.add_task("TUS-002", "review")
        self.add_task("TUS-003", "active")
        self.assert_error("In-flight task limit exceeded")

    def test_missing_task_card(self):
        (self.base / "tasks/TUS-001.md").unlink()
        self.assert_error("missing file")

    def test_path_traversal_rejected(self):
        self.open[0][5] = "../outside.md"
        self.assert_error("path escapes project root")

    def test_absolute_path_rejected(self):
        self.open[0][5] = str(self.base / "tasks/TUS-001.md")
        self.assert_error("absolute path is not allowed")

    def test_symlink_escape_rejected(self):
        path = self.base / "tasks/TUS-001.md"
        path.unlink()
        with tempfile.TemporaryDirectory() as elsewhere:
            outside = Path(elsewhere) / "task.md"
            outside.write_text("# TUS-001\n", encoding="utf-8")
            try:
                path.symlink_to(outside)
            except (OSError, NotImplementedError) as exc:
                self.skipTest(f"Symlink creation unavailable: {exc}")
            self.assert_error("path escapes project root")

    def test_orphan_card(self):
        (self.base / "tasks/TUS-999.md").write_text("# TUS-999\n", encoding="utf-8")
        self.assert_error("Orphan task card")

    def test_interrupted_closure_open_closed_overlap(self):
        row = self.open[0].copy()
        self.close()
        self.open.append(row)
        self.assert_error("both BACKLOG and CLOSED")

    def test_missing_closure_proof(self):
        self.close().unlink()
        self.assert_error("missing file")

    def test_not_run_cannot_be_done(self):
        path = self.close()
        self.edit(path, "| AC1 | PASS |", "| AC1 | NOT_RUN |")
        self.assert_error("non-passing result NOT_RUN")

    def test_missing_acceptance_criterion(self):
        path = self.close()
        self.edit(path, "| AC2 | PASS | Synthetic test fixture observation 2. |\n", "")
        self.assert_error("missing acceptance evidence for AC2")

    def test_r2_self_review_cannot_close(self):
        self.close(risk="R2")
        self.assert_error("cannot close with self-review alone")

    def test_valid_done_enables_dependent_task(self):
        self.close(risk="R2", review="independent-context")
        self.add_task("TUS-002", "ready", "TUS-001")
        result = self.result()
        self.assertTrue(result.ok, result.errors)
        self.assertEqual((result.open_count, result.closed_count), (1, 1))

    def test_bad_header_rejected(self):
        self.save()
        self.edit(self.base / "BACKLOG.md", "| Durum |", "| State |")
        result = workflow.check_workspace(self.root)
        self.assertTrue(any("table header not found" in error for error in result.errors))

    def test_bad_row_rejected(self):
        self.open[0][-1] += " | extra cell"
        self.assert_error("expected 7 table cells")

    def test_cancelled_requires_reason(self):
        path = self.close(outcome="cancelled")
        self.edit(path, "Synthetic cancellation or supersession rationale.", "TODO")
        self.assert_error("requires a Reason section")

    def test_placeholder_target_rejected(self):
        path = self.close()
        self.edit(path, "Target: synthetic-fixture-snapshot", "Target: <snapshot>")
        self.assert_error("requires a real Target")

    def test_blank_field_does_not_consume_next_line(self):
        path = self.close()
        self.edit(path, "Target: synthetic-fixture-snapshot", "Target:")
        self.assert_error("requires a real Target")

    def test_acceptance_date_matches_archive(self):
        path = self.close()
        self.edit(path, "Accepted-on: 2026-09-10", "Accepted-on: 2026-09-09")
        self.assert_error("Accepted-on must match")

    def test_invalid_wip_limit(self):
        self.edit(self.base / "RUNTIME.md", "Max-in-flight-tasks: 2", "Max-in-flight-tasks: 0")
        self.assert_error("positive integer")

    def test_read_only_checker_does_not_modify_files(self):
        self.save()
        def snapshot():
            return {str(path.relative_to(self.root)): hashlib.sha256(path.read_bytes()).hexdigest()
                    for path in self.root.rglob("*") if path.is_file()}
        before = snapshot()
        self.assertTrue(workflow.check_workspace(self.root).ok)
        self.assertEqual(before, snapshot())

    def test_cli_failure_exit_code_and_json(self):
        self.open[0][1] = "done"
        self.save()
        run = subprocess.run([sys.executable, str(CHECKER), "--root", str(self.root), "--json"],
                             capture_output=True, text=True, check=False, timeout=10)
        self.assertEqual(run.returncode, 1, run.stderr)
        self.assertIn('"ok": false', run.stdout)


if __name__ == "__main__":
    unittest.main()
