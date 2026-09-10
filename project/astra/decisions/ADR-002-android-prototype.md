# ADR-002 — Android-first technical prototype

Date: 2026-09-10. Decision owner: Astra.
User changed first target to standalone Android tablet and authorized continuing while absent. Mac packaging is deferred. This is an explicitly reversible usability/engineering prototype, not a completed production/product-effectiveness gate. TUS-002 user comparison and TUS-003 human medical review remain open.

Use dependency-free browser JavaScript with a standalone bundled HTML and a localhost-served PWA. Core has no network calls or LLM. Browser device-local storage is a prototype adapter; JSON export/import provides portable backup. Web storage is not promised as durable desktop SQLite. Browser denial/quota/corruption must show an error, not silently reset. Backup import validates completely before replacing, requires confirmation and retains previous snapshot for undo. No patient data or cloud sync.

Provide three fictional objectives as unmistakable demo data. Medical tasks may be authored and explicitly approved individually by the user; no automatic attribution of medical approval. Demo and personal events/states are separate. Training-only first prototype does not claim independent held-out assessment; core can distinguish observations without turning same-session corrections into mastery.

Delivery: local files and private downloadable artifact. No Sites deployment for this local-first request. Public GitHub push remains blocked by prior automatic review; do not route around it. Source changes stay in existing TUS checkout; no skill modification. No external assets, dependencies or new account.

Alternatives: native Android requires build/signing/distribution overhead; Tauri Mac cannot be tested on Android; hosted-only UI conflicts with local independence. Later move storage adapter to SQLite and shell to Mac without redefining events.

Acceptance: touch controls, limited daily plan including 0 minutes, answer before explanation, error repair distinguished from independent control, immutable/idempotent event append, strict backup round-trip/rejection/undo, local persistence failure handling, self-report separate, offline asset shell. Actual tablet/browser install is an outstanding user device check, not claimed passed in Linux.
