# TUS-005 kalıcılık + sentetik ekran incelemesi

Date: 2026-09-10
Base: 9582bfda1547f83428761f80994ea9f94da6873d
Review-mode: independent-context
Reviewer: /root/persistence_review
Workers: /root/idb_impl; /root/preview_impl
Requested: gpt-5.6-sol/high; effective unknown
Slice-review: accepted with real-browser verification pending
Task-status: incomplete
Snapshot: TUS-005-persistence-manifest.json

Ayrı R2 kaynak/diff incelemesi, son snapshot'ta engelleyici kod bulgusu bırakmadı. Root ürün testlerini entegre ağaçta çalıştırdı:44 Node PASS,8 Linkedom/fake-indexeddb benzetimi PASS. Bu benzetim fiziksel IDB veya tarayıcı kanıtı değildir. Reviewer Astra unittest29 PASS bildirdi. Yönetim yapıcheckPASS.

## Giderilen somut bulgular

- Geçici dosya localStorage yasaksa açılamıyordu: memory modunda storage veSW bağımlılığı kaldırıldı. Önce kırmızı, sonra yeşil portable test kaydı var.
- Retry çift dokunmada paylaşılan pending komutu yarışıyordu: tek uçuş ve çağrıya özel batch; regression testi geçer.
- pagehide BFcache geri dönüşünde kapalı store bırakıyordu: persisted geçişte bağlantı kapatılmaz.
- Yeni workspace yüklenemediğinde eski id/state korunur; ayar depolaması hatası görünür.
- Sabit, network-first cache sürümleri karıştırabiliyordu: scoped cache-first shell, build içerik hash'i sürüm olur; navigation aynıcachedindex'i kullanır.
- Tekrar build stale dosya taşıyordu: yalnız üretilmiş staging yeniden oluşturulur.

Başarısız evaluate sırasında feedback yok, retry sonrası tek değerlendirme var. Source+hint reload'da korunur, tek maruziyet ve assisted sonucu üretir. İtiraz ve end_session eski yanıtı silmez. Tıbbi içerik, sahte ustalık/FSRS/bağımsız kontrol iddiası yok.

## Çalıştırma sınırları

Yerel Chromium resmiindirme timeout/502 ile başarısız; browser executable yok. Cloud Browser seçimi başarılı olsa da ilk navigation transport closed oldu. Yerel gerçek tarayıcı testleriNOT_RUN;5 IDB +8 UI testi GitHub Actions sonucunu bekliyor. Workflow yalnızstandardpublicUbuntu testidir; deploy/secret/cache/artifactupload yok.

Tam005 görevi kapanmaz: FSRS, kontrol uygunluğu,0.1 import/geri dönüş, tam üretim öğrenme oturumu açık. TUS003 insan içerik ve TUS007/010 gerçek cihaz/restore kapıları sürer. Dosya demosu yalnız geçici ekran denemesidir.
