# TUS-012 — Android tek oturum ekranı ve teslim sözleşmesi

10 Eylül 2026 · Tasarım kararı; çalıştırılmış Android kabulü değil.

Dayanak: kullanıcı TUS-011 senaryosunu ve ekran sırasını kabul edip geliştirmeye başlama yetkisi verdi. ONE_TARGET_LEARNING_SCENARIO.md metinleri aynen kullanılır; yeni ekran akışı onayı uydurulmaz. Tıbbi paket TUS-003 onayı bekler.

## Tek önerilen teslim yolu

Sabit HTTPS adresinden kurulabilir PWA, ilk hedef Android'de kurulum destekleyen Chromium tarayıcı. Yerel sunucu yalnız geliştirici aracı; kullanıcıdan Termux/Python çalıştırması beklenmez. Mac kabuğu yok. Chrome referans tarayıcıdır; kullanıcının Huawei/Xiaomi tabletindeki gerçek tarayıcı, GMS ve kurulum davranışı TUS-010'da doğrulanır. Kurulum sunulmaması halinde tarayıcıdan açılış mümkün olsa bile kurulum kabulü geçmiş sayılmaz.

Barındırma henüz etkin değil. Ücretsiz statik hosting adayı GitHub Pages; canlı adres, ayar değişikliği ve açık uygulama yayını bu görevde yapılmaz. Repo push izni host deployment izni değildir. Kullanıcıya deployment onayı, içerik ve build somut olduğunda son adım olarak sunulur; teknik geliştirmeyi durdurmaz. Uygulama hasta verisi/telemetri/uzak AI içermez.

## Ekran eşlemesi

| Ekran | Görünen ana içerik/eylem | Sonraki durum |
|---|---|---|
| İlk ağ açılışı | Hazır sürümü getir; kurulum sunulursa Tablete kur; kurulumu zorlamadan çalışma | Tam app shell indirilince Çevrimdışı hazır; bu yazı kendi başına cihaz testi değil |
| Bugün | Tek hedef, yaklaşık 5–8 dakika, Başla veya Devam et | Kabul edilmiş E1 ya da kayıtlı son adım |
| E1 | Tek soru, A–D; tek Bilmiyorum; seçim sonrası isteğe bağlı güven | Yanıt kayıt işlemi başarılı olunca sonuç; başarısızsa aynı ekranda tekrar dene |
| Öğretim/E2 | Senaryodaki kısa açıklama ve destekli tamamlama | E3 veya Ara ver |
| E3 | Önce kısa neden denemesi, sonra sırayla bağlantı seçimi | Ölçütleri ayrı sonuç; bitir |
| Kaynak/itiraz | İlgili kaynak veya itiraz formu; varsayılan hedef askısı | Etkilenmeyen iş varsa ona geç; yoksa bitir |
| Bitiş | İlk yanıt, destekli sonuç ve açıklama değerlendirmesi ayrı; gerçek sonraki tarih varsa göster | Bugün |
| Ara verme/dönüş | Kaydedilmiş son adım; gönderilmemiş taslak ve soru görülmesi ayrılır | Devam et; ilk yanıtı yeniden yaratmaz |
| Ayrı kontrol | Uygunluk, gecikme ve aile kapıları sağlanınca senaryodaki C1 türü | Kontrol sonucu/destekli alıştırma/itiraz/bitiş |

Öğrenci ekranında içerik editörü, ham olaylar veya zamanlayıcı parametreleri yok. Yedek Ayarlar'da; depolama hatasında ilgili eylem görünür olur. Dokunma esas; zorunlu sürükleme/yazı yok; odak ve metin kontrastı renk dışı işaretlerle desteklenir. Yatay/dikey ve büyütülmüş yazı kabulü gerçek cihaz işidir. Tek ana eylem ve güvenin geç açılması TUS-011 tasarımından gelir; bu davranışların faydası henüz ölçülmedi.

## Kayıt ve güncelleme sınırı

Yanıt ve oturum devamı IndexedDB'de tek readwrite transaction içinde kaydedilecek. Request success tek başına başarı değildir; transaction complete beklenir. Cevap/puan bu tamamlanmadan açılmaz. Abort/quota durumunda eski kayıt korunur, yanıt ekranda kaybolmaz. Tamamlanmış transaction da fiziksel güç kaybına karşı mutlak dayanıklılık garantisi değildir.

Cache API yalnız sürümlü kabuk/içerik içindir. Öğrenci kayıtları cache'e konmaz. Depolama origin'e bağlıdır; protokol/host/port değişikliği kullanıcı göçüdür. Kalıcı depolama isteği denenebilir; ret veya veri silinme ihtimali gizlenmez. Açık sürümlü yedek gerekir.

Yeni sürüm önce ayrı cache'e tamamıyla alınır. Aktif oturum ortasında zorunlu activate/reload yok. Bugün/bitişte “Yeni sürüm hazır” ve kullanıcı eylemi; tamamlanmamış yazılar önce sonuçlanır. Önceki shell sürümü tutulur. Kod geri dönüşü ile veri geri dönüşü farklıdır: uyumsuz eski şema yeni kayıtları açmaya zorlanmaz. Yedek tamamen doğrulanır, yeni workspace'e atomik yüklenir; önceki workspace geri alma için korunur. Bunlar uygulanacak sözleşme; mevcut sw.js bu koşulları henüz karşılamaz.

## Alternatif ve değişme koşulu

Paketli Android ancak gereken OS yeteneği, yönetimli mağaza/dağıtım gereği veya gerçek tablet PWA kabulünde çözülemeyen sorun varsa. TWA web içeriğini paketlemeye ek doğrulama/imzalama hattı getirir ve HTTPS hosting ihtiyacını kaldırmaz. Şu aşamada ikinci dağıtım hattı kurmayacağız.

## Tasarım kabulü ile açık uygulama kapıları

TUS-011 kullanıcı kabulü ekran sırası ve dört dalı kapsar. Buradaki aynı sıralama için yeniden onay istenmez; teknik teslim seçimi Astra'nın kapsam içi kararıdır. TUS-012 yalnız tasarım olarak kapanabilir. Gerçek kurulum/çevrimdışı yeniden açılış, kayıt korunarak güncelleme, yedek/geri alma, Huawei/Chromium davranışı TUS-010 ve TUS-007'de açık kalır. Hosting deployment ayrıca yetki bekler. Hiçbir URL'nin canlı olduğu söylenmez.

## Resmî teknik dayanaklar

Erişim 10 Eylül 2026; araştırmacı /root/android_design, kritik transaction/install/update pasajlarını orkestratör ayrıca kontrol etti. Bunlar ürün API davranışı belgeleridir, eğitimsel kanıt değildir.

- [MDN — Installable PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable): HTTPS/manifest ve tarayıcıya göre kurulum koşulları.
- [MDN — IDBTransaction](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction): transaction sınırı, abort/complete ve dayanıklılık sınırları.
- [Chrome — Service worker updates](https://developer.chrome.com/docs/workbox/handling-service-worker-updates): bekleyen worker ve güncelleme akışı; Workbox kütüphanesi ekleme kararı değildir.
- [MDN — Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria): best-effort/persistent storage ve origin kapsamı.
- [Chrome — Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity): Android paket alternatifinin kapsamı.
- [GitHub — Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages): statik hosting adayı; etkinleştirilmiş servis değil.
