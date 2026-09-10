# TUS Yerel — Araştırma Temelli Öğrenme Uygulaması
## Ürün, mimari, geliştirme ve doğrulama planı · v1.0

**Araştırma oturumu:** 9–10 Eylül 2026, Europe/Istanbul.  
**Durum:** Geliştirme kararı ve pilot tasarımı; üretim kodu veya uygulanmış deney değildir.  
**İstek dayanağı:** Kullanıcının sağladığı `TUS_Yerel_Uygulama_Arastirma_ve_Planlama_Promptu(1).md`.  
**Okuma anahtarı:** `[B]` erişilen kaynağın desteklediği bilimsel bulgu; `[T]` bu plana ait tasarım kararı; `[H]` ayrıca sınanması gereken ürün hipotezi. Köşeli kaynak kimlikleri sondaki kaynakça ve erişim kaydına gider. Sayısal ürün eşikleri, açıkça aksi belirtilmedikçe bilimsel sabit değil, değiştirilebilir başlangıç varsayımlarıdır.

---

## 1. Ürün tezi ve kapsam dışı alanlar

**Ürün tezi:** TUS Yerel, kullanıcıya yalnızca “hangi kartın tekrar zamanı geldiğini” değil, **“bugünkü sınırlı zamanda hangi öğrenme eylemini, hangi gözleme dayanarak yapmasının uygun olduğunu”** gösteren kişisel, çevrimdışı bir çalışma aracıdır. `[T]`

Temel ürün birimi kart değil, **öğrenme hedefi** olacaktır. Bir hedefin ilk öğrenme, hatırlama, açıklama, ayırt etme ve yeni soruya uygulama görevleri bulunabilir. Bunlar aynı puana eritilmeyecektir. Kullanıcı bir soruyu doğru yanıtladığında soru doğruluğu kaydedilir; bunun kavramsal yeterlik kanıtı sayılıp sayılmayacağı ayrıca belirlenir.

Önerilen farklılık üç işlevde yoğunlaşır: doğrulanmış kaynağa bağlı hedefli hata onarımı; tekrar edilen soruyla yeni sorudaki performansın ayrılması; günlük kapasiteyi aşmadan ilk öğrenme, tekrar ve uygulama arasında seçim yapılması. **Bu birleşimin Anki ve iyi bir soru bankasından daha yararlı olduğu henüz kanıtlanmış değildir.** `[H]`

Başarı; gecikmeli bağımsız hatırlama, görülmemiş görevlerde doğruluk, öğrenilen kapsam ve toplam emekle değerlendirilecektir. Günlük seri, üretilen kart sayısı, ekranda geçirilen süre veya bir “beyin puanı” başarı ölçütü olmayacaktır.

**Kapsam dışı:** Klinik karar desteği ve hasta verileri; tanı/tedavi veya takviye önerisi; TUS puanı garantisi; sosyal platform, abonelik ve içerik pazaryeri; bütün tıp kitaplarını otomatik yapılandırma; zorunlu LLM; öğrenme stili testi; EEG/uyku verisinden kişiye özel beyin performansı çıkarımı; ilk sürümde bilgi grafı, derin bilgi izleme modeli ve çok cihazlı eşzamanlama.

## 2. Varsayımlar ve değiştirilebilir sınırlar

| Konu | Başlangıç kararı | Kararı değiştirecek bilgi |
|---|---|---|
| Kullanıcı | Tek kullanıcı, Türkçe çalışma dili; kullanıcının kendisinin aday olduğu varsayılmaz. | Bir kurum veya birden çok öğrenci talebi yeni kapsamdır. |
| İşletim sistemi | Tek masaüstü işletim sistemi üzerinde ilk sürüm. Paketleme kararı aşama 0'da gerçek cihazla kesinleşir. | Tabletin tek başına çalışma zorunluluğu mimariyi değiştirir. |
| Donanım | GPU veya yerel LLM gerekmeyecek. 8 GB RAM'li referans cihaz bir test adayıdır, doğrulanmış gereksinim değildir. | Gerçek cihazda ölçülen bellek, açılış ve veri işleme sonuçları. |
| Sınav tarihi | Bilinmiyor; `exam_date` boş bırakılabilir. Örnek yakın-sınav senaryosu 14 gündür. | Gerçek sınav dönemi ve tarih. |
| Başlangıç düzeyi | Bilinmiyor; alan bazında kısa yoklama ve “bilmiyorum” seçeneği. | Önceki çalışma/deneme kayıtları varsa belirsizliği azaltır. |
| Hedef puan | Bilinmiyor. Varsa motivasyon bilgisi olarak saklanır; model bunu güvenilir net hedefine dönüştürmez. | Standartlaştırılmış, dış kaynaklı ölçümler. |
| Kaynaklar | Kullanım hakkı bulunan küçük metin parçaları ve elle doğrulanmış özgün görevler. | Hazır, lisanslı ve incelenmiş içerik bankası. |
| Geliştirme | Bir geliştirici ve tıbbi içeriği inceleyebilen bir kişi için planlanır. | İnceleyici yoksa otomasyon ve içerik hacmi küçülür. |

Dayanıklılık için iki **kurgusal** profil kullanılır: nöbetli çalışan adayda bazı günler 0–30, uygun günler 60–90 dakika; tam zamanlı adayda örneğin 240 dakika, birden çok çalışma bloğu. Bu süreler kullanıcı verisi veya optimal çalışma süresi değildir. Aynı öğrenme modeli kullanılır; yalnız kapasite, görev bölünmesi ve yeni içerik alımı değişir.

## 3. Araştırma yöntemi, kanıt matrisi ve ürün kararları

### 3.1. Gerçekte yapılan tarama

Bu çalışma **seçici, hedefli bir kanıt incelemesidir; sistematik derleme değildir.** Başlangıç kaynakları başlık/DOI ile kontrol edildi; PubMed/PMC kayıtları, Springer Nature, Wiley, Frontiers ve erişilebilen makale sayfaları incelendi. Yeni çalışmalar için web üzerinden tarih içeren aramalar ve arXiv kayıtları kullanıldı. ÖSYM ve yazılım belgeleri ayrıca kontrol edildi. ERIC, Embase veya Scopus üzerinde doğrudan bir veri tabanı taraması yapılmış gibi kabul edilmemelidir.

Arama izini oluşturan başlıca ifadeler: `retrieval practice health professions education systematic review`, `distributed practice retrieval practice medical education 2025 2026`, `transfer of test-enhanced learning Pan Rickard`, `self explanation meta analysis Bisra`, `Similarity matters Brunmair Richter`, `successive relearning Rawson Dunlosky`, `pre-testing Latimier 2019`, `knowledge tracing student learning`, ilgili makale başlıkları ve DOI'ler; ayrıca `2026 TUS 2 kılavuz`, Anki FSRS ve yerel mimari belgeleri.

Yeni yayın aramaları kapsamlı bir güncelleme veya “sonraki bütün çalışmalar incelendi” iddiası değildir. Bazı yayıncı/PubMed erişimleri başarısız oldu. Özellikle interleaving'in yeni meta-analizini, successive relearning'in bütün protokollerini, illness scripts ve görev değiştirme literatürünü bu oturumda bağımsız biçimde tam doğrulayamadım. Bunlar için aşağıdaki dar tasarım kararlarının ötesinde etkinlik iddiası kurulmadı. Pashler ve arkadaşlarının promptta verilen öğrenme stilleri makalesinin birincil içeriğine erişim doğrulanamadığından bağımsız bir kanıt satırı açılmadı.

**Erişim ayrımı:** R02, R06, R08 ve R09'un tam HTML metinleri erişilebildi; ilgili bölümleri incelendi. R01, R03, R04, R05 ve R07 için erişilen özet/önizleme dışındaki yöntem ayrıntıları çıkarılmadı. R10 ve R11'in yazar tarafından sunulan özet ve yayın bilgileri incelendi. NBME'nin altıncı baskıyı tanıtan sayfası erişildi, kitabın tamamı okunmadı.

### 3.2. Kanıt değerlendirmesi nasıl kullanılacak?

**Güçlü:** Farklı desenlerde ve derlemelerde desteklenen genel öğrenme ilkesi. **Orta:** Olumlu fakat bağlamı, karşılaştırması veya ölçümü sınırlı/heterojen destek. **Sınırlı:** Dolaylı mekanizma, teknik gösterim, az veri ya da bu taramada eksik erişim. Bunlar resmî GRADE dereceleri değildir.

**TUS'a aktarım güveni ayrı bir eksendir.** Sağlık eğitimi bilgilerini hatırlamaya ilişkin destek, bu ürünün TUS puanını artırdığı anlamına gelmez. İncelenen kaynaklardan bu özel ürün için doğrudan TUS etkinliği sonucu çıkarılamaz.

### 3.3. Kanıt matrisi

Aşağıdaki “ürün ve ölçüm” sütunu araştırmalarda denenmiş aynı yazılım özelliği değil, çoğunlukla bu plana ait çıkarımdır.

