# TUS ürün değişmezleri ve izlenebilirlik

**Dayanak:** `docs/input/TUS_Yerel_Uygulama_Proje_Plani.md` v1.0 ve sağlanan araştırma promptu. Aşağıdaki maddeler bu belgelerin geliştirme kontrollerine çevrilmesidir; yeni literatür sonucu değildir. Planın `[B]` bulgu, `[T]` tasarım, `[H]` hipotez ayrımı korunur. Kaynaklar bu paket hazırlanırken tıbben yeniden doğrulanmış sayılmaz.

## Değişmezler

| Kimlik | Korunacak davranış | Plan dayanağı | Gerekli kontrol örneği |
|---|---|---|---|
| I01 | Öğrenme hedefi, görev ve soru ailesi ayrı; çok hedefli yanlış bütün hedefleri yanlış yapmaz. | §4.2, §6.1 | Aynı yanıtın yalnız rubrikle ayrıştırılabilen hedefe atanması. |
| I02 | Gözlem, kullanıcı beyanı ve algoritmik çıkarım ayrı. | §6.1 | Dışarıda çalıştım beyanı bağımsız başarı oluşturmaz. |
| I03 | Hatırlama, açıklama, ayırt etme ve yeni görevde uygulama kanıtı ayrı. | §5, §6.1 | Doğru sonuç ama yanlış mekanizma ayrı raporlanır. |
| I04 | İpucu, cevap gösterimi, tahmin ve aynı oturum tekrarı bağımsız gecikmeli kanıt değildir. | §5, §6.1 | Cevabı açıp doğru yazınca bağımsız başarı artmaz. |
| I05 | Eğitim ve değerlendirme, aile ve maruziyet seviyesinde ayrılır. | §3.4, §11.4 | Yüzeyi değişmiş kardeş soru yeni bağımsız kontrol sayılmaz. |
| I06 | Plan önerisi ile gerçekleşen çalışma ayrı; kaçırılan gün yanlış üretmez. | §6.4–6.6 | Üç boş günde yeni yanlış/başarılı tekrar olayı sıfırdır. |
| I07 | Kapasite sınırı, açık erteleme ve kullanıcı kontrolü korunur. | §6.4–6.6 | Sıfır bütçe ve aşırı tekrar borcu sınanır. |
| I08 | Zamanlayıcı ile öğretim/planlama kararı ayrı; FSRS kavram ustalığı değildir. | §6.3 | Zamanlayıcı değişimi açıklama/aktarım puanı üretmez. |
| I09 | Kaynak, görev, anahtar, politika ve gözlemin sürümü izlenir. | §7, §8.4 | Eski yanıt o anda kullanılan göreve bağlanır. |
| I10 | Taslak/onaysız/askıdaki içerik normal öğrenme ve test akışına girmez. | §7.1–7.4 | Yayın filtresi ve askı genişletmesi test edilir. |
| I11 | Anahtar düzeltmesi orijinal yanıtı silmez; etki analizi ve yeniden türetim yapılır. | §7.3 | Eski olay korunur, düzeltme olayıyla durum hesaplanır. |
| I12 | Çekirdek LLM ve internet olmadan çalışır; gizli dış bağımlılık yok. | §7.5, §8.5 | Ağ kapalı ve yerel model yokken yeniden başlatılmış uygulama. |
| I13 | Aynı olay iki kez etkili olmaz; göç, silme ve geri yükleme güvenilir. | §8.5–8.6 | Çift gönderim, yarım işlem, bozuk yedek, eski şema. |
| I14 | Teknik doğruluk, içerik doğruluğu, eğitimsel yarar ayrı kapılar. | §11 | Test sonucu öğrenme etkisi veya insan onayı diye gösterilemez. |
| I15 | Hasta verisi, tedavi önerisi, sahte beyin puanı ve kesin TUS puanı vaadi kapsam dışı. | §1, §4.1, §9 | UI metni, veri alanları ve ağ yüzeyi incelemesi. |
| I16 | Mevcut araç karşılaştırması, küçük döngü ve aşama kapıları atlanmaz. | §8.1, §10 | Büyük OCR/RAG/kişisel model ancak ölçülmüş darboğaz sonrası. |

Görev kartı yalnız etkilediği Ixx maddelerini listeler. Etkilenen her değişmezin kabul/test karşılığı vardır. Geçerli kullanıcı kapsam değişikliği bu belgelerle çelişiyorsa Astra farkı açıkça karar dosyasına taşır; kaynak planı sessizce yeniden yazmaz.

## Sezgisel değerler nasıl kodlanır?

Planın 7 günlük görünürlük eşiği, iki başarı, %80 görev bütçesi, örnek tekrar payı ve 0,90 hedef hatırlama gibi sayıları sürümlü ayar/politika olarak tut. Bunlar bu ürün için değiştirilebilir tasarım başlangıcıdır; nörobiyolojik yasa değildir. Varsayılan değiştiğinde eski kayıtların yeni kuralla sessiz yeniden etiketlenip etiketlenmediği açıkça kararlaştırılır.

TUS sınav yılı/oturum/süre/puanlama bilgisi ayrıca sürümlü resmî kaynaktan doğrulanır. Bu skill sınav sayıları için yeni bir yetkili kaynak değildir. Dönem belli değilse tarih/puan uydurulmaz.

## İçerik inceleme kapısı

Ajanlar kaynak ve görev taslağı hazırlayabilir; onaylayan insan kimliği, tarih, kapsam ve kaynak sürümü kaydedilmeden gerçek tıbbi görev yayımlanmaz. Bir doktorun iki okuması iki bağımsız uzman incelemesi diye etiketlenmez. Kullanıcıda uzmanlık bilgisi bulunsa dahi otomatik “onaylayan kişi” alanı doldurulmaz.

İnsan incelemesi beklenirken teknik testler tıbbi iddia içermeyen açıkça sentetik veriyle yapılabilir. Sentetik verinin test filtresinden geçmesi gerçek içerik paketini onaylamaz. Öğrenme denemesinde kullanılacak içerik için kapı açık kalır.

## Eğitimsel değerlendirme kapısı

Pilotun atama birimi, aile ayrımı, gecikme, toplam emek ve eksik veri kuralları sonuç görülmeden kaydedilir. Deney algoritması eğitim–test sızıntısına izin veriyorsa sonuç “iyi görünüyor” diye yayımlanmaz. Aynı sorunun tekrarları bağımsız örnek sayısını şişiremez.

Ürün geliştirme işi teknik kabulden geçebilir; bu durum öğrenme yararının kanıtlandığı anlamına gelmez. Aşama 5'e kadar hiçbir teknik kapanış raporu etkinlik iddiası kurmaz. Planın örnek pilot büyüklüğü yeterli istatistiksel güç garantisi değildir.
