# Paket doğrulama raporu

**Paket:** TUS Astra Starter v1.0.0  
**Hazırlama oturumu:** 10 Eylül 2026  
**Gerçek test ortamı:** Linux, Python 3.13.5

## Gerçekten çalıştırılan kontroller

| Kontrol | Sonuç | Kapsam / kayıt |
|---|---|---|
| Canlı başlangıç dosyaları | PASS | 8 açık görev, 0 kapanmış görev; durum/bağımlılık/kart yolları tutarlı. `validation/workflow-check.json` |
| Denetleyici birim testleri | PASS | 29 test, 0 hata, 0 atlanan test. Geçici ve açıkça sentetik iş kayıtları. `validation/workflow-tests.txt` |
| SKILL YAML alanları | PASS | Ad/klasör eşleşmesi, ad biçimi, açıklama ve uyumluluk uzunlukları, metadata alan türleri kontrol edildi. |
| Ana skill kapsamı | PASS | 125 satır; altı göreli protokol bağlantısının hedefi mevcut. Token sayısı veya model performansı ölçümü değildir. |
| Kaynak snapshot'ları | PASS | İki girdi, sağlanan dosyalarla byte düzeyinde aynı; SHA-256 değerleri SOURCE_MANIFEST.json ile eşleşiyor. |
| Python sözdizimi | PASS | Denetleyici ve test dosyaları AST ayrıştırmasından geçti. |

Yukarıdaki yapısal kontroller kendi doğrulama yordamımızla yapıldı; haricî Agent Skills sertifikasyonu veya `skills-ref` çalıştırıldığı iddiası değildir. Ayrıntılı paket sonucu `validation/package-check.json` içindedir.

Çalışma dizini paket köküydü. Aşağıdaki iki komut gerçekten çalıştırıldı; her biri 0 çıkış kodu verdi:

```bash
python3 tools/astra/check_workflow.py --root . --json
python3 -m unittest discover -s tests/astra -p 'test_*.py' -v
```

Denetleyici testlerinde; döngüsel ve eksik bağımlılıklar, tamamlanmadan başlatma, iptali başarı sayma, eşzamanlı iş sınırı, eksik kart, yol taşması ve symlink ile kök dışına erişim, yetim kayıt, yarıda kalmış kapanış, eksik kabul kanıtı, NOT_RUN sonucu, R2 işte yalnız öz-inceleme, boş/yer tutucu alanlar, tarih uyuşmazlığı ve hatalı tablo biçimi sınandı. Denetleyicinin proje dosyalarını değiştirmediği de dosya özetleriyle kontrol edildi.

## Bu sonuç neyi kanıtlamaz?

**Gerçek çok ajanlı GPT-6 Astra oturumu yürütülmedi.** Ajan açma, model/efor seçme, izole çalışma alanı sağlama ve paralel görev yürütme kabiliyeti bu paketle ölçülmedi. Bunlar hedef çalışma ortamında TUS-001 ile doğrulanacak.

TUS uygulaması kodlanmadı; uygulama testleri, hedef işletim sistemi paketleme ve çevrimdışı ürün testleri çalıştırılmadı. İnsan tıbbi içerik incelemesi veya öğrenme etkisi deneyi yapılmadı. Sağlanan proje planının bütün bilimsel kaynakları yeniden taranmadı. Dolayısıyla bu rapor ürün başarısı, tıbbi doğruluk, öğrenme artışı veya en hızlı/en ucuz orkestrasyon iddiası değildir.

`QUALITY_AND_EVALS.md` içindeki 18 ajan-davranışı senaryosu önerilen değerlendirme protokolüdür; gerçekleşmiş sonuç değildir. Python testleri bu senaryoların tamamının gerçek ajan üzerinde geçtiğini göstermez.

## Denetleyicinin sınırı

Markdown denetleyicisi dosya ve alanların tutarlılığına bakar. Bir test kaydının doğru söylendiğini, belirtilen kişinin gerçekten onay verdiğini veya ajan izinlerinin çalışma sistemi tarafından uygulandığını anlayamaz. Kapsamı belirtilmemiş bir manifest, uydurma kanıt ya da yanlış tıbbi iddia metin olarak biçimsel kontrolden geçebilir. Bunların gerçek denetimi Astra, uygun test yürütücüsü ve gerektiğinde insan inceleyicinin sorumluluğudur.

Başlangıç backlogunun sekiz satırının tamamı `queued` durumundadır. Bu paketin hazırlanması onların tamamlandığı veya ürün geliştirme izni verildiği anlamına gelmez.