| Alan / kaynak | Desen, katılımcı ve materyal | Karşılaştırma, süre, gecikme, ölçüm | Gözlenen sonuç ve sınır | İlke / TUS aktarımı | Ürün davranışı → kabul ölçümü |
|---|---|---|---|---|---|
| Aktif hatırlama ve aralıklı çalışma — R01, R02 | Genel teknik değerlendirmesi; sağlık eğitiminde 56 çalışma, 63 deney. Anatomi/fizyoloji dahil çeşitli içerikler. | Kontroller ve sınav türleri heterojen; çalışma süresi sıkça raporlanmamış/kontrol edilmemiş; gecikmeler ve aynı/yeni soru ayrımı ortak değil. | R02'de 43 deney anlamlı yarar bildirir; bu bir ortak etki büyüklüğü veya ürün başarı olasılığı değildir. | Genel ilke güçlü; doğrudan TUS ürünü için dolaylı. | Yanıtı göstermeden hatırlama ve ayrı günlerde kontrol → gecikmeli, ipucusuz doğruluk; toplam süre kaydı. |
| Ön test ve üretme girişimi — R09 | DNA konulu metinlerle üç koşullu deney; analizde 285 yetişkin, tıp/biyoloji dışı katılım hedeflenmiş. | Ön test–okuma, okuma–son test, yeniden okuma; süre eşitlenmemiş; 7 gün sonra çalışılmış/yeni görevler. | Çalışılmış sorularda son test d=0,74, ön test d=0,35; aktarım sonucu yeni/genelleme sorularının birlikte analizine duyarlı. | Orta, içerik ve desenle sınırlı; TUS dolaylı. | Bilmeyene kısa yoklamadan sonra öğretim; uzun başarısız ön test dizisi yok → ilk öğrenme maliyeti ve gecikmeli kontrol. |
| Aktarım — R03 | Meta-analiz: 122 deney, 10.382 katılımcı. | Test alıştırması, test dışı yeniden karşılaşmayla kıyaslanır; gecikme ve süre eşleme ayrıntıları erişilen özetten tek tek doğrulanamaz. | d=0,40; %95 GA 0,31–0,50. Başlangıç başarısı ve görev ilişkisi moderatör; her aktarım türünde aynı yarar yok. | Orta; TUS benzeri yeni görev tasarımı gerektirir. | Soru aileleri ve ayrı tutulmuş sorular → aynı sorudaki başarıdan bağımsız yeni soru sonucu. |
| Bilişsel yük, örnek ve desteğin azaltılması — R04 | Sağlık eğitimine yönelik kuramsal/tasarım derlemesi; tek deney değildir. | Tek N, kontrol, test gecikmesi veya ortak etki büyüklüğü uygulanamaz. | Öğrencinin deneyimine göre destek değişmelidir; kesin ekran öğesi sayısı veya uygulama etkisi vermez. | Öğretim tasarımı için orta; ürüne aktarım hipotez. | Çözülmüş örnek → eksik adımı tamamlama → bağımsız görev; uzman atlayabilir → bağımsız başarının ve sürenin birlikte ölçümü. |
| Kendi açıklamasını üretme — R05 | 64 rapor, 69 etkiyi içeren meta-analiz; farklı öğrenme alanları. | Açıklama istemenin karşılaştırmaları farklı; süre/gecikme ayrıntıları özetten doğrulanmadı. | Ortalama g=0,55; belirsizlik aralığı erişilen özette yok. TUS ya da LLM değerlendirmesi denenmiş sayılmaz. | Orta; seçilmiş mekanizma görevlerine dolaylı. | Kısa neden/karşı-örnek görevi, her kartta değil → rubrikle açıklama ve yeni sorudaki sonuç / ek süre. |
| Üstbiliş — R07 | Üç fizyoloji metniyle strateji karşılaştırması; rastgele atama bildiriliyor; örnekteki N özette verilmemiş. | Tekrar okuma, geri getirme ve öğrenme yargısı içeren koşullar; 1 hafta sonra hatırlama/aktarım. Süre eşitliği özetten doğrulanmadı. | Bazı geri getirme/öğrenme yargısı koşulları daha iyi; küçük bir bağlamı bütün öğrenci modeline genellemek uygun değil. | Orta/sınırlı; TUS dolaylı. | Seyrek güven beyanı ve haftalık gözden geçirme → güven-doğruluk farkı, yanıt yükü, yeni görev sonucu. |
| Geri bildirim — R06 | 435 çalışma, 994 etki; 61.000'den fazla katılımcı; farklı desen ve düzeyler. | Geri bildirim türleri/karşılaştırmalar heterojen; ortak süre veya test gecikmesi yok. | Aykırı değer işlemi sonrası d=0,48; %95 GA 0,44–0,51; I²=%83,4. Zamanlama ve bilgi içeriği tek kurala indirgenemez. | Genel ilke orta/güçlü; TUS'a özel uygulama belirsiz. | Hatanın dayanağını gösteren kısa düzeltme; denemede blok sonrası → sonraki bağımsız hata tekrarı ve süre. |
| Karışık alıştırma, ayırıcı özellikler — R01; güncel özel tarama sınırlı | Genel teknik incelemesindeki interleaving değerlendirmesi. | Güncel özel meta-analizin tam yöntem/sonuçları doğrulanmadı. | Rastgele ders değiştirmeye veya her acemiye karışık zor soru vermeye doğrudan dayanak sayılmaz. | Bu ürün için sınırlı/koşullu. | Önce temel örnek, sonra gerçekten karışan 2–3 kavramı karşılaştırma → görülmemiş karşılaştırmalı görevde hata. |
| Uyku, yorgunluk, sürdürülebilirlik — R08 | İnsan/hayvan uyku-bellek araştırmalarının kapsamlı derlemesi. | Çok farklı deney ve bellek görevleri; tek çalışma takvimi karşılaştırması değildir. | Uyku-bellek ilişkisi, kişisel çalışma saati veya nöbet sonrası otomatik reçete doğrulamaz. | Mekanizma desteği; bu arayüz davranışına dolaylı. | Kullanıcının kapasiteyi azaltması, duraklatma, cezasız ara → kapasite aşımı ve bırakılan plan miktarı. |
| Bilgi izleme ve analitik — R10 | KDD 2024 kabul bilgili çalışma; üç veri kümesinde 11 başlangıç modele karşı yanıt tahmini. | Veri kümesi kestirimi; bir TUS öğretim müdahalesi deneyi değil. | Daha iyi tahmin, daha iyi müdahale seçimini kendiliğinden doğrulamaz. | Model tercihi için sınırlı; nedensel öğrenme etkisi göstermez. | İlk sürümde açıklanabilir kanıt durumları → zamansal ayrımlı tahmin ölçümü ayrı, öğrenme pilotu ayrı. |
| Tıbbi AI/RAG — R11 | CSEDU 2025 yayın bilgili sistem; Polonya uzmanlık sınavı açıklamaları, tıbbi değerlendiriciler. | İçerik uygunluğu/güvenilirliği/tutarlılığı; erişilen özet öğrenme deneyi vermiyor. | İçerik değerlendirmesi bir öğrencinin gecikmeli kazanımı değildir. | İçerik yardımcı aracı için sınırlı. | AI yalnız taslak; insan onayı → kritik hata ve doğrulama dahil hazırlama süresi. |

**Araştırmadan zorunlu modül çıkarmama kararı:** Generation effect için “yanıtı kendisi üretme” düşük maliyetli bir görev seçeneğidir; bağımsız bir modül değildir. Successive relearning, ayrı oturumlarda yeniden başarılı hatırlama akışı olarak denenebilir; ideal başarı sayısı veya aralıkları doğrulanmış sayılmaz. Şema/illness script kavramları bir olgu şablonunu düzenleyebilir; otomatik kapsamlı bilgi grafını gerekçelendirmez. Dikkat kesintileri için duraklatma ve sade ekran mühendislik tercihidir; kişiye özel dikkat tanısı yapılmaz. `[T/H]`

### 3.4. Özelliklerin kanıttan kabule izlenebilirliği

| Özellik | Kaynak → sınır | Tasarım çıkarımı | Yazılım kabulü | Eğitimsel sınama |
|---|---|---|---|---|
| Cevabı gizleyerek çalışma | R01/R02 → her görev serbest hatırlama olmak zorunda değil | Yanıt, ipucu veya “bilmiyorum” eyleminden sonra geri bildirim | İpucu ve cevap gösterimi zaman damgalı | Gecikmeli ipucusuz başarı |
| İlk öğrenme desteği | R04/R09 → başlangıç bilgisizliği unutma değil | Kısa kaynak/örnek ve azalan destek | Bilinmeyen konu otomatik unutuldu sayılmaz | Bağımsız görev / toplam süre |
| Hata onarımı | R06 → tür/timing heterojen | Nedene ilişkin geçici hipoteze uygun açıklama | Her hata yönlendirmesi gözlem ve gerekçeye bağlı | Farklı ailede hata tekrarı |
| Kavramları ayırma | R01/R05 → karışık alıştırma ve açıklama aynı mekanizma değil | Karşılaştırma, sonra bağımsız olgu | Çeldiricinin hangi ayrımı sınadığı kayıtlı | Yeni olguda ayırt etme |
| Aralıklı tekrar | R01/R02, T02 → FSRS'nin TUS üstünlüğü kanıtlanmış değil | Hazır zamanlayıcı; ayrı öğrenme durumu | Algoritma sürümü ve girdi/çıktı tekrar üretilebilir | Hatırlama–iş yükü dengesi |
| Kapasite uyarlama | R08 → kişisel takvim etkisi doğrudan test edilmemiş | Kullanıcı kontrollü yük sınırı | Ara verilen gün yanlış yanıt üretmez | Sürdürülebilirlik ve bırakılan kapsam |
| Aktarım kontrolü | R03 → aynı sorudaki iyileşme ayrı sonuç | Soru ailesi bazında ayrılmış kontrol bankası | Değerlendirme öğesi eğitime sızmaz | İlk görülen ailelerde performans |

## 4. TUS'a uyarlama ve içerik kapsamı

### 4.1. Doğrulanan resmî temel

Referans **2026-TUS 2. Dönem Başvuru Kılavuzu**, özellikle basılı s.2, 28 ve 43'tür [T01]. TTBT ve KTBT ayrı ayrı **100 soru ve 135 dakika**dır. Ham net `doğru − yanlış/4` olarak hesaplanır. Tıp mezunları için ağırlıklı K, standart TTBT/KTBT puanlarını %40/%60; T ise %60/%40 kullanır. Nihai puan ayrıca topluluk istatistiklerine bağlıdır; yalnız netlerden güvenilir kişisel TUS puanı çıkarılmaz.

Resmî **yaklaşık** dağılım: TTBT'de Anatomi 13, Histoloji–Embriyoloji 7, Fizyoloji 8; Biyokimya, Mikrobiyoloji, Patoloji ve Farmakoloji 18'er. KTBT'de Dahiliye grubu 35, Pediatri 25, Cerrahi grubu 30, Kadın Hastalıkları–Doğum 10. Bu dağılım ayrıntılı konu sıklığı tahmini değildir.

`ExamSpecification` içinde dönem, kaynak sürümü, oturumlar, süreler, puanlama politikası, yaklaşık ders dağılımı ve doğrulama tarihi saklanır. Gelecek dönemin kuralları otomatik olarak aynı sayılmaz. Sınav tarihi ayrı kullanıcı girdisidir. Tarihsel soru anahtarı ve güncel tıbbi bilgi ayrı sürümlerde tutulur. `[T]`

### 4.2. Konu modeli ve pilot

Hiyerarşi: **ders → konu → öğrenme hedefi → bilgi birimi → görev/soru**. Bir soru birden fazla hedefe bağlanabilir; çok hedefli sorudaki yanlış, bütün hedeflerin öğrenilmediği anlamına gelmez. Hangi hedefi sınadığı rubrikte ayrıştırılamıyorsa çıkarım belirsiz kalır.

İlk çalışan dilim 3 hedef/9 görev; kullanılabilir MVP **12 hedef/36 eğitim görevi ve 12 ayrı kontrol görevi** ile sınırlanır. Bunlar kullanılabilirlik içeriğidir, yeterli etkinlik örneklemi değildir. Üç içerik türünden dörder hedef seçilir: doğrudan bilgi; mekanizma; ayırt etme/uygulama. İlk örnekler endokrin alandan olabilir; sonraki genişleme bir görsel anatomi ve bir ilaç-mekanizma kümesi içermelidir. Dar bir endokrin pilotu bütün TUS'u temsil etmez. `[T]`

İçerik şablonları: kısa olgu hatırlama; etiketleri gizlenen lisanslı görsel; nedensel zincir; karşılaştırmalı tablo; tek-en-iyi-yanıt olgusu. Görsel erişilebilirliği için alternatif metin, sınanan cevabı önceden açığa çıkarmayacak şekilde tasarlanır. Her bilgi biriminin ayrı karta dönüşmesi gerekmez: anlamlı ilişki tek görev içinde çalışılabilir.

Uygulama dışı çalışma tek kısa kayıtla eklenir: konu, kaynak, süre, çalışma türü, isteğe bağlı soru sonucu ve beyan güvenilirliği. Bu kayıt **“kaynağı çalıştığını bildirdi”** demektir; bağımsız başarı değildir. `[T]`

## 5. Temel öğrenme döngüsü ve üç örnek etkileşim

**Akış:** kısa yoklama → gerekirse ilk öğretim → bağımsız yanıt → hedefli geri bildirim → olay kaydı → uygun sonraki görev → ayrı zamanda bağımsız kontrol. `[T]`

Cevap gösterildikten hemen sonraki doğru yanıt, o oturumda düzeltmenin izlenmesidir; gecikmeli bağımsız başarı etiketi taşımaz. Görev başında yanıt verilmesi istenir fakat “bilmiyorum” her zaman mümkündür. Bilmeyene uzun süre tahmin yaptırmak yerine açıklama ve örnek sunulur. Eğitimde düzeltme yanıt sonrası, denemede blok sonrası verilir; bu bir başlangıç politikasıdır, her koşul için optimal zamanlama iddiası değildir.

### 5.1. Bilgi hatırlama

**Eğitim örneği:** “Tiroidin parafoliküler C hücreleri hangi hormonu üretir?” Dayanak: kalsitonin [C01]. Bu özgün kısa görev klinik öneri değildir.

Kullanıcı kısa yanıt verir veya bilmiyorum der. Yanıtın açıklanmış eş anlamlı listesinde bulunması otomatik karşılaştırmaya izin verir. Belirsiz yazım/ifade otomatik yanlış yapılmaz; cevap ve rubrik gösterilerek insan değerlendirmesi alınır. Yanlışta ilgili kaynak paragrafı ve kısa düzeltme görünür. Aynı oturumda tekrar yalnız öğretim kaydıdır. Ayrı günkü ipucusuz deneme hatırlama kanıtı sağlar; tek olgusal hedefte başarı, bütün tiroid konusuna genellenmez.

