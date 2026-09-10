# TUS-005 ilk dilim — yürütme sözleşmesi

Date: 2026-09-10
Task-ID: TUS-005
Base: f31563c (local; main4c251e5 üzerine tasarım kararı)
Worker: /root/session_core_impl
Requested-model: gpt-5.6-sol
Requested-effort: high
Effective-model: unknown
Effective-effort: unknown
Workspace: /workspace/scratch/6be1bd604873/TUS-core-worktree
Branch: agent/tus-005-session-core
Allowed-write: prototype/session-core.js; tests/prototype/session-core.test.cjs; docs/design/SESSION_CORE_CONTRACT.md

Amaç: saf sürümlü oturum/yanıt olay çekirdeği; cevap kilidi, gözlem/beyan/türetim ayrımı, yardım, tekrar kimliği/revizyon, pause/resume, itiraz nötrleştirme. Kaynak/görev/aile/anahtar/politika izlenebilir. Yalnız sentetik fixture. node --test tests/prototype/session-core.test.cjs ve mevcut wildcard testleri.

Sınır: mevcut0.1 veri/app/sw/core değişikliği, ürün UI bağlantısı, FSRS, IDB kalıcılığı, gerçek import/migration, hosting/ücret/medical yayın yok. Tam005 kapanmaz. Worker commit/push/alt ajan açmaz. Ana yönetim dosyası yazıcısı /root ayrı worktree'dedir. Aynı paylaşılan ağaçta iki yazıcı yok.

Kabul: aynı kimlikli aynı içerik no-op; farklı içerik/stale rev reject; ilk cevabı overwrite edememe; tarafsız itiraz; confidence correctness'i değiştirmez; source/hint aided; state/input alias güvenliği; failed batch kısmi olay üretmez; gerçek timestamp/schema/ref/status validation; kontrol/scheduler desteği varmış gibi sayılmama. Ayrı R2 incelemesi ve gerçek test sonucu gerekir. R2 inceleme, tamamı henüz uygulanmamış005'i kapatmaz.
