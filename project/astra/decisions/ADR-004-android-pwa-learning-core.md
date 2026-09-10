# ADR-004 — Android PWA ve sürümlü öğrenme çekirdeği

Date: 2026-09-10
Status: accepted
Scope: TUS-004; ilk tek hedef dilimi. TUS-012 tasarım kapanışı ve /root/design_gate_review ayrı incelemesiyle yürürlük.

Karar: Mevcut vanilla JS prototipten devam; tarayıcıya kurulabilir HTTPS PWA, cihaz içi IndexedDB, sürümlü statik içerik/kabuk. Backend, LLM, framework veya Mac kabuğu eklenmez. Sabit origin veri sınırıdır. docs/design/ANDROID_SESSION_UX.md teslim/güncelleme/rollback ayrıntısını taşır.

Yerel HTTP sunucu geliştirme içindir; LAN'daki bilgisayara bağımlı tablet nihai hedef değildir. Tek HTML dosyasını Android dosya yöneticisinden açma, kullanıcı teslim yolu olarak bırakılır. Host henüz seçilip etkinleştirilmedi; ücretsiz Pages adayının yayın yetkisi sonraki somut build aşamasında istenir.

## Veri ve sorumluluk

Mevcut prototype/core.js ve 0.1 localStorage anahtarları korunur. Yeni v2 oturum çekirdeği ayrı modülde geliştirilir; mevcut öz değerlendirme kayıtları sessizce nesnel doğruya çevrilmez. İlk parça saf sürümlü komut→olay/oturum dönüşümüdür; browser transaction adaptörü bunun çevresine eklenecek. Saf reducer atomik disk kalıcılığı diye sunulmaz.

Yanıt kullanılan görev/kaynak/anahtar/politika ve aile snapshot'ına bağlıdır. Kök açılışı, ipucu/kaynak, cevap gösterimi, ilk yanıt, değerlendirme, güven beyanı ve itiraz ayrı olaydır. Orijinal yanıt düzeltmede değişmez. Aynı kimlikli tam tekrar etkisiz, farklı içerikli kimlik çakışması hatadır; revizyon çatışması veri ezmez. Gecikmeli kontrol uygunluğu açılıştan önceki geçmişe göre belirlenir; öğenin kendi kökünün görülmesi birinci denemeyi geriye dönük kirletmez. Yardım, aile geçmişi ve gerçek gecikme ayrıca doğrulanır.

TUS-005 ilk kod sınırı prototype/session-core.js ve tests/prototype/session-core.test.cjs; sentetik görevlerle sözleşme. FSRS sürüm sabitleme/adaptörü, IndexedDB transaction bağlantısı ve 0.1 import/geri dönüşü tamamlanana kadar TUS-005 kapanmaz. TUS-007 gerçek restore/çökme ve TUS-010 cihaz sınırları korunur. Tıbbi banka TUS-003 onayı olmadan normal çalışmaya alınmaz.

## Alternatif ve geri dönüş

Mevcut v0.1'i doğrudan dönüştürmek daha az dosya yaratır ama kayıt semantiğini sessiz değiştirme riski taşır. İzole yeni modül, doğrulanana kadar eski app.js'ye bağlanmaz; geri alma modülü kaldırmakla sınırlıdır, kullanıcı verisi göçü yapılmaz. Native/TWA dağıtımı yalnız PWA kabulü başarısızsa veya gerçekten gerekli OS/dağıtım yeteneği varsa yeniden değerlendirilir.

## Doğrulama

TUS-002 karşılaştırmalı etkinlik kapısı açık; bu dar teknik dilimi ADR-003 gereği kilitlemez. Saf çekirdek için Node testleri; transaction/restore için ayrı entegrasyon; kurulum için gerçek Android. Otomatik test sayısı öğrenme etkisi değildir. Resmî teknik kaynaklar ANDROID_SESSION_UX.md içinde. Bağımsız tasarım incelemesi tamamlanmadan ADR accepted olmaz.