### 5.2. Mekanizma anlama

**Eğitim örneği:** Tiroid hormonlarının hipotalamus–hipofiz eksenine negatif geri bildirimi [C01]. İlk önce açıklanmış bir eksen gösterilir. Sonra “Hipofiz işlevi korunurken tiroid hormonları azalırsa TSH yönü neden değişir?” görevi verilir.

Rubrik: hormon azalması; negatif geri bildirimin azalması; hipofiz yanıtı bağlantısını kurma. İlk görevde bir adım hazır bırakılır, sonraki görevde destek kaldırılır. Yalnız “TSH artar” yanıtı yön bilgisini gösterebilir; mekanizmayı açıkladı sayılmaz. Sonraki kontrolde hormonlar ve koşullar farklı biçimde sunulur. Görsel veya eksen açıklaması öğrenmeyi kolaylaştırmıyorsa zorunlu tutulmaz.

### 5.3. Ayırt etme ve uygulama

**Basitleştirilmiş eğitim olgusu:** Tiroid hormon üretimi yetersizken TSH artışı ile hipofiz hasarı durumunda TSH testinin sınırlılığını ayırt etme. ATA'nın hasta bilgilendirme kaynağı bu temel ayrımı destekler [C02]. Gerçek hastaya tanı koyma amacı yoktur; laboratuvar, ilaç ve eşlik eden durum istisnaları dışlanmış öğretim senaryosudur.

Önce bez kaynaklı ve hipofiz kaynaklı iki açıklama karşılaştırılır. Ardından kullanıcı yeni bir kısa olguda **hangi bilgiyle ayrım yaptığını** belirtir. Yanlış ve yüksek güven varsa “TSH yorumuna ilişkin karışıklık olabilir” denir; kesin kavram yanılgısı tanısı konmaz. Karşılaştırmalı açıklama ve farklı soru ailesinden yeni uygulama seçilir. Cümleleri değiştirilmiş aynı olgu, bağımsız aktarım sorusu sayılmaz.

**Yayımlama kontrolü:** Bu örneklerin gerçek uygulama bankasına girmesi için kaynak sürümü, açık varsayımlar, cevap anahtarı ve rubrik tıbbi inceleyici tarafından onaylanmalıdır. ATA sayfası ve OpenStax bölümü kapsamlı klinik kılavuz yerine kullanılmaz. Başka uzmanlık alanları için kendi yetkin kaynakları gerekir.

## 6. Öğrenci modeli ve günlük karar mekanizması

### 6.1. Üç farklı veri türü

| Katman | Örnekler | Ne yapılmaz? |
|---|---|---|
| Doğrudan gözlem | Yanıt, doğruluk, gösterim/cevap açma, ipucu, saat, görev sürümü, soru ailesi, kesinti, görev türü | Yanıt süresinden tek başına dikkat veya bilgi seviyesi teşhisi |
| Kullanıcı beyanı | Tahmin ettim, yoruldum, soruyu yanlış okudum, dışarıda çalıştım, güven derecesi | Beyanı biyometrik ölçüm veya gözlenmiş başarı gibi kullanma |
| Algoritmik çıkarım | Hatırlama olasılığı, onarım ihtimali, yetersiz aktarım kanıtı, öneri gerekçesi | Çıkarımı gerçek veya değişmez öğrenci özelliği gibi saklama |

Her hedef için dört ayrı kanıt görünümü tutulur: **hatırlama, açıklama, ayırt etme, yeni görevde uygulama**. Durumlar: değerlendirilmedi; destekle yapabildi; bağımsız başarı gözlendi; gecikmeli başarı gözlendi; çelişkili/yetersiz kanıt. Birleşik “konuya %92 hâkim” göstergesi yoktur.

MVP'nin muhafazakâr görünürlük kuralı: ayrı günlerde iki ipucusuz doğru ve bunlardan en az birinin son ilgili öğretimden en az 7 gün sonra olması, “gecikmeli hatırlama gözlendi” etiketine izin verir. Bu 7 gün bir bellek yasası değil **raporlama eşiğidir**; olayların gerçek aralıkları ayrıca görünür. Bir haftadan kısa kullanımda etiket oluşmaması başarısızlık değildir. Açıklama rubriği ve farklı ailelerde uygulama kanıtı ayrıca gerekir. İki doğru yeni soru, yalnız “iki görevde uygulama gözlendi” demektir; sınırsız ustalık değildir.

İpucu, cevap gösterimi, aynı oturum tekrarı ve tahmin beyanı özgün bayraklarla tutulur. Tahminle doğru, soru puanını değiştirmez; bağımsız kavramsal yeterlik kanıtı olarak ağırlığı sınırlandırılır. Sonuç birden çok hedefi içeriyorsa kanıt hangi hedefe atanabildiği kadar güncellenir.

### 6.2. Hata hipotezleri ve yönlendirme

| Gözlem / ek kanıt | Geçici yorum | Müdahale |
|---|---|---|
| Hiç çalışmadığını bildiriyor, başlangıç yoklaması başarısız | İlk öğrenme gereksinimi | Kısa kaynak ve çözülmüş örnek |
| Önce bağımsız başarı, gecikmede başarısızlık | Hatırlama güçlüğü olasılığı | Düzeltme + aralıklı yeniden kontrol |
| Tekrarlanan yanlış nedensel açıklama | Kavram yanılgısı olasılığı | Mekanizma açıklaması + karşı örnek |
| Benzer alternatifler arasında aynı karışıklık | Ayırt etme güçlüğü olasılığı | Yan yana ayırıcı özellikler + yeni olgu |
| Yüksek güvenli yanlış | İncelenmeye değer uyumsuzluk | Önce anahtar/kaynak kontrolü, sonra hedefli onarım |
| Düşük güvenli doğru / tahmin | Kırılgan başarı olasılığı | Yeni bağımsız görev veya gecikmeli kontrol |
| “Yanlış okudum” beyanı, sonraki benzer görev doğru | Okuma hatası ihtimali | Kısa kök inceleme; ilk sonucu sessizce silmeme |
| Yalnız süreli bloklarda sorun, kesinti yok | Hız–doğruluk sorunu ihtimali | Uygun süreli blok ve sonradan analiz |

Güven sorusu her görevde zorunlu değildir. İsteğe bağlı “eminim / emin değilim / tahmin ettim” alanı ve seçilmiş kontrol sorularında cevap gönderimiyle birlikte alınan 0–100 olasılık beyanı kullanılabilir. İkinci veri yoksa birinciyi keyfî olasılıklara dönüştürüp Brier puanı hesaplanmaz. Güven kaydı doğru cevabı görmeden alınır.

### 6.3. Zamanlayıcı ile planlayıcının ayrılması

**Zamanlayıcı:** Belirli tekrar öğesinin ne zaman gözden geçirileceğini hesaplar. **Planlayıcı:** Bugün tekrarın mı, yeni konunun mu, açıklamanın mı, olgunun mu uygun olduğunu seçer. FSRS çıktısı kavram anlama veya sınav puanı değildir. Anki belgeleri FSRS'yi SM-2 alternatifi olarak tanımlar; hedef hatırlama artırıldıkça tekrar yükü yükselir [T02].

| Yaklaşım | Başlangıç rolü | Karar |
|---|---|---|
| Basit sabit/genişleyen aralık kuralı | Test edilebilir referans, çalışır en küçük dilim | Tutulur; katsayılar sezgisel olarak etiketlenir. |
| SM-2 | Eski araçla karşılaştırma/uyumluluk seçeneği | Ayrı geliştirme yatırımı yapılmaz. |
| Hazır FSRS uygulaması | MVP'nin olgusal tekrar zamanlayıcısı | ts-fsrs uyarlayıcısı; sürüm/parametreler sabitlenir [T06]. |
| Yeni bellek/öğretim modeli | Büyük geliştirme ve doğrulama maliyeti | İlk sürüm dışında. |

Başlangıçta FSRS'nin kütüphane varsayılan parametreleri kullanılır; kişisel model varmış gibi sunulmaz. Hedef hatırlama için 0,90 bir başlangıç ayarıdır, bireye/TUS'a kanıtlanmış optimum değildir. Uygun yanıt derecelendirmesi açık öğretilir: hatırlayamamak “Again”, zor da olsa doğru hatırlamak “Hard” olabilir [T02]. Çok hedefli klinik soruların tamamı tek bir hatırlama kartı gibi zamanlanmaz. Bu görevler ayrı plan kuyruğuna girer.

Sürüm yükseltme mevcut tarihleri sessizce değiştirmez. Modelin daha iyi gelecek yanıtı tahmin ettiği zamansal ayrımlı veride gösterilmeden kişisel optimizasyon açılmaz. Küçük veriyle birkaç parametreyi iyi uydurmak yeterli değildir; farklı zaman dilimlerinde kalibrasyon ve yük ölçülür. Ürünün öğrenme yararı yine ayrı deney gerektirir.

### 6.4. İlk planlayıcı: kapasite sınırlı, açıklanabilir kurallar

İlk sürümde **“beklenen öğrenme kazancı/dakika” şeklinde ölçülmemiş bir sayısal skor hesaplanmaz.** Planlayıcı altı görev havuzu kullanır: ilk öğrenme, tekrar, kavram onarımı, ayırıcı alıştırma, zamanlı yeni soru bloğu, deneme analizi. İçerik hazırlama ve kaynak inceleme de zaman bütçesinden yer alır.

Kullanıcı bugünkü üst süreyi belirler. Varsayılan plan bu sürenin %80'ini doldurur; kalan %20 görev belirsizliği ve geçiş payıdır. Bu oran bilimsel sonuç değil başlangıç tasarımıdır. Az veride görev süreleri aralıkla verilir; yeterli gözlem sonrasında görev türüne göre süre dağılımı ve örneğin 80. yüzdelik kullanılır. Kesinti işaretli süreler ayrıca tutulur.

Sıra önce geçerlilik ve güvenlik, sonra öğrenme gereksinimidir: onaysız/askıdaki içerik elenir; değerlendirme protokolüne ait işler korunur; önkoşulu bilinmeyen hedef öğretime yönlenir; doğrulanmış yüksek güvenli yanlışlar ve önemli boşluklar onarıma alınır; gecikmiş tekrar, yeni kapsam ve bağımsız uygulama arasında haftalık denge korunur. Aynı aileden çok benzer sorular art arda seçilmez.

Tekrarlar normal haftada kullanılabilir görev bütçesinin yaklaşık yarısını aşınca uyarı verilir. Bu bir katı evrensel kota değildir; kullanıcı geçici farklı dağılım seçebilir. Yeni içerik azaltılır ama her gün otomatik sıfırlanmaz: haftalık kapsam için korunan küçük yeni-öğrenme ve yeni-uygulama payları vardır. Kullanıcının kapasitesi buna bile yetmiyorsa plan **ulaşılamayacak hedefleri açıkça listeler**.

Örnek açıklama: “Bu hedefi tekrar sorusunda doğru yaptın, fakat farklı ailedeki iki uygulamada zorlandın. Bugün üçüncü kart yerine karşılaştırmalı örnek öneriyorum.” Kullanıcı açıklamayı açabilir, görevi değiştirebilir veya kapasiteyi azaltabilir. Değişiklik gerçek öğrenme olayı değil plan tercihi olarak kaydedilir.

### 6.5. İstenen üç sözde kod

Aşağıdaki kod yalnız davranış sözleşmesidir; üretim kodu değildir.

