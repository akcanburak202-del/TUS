# ADR-005 — Kalıcı kayıt ve geçici ekran denemesi

Date: 2026-09-10
Status: accepted
Scope: TUS-005 dar devam dilimi; TUS-006 üretim kabulü değil.

Kullanıcı kaldığımız yerden devamı ve deneyebileceği aşamaya ilerlemeyi istedi. Kayıtlı TUS005 sürer; üretim bağımlılıkları tamamlanmış sayılmaz. IDB adaptörü ve açıkça sentetik, tıbbi olmayan ekran harness'i birlikte geliştirilir. Tıbbi tiroid soruları normal bankaya açılmaz.

Kalıcı sürüm: bir workspace'in olay günlüğü ve bu günlükteki oturum adımı tek IndexedDB readwrite transaction ile yazılır. API yalnız complete sonrası yeni state döndürür. Katalog sürümleri doğrulanır; bozuk kayıt boş state ile değiştirilmez. source/hint, güven ve değerlendirme ayrı; tamamlanmış yanıta itiraz mümkün.

Kullanıcının şimdiden ekranları deneyebilmesi için release/learning-preview/TUS-Ogrenme-Akisi-Deneme.html üretilir. Bu yalnız açıkça etiketlenmiş GEÇİCİ bellek demosudur; localStorage/IDB/SW kullanmaz, sayfa kapanınca kayıtlar silinir. Nihai Android teslim yolu değildir ve ADR004 HTTPS PWA kararını değiştirmez. HTTPS ZIP gerçek IDB modülünü içerir; yeni hosting deployment yapılmaz. Mevcut0.1 app/veri anahtarları korunur.

Bu demoda iki alıştırma iki teknik session olarak temsil edilir; aynı workspace içindedir. İkinci alıştırma açıkça destekli, öğrenme veya bağımsız kontrol kanıtı değildir. Tam E1/E2/E3 üretim orkestrasyonu, FSRS, bağımsız kontrol ve legacy import açık kalır. TUS005/006 kapanmaz.

## Doğrulama yolları

Node sözleşmeleri, Linkedom+fake-indexeddb benzetimi, gerçek Playwright Chromium ve fiziksel Android ayrı kanıtlardır. Benzetim gerçek disk/OS güvencesi değildir. Yerel Chromium kurulumu timeout/502, Cloud Browser bağlantısı transport closed ile sonuçlandı. Tarayıcı suite'i bu yüzden GitHub Actions standard ubuntu runner'a taşınır; Node24, Playwright1.63.0 ve test bağımlılıkları package-lock ile sabit. Workflow yalnız testtir, hosting/secret/write permission/artifact upload/cache kullanmaz. Public repo standard runner kullanımı ücretsizdir; ücretli larger runner seçilmedi.

Teknik dayanaklar (erişim10 Eylül2026): [MDN IDBTransaction](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction), [Playwright CI](https://playwright.dev/docs/ci-intro), [GitHub Actions kullanım koşulları](https://docs.github.com/en/billing/concepts/product-billing/github-actions). Bunlar teknik davranış/çalıştırma belgeleri, öğrenme etkisi kanıtı değildir.
