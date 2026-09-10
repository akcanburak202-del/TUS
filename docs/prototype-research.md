# Android prototip kararı — mevcut araç kıyası

2026-09-10. Araştırmacı: /root/research_gate, istenen GPT-5.6 Sol/high; etkin model metadata unknown. Kaynaklı masaüstü araştırmasıdır; gerçek kullanıcı denemesi yapılmadı. TUS-002 PARTIAL; üretim yolu kapısı açık kalır.

| Seçenek | İlk öğrenme / hata onarımı / ayrı kontrol | Maliyet ve sınır |
|---|---|---|
| AnkiDroid + soru bankası + kısa kayıt | Hazır tekrar, yeniden öğrenme ve çevrimdışı kullanım; aile ve kontrol ayrımı ayrı deste/kayıt düzeniyle | En düşük geliştirme maliyeti; uygulama geçişi ve elle ilişkilendirme ölçülmeli |
| AnkiDroid yanında yardımcı uygulama | Kaynak, hata ve ayrı kontrol kaydını yardımcı üstlenir; Anki zamanlayıcıyı korur | İki veri kaynağı ve kimlik eşleme; native Android API, tarayıcıdan doğrudan kullanılamaz |
| Küçük bağımsız yerel prototip | Kaynak, yanıt, açıklama ve gözlem tek akışta; aile sınırları veri sözleşmesinde | En yüksek uzun dönem maliyeti; mevcut prototip hazır zamanlayıcı yerine yalnız basit oturum önerisi yapar, FSRS iddiası yok |

Karar: Kullanıcının Android prototip isteğine uygun, geri alınabilir dar bağımsız deneme. Üretim uygulaması için AnkiDroid + aynı üç akışla karşılaştırılacak. Gerçek süre, tıklama, uygulama değiştirme ve veri eşleme maliyeti ölçülmeden üstünlük sonucu yok.

Ölçülecek üç akış: (1) bilmiyorum → kısa öğretim → destekli görev, (2) yanlış → kaynak/anahtar kontrolü → hata onarımı, (3) ayrı aileden gecikmeli ilk kontrol. Prototip ilk iki akışın yalnız temel teknik parçalarını sağlar; güven beyanı, anahtar itirazı, ayrı onarım ailesi ve bağımsız kontrol kullanıcı arayüzü henüz yok. Bu eksikler üretim kabulü diye gizlenmez.

## Kaynaklar ve teknik sınırlar

- https://docs.ankiweb.net/deck-options.html — öğrenme, yeniden öğrenme ve FSRS ayarları.
- https://docs.ankiweb.net/importing/text-files.html — UTF-8 aktarım/alan ve etiket eşleme.
- https://addon-docs.ankiweb.net/ — eklenti yolu.
- https://docs.ankidroid.org/manual.html — çevrimdışı çalışma, içe/dışa aktarım ve yedekler.
- https://github.com/ankidroid/Anki-Android/wiki/AnkiDroid-API — native Android not ekleme API'si; PWA köprüsü değildir.
- https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register — service worker HTTP(S)/güvenilir köken koşulları.
- https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy#file_origins — yerel dosya kökeni değişkenliği.
- https://web.dev/articles/install-criteria — Chrome kurulum tanıtımı koşulları, gerçek cihaz kontrolü gereği.

file:// tek dosya dış kaynak yüklemeden çalışabilecek şekilde paketlenir; PWA değildir ve dosya açma/depolama davranışı Android tarayıcısına bağlıdır. Tablette çalışan sunucu üzerinden http://localhost service worker için güvenilir kökendir. Başka bilgisayarın düz HTTP LAN IP'si bu istisna değildir. Ana ekrana kurulum ve kapat/aç çevrimdışı testi fiziksel cihazda doğrulanmalıdır. APK sunulmaz.