```text
select_next_activity(context):
    if context.remaining_minutes <= 0:
        return STOP("Bugünkü kapasite doldu")

    candidates = approved_and_current_tasks(context.objectives)
    candidates -= suspended_tasks
    candidates -= held_out_tasks_outside_authorized_test_window
    candidates -= recently_exposed_siblings_when_independence_required

    lanes = build_lanes(candidates,
                       first_learning, recall, repair,
                       discrimination, timed_application, exam_analysis)
    lanes = apply_prerequisite_and_evaluation_constraints(lanes)
    lane = choose_lane_by_documented_rules(
        lanes, weekly_coverage_debt, repair_evidence,
        overdue_risk, user_choice, review_share_limit)
    task = first_eligible_task_fitting_duration_budget(lane)
    if task is NONE:
        task = try_shorter_task_or_offer_source_fragment(lanes)
    if task is NONE:
        return STOP("Kalan süreye uygun iş yok; zorlama yapılmadı")
    return task + reason_codes + evidence_ids + duration_range
```

```text
update_learning_state(event, expected_revision):
    validate_task_version_and_event_shape(event)
    if event.id_already_committed:
        return EXISTING_RESULT

    begin_transaction(expected_revision)
    append_original_event(event)
    if event.references_disputed_content:
        mark_evidence_as_pending_content_review(event)
        commit_without_increasing_mastery_or_forgetting()
        return

    grade = resolve_grade_with_rubric_and_human_override(event)
    tags = derive_exposure_hint_guess_interruption_and_family_tags(event)
    update_observed_performance(grade, tags)
    update_separate_evidence_views(recall, explanation,
                                   discrimination, transfer)
    if event.is_valid_recall_review:
        update_scheduler_with_versioned_adapter(event)
    update_error_hypotheses_without_claiming_diagnosis()
    persist_projection_and_explanation_atomically()
    commit()
```

```text
replan_after_missed_days(today, new_capacity):
    append_plan_deviation_record()
    # Yokluk, yanlış cevap ya da yapılmış tekrar değildir.
    keep_learning_events_and_original_due_dates_unchanged()
    candidates = rederive_eligible_work_from_current_state(today)
    estimate_workload_by_task_type(candidates)
    protect_agreed_coverage_and_independent_application_windows()
    reduce_new_intake_if_review_debt_exceeds_sustainable_capacity()
    select_tasks_within_budget(new_capacity, reserve_fraction)
    record_deferred_tasks_with_reasons_not_as_failures()
    show_unreachable_goals_and_user_control()
    save_new_plan_version_separately_from_actual_work()
```

### 6.6. Örnek hafta ve üç günlük ara

Aşağıdaki sayılar kurgu örneğidir. İlk sütun **kapasitedir**, hepsi tamamlanmış iş değildir. Gerçekleşen süreye o günkü içerik hazırlama/inceleme ve uygulama dışı bildirilen çalışma da dahildir; kaynağı ayrıca belirtilir.

| Gün | İlan edilen kapasite | Gerçekleşen | Yeniden planlama davranışı |
|---|---:|---:|---|
| Pazartesi | 60 dk | 50 dk | İlk öğretim, tekrar, kısa bağımsız uygulama; kalan işler kayda alınır. |
| Salı | 45 dk | 30 dk | Kullanıcı süreyi azaltır; yeni içerik yerine gerekli onarım korunur. |
| Çarşamba | 30 dk | 0 dk | Çalışılmadı; yanlış cevap üretilmez. |
| Perşembe | 45 dk | 0 dk | Önceki plan gerçekleşmedi; yeni olay yoktur. |
| Cuma | 60 dk | 0 dk | Üçüncü günün işi ertesi güne topluca eklenmez. |
| Cumartesi | 90 dk | 70 dk | Yeni görev planı en çok 72 dk: örneğin 30 tekrar + 20 onarım + 22 yeni uygulama; 18 dk pay. |
| Pazar | 60 dk | 50 dk | Gerçekleşen son duruma göre sınırlı yeni konu ve gecikmeli kontrol. |
| Toplam | 390 dk kapasite | 200 dk çalışma | “390 dk çalışıldı” veya “190 dk başarısızlık” raporu üretilmez. |

Üç günlük aranın eski 135 dakikalık kapasitesi cumartesiye borç olarak eklenmez. Zamanlayıcı geçmiş gözlemleri değiştirmez; planlayıcı bugünkü adayları yeniden seçer. Ertelenen iki hedef varsa kullanıcı bunu görür. Kullanıcı daha fazla çalışmayı seçebilir, fakat uygulama bunu zorunlu geri ödeme gibi sunmaz.

Sınava örneğin 14 gün kaldığında kullanıcı onayıyla yeni hedef alımı daraltılır, doğrulanmış açıklar ve zamanlı uygulama öne çıkar. Bütün kartların tarihleri sınav öncesine sıkıştırılmaz. Öğrenmenin tamamını yetiştirmek gerçekçi değilse eksik kapsam gösterilir; “bilimsel son hafta mucizesi” modu yoktur.

## 7. İçerik edinimi, doğrulama ve yapay zekâ sınırı

### 7.1. İçerik üretimi ürünün bir parçasıdır

İlk sürüm, içerik ekleme işini kullanıcıdan gizleyen tam kitap otomasyonu değildir. Kaynak parçası seçilir; hedef, görev, beklenen yanıt ve dayanak elle oluşturulur. Aynı kaynak parçasından gereksiz onlarca kart üretilmez. Otomatik toplu içe aktarma ancak küçük örneklerde doğrulama akışı çalıştıktan sonra gelir. `[T]`

Kaynak kaydı; eser/kurum, yazar, baskı veya tarih, erişim tarihi, sayfa/bölüm, varsa yerel dosya özeti, kullanım hakkı durumu ve doğrulayan kişiyi içerir. Bir web sayfasının okunabiliyor olması, tüm metin/görsellerinin yeniden dağıtılabileceği anlamına geliyormuş gibi işlem yapılmaz. Kullanım hakkı belirsiz kaynaklar dağıtılabilir içerik paketine girmez. Kaynak sürümleri değişmez kimlik taşır; yeni baskı yeni sürümdür.

**Yayın akışı:** `taslak → kaynak dayanağı kontrolü → görev/cevap/rubrik incelemesi → onaylı → kullanıma açık`. Taslaklar öğrenme ve değerlendirme kuyruklarında görünmez. Öz-inceleme, başka bir insanın incelemesi ve alan uzmanı incelemesi ayrı etiketlenir; yalnız bir kişinin iki kez bakması “bağımsız uzman onayı” değildir.

### 7.2. PDF ve görsel giriş yolu

MVP'de seçilmiş metin/Markdown ve yerel görsel ekleme yeterlidir. İkinci adımda PDF'nin mevcut metin katmanı kullanılır. Metin yoksa tüm kitabı değil seçilmiş sayfayı yerel OCR işleminden geçiren seçenek açılır. Önizlemede kaynak görüntüsüyle çıkarılan metin yan yana incelenir. Bu bir sonraki aşama tasarımıdır; bu plan hazırlanırken kullanıcı dosyasına OCR uygulanmadı.

Sayılar, dozlar, birimler, negatif ifadeler, tablo satır–sütun hizası ve görsel etiketleri otomatik “başarılı içe aktarma” sayılmaz. Kritik alan kontrol listesiyle elle doğrulanmadan görev yayımlanmaz. İçe aktarmada dosya türü, boyut, satır şeması, kimlik çakışması ve lisans durumu kontrol edilir; kısmi hatalı yüklemede işlem geri alınır.

### 7.3. Yanlış anahtar ve çelişki yönetimi

**İhbar → askıya alma → etki analizi → insan incelemesi → sürümlü düzeltme → yeniden değerlendirme** akışı zorunludur. Kaynağa ve görev ailesine bağlı hangi öğelerin etkilendiği listelenir. İnceleyici görev bazında askıyı genişletebilir; aynı kaynağın bütün içeriği gerekçesiz geçersiz sayılmaz.

Orijinal kullanıcı yanıtı ve o anda gösterilmiş anahtar silinmez. Yeni bir `GradeCorrection`/`ContentCorrection` olayı eklenir. Etkilenen kanıt görünümleri yeniden türetilir; gerekirse bellek modeli durumu geçersiz işaretlenip son güvenilir noktadan hesaplanır. Kullanıcının yanlış bilgiyi gerçekten görmüş olması ortadan kalkmadığı için düzeltme bildirimi ve yeni öğrenme görevi gerekebilir.

Tarihsel sınavın kabul ettiği yanıt ile güncel kaynak farklıysa iki bağlam ayrı sunulur. Sistem otomatik olarak birini “gerçek” seçip eski kaydı sessizce yeniden yazmaz. Değerlendirme öğesi hatalıysa analizden çıkarma veya yeniden puanlama kararı sürümlenir; iki deney koluna simetrik uygulanır.

### 7.4. Soru ve serbest yanıt kalitesi

Her soru için tek açık hedef, yeterli kök, belirtilmiş varsayımlar, savunulabilir tek en iyi yanıt, içerikçe anlamlı çeldirici ve gerekçe aranır. Çeldiricinin niçin yanlış olduğuna dayanak yoksa soru onaylanmaz. Dilbilgisel cevap ipuçları, seçenek uzunluğu, kökten cevabın sızması, ezberlenen sayının anlamsız biçimde değiştirilmesi ve birden çok kabul edilebilir yanıt için inceleme alanları bulunur. Bunlar bu projenin kalite kontrol kurallarıdır; erişilmeyen NBME kitabının tamamına dayandırılmamıştır [Q01].

Türkçe kısa yanıtlar kontrollü eş anlamlılar ve rubrikle değerlendirilebilir. Sözcük benzerliği veya tek LLM çıktısı kesin hakem değildir. Kullanıcı kendi cevabını, beklenen yanıtı ve ölçütleri görebilir; itiraz veya elle düzeltme yapabilir. Serbest yanıtta insan puanının kim tarafından verildiği kaydedilir; kendini puanlama bağımsız ölçüm sayılmaz. Deneyin açık uçlu sonuçlarında koşulu bilmeyen inceleyici tercih edilir.

### 7.5. İsteğe bağlı yerel model

LLM yalnızca şu aday işlerde denenir: kaynak içinden taslak görev önermek; karşılaştırma tablosu taslağı; kaynak dayanağıyla kısa açıklama taslağı; eş anlamlı cevap önerileri. Model, kullanıcı öğrenme durumunu veya onaylanmış anahtarı doğrudan değiştiremez. RAG, dayanağın iddiayı desteklediğini kendiliğinden kanıtlamaz; R11'de içerik kalitesi değerlendirilmiş olması da bu üründe öğrenme etkisi kanıtı değildir.

Model adı/sürümü, istem şablonu, kaynak kimlikleri ve üretim zamanı kayda girer. İkinci modelin onayı bağımsız tıbbi inceleme sayılmaz. Model servisinin kapanması öğrenme, planlama, kaynak okuma, puanlama rubriği ve yedeklemeyi etkilemez. Ağ üzerinden başka modele otomatik geçiş yapılmaz.

Bu modülün açılma koşulu: örnek içeriklerde insan doğrulaması dahil toplam hazırlama süresini azaltması, tıbbi incelemede kabul edilemez hata üretmemesi ve donanımda kullanılabilir çalışması. Hız ölçülmeden model boyutu veya performans sözü verilmez. İnsan incelemesini uzatıyorsa modül çıkarılır. Kritik hata gözlenmemiş olması da gelecekte hiç hata olmayacağı iddiasına dönüşmez. `[T/H]`

## 8. Yerel mimari, alternatifler ve veri modeli

### 8.1. Sıfırdan geliştirme kararı

