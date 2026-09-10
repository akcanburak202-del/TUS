# TUS Yerel — Android prototipini dene

Bu sürüm, cihazında çalışan ilk teknik prototiptir. APK değildir. Tıbbi içerik bankası yerine üç kurgusal hedef ve kendi kaynaklı sorularını ekleyebileceğin alan içerir.

## Hızlı deneme

`release/TUS-Android-Prototip.html` dosyasını indir. JavaScript çalıştıran bir tarayıcıyla açmayı dene. Android dosya önizleyicileri HTML kodunu çalıştırmayabilir; bazı tarayıcılar dosyayı yeniden indirmeyi seçebilir. Böyle olursa aşağıdaki yerel sunucu yolunu kullan. Dosya modunda kalıcılık tarayıcıya bağlıdır; bir yanıt verdikten sonra sayfayı tekrar açarak kontrol et ve JSON yedeğini indir.

## Tablette daha güvenilir açılış — Termux / Ubuntu

1. ZIP dosyasını `TUS-Android-Prototip` adlı klasöre çıkar.
2. Termux veya tabletindeki Ubuntu terminalinde, çıkardığın klasöre geç. İndirilenlere Termux erişimi yoksa bir kez `termux-setup-storage` çalıştırıp Android dosya iznini ver. Python yoksa Termux'ta `pkg install python` gerekir; Ubuntu içinde varsa yeniden kurma.
3. Paket kökünde çalıştır:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

4. Aynı tablette Chrome veya kullandığın tarayıcıda aç:

```text
http://localhost:8000/prototype/
```

`localhost` tabletin kendisidir; başka bilgisayar veya internet gerekmez. 8000 portu kullanımdaysa 8001 seç ve adresi de değiştir. Bu sunucu yalnız tabletin kendisine bağlanır, LAN'a açılmaz.

5. **Yedek ve kurulum** bölümünde çevrimdışı kabuğun kaydedildiğini kontrol et. İlk açılışta sunucuyu çalışır bırak. Sonra uçak modunda kapatıp aynı adresi yeniden aç. Tarayıcı destekliyorsa menüden **Ana ekrana ekle / Uygulamayı yükle** kullanabilirsin. Kurulum seçeneğinin görünmesi cihazda ayrıca doğrulanmalı.
6. Aynı köken ve portu kullan. `localhost` ile `127.0.0.1` farklı veri alanlarıdır; rastgele değiştirme. Gizli sekme kullanma. Yerel dosya modunda ve Web Locks desteklemeyen tarayıcılarda yalnız bir sekme kullan; çok sekmeli eşzamanlı yazma garantisi yoktur. Desteklenen localhost tarayıcısında ikinci sekme salt okunur açılır. Browser verilerini temizlemek kayıtları siler.

## Beş dakikalık kabul denemesi

- Örnek çalışma → 5 dk → oturumu başlat. Cevap yaz; kontrol et; öz değerlendirme yap. Açıklama cevap verilmeden görünmemeli.
- Bir soruda **Bilmiyorum** de. Kayıtlarda bunun yanlış yanıtla ayrı olduğunu kontrol et.
- **Bugün ara** seç. Görev veya yanlış yanıt üretilmemeli.
- **Kendi hedeflerim → Hedeflerim** içinde kısa, kullanım hakkın olan kaynaklı bir soru ekle. Cevabı kendin kontrol ettikten sonra onay kutusunu işaretle. Örnek veriler bu alana geçmemeli.
- JSON yedeği indir. Bir kayıt daha ekle. Önceki yedeği geri yükle; ardından son içe aktarmayı geri al. Dosyayı başka cihazda sakla.
- Tarayıcıyı kapatıp yeniden aç, sonra uçak modunda tekrar aç. Kayıtların kaldığını ve akışın çalıştığını doğrula.

## Bilmen gereken sınırlar

- Oturum devam ederken sayfadan ayrılırsan tamamlanan kayıtlar korunur; açık yanıt ve sıra devam etmez. Ara verilen gün başarısızlık kaydı oluşturmaz.
- Doğru sayısı kendi değerlendirmendir. Açıklamadan hemen sonra doğru demek bağımsız veya gecikmeli öğrenme sonucu değildir.
- Zamanlama basit ve açıklanabilir bir prototip önerisidir; FSRS ya da TUS puanı tahmini değildir. Her oturumda hedef başına en fazla bir görev seçilir.
- Tıbbi yayın incelemesi, ayrı kontrol bankası, kaynak/anahtar düzeltme, gerçek SQLite göçleri, Mac paketi ve öğrenme etkinliği değerlendirmesi açık işlerdir.
- JavaScript / yerel depolama engellenirse uygulama hatayı gösterir. Bozuk kayıt otomatik silinmez. Tarayıcı depolaması kalıcı veritabanı garantisi değildir; düzenli yedek gerekir. Dışa ve içe aktarılan yedek için ortak sınır 10 MB'dır; bu sınırı aşan yeni kayıt uygulanmaz.
- Bu teslim Linux ortamında otomatik test edildi. Gerçek Android tarayıcı, ekran/kurulum ve Mac testleri yapılmadı.

İlerleyen geliştirmede aynı veri anlamlarını koruyarak Mac kabuğu ve daha dayanıklı yerel depolama eklenebilir.
