# Astra · Devam noktası

Güncellendi: 2026-09-10. Kullanıcı TUS-011 senaryosunu kabul edip repoya eklemeyi ve geliştirmeye başlamayı istedi.

## Geçerli sözleşme

Android tablet ilk, Mac sonra. docs/TUS_Ogrenme_Deneyimi_Revizyon_Plani_v2.md, ADR-003, ADR-004 ve docs/design/ONE_TARGET_LEARNING_SCENARIO.md geçerli. Açık durumun tek kaynağı BACKLOG.md. Genel planı baştan yazma.

## Son güvenilir nokta

Remote main senaryo entegrasyonu 4c251e56a558a6f38c36bb367eb19efd387399fb doğrulandı. Bu kaydı içeren sonraki gönderimin kesin SHA'sı GitHub main ref'inden okunmalı; kendi commit kimliğini dosyanın içine varsayma. Yerel gerçek repo /workspace/scratch/6be1bd604873/TUS-repo, main. Başlangıç import geçmişi local-import-history dalında korunur; remote ile karıştırma.

## Yapılan

TUS-011 kullanıcı tasarım kabulüyle; TUS-012 ve TUS-004 ayrı tasarım incelemesiyle kapandı. Android teslim kararı HTTPS PWA; hosting henüz etkin değil. TUS-005'in ilk saf çekirdeği prototype/session-core.js: sürümlü köken, ilk yanıt kilidi, ayrı güven/değerlendirme, zamanlı yardım, pause/resume, hedef itirazı, tekrar kimliği/revizyon ve geçersiz geçmiş reddi. UI bağlantısı yok; mevcut0.1 core/app/sw ve kullanıcı depolaması değişmedi.

13 yeni test dahil43 Node testi ve29 Astra testi PASS. Ayrı R2 incelemesi hedef hashlerde engel bulmadı. Tam kanıt runs/TUS-005-session-core-review.md ve ilişkili loglarda. Otomatik test öğrenme yararı veya gerçek cihaz kanıtı değildir.

## Kaldığımız iş

TUS-005 ready; tamamlanmış sayma. İlk sonraki dilim: saf çekirdeğin etrafında IndexedDB olay+oturum atomik kalıcılığı ve reload/abort/quota sözleşmesi. Kartta tam session yönlendirme/bitiş, FSRS sürüm/adaptörü, bağımsız kontrol uygunluğu ve0.1 import/geri alma açık. docs/design/SESSION_CORE_CONTRACT.md API sınırı; LEGACY_IMPORT_CONTRACT.md henüz uygulanmamış göç sözleşmesi.

TUS-003 insan tıbbi içerik ve kontrol aile kabulü beklediğinden blocked; mevcut kontrol içeriği kullanıcı tarafından görüldü, görülmemiş kontrol sayılamaz. TUS-007 restore/çökme ve TUS-010 gerçek Android kapıları açık.

## Aktif sahiplik ve yetki

Bu dilimin worker/reviewer'ları tamamlandı; arka planda devam eden uygulama işi yok. /root/session_core_impl izole TUS-core-worktree içinde yalnız üç izinli dosya yazdı; /root/session_core_review taze bağımsız bağlamda inceledi. Ana kayıtların tek yazıcısı /root. İstenen gpt-5.6-sol/high; etkin metadata unknown. Yeni turda gerçek durumu doğrula.

Senaryo ve kapsam içi geliştirme commit/gönderimi açıkça yetkili. Yeni ücret, hosting deployment ve insan tıbbi onayı yok. Teknik iş sentetik fixture ile ilerler; tıbbi öğrenci bankasını etkinleştirme.

## Yeni yürütme · 2026-09-10

Kullanıcı kaldığımız yerden devamı ve denenebilir aşamaya ilerlemeyi istedi. Remote main9582bfd doğrulandı, temiz baseline. /root/idb_impl: TUS-idb-worktree, session-store ve dar end_session uzantısı + test/sözleşme. /root/preview_impl: TUS-preview-worktree, yalnız prototype/preview/ ve browser testi. Ortak API store.open({catalog,dbName}) -> load(workspaceId), dispatch(workspaceId,commands), close. Ayrı izole yazıcılar, ortak şema değişikliğinin tek sahibi idb_impl; root yönetim ve paketleme. TUS005 aktif; sentetik teknik harness TUS006 kabulü değildir. Model tercihleri sol/high; effective unknown.