| Yol | Güçlü taraf / doğrulanan imkân | Proje açısından sınırlılık | Tercih koşulu |
|---|---|---|---|
| Anki + mevcut soru bankası + basit plan | Anki FSRS, metin içe aktarma ve eklenti imkânı sunuyor [T02–T04]. | Bu plana özgü kaynak sürümü, hata hipotezi ve aile bazlı değerlendirme akışını ayrıca düzenlemek gerekir. | Sorun esas olarak tekrar ve basit takipse ilk seçim. |
| Anki'ye tamamlayıcı katman | Mevcut kart/tekrar yatırımı korunur; Python eklenti yolu belgelenmiş [T04]. | İki uygulama veya eklenti sürüm uyumu ve veri eşleme maliyeti doğabilir. | Kullanıcının hazır Anki içeriği fazlaysa küçük eklenti/yan araç. |
| Bağımsız küçük masaüstü uygulaması | Kaynak → hedef → görev → kanıt → plan akışı tek veri sözleşmesinde tutulur. | Kart arayüzü, içerik editörü, yedekleme ve paketleme yeniden geliştirilir. | İlk iki yol temel iş akışını gereksiz emekle çözüyorsa. |

**Karar:** Bağımsız uygulama bu planın referans mimarisidir; geliştirmeye geçiş, aşama 0'daki mevcut araç karşılaştırmasına bağlıdır. İlk 12 hedef için mevcut araçlarla yapılan deneme hedefli onarım ve ayrı değerlendirmeyi rahatça yürütüyorsa bağımsız uygulama projesi küçültülür veya durdurulur.

Anki'nin ana lisansı AGPL-3.0-or-later'dır; dahil bileşenlerin farklı lisansları bulunur [T05]. ts-fsrs MIT lisanslıdır [T06]; Tauri MIT veya Apache-2.0 altında sunulur [T07]. Bu plan Anki kaynak kodunu kopyalamayı veya lisans yükümlülüklerini kendiliğinden çözülmüş saymayı önermez. Seçilen sürümlerin lisans envanteri, dağıtımdan önce yeniden kontrol edilir. En düşük bağımlılıklı entegrasyon, onaylı olgusal görevlerin UTF-8 TSV dışa aktarımıdır; bütün öğrenci modelinin Anki'ye taşındığı iddia edilmez.

### 8.2. Masaüstü mü, yerel sunucu mu?

| Boyut | Paketli masaüstü | Yerel sunucu + tarayıcı |
|---|---|---|
| Günlük başlatma | Tek uygulama; tarayıcı/sunucu ömrü yönetimi yok | Sunucu başlatma, port ve süreç yönetimi gerekir |
| Güvenlik sınırı | Dinleyen ağ portu gerekmeyen dar yerel yüzey | Loopback varsayılanı; LAN açılırsa kimlik doğrulama ve ağ koruması gerekir |
| Yedekleme | Uygulama veri dizini ve güvenilir yedek komutu | Aynı veri bütünlüğü ihtiyacı; tarayıcı belleği tek yedek kabul edilmez |
| Bakım | İşletim sistemi paketleri, imzalama ve WebView farkları | Sunucu çalışma ortamı ve tarayıcı uyumluluğu |
| Tablet | İlk sürümde yok | Ana bilgisayar açıkken LAN tarayıcı erişimi daha doğrudan |
| Bağımsız çevrimdışı tablet | Ayrı istemci/senkronizasyon projesi | Ana bilgisayar kapalıyken yerel sunucu çözümü bunu sağlamaz |

**Seçim:** Tek cihaz ve çevrimdışı çekirdek için **Tauri 2 + TypeScript arayüz/alan paketi + dar Rust dosya/veritabanı köprüsü + SQLite**. Tauri'nin Rust ve işletim sistemi WebView yaklaşımı resmi mimari belgesinde açıklanır [T07]. React arayüz için bir uygulama tercihi olabilir; öğrenme kuralları React bileşenlerine gömülmez. İşletim sistemi desteği gerçek hedefte paketleme testiyle teyit edilir; WebView kurulumu gerekirse ilk kurulum adımında çözülür.

Tablet LAN erişimi birinci öncelik çıkarsa karar yerel sunucu lehine değişebilir. Tabletin kendi başına çevrimdışı çalışması, eşzamanlama ve çatışma çözümüyle birlikte ayrıca kapsamlandırılır. “Yerel” ile “her cihazda bağımsız” aynı vaat değildir.

### 8.3. Modüler tek uygulama

```text
Paketli kullanıcı arayüzü
    ↕
Saf TypeScript alan paketi
    içerik politikası | kanıt türetici | planlayıcı | zamanlayıcı uyarlayıcısı
    ↕ dar, şemalı kayıt/dosya komutları
Rust yerel köprüsü
    işlem / beklenen revizyon / dosya izni / yedek / içe aktarma
    ↕
SQLite + içerik özetiyle adreslenen değişmez varlık dosyaları

İsteğe bağlı yerel AI süreci → yalnız taslak üretim arayüzü
```

Alan paketi ağ ve arayüzden bağımsız, deterministik test edilebilir fonksiyonlar içerir. ts-fsrs bu pakette bir uyarlayıcı arkasında çalışır. Görev seçimi gerçek zamanlı LLM çağrısı değildir. Rust köprüsü keyfî SQL, shell veya sınırsız dosya erişimi açmaz; işlem komutlarını ve veri şemasını doğrular. Kayıt beklenen revizyonla atomik işlenir. Aynı olay ve aynı politika sürümü aynı türetilmiş durumu vermelidir.

İlk sürümde mikroservis, ayrı vektör veritabanı, kuyruk sunucusu veya kullanıcı hesabı altyapısı yoktur. Kaynak içinde basit arama yeterli değilse daha sonra yerel tam metin arama eklenir. Tıbbi “anlam grafı” arama için ön koşul değildir.

### 8.4. Veri modeli taslağı

| Varlık | Temel alanlar / sözleşme |
|---|---|
| `Source`, `SourceVersion` | Kimlik, bibliyografi, tarih/baskı, hak durumu, dosya özeti, değişmez sürüm |
| `SourceSpan` | Sayfa/bölüm, kısa dayanak, gerekirse görsel kırpım kimliği |
| `Course`, `Topic`, `LearningObjective` | Hiyerarşi, hedef cümlesi, önkoşullar, içerik türü, kapsam etiketi |
| `KnowledgeUnit` | Olgu/ilişki/mekanizma; birden fazla hedefe bağlanabilir |
| `TaskFamily` | Paylaşılan kök/çözüm/yüzey benzerliği; değerlendirme sızıntısı grubu |
| `Task`, `TaskVersion` | Görev türü, hedefler, aile, kök, seçenekler, anahtar, rubrik, kaynaklar, yayın durumu |
| `ContentReview`, `ContentIssue` | Kontrol türü, inceleyici, karar, gerekçe, etki alanı, sürüm |
| `StudySession`, `Attempt` | Gösterilen görev sürümü, yanıt, doğruluk, güven beyanı, ipucu, kesinti, süreler |
| `LearningEvent` | Benzersiz olay kimliği, sıra, UTC zaman, yerel tarih/saat dilimi, gözlem/beyan türü, politika sürümü |
| `GradeCorrection` | Eski olaya referans, yeni değerlendirme, gerekçe ve kaynağı |
| `EvidenceProjection` | Hatırlama/açıklama/ayırt etme/aktarım; türetilmiş kanıt ve belirsizlik |
| `SchedulingState` | Öğe kimliği, algoritma/kütüphane/parametre sürümü, model durumu, sonraki tarih |
| `StudyPlan`, `PlanVersion`, `PlanItem` | Kapasite, önerilen işler, gerekçe kodları, ertelenenler; gerçekleşenden ayrı |
| `ExternalStudyReport` | Kullanıcı beyanlı kaynak, konu, süre, sonuç; gözlemden ayrı |
| `ExamSpecification`, `MockExam` | Sınav kural sürümü, oturum/yanıtlar, net; normatif puan yok |
| `EvaluationAssignment` | Konu kümesi, eş, rastgele kol, gecikme, ayrılmış aileler, protokol sürümü |
| `BackupManifest`, `MigrationLog` | Şema, veri/varlık özetleri, kayıt sayıları, tamamlanma ve geri dönüş durumu |

Bu tabloların hepsi ilk gün yazılmaz. İlk dilim kaynak–hedef–görev–olay–durum–yedek bağlantısını kurar. Değerlendirme atamaları deney aşamasında eklenir. Sürümleme ve aile kimliği ise sonradan pahalı düzeltme gerektirmemesi için baştan bulunur.

### 8.5. Güvenlik, çevrimdışı çalışma ve veri bütünlüğü

Kurulum ve isteğe bağlı, açıkça başlatılan içerik/model indirmeleri sonrası çekirdek tamamen çevrimdışıdır. Uzak font, CDN, görünmez analitik, telemetri, hesap doğrulama veya lisans sunucusu bağımlılığı yoktur. Otomatik web içerik gömme kapalıdır. Kaynak HTML'i temizlenir; içerik tarafından komut veya script çalıştırılamaz. Dış bağlantı ancak açık kullanıcı eylemiyle açılır. Kaynak güncelleme günlük öğrenme döngüsünden ayrıdır.

Yerel dosya olmak şifreleme değildir. Cihaz hesabı izinleri ve işletim sistemi disk şifrelemesi kurulum kontrolünde açıklanır. Paylaşılan cihaz için ayrıca gereksinim değerlendirilir. Şifreli taşınabilir yedek gerekiyorsa yerleşik/denetlenmiş şifreleme çözümü seçilir; özel kriptografi yazılmaz. Anahtar kaybı ve yedeklerin kapsamı kullanıcıya açık olmalıdır.

Olaylar eklemeli günlükte tutulur; türetilmiş görünümler yeniden üretilebilir. Bu, geri alınamaz kullanıcı verisi kilidi değildir: kullanıcı bütün koleksiyonu veya belirli içeriği ilişkili kayıtlarla silmeyi seçebilir. Silme aktif veride, ekli dosyalarda ve uygulamanın yönettiği yerel yedeklerde test edilir. Daha önce dışa aktarılmış veya başka ortama kopyalanmış yedeklerin silinmesi ayrıca kullanıcının kontrolündedir.

Saat bilgisi UTC, olay sırası ve yerel gün/saat dilimiyle saklanır; oturum süresi mümkün olduğunda monoton saatle ölçülür. Saat geri alınması negatif çalışma süresi veya geçmişe yazılmış başarılı tekrar üretmez. Şüpheli tarihler işaretlenir; sessiz toplu yeniden zamanlama yapılmaz. Uykuya alınan cihazda geçen süre çalışma süresine eklenmez.

Yanıt iki kez gönderilirse benzersiz olay kimliğiyle tek kayıt oluşur. Yarım kalan oturumda kaydedilmiş yanıt korunur; gösterilip yanıtlanmamış sorunun maruziyeti de tutulur. Kaynak varlığı geçici dosyaya yazılır, özeti doğrulanır ve atomik adlandırılır; ardından veritabanı kaydı bağlanır. Çökmede sahipsiz dosya temizlenebilir ama veritabanı eksik dosyaya referansla bırakılmaz.

### 8.6. Yedek ve açık dışa aktarma

SQLite'nin belgelenmiş Backup API'si tutarlı anlık kopya sağlar [T08]. Canlı veritabanının yalnız ana dosyasını rastgele kopyalamak ürünün yedek yöntemi olmayacaktır. Yedek; tutarlı veritabanı görüntüsü, referanslanan değişmez varlıklar, şema/politika sürümleri ve özet/sayım manifestini birlikte içerir. Yedek sırasında varlık temizleme engellenir.

Geri yükleme önce ayrı dizinde açılır; özetler, veritabanı bütünlüğü, yabancı anahtarlar, kritik kayıt sayıları ve kaynak dosyaları kontrol edilir. Başarılıysa aktif koleksiyonla değiştirilir; eski durum geri dönüş için korunur. Yedek alınabilmesi kadar **gerçek geri yüklemenin sınanması** kabul koşuludur.

Açık dışa aktarım: kaynak/hedef/görevler için JSON/Markdown; olaylar için JSONL/CSV; desteklenen olgusal görevler için UTF-8 TSV; medya manifesti. Şema sürümü ve değerlendirme kökeni dışa aktarımda korunur. Anki aktarımı yalnız desteklenen görevlerin taşındığını belirtir; aktarım, tüm öğrenme geçmişinin kusursuz dönüşümü gibi sunulmaz [T03].

