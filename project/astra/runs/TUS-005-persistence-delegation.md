# TUS-005 kalıcılık ve denenebilir teknik ekran

Base: 9582bfda1547f83428761f80994ea9f94da6873d
Workers: /root/idb_impl; /root/preview_impl
Requested: gpt-5.6-sol/high; effective unknown
Max parallel:2; separate git worktrees, no shared writer.

IDB worker alanı: prototype/session-store.js, tests/browser/session-store.spec.cjs, docs/design/SESSION_STORE_CONTRACT.md; end_session için session-core.js ve ilgili mevcut Node testi. UI worker alanı: prototype/preview/ ve tests/browser/preview.spec.cjs. Root yönetim/paketleme ve entegrasyon. Commit/push/deploy/agent açma worker yetkisi yok.

Sabit API: TusSessionStore.open({catalog,indexedDB?,dbName?}) -> Promise store; load(workspaceId) -> validated Core state/defaultempty; dispatch(workspaceId,commandsArray) -> committed state; close(). Yanıt/oturum state'i aynı readwrite transaction içinde; resolve yalnız complete. Hatalı kaydı boş state ile değiştirme yok. Girdiler asenkron işlemden önce kopyalanır. IDB concurrent revision, duplicate, abort ve hata yolları gerçek Chromium üzerinde sınanacak.

End_session: aktif ve değerlendirilen yanıtı olan session tamamlanır; sonradan itiraz mümkün, ek cevap/step/restart değil. Eski0.1 core/app/sw/localStorage değişmez.

Demo yalnız kurgusal nonmedical içerik; 4 yol, kayıt sonrası feedback, ayrı güven, pause/reload, hedef askısı. TUS003 ve006 üretim kapısı açılmaz. FSRS/control/import tamamlanmış sayılmaz. Android gerçek cihaz sonucu ayrıca kullanıcı testi; Linux Chromium eşdeğer değildir. Hosting deploy bu yürütmede otomatik yapılmaz.
