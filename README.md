# TUS Yerel

Araştırma temelli, tek kullanıcılı, çevrimdışı TUS öğrenme uygulaması projesi.

Başlangıç kurulumu yapılıyor. Henüz çalışan uygulama veya doğrulanmış tıbbi içerik bankası yok.

- Proje planı: [docs/input/TUS_Yerel_Uygulama_Proje_Plani.md](docs/input/TUS_Yerel_Uygulama_Proje_Plani.md)
- Astra giriş noktası: [ASTRA_ORCHESTRATOR.md](ASTRA_ORCHESTRATOR.md)
- Güncel devam noktası: [project/astra/STATE.md](project/astra/STATE.md)
- Açık işler: [project/astra/BACKLOG.md](project/astra/BACKLOG.md)
- Başlangıç paketinin kullanım belgesi: [docs/astra-starter-guide.md](docs/astra-starter-guide.md)

## Mevcut doğrulama

Depo kökünde Python 3.10+ ile:

```sh
python3 tools/astra/check_workflow.py --root .
python3 -m unittest discover -s tests/astra -p 'test_*.py' -v
```

Bunlar orkestrasyon kayıtları ve denetleyici testleridir; uygulama, tıbbi doğruluk veya öğrenme etkisi testi değildir. `validation/` ve `VALIDATION_REPORT.md` içe aktarılan paketin tarihsel denetimleridir; güncel çalışma kayıtları `project/astra/runs/` altında tutulur.

## Android prototipi · 0.1

İlk hedef kullanıcı isteğiyle Android tablet oldu; Mac daha sonra. `prototype/ANDROID-BASLANGIC.md` açılış ve gerçek cihaz denemesini anlatır. `release/TUS-Android-Prototip.html` ağ varlığı gerektirmeyen tek dosya paketidir; yerel dosya desteği tarayıcıya bağlıdır. PWA için tablette localhost sunucusu kullanılır.

```sh
python3 tools/prototype/build.py
python3 tools/prototype/verify.py
node --test tests/prototype/*.test.cjs
python3 -m http.server 8000 --bind 127.0.0.1
```

Tarayıcı adresi: `http://localhost:8000/prototype/`.

Kapsam: 3 kurgusal hedef/9 görev, kullanıcı kontrollü kişisel sorular, süre bütçesi, hatırlama/açıklama/ayırt etme sırası, öz değerlendirme ve maruziyet kayıtları, JSON yedekleme/geri alma. Tıbbi onay, bağımsız kontrol arayüzü, FSRS, gerçek Android testi, SQLite/Mac paketleme ve eğitimsel etkinlik tamamlanmış sayılmaz. TUS-009 teknik prototip; orijinal TUS-002–008 kapılarının yerine geçmez.

## Buradan devam et — öğrenme deneyimi revizyonu v2

0.1 teknik prototip, kullanıcının beklediği öğretim deneyimini karşılamadı; bu bir ürün kabulü değildir. Güncel yön [revizyon v2](docs/TUS_Ogrenme_Deneyimi_Revizyon_Plani_v2.md), devam noktası [STATE](project/astra/STATE.md), açık işler [BACKLOG](project/astra/BACKLOG.md), yeni sohbet mesajı [NEXT_CHAT_PROMPT](project/astra/NEXT_CHAT_PROMPT.md).

İlk iş: [TUS-011](project/astra/tasks/TUS-011.md), tek hedefin kaynaklı öğretim senaryosu. Android önce, Mac sonra. Revizyon bu entegrasyonda plan/iş kaydı olarak eklendi; uygulama kodu değiştirilmedi.