## 9. Minimal arayüz akışları

**Bugün:** “Kaç dakikan var?”; başlatılabilir tek sonraki eylem; tahmini süre aralığı; bir cümle gerekçe; değiştir/duraklat. Yan tarafta en çok gerekli plan öğeleri ve ertelenen hedefler. Aynı ekranda grafik duvarı yoktur.

**Çalış:** Görev → yanıt/bilmiyorum/ipucu → kısa geri bildirim → gerekirse kaynak/rubrik → sonraki iş. Mekanizma veya onarım gerekmeyen kolay görevde uzun açıklama zorunlu değildir. Zamanlı deneme ile öğrenme modu görünür biçimde ayrılır.

**İçerik:** Kaynak dayanağı ve görev birlikte görünür; yayın durumu, sürüm, itiraz ve askıya alma erişilebilirdir. İçerik hazırlama süresi ayrıca kaydedilebilir.

**Haftalık gözden geçirme:** Tekrar edilenlerde başarı, ilk kez görülenlerde başarı, gecikmeli kontrol sayısı, süre maliyeti ve eksik kapsam ayrı gösterilir. “Hatırlama: 7/10 bağımsız kontrol, son kontrol 9 gün gecikmeli” gibi somut gösterim kullanılır. Veri azsa “yetersiz kanıt” yazılır. Uyarlamalı alıştırma yüzdesi standart deneme yüzdesi gibi sunulmaz.

**Veri ve ayarlar:** Dışa aktarım, yedek/geri yükleme denemesi, yerel veri silme, sınav kural sürümü ve isteğe bağlı AI durumu.

Klavye ile tam çalışma, görünür odak, okunabilir yazı boyutu, renk dışı durum işaretleri ve ekran okuyucu etiketleri kabul testidir. Bir sorunun cevabını gizleyen görselde erişilebilirlik alternatifi aynı öğrenme hedefini mümkün olduğunca korumalıdır; sırf gizleme uğruna kullanılamaz içerik üretilmez. Baskıcı seri kaybı veya çalışma kaçırma cezası yoktur. `[T]`

## 10. MVP, geliştirme sırası ve geçiş kapıları

### 10.1. Özellik sınıflaması

| İlk kullanılabilir sürümde gerekli | Kullanım/kanıt doğrulamasından sonra | Şimdilik dışarıda |
|---|---|---|
| Kaynak ve görev sürümü, cevap/rubrik incelemesi | Seçici PDF/OCR | Tam kitap otomasyonu |
| İlk öğrenme + yanıt + geri bildirim + bağımsız kontrol | Lisanslı görseller için gelişmiş maskeleme | Özel büyük bilgi grafı |
| Ayrı kanıt türleri ve soru aileleri | Kişisel FSRS optimizasyonu | Yeni derin öğrenme öğrenci modeli |
| Kapasite sınırlı planlayıcı ve ara sonrası yeniden plan | Yerel LLM taslak araçları | Otomatik tanı/tedavi veya tek LLM hakem |
| Basit referans zamanlayıcı ve sürümlü FSRS uyarlayıcısı | Yerel ağdan tablet erişimi | Bağımsız tablet eşzamanlama projesi |
| Çevrimdışı çekirdek, dışa aktarım ve doğrulanmış geri yükleme | Gelişmiş deneme analizi | Topluluk verisi olmadan IRT/TUS puanı tahmini |
| Küçük onaylı pilot içerik | Yeni uzmanlık alanlarına genişleme | Sosyal/abonelik/rozet altyapısı |

### 10.2. Aşamalar

| Aşama | Çalışan çıktı | Bağımlılık | Kabul testi | Sonraki aşamaya geçiş |
|---|---|---|---|---|
| **0 — Mevcut araç ve kapsam kararı** | 12 hedeflik içerik taslağı; Anki + basit planla örnek çalışma; 3 kritik akışın elle denenmesi | Kaynak ve gerçek cihaz bilgisi | İlk öğrenme, yanlış onarımı ve yeni soru kontrolünün idari süresi ölçülür | Bağımsız uygulamanın çözmesi gereken somut darboğaz vardır; yoksa eklenti/mevcut araç seçilir |
| **1 — En küçük güvenilir döngü** | 3 hedef/9 görev; kaynak, görev sürümü, yanıt, rubrik, olay kaydı; basit tekrar; yedek | Aşama 0 kararı | Çift gönderim, ipucu, “bilmiyorum”, çökme ve geri yükleme testleri | Veri kaybı yok; üç içerik türünde uçtan uca çalışma var |
| **2 — Kanıt modeli ve içerik güvenliği** | Ayrı hatırlama/açıklama/uygulama kanıtı; aileler; onay ve askı; anahtar düzeltme | Olay günlüğü | Aynı sorunun tekrarı aktarım sayılmaz; anahtar düzeltmesi geçmişi korur | Kanıt durumları denetlenebilir ve yeniden üretilebilir |
| **3 — Günlük plan ve FSRS** | Altı görev havuzu; kapasite; açıklama; ara sonrası plan; hazır FSRS uyarlayıcısı | Geçerli görevler ve güvenilir olaylar | Süre üst sınırı, backlog, 0 dakika, yakın sınav, sürüm geçişi | 12 hedef/36 eğitim + 12 kontrol göreviyle offline MVP |
| **4 — Kullanılabilirlik ve sağlamlaştırma** | Paketli tek OS sürümü; erişilebilirlik; içe/dışa aktarım; yedek geri dönüş ekranı | MVP | Ağ tamamen kapalı uçtan uca çalışma; bozuk dosya/migration/güvenlik testleri | Kritik açık/veri hatası yok; kullanıcı iş akışını yardımsız tamamlıyor |
| **5 — Eğitimsel pilot** | Önceden yazılmış protokol, eşleştirilmiş kümeler, aktif karşılaştırma, zaman maliyeti raporu | Onaylı eğitim/değerlendirme bankası | Aile sızıntısı, rastgele atama, gecikme, kör puanlama, eksik veri kontrolü | Ek fayda sinyali veya maliyet düşüşü varsa yalnız yararlı bileşenler korunur |
| **6 — Kontrollü genişleme** | Yeni konu/görsel, seçici OCR veya yerel AI'dan tek bir modül | Ölçülmüş darboğaz ve geçtiği kapı | Modül için ayrı hata, süre ve kullanıcı faydası kıyası | Faydası belirsiz modül çıkarılır; ölçek gereksiz yere büyütülmez |

Her aşama küçük değişikliklerle ilerler. Her değişikliğin şartnamesi, bağlı veri göçü, örnek girdisi, beklenen çıktısı, testleri ve geri alma yolu bulunur. Üretim kodunun yalnız model tarafından yazılmış olması test ve tıbbi inceleme yerine geçmez. Takvim tahmini, gerçek geliştirici kapasitesi ve içerik hazırlama ölçümleri olmadan bağlayıcılaştırılmaz.

**Önerilen ilk iş paketleri:** `ADR-001 kapsam ve mevcut araç kararı`; `CONTENT-001 üç hedef paketi`; `DATA-001 sürümlü olay ve görev sözleşmesi`; `LOOP-001 çevrimdışı çalışma döngüsü`; `QA-001 çift kayıt/çökme/geri yükleme`. İlk geliştirme hedefi kapsamlı panel veya model entegrasyonu değildir.

## 11. Teknik, içerik ve eğitimsel doğrulama

### 11.1. Üç bağımsız başarı katmanı

| Katman | Başarı sorusu | Kanıt / test |
|---|---|---|
| Yazılım | Sistem kayıt, plan, puanlama ve veriyi doğru yönetiyor mu? | Birim, bütünleşme, özellik tabanlı test, hata enjeksiyonu, offline uçtan uca test |
| İçerik | Kaynak, soru, anahtar ve açıklama doğru ve uygun mu? | Sürüm/dayanak kontrolü, insan incelemesi, itiraz/askı ve yeniden puanlama |
| Öğrenme | Ek iş akışı, makul aktif düzene göre kullanıcıya yarar sağlıyor mu? | Önceden tanımlı tek kullanıcı karşılaştırması, ayrı değerlendirme aileleri, gecikmeli sonuç ve toplam maliyet |

Birinde başarılı olmak diğerlerini kanıtlamaz. Yazılım testleriyle “öğrenmeyi %20 artırır” veya uzman içerik incelemesiyle “öğrenci anladı” sonucu çıkarılmaz.

### 11.2. Teknik test matrisi

Deterministik alan testleri aynı olay dizisini iki kez oynatır ve aynı kanıt/zamanlama sonuçlarını arar. Oturum tamamlanması, doğru/yanlış/boş, güven, ipucu, yeniden gösterim ve insan düzeltmesi ayrı örneklerle sınanır. Revizyon çakışması sessiz veri ezmeye dönüşmez.

Özellik tabanlı testler: plan süresi kapasiteyi aşmaz; ara verme öğrenme olayı üretmez; askıdaki/onaysız görev seçilemez; değerlendirme bankası eğitim sırasında gösterilemez; bütün gözlemler kullandıkları görev sürümüne bağlıdır; aynı olay iki kez etkili olamaz.

Bütünleşme testleri: bozuk UTF-8/şema, çok büyük dosya, duplicate ID, eksik medya, yarıda kalan import, canlı yedek, yedekten dönüş, desteklenmeyen yeni şema ve veri göçü hatası. Yeni şema açılamıyorsa eski veriye yazılmaz. Göçten önce doğrulanmış yedek alınır.

Zaman testleri: gece yarısı, saat geri/ileri, saat dilimi değişikliği, cihaz uykuya alınması, uygulamanın zorla kapanması. Güvenlik testleri: kaynak HTML'indeki script, kötü niyetli dosya yolu, SQL/komut enjeksiyonu girişimi, beklenmeyen dış ağ çağrısı. Paketli uygulamanın ağ günlüğünde kullanıcı tarafından istenmeyen istek olmamalıdır.

Performans için referans cihaz ve veri kümesi önceden kaydedilir. Örneğin 10.000 görev/100.000 olayla sıradaki görevin yüzde 95 durumda 300 ms içinde seçilmesi bir **mühendislik hedefi** olabilir; ölçülmüş sonuç değildir. Büyük içe aktarma UI'yi kilitlememeli, iptal edilebilmelidir. Kötü performansta veri modeli/indeksler gözden geçirilir; LLM ile hız açıklaması yapılmaz.

### 11.3. İçerik testleri

Pilotun bütün aktif görevleri insan tarafından incelenir. Cevap anahtarları, negatif ifadeler, sayısal değerler ve rubrikler kontrol listesiyle taranır. Aynı aile etiketleri en az bir kez gözden geçirilir; kökü yeniden yazılmış soru farklı aileye kaçmamalıdır. Deney sorularının kaynağı açık fakat yanıtı eğitim oturumuna görünmez olmalıdır.

Gözlenen kritik anahtar/yorum hatası ilgili görevi durdurur. İnceleyici onayının kapsamı açık yazılır; tüm tıbbi doğruluğun garanti edildiği ilan edilmez. Üretim maliyeti ölçülür: taslak yazma, kaynak bulma, doğrulama, itiraz ve düzeltme süreleri. Pilotun en pahalı aşaması içerikse kapsam azaltılır; otomasyon şart koşulmaz.

### 11.4. Tek kullanıcı eğitimsel pilot

**Amaç:** TUS Yerel'in ek karar/onarım akışını, **doğrulanmış sorular + aynı standart aralıklı tekrar + basit plan** ile karşılaştırmak. Pasif okuma veya hiç çalışmama tek karşılaştırma olmayacaktır. İlk pilot etkililik kanıtlamaktan çok uygulanabilirliği ve olası ek faydayı araştırır. `[T/H]`

