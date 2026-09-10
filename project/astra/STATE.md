# Astra · Devam noktası

Güncellendi: 2026-09-10T17:35:01+00:00

## Geçerli sözleşme

Android tablet ilk, Mac sonra. Güncel plan docs/TUS_Ogrenme_Deneyimi_Revizyon_Plani_v2.md; ADR003/004/005 ve docs/design/ONE_TARGET_LEARNING_SCENARIO.md. Açık iş durumu BACKLOG.md. Genel planı yeniden yazma.

## Son güvenilir sürüm

Remote main kod+demo commit'i 03d396602f45d43f5b5d8a75371b5471f3d02f5f; tree2f00f17c6b62aa6ca0d60fe47c9dc55155e336b1 doğrulandı. Bu kaydı içeren sonraki commit yalnız devir/kanıt belgesidir; kesin yeni mainSHA'yı API'den oku. Repo /workspace/scratch/6be1bd604873/TUS-repo, main. Yerel çalışmalar local-import-history, local-session-core-history ve local-persistence-history dallarında korunur.

## Yapılan ve denenebilir çıktı

TUS005: ilk yanıt/güven/değerlendirme/yardım/itiraz çekirdeği, end_session ve gerçek IndexedDB adaptörü var. Workspace olayları ve oturum adımı tek transaction; başarı complete sonrası. Aynı komut etkisiz tekrar, stale revision/bozuk geçmiş reddi. prototype/preview/ yalnız sentetik, tıbbi olmayan ekran denemesi; eski0.1 app/core/sw/localStorage değişmedi.

release/learning-preview/TUS-Ogrenme-Akisi-Deneme.html kullanıcıya verilecek geçici tek dosya; bütün kayıtları bellekte, sayfa kapanınca silinir. HTTPS ZIP kalıcı IDB sürümünü içerir ama hosting etkin değil. Demo içerikleri ısı denetleyicisi, tiroid sorusu sentetik diye etiketlenmedi. Tiroid senaryosu tasarım/kaynak belgesinde; tıbbi onay bekler.

CI https://github.com/akcanburak202-del/TUS/actions/runs/34508758242 kod03d396602f45d43f5b5d8a75371b5471f3d02f5f için SUCCESS:44 Node,8 Linkedom/fakeIDB benzetimi,5 gerçek ChromiumIDB testi ve8 UI kontrolü. HTMLSHA yerel veCI eşleşti. Bağımsız R2 incelemesi ve manifest runs/TUS-005-persistence-review.md / persistence-manifest.json içinde; CI sonucu persistence-ci.json. Yerel browser kurulumu başarısızdı, CI bunu gerçek Chromium'da telafi etti. Fiziksel Android, gerçek güç kaybı/quota ve offline install/update/rollback NOT_RUN.

## Kaldığımız iş

TUS005 ready ve açık: sürümlü FSRS zamanlayıcı uyarlayıcısı, kontrol uygunluğu (aile/maruziyet/gecikme),0.1 import/geri alma ve tam üretim oturum yönlendirmesi. Sonraki teknik dilim: 0.1 yedeğini değiştirmeden içe alan adaptör ve geri dönüş; docs/design/LEGACY_IMPORT_CONTRACT.md kaynak sözleşme. Sahte tarih/ustalık üretme. TUS007/010 gerçek restore/cihaz kapıları korunur.

TUS003 blocked: insan tıbbi içerik incelemesi ve görülmemiş kontrol aile kabulü yok. Kullanıcı mevcutC1'i gördü; bağımsız görülmemiş kontrol diye kullanma. TUS006 queued; sentetik harness onu tamamlamaz.

## Sahiplik ve yetki

/root/idb_impl, /root/preview_impl ve /root/persistence_review tamamlandı; arka planda çalışan ajan yok. İstenen sol/high, effective unknown. Root entegrasyon ve kabulü yaptı. Bu devam isteği kapsam içi geliştirme ve repo gönderim yetkisini sürdürüyor. Yeni hosting deployment, ücret veya insan tıbbi onayı verilmiş sayılmadı. Standard public GitHub test workflow'u read-only yetkiyle çalıştı; yayın değildir.