**Atama birimi:** Soru değil, birbirini fazla öğretmeyen kavram/hedef kümesi. Başlangıç, içerik türü ve inceleyicinin güçlük tahminiyle **12 eşleştirilmiş çift = 24 küme** hazırlanır. Doğrudan bilgi, mekanizma ve uygulama türlerinin her birinde dört çift bulunur. Her çiftte biri yazılıma, diğeri aktif karşılaştırmaya rastgele atanır; rastgelelik tohumu ve atama protokolü saklanır.

**İçerik büyüklüğü:** Her küme için yaklaşık 2 eğitim görevi ve 2 ayrı aileden kontrol görevi: toplam 48 eğitim + 48 kontrol, yani 96 onaylı görev. Gerekli başlangıç yoklamaları ayrıca hazırlanır; bu sayı güç analizi sonucu değildir. İçerik birbirinden yeterince ayrılamıyorsa bu tasarım kullanılmaz; küme sayısı/alanlar değiştirilir.

**İki gecikme, tek kümede iki öğretici test değil:** Her içerik türündeki dört eşin ikisi 7 günlük, ikisi 28 günlük son teste atanır. Böylece her gecikmede 6 çift vardır. Bir küme erken testle öğretildikten sonra 28 günlük “ilk bağımsız ölçüm” gibi değerlendirilmez. Bu küçük yapı hassas bir etki tahmini sağlamaz; sonucu belirsiz bırakabilmesi beklenir.

**Çalışma bütçesi ve kontrol:** İki kolda aynı toplam aktif çalışma tavanı ve aynı takvim penceresi kullanılır; örneğin küme başına toplam 20 dakika üç oturuma dağıtılır. Bunlar başlangıç tasarımıdır. Yanıt, kaynak okuma, açıklama ve geri bildirim bu bütçeye dahildir. Başarılı kolun daha çok çalışmasına sessizce izin verilmez. Her eşte son öğretim günü ve atanmış test gecikmesi eşitlenir; gerçekleşen sapmalar kaydedilir. Her kümenin son öğretimi ile kontrolü arasındaki gerçek süre ayrıca saklanır. Gecikme penceresinde o küme için uygulama tekrarları durdurulur; dışarıda çalışma olursa beyanla işaretlenir.

İçerik hazırlama maliyeti iki kola ortak ve kola özgü olarak ayrılır; yazılımı kullanma, planı yönetme, inceleme ve düzeltme süreleri ayrıca eklenerek **toplam maliyet** raporlanır. Yazılım geliştirme emeği günlük öğrenci çalışma süresinden ayrı bir yatırım maliyeti olarak gösterilir. Sadece kısa cevap süresiyle “verimlilik arttı” denmez.

**Sonuçlar:** İlk görülen soruda doğru/yanlış/boş; gerektiğinde kör rubrik puanı; gecikmeli ipucusuz hatırlama; kapsam; doğru ve yanlış yanıtların ayrı süre dağılımları; güven-doğruluk uyumu; toplam süre. Aynı sorudaki tekrar başarısı ayrı bir ikincil ölçümdür. Standart dışı soru setinden TUS puanı veya yüzdelik dilim çıkarılmaz.

**Sızıntı denetimi:** Eğitim ve kontrol aileleri ayrı; değerlendirmenin kök/çeldiricileri öneri sistemine ve AI taslak girdilerine girmez. Kaynak ve hedef ortak olabilir—aynı hedefin aktarımı zaten ölçülmektedir—fakat yüzeysel varyasyonlar yeni aile sayılmaz. Çok yakın kümeler arası bilgi taşınması inceleyici tarafından önceden işaretlenir. Bütünüyle engellenemeyen taşınma sonuç sınırlılığı olarak raporlanır.

**Analiz:** Kümelerin eş içi sonuç farkları gösterilir. Atama birimi kümeyken yüzlerce tekrar bağımsız örnek kabul edilmez. Uygunsa eşleştirilmiş rastgeleleştirme analizi ve belirsizlik aralığı raporlanır; alt gruplar küçükse çıkarım yapılmaz. Kaçırılan test “yanlış” değil eksik veridir; kayıp nedenleri ve duyarlılık analizi belirtilir. Başlangıçta tavan/taban etkisi varsa pilotun yorumlanamayabileceği kabul edilir. Tek kullanıcının sonuçları topluma genellenmez.

Basit ABAB önerilmez: öğrenilen bilgi sonraki koşula taşınabileceğinden ilk duruma geri dönüldüğü varsayımı savunulamaz. Önce küçük bir bileşen kıyası yapılabilir: örneğin aynı tekrar düzeninde yalnız hedefli hata onarımı açık/kapalı. Birden fazla özelliği birlikte değiştirmek hangi bileşenin yararlı olduğunu göstermez.

### 11.5. Önceden belirlenen karar ve kaldırma ölçütleri

**Güvenlik/geçerlilik kapısı:** Veri kaybı, yanlış anahtarın sessiz uygulanması, eğitim–test sızıntısı veya ciddi içerik sorunu varsa ilgili değerlendirme durur; sorun düzeltilmeden olumlu etki iddiası yapılmaz.

**Kullanılabilirlik kapısı:** Kullanıcı yardım almadan görev başlatabilmeli, kaynağı görebilmeli, yanlış anahtara itiraz edebilmeli, ara sonrası kapasite belirleyebilmeli ve yedeği geri yükleyebilmelidir. Örneğin sıradan oturumlarda içerik üretimi hariç salt idare süresinin toplamın %10'unu aşması yeniden tasarım sinyalidir; eşik bilimsel bir norm değildir.

**Eğitimsel devam sinyali:** Önceden seçilmiş pratik önem düzeyi örneğin yeni görevlerde +5 yüzde puan ya da benzer sonuçta %20 daha düşük toplam zaman olabilir. Bunlar pilotu yorumlamak için hedeflerdir, 24 kümeyle bu farkların güvenilir biçimde saptanacağı sözü değildir. “Benzer” demek için belirsizlik/eşdeğerlik aralığı gerekir; anlamlı fark çıkmaması eşitlik kanıtı değildir. Kanıt yetersizse sade başlangıç düzeni korunur ve pahalı özellik yaygınlaştırılmaz.

Açıklama/güven formu görevin süresini büyütüp yeni görevde fayda göstermiyorsa seyrekleştirilir veya kaldırılır. Uyarlamalı plan sürekli düşük kapsam yaratıyorsa kurallar sadeleştirilir. Yerel AI doğrulama yükünü azaltmıyorsa çıkarılır. Yeni model yalnız yanıt tahmininde iyileşip toplam öğrenmede yarar göstermiyorsa öğretim kararlarını devralmaz.

## 12. Riskler, kabul senaryoları ve açık kararlar

### 12.1. İstenen kabul senaryoları

| Durum | Beklenen ürün davranışı | Geçme koşulu |
|---|---|---|
| **Başlangıç verisi yok** | Kısa yoklama; varsayılan zamanlayıcı; bilinmeyen kanıt durumu | Kişisel başarı/unutma oranı uydurulmaz; kullanıcı ilk göreve başlayabilir |
| **Hiç bilmediği konu** | Kaynak + çözülmüş örnek + destekli görev | Ön test yanlışı unutma sayılmaz; hemen uzun tekrar kuyruğu oluşturulmaz |
| **Aynı soruyu ezberliyor, yenide başarısız** | Aile bazında ayrım; açıklama/uygulama onarımı | Eski doğru yüzdesi konu ustalığına dönüşmez; yeni aile sonucu ayrı görünür |
| **Yüksek güvenli yanlış** | Önce anahtar/dayanak geçerliliği; sonra hipotezli onarım | Kesin psikolojik/bilişsel tanı konmaz; kullanıcı açıklamayı değiştirebilir |
| **Üç gün ara** | Güncel kapasiteden yeni plan; geçmiş yanıtlar değişmez | Sıfır otomatik yanlış; birikmiş tüm iş tek güne yığılmaz |
| **Kapasiteyi aşan tekrar** | Sınırlı seçim; yeni alımı azaltma; açık erteleme | Plan bütçeyi aşmaz; vazgeçilen/ertelenen kapsam görünür |
| **Sınava çok az süre** | Kullanıcı onaylı kapsam daraltma, doğrulanmış açıklar ve süreli uygulama | Bütün kartlar aynı tarihe çekilmez; puan artışı vaadi yok |
| **Yanlış cevap anahtarı** | Askı, etki analizi, sürümlü düzeltme, yeniden puanlama | Orijinal yanıt korunur; yanlış anahtar kullanıcı unutması gibi kalmaz |
| **Çelişkili kaynak** | Çelişki ve tarihsel/güncel bağlam görünür; insan incelemesi | Sistem sessizce birini seçmez; sorunlu görev değerlendirmeden çıkarılabilir |
| **Yerel model çalışmıyor** | Taslak yardımı kapanır; ana çalışma devam eder | Planlama, öğrenme, puanlama, kaynak ve yedekleme tamamlanır |
| **İnternet tamamen kapalı** | Tüm çekirdek işlevler yerelden yürür | Ağ bağımlılığı yok; açık uygulama yeniden başlatıldığında da çalışır |
| **Yedekten geri dönüş** | Ayrı alanda doğrulama, sonra aktif koleksiyona geçiş | Görev sürümleri, olay sayıları, medya özetleri ve zamanlama aynı; bozuk yedek mevcut veriyi bozmaz |

### 12.2. En önemli riskler

**İçerik maliyeti:** Planın en büyük pratik riski koddan önce doğrulanmış görev üretimidir. Önlem: küçük kapsam, görev başına hazırlama/inceleme süresi, az ama kaliteli kontrol sorusu; yetersiz kaynakta kapsam azaltma.

**Sahte yeterlik hissi:** Çok tekrar edilen soru, güven skoru veya görsel grafik iyi öğrenilmiş gibi görünebilir. Önlem: kanıt türlerini ve aileleri ayırma; belirsizlik ve ham sayıları gösterme.

**Aşırı planlama:** Kendi başına basit yapılabilecek çalışmayı uygulama yönetimine dönüştürmek. Önlem: idari süreyi ölçme, kullanıcıya geçişleri atlama hakkı, tek öneri ekranı.

**Kapsamın dengesiz daralması:** Yalnız yanlışlara veya çok sık çıktığı sanılan konulara odaklanma. Önlem: resmî yaklaşık ders kapsamını ayrı tutma, haftalık kapsam denetimi; küçük yayımlanmış örneklerden kesin alt konu ağırlığı türetmeme.

**Ölçüm yanlılığı:** Kendini puanlama, kollar arası zaman farkı, yeniden yazılmış sorular, testin öğretmesi. Önlem: kör rubrik, toplam zaman, aile ayrımı, ayrı gecikme kümeleri ve önceden belirlenmiş analiz.

**Yerellik yanılgısı:** Yerel dosyayı otomatik güvenli, yedeklenmiş veya lisanslı sanma. Önlem: ayrı güvenlik/hak/yedek sözleşmeleri.

### 12.3. Tasarıma eleştiri

**En zayıf bilimsel varsayım**, birkaç doğru/yanlış ve kullanıcı beyanından hangi onarım eyleminin en çok yarar sağlayacağını seçebileceğimizdir. Güçlü hatırlama literatürü bu politika seçimini doğrulamıyor. Bu nedenle hata sınıfları hipotez, planlayıcı kuralları açıklanabilir ve değiştirilebilir; nedensel fayda küçük karşılaştırmalarla ayrıca sınanır.

**İkinci zayıf varsayım**, hatırlama–açıklama–ayırt etme–uygulama ayrımının kullanıcı için maliyetinden fazla değer yaratacağıdır. Veri modeli ayrımı korurken arayüz bu alanları her soruda doldurtmaz. Kullanım yükü artarsa görünür akış sadeleştirilir.

**Gereksiz karmaşıklık adayları:** Her soru için zorunlu güven, otomatik hata teşhisi, kişisel bellek parametresi optimizasyonu, bilgi grafı, tam kitap OCR, LLM hakem ve çok cihazlı eşzamanlama. Hiçbiri öğrenme çekirdeğinin ön koşulu değildir.

**Planı değiştirecek sonuçlar:** Aktif karşılaştırma aynı işi daha az toplam emekle yapıyorsa Anki/yan araca dönülür. Görülmemiş soruda kazanım yokken tekrar yüzdesi artıyorsa soru/öğretim tasarımı değiştirilir. Görevler yeterince bağımsız ayrılamıyorsa pilot yeniden tasarlanır. İçerik onayı yetişmiyorsa algoritma değil kapsam küçültülür. Kullanıcının esas gereksinimi bağımsız tabletse masaüstü mimarisi yeniden seçilir.

**Yeni uygulama yerine mevcut araçlar**, ihtiyaç esas olarak olgusal tekrar ise; hazır kaliteli Anki içeriği varsa; kaynak ve soru analizi dışarıda zaten düzenliyse; idari yük düşükse; yeni uygulama geliştirme/inceleme emeği öğrenme zamanını tüketiyorsa daha mantıklıdır. Bağımsız ürünün varlık gerekçesi bir aracı yeniden yazmak değil, bu karşılaştırmada gösterilebilen iş akışı yararıdır.

### 12.4. Mimariyi veya öğrenme planını değiştirecek açık sorular

Başlangıç kararı bu soruların yanıtını beklemek zorunda değildir. Aşama 0'da kesinleştirilecek bilgiler: hedef cihaz/işletim sistemi; tabletin ana bilgisayara bağlı mı bağımsız mı olacağı; sınav dönemi ve gerçek zaman bütçesi; mevcut Anki/soru bankası yatırımı; kaynak kullanım hakları; tıbbi içerik incelemesini kimin yapacağı. Hedef puan bağlamdır, tek başına güvenilir algoritma hedefi değildir.

**Son karar:** Önce üç öğrenme türünü temsil eden doğrulanmış küçük içerik ve en küçük çevrimdışı döngü. Ardından ayrı kanıt durumları, hataya göre yönlendirme ve kapasite sınırlı plan. Standart aralıklı tekrar tekrar icat edilmez. Daha büyük içerik otomasyonu, kişisel modeller ve AI ancak bu çekirdek gerçek bir kullanıcıda maliyetini haklı çıkardığında eklenir.

---

## Ek A — Kaynakça ve erişim kaydı

Aşağıdaki adresler bibliyografik doğrulamayı kolaylaştırmak içindir. Bilimsel sonuçlar yalnız yukarıda belirtilen erişim kapsamıyla kullanılmıştır. Teknik belgeler ve klinik örnek kaynakları eğitimsel ürün etkisi kanıtı değildir.

### Bilimsel kaynaklar

**R01 — Dunlosky ve ark. (2013).** Improving Students' Learning With Effective Learning Techniques: Promising Directions From Cognitive and Educational Psychology. *Psychological Science in the Public Interest.* DOI `10.1177/1529100612453266`. PubMed özeti: `https://pubmed.ncbi.nlm.nih.gov/26173288/`. Karar: hatırlama/dağıtılmış çalışmayı çekirdeğe almak; daha sınırlı teknikleri seçici kullanmak.

**R02 — Trumble ve ark. (2024; çevrimiçi 2023).** Systematic review of distributed practice and retrieval practice in health professions education. *Advances in Health Sciences Education.* DOI `10.1007/s10459-023-10274-3`. Tam HTML: `https://link.springer.com/article/10.1007/s10459-023-10274-3`. Karar: sağlık eğitimi bağlantısı; süre ve ölçüm geçerliği sınırlılıkları nedeniyle toplam maliyet ve ayrı kontrol bankası.

**R03 — Pan ve Rickard (2018).** Transfer of test-enhanced learning: Meta-analytic review and synthesis. *Psychological Bulletin.* DOI `10.1037/bul0000151`. Özet: `https://pubmed.ncbi.nlm.nih.gov/29733621/`. Karar: tekrar doğruluğuyla yeni görev başarısını ayırmak.

**R04 — Van Merriënboer ve Sweller (2010).** Cognitive load theory in health professional education: design principles and strategies. *Medical Education.* DOI `10.1111/j.1365-2923.2009.03498.x`. Özet/önizleme: `https://asmepublications.onlinelibrary.wiley.com/doi/10.1111/j.1365-2923.2009.03498.x`. Karar: deneyim düzeyine göre örnek, destek ve desteğin azaltılması.

**R05 — Bisra ve ark. (2018).** Inducing Self-Explanation: a Meta-Analysis. *Educational Psychology Review.* DOI `10.1007/s10648-018-9434-x`. Özet: `https://link.springer.com/article/10.1007/s10648-018-9434-x`. Karar: hedefli kısa mekanizma açıklaması; her görevde uzun yanıt yok.

**R06 — Wisniewski, Zierer ve Hattie (2020).** The Power of Feedback Revisited: A Meta-Analysis of Educational Feedback Research. *Frontiers in Psychology.* DOI `10.3389/fpsyg.2019.03087`. Tam HTML: `https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.03087/full`. Karar: bilgi taşıyan, hatayla ilişkili geri bildirim; tek optimal biçim/timing iddiasından kaçınma.

**R07 — Dobson, Linderholm ve Stroud (2019).** Retrieval practice and judgements of learning enhance transfer of physiology information. *Advances in Health Sciences Education.* DOI `10.1007/s10459-019-09881-w`. Özet: `https://link.springer.com/article/10.1007/s10459-019-09881-w`. Karar: düşük yükte üstbiliş araçlarını pilotta sınamak.

**R08 — Rasch ve Born (2013).** About Sleep's Role in Memory. *Physiological Reviews.* DOI `10.1152/physrev.00032.2012`. Tam HTML: `https://pmc.ncbi.nlm.nih.gov/articles/PMC3768102/`. Karar: uyku/bellek bilgisini kişiye özgü saat reçetesine çevirmemek; kullanıcı kontrollü kapasite.

**R09 — Latimier ve ark. (2019).** Does pre-testing promote better retention than post-testing? *npj Science of Learning.* DOI `10.1038/s41539-019-0053-1`. Tam HTML: `https://www.nature.com/articles/s41539-019-0053-1`. Karar: hiç öğrenilmemiş içerik ile öğrenilmiş içeriğin hatırlanmasını ayırmak; ön testi varsayılan uzun öğretim yöntemi yapmamak.

**R10 — Cui ve ark. (2024).** Leveraging Pedagogical Theories to Understand Student Learning Process with Graph-based Reasonable Knowledge Tracing. Yazar kaydında SIGKDD 2024 kabul bilgisi. Erişilen özet/metadata: `https://arxiv.org/abs/2406.12896`. Karar: tahmin başarısını öğretim etkisinden ayrı sınamak; derin modeli MVP dışına almak.

**R11 — Kaczmarek ve ark. (2025).** Optimizing Retrieval-Augmented Generation of Medical Content for Spaced Repetition Learning. Yazar kaydında *CSEDU 2025*, cilt 2, s.174–186; DOI `10.5220/0013477700003932`. Erişilen özet/metadata: `https://arxiv.org/abs/2503.01859`. Karar: tıbbi AI taslağında kalite incelemesi; öğrenme etkisi iddiası yerine içerik maliyetini ölçmek.

### Resmî sınav ve teknik kaynaklar

**T01 — ÖSYM.** 2026-TUS 2. Dönem Başvuru Kılavuzu. Resmî PDF; ilgili sayfalar görsel olarak da kontrol edildi: `https://dokuman.osym.gov.tr/web/2026/7/basvuru-kilavuzu-rn15c8-30102957.pdf`. Karar: sürümlü sınav yapılandırması; norm verisi olmadan puan tahmini yok.

**T02 — Anki Manual, Deck Options / FSRS.** Güncel sayfa: `https://docs.ankiweb.net/deck-options.html`. Karar: zamanlayıcı/öğretim ayrımı ve yük–hatırlama tercihi. Belgede eski “Compute Minimum Recommended Retention” özelliğinin 25.07 itibarıyla kaldırıldığı yazıyor; yeni tasarım o eski özelliğe bağımlı değildir.

**T03 — Anki Manual, Text Files.** `https://docs.ankiweb.net/importing/text-files.html`. Karar: UTF-8 TSV ile düşük bağımlılıklı içerik aktarımı; alan ve duplicate kontrolü.

**T04 — Writing Anki Add-ons.** `https://addon-docs.ankiweb.net/`. Karar: bağımsız uygulamaya alternatif Python eklenti yolu.

**T05 — Anki LICENSE.** `https://github.com/ankitects/anki/blob/main/LICENSE`. Karar: Anki kaynak kodu ve dahil bileşenlerin lisansları ayrı incelenecek.

**T06 — ts-fsrs, resmî proje deposu.** `https://github.com/open-spaced-repetition/ts-fsrs`. Karar: hazır, sürümlü zamanlayıcı uyarlayıcısı; özel FSRS türevi yazmama. Paket/algoritma sürümü geliştirme başında kilitlenecek.

**T07 — Tauri Architecture.** `https://v2.tauri.app/concept/architecture/`. Karar: yerel masaüstü kabuğu ve dar dosya/veritabanı köprüsü.

**T08 — SQLite Online Backup API.** `https://www.sqlite.org/backup.html`. Karar: doğrulanabilir tutarlı yedek, geri yükleme testi.

### Eğitim örneği ve soru kalitesi kaynakları

**C01 — OpenStax, Anatomy and Physiology 2e, 17.4 The Thyroid Gland.** `https://openstax.org/books/anatomy-and-physiology-2e/pages/17-4-the-thyroid-gland`. Yalnız C hücresi/kalsitonin ve eksen geri bildirimi örneklerinin dayanağıdır; tüm sayfanın klinik rehber olarak onaylandığı anlamına gelmez. Görsel/metin lisansları içerik bazında kontrol edilmelidir.

**C02 — American Thyroid Association, Hypothyroidism.** `https://www.thyroid.org/hypothyroidism/`. Temel tiroid–hipofiz ayrımının eğitim örneği dayanağı; kapsamlı tanı/tedavi kılavuzu olarak kullanılmadı.

**Q01 — NBME, Item-Writing Guide tanıtım sayfası.** `https://www.nbme.org/institutions/nbme-item-writing-guide/`. Sayfa altıncı baskıyı tanıtıyor; tam kitabın içeriğine erişilmedi. Karar: soru yazımında ayrıca uzman incelemesi ve ölçme-değerlendirme kontrolü; okunmamış kitaba ayrıntı atfetmeme.

## Ek B — Geliştiriciye teslim kontrol listesi

Bu planla işe başlanırken karar kayıtları ve test örnekleri aynı depoda tutulmalıdır. Aşağıdaki dosyalar iş ürünleridir, mevcut oldukları iddia edilmez:

- `docs/product-scope.md`: sorun, kapsam dışı ve mevcut araç karşılaştırması.
- `docs/evidence-register.md`: kaynak → sınır → karar → ölçüm bağlantıları.
- `docs/content-contract.md`: görev/rubrik/dayanak/yayın ve düzeltme sözleşmesi.
- `docs/learning-state.md`: gözlem, beyan, çıkarım ve aile kuralları.
- `docs/planner-policy.md`: kapasite, öncelik, ara sonrası plan, gerekçe kodları.
- `docs/data-and-recovery.md`: şema, göç, silme, yedek, geri dönüş.
- `docs/evaluation-protocol.md`: eşleştirme, atama, gecikme, test bankası ve analiz.
- `tests/acceptance/`: bölüm 12.1'deki 12 senaryonun çalıştırılabilir karşılıkları.

İlk sürüm ancak küçük öğrenme döngüsü, içerik güvenliği ve verinin geri getirilebilirliği birlikte çalışıyorsa “kullanılabilir” sayılır. Öğrenmeye ek yarar sağladığı ise ancak eğitimsel değerlendirmeden sonra ayrıca söylenebilir.
