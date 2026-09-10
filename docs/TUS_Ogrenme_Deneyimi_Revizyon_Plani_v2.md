# TUS Yerel — Öğrenme deneyimi revizyon planı v2

Tarih: 10 Eylül 2026. Durum: uygulama öncesi ürün ve öğretim tasarımı önerisi.

Dayanak: TUS_Yerel_Uygulama_Proje_Plani.md v1; TUS Astra iskeleti; mevcut 0.1 prototipi; kullanıcının “özellik az, bilimsel yöntemler görünmüyor, arayüz karmaşık” geri bildirimi. Bu belge ana planın tamamının yerine geçmez; ilk kullanılabilir sürümün kapsamını, geliştirme sırasını ve kabul ölçütlerini revize eder. Bu çalışmada uygulama kodu değiştirilmedi.

**Ürün vaadi:** Kullanıcı, kaynaklı hazır bir konuda doğrudan çalışmaya başlayacak; uygulama gözlenen yanıtına uygun sonraki öğrenme eylemini seçecek, gerçek tekrar tarihleri oluşturacak ve sonraki günlerde aynı bilgiyi kullanıp kullanamadığını ayrı gösterecek.

**Başarı:** Aynı toplam emekle daha iyi gecikmeli hatırlama / yeni soru performansı veya bu sonuçları koruyarak daha az hazırlama ve yönetim yükü. Bu sonuçlar henüz gösterilmedi.

## 1. Önceki teslimden çıkarılan kararlar

0.1 bir teknik denemeydi: yerel kayıt, yedek ve bazı veri değişmezleri sınandı. Bu kabul, anlamlı bir TUS öğrenme deneyiminin veya kullanılabilirliğin kabulü değildi. 30 otomatik test, öğretim etkinliği ölçüsü değildir. Kullanıcının geri bildirimi, ürün kabulünün henüz karşılanmadığına dair gerçek veridir; kontrollü öğrenme deneyi değildir.

| Mevcut durum | Revizyon | Neden |
|---|---|---|
| Kurgusal kapsül/istasyon soruları | Geliştirici testlerinde kalacak; normal başlangıçta küçük, incelenmiş tıbbi paket | Kullanıcı tıp çalışırken faydayı değerlendirebilmeli |
| Boş kişisel alan; önce soru yazma yükü | Hazır oturum; içerik hazırlama ayrı, isteğe bağlı iş | Uygulamanın ilk değeri içerik editörüne bağlı olmamalı |
| Görev türleri sabit sırayla dönüyor | Yanıt, önceki gözlem ve hedef türüne göre dallanan oturum | Her hata aynı öğretimi gerektirmiyor |
| Süre bütçesi var, tekrar tarihi yok | Kalıcı son/sonraki tekrar tarihleri ve hazır zamanlayıcı | Günlük sıralama, aralıklı tekrarın yerine geçmez |
| Açıklama açıldıktan sonra öz değerlendirme | Yanıt önce kalıcı olarak kilitlenir; değerlendirme ve açıklama ayrı olaylar | Cevabı bilmekle sonradan doğru kabul etmek ayrılmalı |
| Kayıt panelleri ve uyarılar ana ekranda | Tek önerilen oturum; ayrıntılar ihtiyaç halinde | Çalışmaya başlama yükünü azaltmak |
| Bağımsız kontrol yalnız çekirdekte | Ayrı aileden, önceden gösterilmeyen gerçek kontrol akışı | Soru ezberiyle aktarımı ayırmak |
| Kullanılabilirlik ileri aşamada | Her küçük dilimde gerçek kullanıcı akışı kontrolü | Sonradan bütün ekranları yeniden yapmayı önlemek |

Korumaya değer parçalar: cihazda çalışma, bağımlılıksız çekirdek yaklaşımı, kaynak/olay sürümleri, örnek ve kişisel veri ayrımı, yedek doğrulama ve geri alma testleri. Mevcut veri modeli üretim için yeterli varsayılmayacak; hedefli olarak genişletilecek.

## 2. Kanıtı kullanma kuralı

- **[B] Bilimsel bulgu:** Erişilen çalışma/derlemenin desteklediği sınırlı sonuç.
- **[T] Tasarım kararı:** Bu sonuçtan ve kullanım ihtiyacından çıkardığımız uygulama davranışı.
- **[H] Ürün hipotezi:** Bu davranışın kullanıcıya ek fayda sağlayacağı beklentisi; ayrıca ölçülmeli.
- **[Ü] Ürün örneği:** Bir uygulamanın belgelenmiş özelliği. Öğrenme etkisi kanıtı değildir.

Bu tarama hedefli bir ürün araştırmasıdır; sistematik derleme veya bütün güncel literatürün taranması değildir. İlk planın bilimsel kayıtları yeniden kullanıldı; seçilen kaynaklar ve resmi ürün belgeleri kontrol edildi. Arayüz önerileri canlı rakip uygulama kullanılabilirlik testi sonucu değildir.

| Yöntem ve dayanak | Uygulama kararı | Sınır ve ölçüm |
|---|---|---|
| Aktif hatırlama + zamana yayma [B]. Sağlık eğitimindeki Trumble derlemesi: 56 çalışma, 63 deney; 43 deneyde olumlu anlamlı sonuç, yöntemler heterojen. [S1] | [T] Yanıtı açıklamadan önce üretme; farklı günlerde yeniden sorma | Bu uygulama veya TUS üstünlüğü gösterilmedi. Gecikmeli ipucusuz yanıt ve toplam emek ölçülür |
| Kendi açıklamasını üretme [B]. Bisra meta-analizi farklı alanlarda yarar bildirir; erişim özet düzeyinde. [S2] | [T] Mekanizma hedeflerinde kısa neden sorusu ve belirli değerlendirme ölçütleri | Her soruya uzun yazı eklenmez. Ek sürenin sonraki görev başarısına değip değmediği sınanır |
| Geri bildirim [B]. Wisniewski meta-analizinde etki, içerik ve bağlama göre değişir. [S3] | [T] Yanlış seçenekle ilgili kısa düzeltme; gerekiyorsa karşılaştırma/örnek; ardından ayrı alıştırma | “Açıklama okundu” başarı değildir. Sonraki görevde aynı hatanın tekrarı izlenir |
| Yeni bağlama aktarım [B]. Pan–Rickard meta-analizi aktarımın mümkün fakat koşullara bağlı olduğunu gösterir. [S4] | [T] Eğitim ailesinden ayrı tutulmuş görevlerle uygulama kontrolü | Yalnız sözcükleri değişmiş soru yeni aile sayılmaz. İlk karşılaşma, gecikme ve payda gösterilir |
| Kısa ön yoklama [B]. Latimier çalışması belirli metin/deney koşullarında ön test ve son testi inceler. [S5] | [T] Bilmeyen kullanıcıyı kısa yoklamadan sonra öğretime geçirme | TUS veya bu oturum için optimum protokol değildir. Uzun başarısız soru dizisi yapılmaz; kullanıcı öğretime doğrudan geçebilir |
| Kaynak yanında kısa öğretim ve kademeli destek | [T/H] Önce açıklamalı örnek, sonra eksik adımı tamamlama, sonra bağımsız görev | İlk plandaki öğretim tasarımı yaklaşımı korunur; bu tur ayrı yeni etkinlik iddiası yok. Desteğe ihtiyaç duymayan atlayabilir |
| Karışan kavramları karşılaştırma | [T/H] Seçilmiş iki kavramın ayırıcı özelliği; ardından karışık olgu | Rastgele ders karıştırma önerilmez. Özel interleaving meta-analizinin güncel yöntemleri bu tur doğrulanmadı; evrensel fayda iddiası yok |

Sabit “en iyi çalışma süresi”, herkes için aynı 1–3–7 gün kuralı veya beynin öğrenme tipini belirleyen test yok. Sürüm varsayımları, bilimsel sabit olarak sunulmayacak.

## Ürün örneklerinden alınacak fikirler

Aşağıdaki özellikler resmi yardım belgelerinde doğrulandı; abonelik arkasındaki içerik incelenmedi ve ürünler canlı kullanıcı testiyle karşılaştırılmadı. Bu tablo [Ü] ürün davranışını ve bizim [T] tasarım çıkarımımızı ayırır.

| Örnek | Belgelenmiş davranış | Bizim revizyonumuz için çıkarım | Taşınmayacak yük / iddia |
|---|---|---|---|
| Anki | Soru → cevap → değerlendirme; sonraki gösterim aralığı görünür; FSRS ve günlük limit ayarları mevcut | Tek çalışma kuyruğu, gerçek sonraki tekrar, ayrıntıları gizlenmiş zamanlayıcı | İlk ekranda parametre/preset yığını; kart derecesinden kavram ustalığı çıkarımı |
| AMBOSS | Konu makalesinden ilgili soru oturumu başlatma; yanlışla ilişkili metni işaretleme; bağlantılı bilgiye erişim | Kaynak ile soruyu birleştirme; yanlış sonrası ilgili açıklamayı gösterme | Bütün makaleyi zorunlu okuma, çok sayıda başlangıç filtresi; tek doğruyla öğrenme tamamlandı varsayımı |
| RemNote | Belgeye özel veya genel çalışma kuyruğu; zamanı gelen kartlar; not bağlamıyla çalışma | Hazır içerikte tek Çalış girişi; gerektiğinde hedefin konu bağlamı | Öğrenciye kart yazım sözdizimi/çok sayıda kart türü yüklemek; AI açıklamasını tıbbi kaynak saymak |

Kaynaklar: [Anki çalışma akışı](https://docs.ankiweb.net/studying.html), [Anki tekrar ayarları](https://docs.ankiweb.net/deck-options.html), [AMBOSS kaynak–soru bağlantısı](https://support.amboss.com/hc/en-us/articles/360035199871-Feature-Overview), [AMBOSS oturum oluşturma](https://support.amboss.com/hc/en-us/articles/360032477132-Creating-a-Qbank-session), [RemNote çalışma kuyruğu](https://help.remnote.com/en/articles/6022755-getting-started-with-spaced-repetition), [RemNote kart oluşturma](https://help.remnote.com/en/articles/6025481-creating-flashcards).

Bu örneklerden çıkan ortak tasarım önerisi: kullanıcı hangi içeriğin ne zaman çalışılacağını yönetmek için uygulamalar arasında gezinmek zorunda kalmasın. Bu kolaylığın bizim TUS akışındaki faydası ayrıca ölçülecek. Özellikle ürün belgelerindeki geniş başarı/hatırlama vaatleri bilimsel kanıt tablosuna aktarılmadı.

## 3. Yeni ilk sürümün tamamlanmış kullanıcı deneyimi

**İlk ekranda:** “Bugün çalış” → bir önerilen oturum → “Başla / Devam et”. Süre son seçimden gelir; ilk kullanımda değiştirilebilir yaklaşık 15 dakika varsayılır. Süre değiştirme zorunlu karar değildir. Hazır konu varsayılandır; konu değiştirme isteğe bağlıdır. Uzun profil formu, dosya yükleme ve kart yazma zorunlu değildir.

İlk anlamlı paket için öneri: tiroid ekseni çevresinde üç öğrenme hedefi. Bu konu seçimi önceki planın örneklerini devam ettiren geri alınabilir ürün kararıdır; tüm TUS'u temsil etmez. Hedefler: temel yapı–hormon ilişkisini hatırlama; geri bildirim mekanizmasını açıklama; verilen bulgularda primer/merkezi örüntüyü ayırt etme. Bu belge soru anahtarı veya tıbbi yayın onayı içermez.

Paket: **3 hedef, hedef başına 3 eğitim görevi ve 1 ayrı kontrol görevi: toplam 9 eğitim + 3 kontrol**; ayrıca kısa kaynak açıklamaları, bir açıklamalı örnek ve gerekli karşılaştırmalar. 0.1'in 9 görev sınırına kontrol deneyimini görünür kılmak için 3 ayrı görev eklenir. Hepsinin ilk oturumda bitirilmesi gerekmez. Sonraki genişleme, ana plandaki 12 hedef / 36 eğitim + 12 kontrol sınırına bağlıdır.

Yaklaşık 10–15 dakikalık bir ilk oturum, sadece denenebilir bir başlangıç tasarımıdır. Öğrencinin hızı ve seçilen kapasiteye göre tamamlanan görev sayısı değişir. Kontrol günleri ilk oturumun süresine sıkıştırılmaz.

| Aşama | Kullanıcının gördüğü | Uygulamanın yapacağı |
|---|---|---|
| Başlangıç | Konu, tahmini süre, tek cümle amaç | Mevcut kanıt yoksa kısa yoklama veya öğretime doğrudan giriş |
| İlk yanıt | Tek soru, uygun yanıt biçimi, Bilmiyorum | Yanıtı ve isteğe bağlı güveni açıklamadan önce kaydet |
| Öğretim gereği | Kısa kaynaklı açıklama / açıklamalı örnek | Hatanın kesin nedenini iddia etmeden uygun destek sun |
| Alıştırma | Eksik adımı tamamlama veya farklı örnek | Destekli doğruyu bağımsız kanıttan ayır |
| Aynı oturumda yardımsız alıştırma | Açıklama kapalı, yeni eğitim görevi | Eğitim alıştırması olarak kaydet; aynı oturum olduğu için gecikmeli öğrenme veya ayrılmış kontrol sonucu sayma |
| Oturum sonu | Yapılanlar, açık kalan ayrım, sonraki tekrar tarihi | Tekrar oluştur; bitmeyeni açıkça ertele |
| Sonraki geliş | Bugünkü tekrar ve zamanı gelen yeni kontrol | Gerçek gecikmeyi, önceki karşılaşmayı ve desteği birlikte raporla |

**Gecikme sözleşmesi:** İlk pilotta ayrılmış kontrol için en az 7 tam gün, ürünün değiştirilebilir raporlama/ölçüm eşiğidir; bilimsel optimum değildir. Hedefe son ilgili karşılaşma, kontrolün en erken uygunluk zamanı ve soru ailesinin görülmüş olup olmadığı saklanır. Arada aynı hedef tekrar çalışılırsa gerçek gecikme yeniden hesaplanır; kısa aralık 7 günmüş gibi sunulmaz. Sürekli tekrar kontrolü öteleyebilir; uygulama bunu açıklar. Kontrolü erkene çekmek isteyen kullanıcı eğitim alıştırmasına geçebilir, fakat o görev artık görülmemiş kontrol olarak kullanılamaz. Testlerde zaman ilerletme, gerçek kullanıcıda 7 günlük öğrenme gözlemi sayılmaz. Sonuç etiketi “7 gün sonra 1 yeni görevde doğru” gibi dar kalır; üç sorudan genel yeterlik sonucu çıkarılmaz.

## 4. Yanıta göre öğretim sözleşmesi

| Gözlem | İlk eylem | Sonraki görev | Asla yapılmayacak çıkarım |
|---|---|---|---|
| Bilmiyorum; önceki başarı yok | Kısa kaynak ve örnek | Destekli tamamlama | “Unuttun” veya “başarısızsın” |
| Önceden bağımsız doğru, şimdi hatırlayamıyor | Kısa düzeltme ve yeni tekrar zamanı | İpucusuz yeniden hatırlama | Tek hatadan kavram yanılgısı teşhisi |
| Benzer iki seçenek arasında hata | Ayırıcı özelliği göster; kısa karşı örnek | Farklı eğitim ailesinden olgu | Her yanlışı aynı açıklamayla geçiştirme |
| Sonuç doğru, neden eksik | Eksik bağlantıya yönelik açıklama | Kısa neden / eksik adım | Sonuç doğrusunu mekanizma başarısı sayma |
| Doğru ama tahmin ettiğini söylüyor | Gereksiz uzun öğretim yok | Daha sonra kısa bağımsız kontrol | Tahmini otomatik yanlış puanlama |
| Emin olduğu halde yanlış | Önce anahtar/kaynak kontrol bağlantısı | Geçerli anahtar varsa onarım | Kullanıcıyı tek cevaptan yanlış inanç sahibi ilan etme |
| Anahtar itirazı / kaynak çelişkisi | Öğeyi incelemeye al; başka göreve geç | İnceleme tamamlanana kadar nötr | Tartışmalı sonucu öğrenme planına kesin veri yapmak |

İlk sürüm bu dalları açık kurallarla yürütür; LLM'nin kişiyi teşhis etmesine veya serbest cevabı otorite gibi puanlamasına ihtiyaç yoktur. İçerik yazarları yanlış seçeneklerin hangi ayrımı sınadığını yazar; bir yanlış seçenek tek başına o hatanın kesin nedeni sayılmaz. Kullanıcı “Bu açıklama bana uymadı” diyerek başka desteği seçebilir.

## 5. Yanıt biçimi ve ölçme

Tablette her soruda metin yazmak zorunlu olmayacak. Olgu/ayırt etme için tek-en-iyi-yanıt; kısa bilgi için kısa yanıt; seçili mekanizma için bir–iki cümle veya nedensel sıralama kullanılacak. Soru formatları arasındaki performans tek puanda birleştirilmeyecek.

- Yanıt gönderimi kalıcı kayıt oluşturur. Sayfa kapanırsa o yanıt kaybolmaz; devam edilen soru kimliği korunur.
- Önceden belirlenmiş anahtarlı seçenek sorusu doğrudan puanlanabilir. Kısa cevapta yalnız incelenmiş eş anlamlılar eşlenir; belirsiz yazım otomatik yanlış olmaz.
- Mekanizma açıklamasında örneğin 2–3 açık ölçüt sunulur. Kullanıcının kendi işaretlemesi öz değerlendirmedir; bağımsız uzman değerlendirmesi gibi gösterilmez.
- Güven kaydı cevap görülmeden alınır; normal eğitimde isteğe bağlıdır. “Eminim / emin değilim / tahmin” keyfi yüzdeye çevrilmez.
- Soru kökünü görmek, ipucu, yanıt, kaynak ve alıştırma ayrı karşılaşmalardır. Yalnız cevap açılışını kaydetmek yeterli değildir.
- Tekrar doğruluğu, ilk görülen görev doğruluğu, gecikmeli yanıt ve destekli performans ayrı kalır. İlk örneklemde “ustalık yüzdesi” gösterilmez.

## 6. Gerçek tekrar takvimi ve günlük seçim

Kullanılabilir revizyonda gerçek bir zamanlayıcı zorunludur. Hazır FSRS kütüphanesi, olgusal hatırlama öğeleri için sürümlü uyarlayıcıyla kullanılacak; basit sabit aralık yöntemi yalnız karşılaştırma/test referansı olarak korunacak. Kütüphane sürümü uygulama başında seçilip kilitlenecek. FSRS'nin varlığı bu ürünün TUS üstünlüğünü kanıtlamaz. Resmi Anki belgesi algoritmayı ve ayarlarını açıklar; bilimsel etki kanıtı olarak kullanılmaz. [Ü/P1]

Soru doğruluğu, öz değerlendirme ve FSRS notu aynı alan olmayacak. İlk öğrenme veya çözümü görmüş olma bağımsız hatırlama gibi derecelendirilmeyecek. Hatırlayamama ve güçlükle de olsa doğru hatırlama açıkça ayrılacak. Çok hedefli olgu sonucu bütün hedeflerin tekrar tarihini topluca değiştirmeyecek. Mekanizma/ayırt etme alıştırmaları öğretim planında ayrı tutulacak.

Günlük plan: ilk öğrenme, zamanı gelen hatırlama, hedefli onarım ve ayrı kontrol arasından süreye sığan işler. Kullanıcıya sadece kısa gerekçe görünür. Kontrol görevleri kendi takvim/sızıntı kurallarına bağlıdır. İncelenmemiş içerik hiçbir havuza alınmaz. Süre yoksa plan boştur; yanlış yanıt oluşturulmaz. Ara sonrası bütün borç tek güne yüklenmez. Kullanıcı erteleyebilir; erteleme öğrenme olayı değildir.

Takvim ve gün sınırı uygulamanın kayıtlı yerel saat diliminde tutarlı hesaplanır; geçmiş olaylar UTC ile saklanır. Saat dilimi/algoritma değişimi geçmişi sessizce yeniden yazmaz. Gün geçişi, 0 dakika, uzun ara ve saat değişimi kabul örnekleri arasında olacak.

## 7. Arayüz revizyonu

Görsel yön: sakin bir çalışma yüzeyi; güçlü okunabilirlik, az metin ve tek ana eylem. Bilimsel gerekçeler “Bu çalışma neden önerildi?” ayrıntısında erişilir; ana ekranda makale özeti veya teknik terim duvarı olmaz.

| Yüzey | İlk görünenler | İkinci plandakiler |
|---|---|---|
| Bugün | Konu / süre / tek önerilen oturum / Başla veya Devam et | Ayrıntılı plan gerekçesi, diğer konular |
| Çalışma | Tek soru veya öğretim adımı; ilerleme; ara ver | Kaynak, gerekçe, anahtar itirazı |
| Gözden geçir | Gecikmeli hatırlama ve yeni soru sonuçları, somut paydalar | Ham olay günlüğü, teknik sürümler |
| Konular / Ayarlar | İncelenmiş paket seçimi; gerektiğinde yedek | İlk oturumda zorunlu gezinme yok; içerik editörü çalışma alanında bulunmaz |

Örnek ana ekran metni: “Bugün çalış · Tiroid ekseni · Yaklaşık 12 dakika · Önce kısa bir yoklama, gerekiyorsa açıklama · Başla.” Süre ve içerik örnektir; gerçek planla doldurulur.

Arayüz bütçesi: normal girişte tek Başla/Devam et eylemi; soru başına yanıt ve gönderim; güven zorunlu değil. Süre/konu değiştirme ve erteleme ikincil eylemdir. Kaynak ve itiraz yalnız ilgili soruda açılır; teknik ayarlar ilk kullanımdan çıkarılır. Bu bütçe tasarım tercihi olarak kullanıcıyla sınanır.

Çalışma sırasında yan panel kapanır. Kaynak doğru cevabı açığa çıkarıyorsa açılışı yardım olarak kaydedilir. Dokunma, klavye ve büyütülmüş yazı desteklenir. İlerlemede yalnız renk kullanılmaz. Yedek hatası gibi eylem gerektiren durumlar görünür; tekrarlayan “bu bağımsız kanıt değildir” metinleri her ekranda kullanılmaz, sonuç etiketi ve açıklamasına taşınır.

## 8. Hazır içeriği hazırlama sorumluluğu

İçerik, geliştirme ekibinin teslimidir. Yazma, inceleme, hak yönetimi ve kontrol bankası düzenleme ayrı geliştirici/inceleyici alanında yürütülür. Mevcut kişisel kart verisi korunur; 0.2 öğrenci akışının başlangıcı editör olmaz. Öğrenciden boş editörü doldurması beklenmez. Önce 3 hedeflik paket için kaynak paragrafları, özgün sorular, anahtar, ölçüt, açıklama, yanlış seçenek gerekçesi, aile ve hak bilgisi hazırlanır. İnsan inceleyiciye bu somut paket sunulur; kullanıcıya “önce bütün içerikleri sen yaz” denmez.

Tıbbi yayın öncesi kaynak doğruluğu ve insan inceleme kaydı gerekir. Kullanıcının hekim olması kendiliğinden içerik onayı değildir. Hazır tıbbi paket inceleme bekliyorsa kurgusal veri teknik testte kalır; ürün teslimi tıbbi pilot hazırmış gibi sunulmaz.

Kontrol sorularının yazılması veya incelenmesi de karşılaşmadır. Öğrenci aynı zamanda kontrol sorularının yazarı/inceleyicisiyse bu sorular “ilk kez görülen bağımsız kontrol” sayılmaz; ayrı incelenmiş bir paket/inceleyici gerekir veya ilk karşılaşma ölçümü açıkça devre dışı bırakılır. Kontrol bankası öğrenme listesinden, önerilerden ve kaynak önizlemelerinden sızmayacak. Bu erişim düzeni güvenlik sırrı değil ölçüm geçerliği kuralıdır.

Telifli soru bankalarından soru/açıklama kopyalanmaz. Ticari ürünlerden alınan şey akış fikridir. Tıbbi güncelleme/anahtar düzeltmesi eski yanıtı silmez; etki analizi ve yeniden türetim ayrı kaydedilir.

## 9. Geliştirme sırası ve kabul

Aşağıdaki R etiketleri bu planın iş paketleridir; mevcut TUS görev kimliklerinin yerine geçmez. Aktif backlog'a uygulama kararı sırasında bağımlılıklarıyla aktarılır. Bu tur hiçbir ürün işi tamamlandı sayılmaz.

| Sıra | İş paketi | Teslim | Geçiş ölçütü |
|---|---|---|---|
| R1 | Tek hedefin öğretim ve içerik sözleşmesi | Bilinmeyen, yanlış, doğru ve itiraz yolları; kaynaklı taslak | Her yolun sonraki adımı belli; insan içerik incelemesi için somut paket hazır |
| R2 | Ekran ve dağıtım taslağı | Tek oturum ekranları; seçilmiş Android teslim yolu; açılış/güncelleme/geri dönüş akışı | Kullanıcıya birden çok teknik kurulum seçtirmeyen uygulanabilir yol; arayüz kararı anlaşılır |
| R3 | Tek hedefin tam dikey dilimi | İçerik onayı sonrası başlatma, yanıt, onarım, kapanış, kaldığı yerden dönüş, gerçek tekrar, ayrı gecikmeli kontrol, sonuç ve Android açılışı | Bütün döngü gerçek cihazda kullanılabilir; zaman geçişleri ayrıca teknik testle sınanmış; gerçek gecikmeli öğrenme sonucu yalnız zamanı geldiğinde raporlanır |
| R4 | Üç hedefe genişleme | 9 eğitim + 3 kontrol; tüm görev türleri; 0.1 verisinin güvenli geçişi | R3 kullanıcı akışı kabul edilmiş; kişisel kayıtlar/öz değerlendirmeler anlam değiştirmemiş |
| R5 | Birleşik kullanılabilirlik ve sağlamlık | Tablet yönü/klavye/çevrimdışı/güncelleme/yedek senaryoları | Yeni kapsamda yardımsız çalışma; kritik veri/cihaz hatası yok; ilk cihaz testi bu aşamaya ertelenmez |
| R6 | Kısa karşılaştırmalı pilot | Aynı emekle mevcut yöntem ve revizyon gözlemleri | Kullanışlılık ve öğrenme bulguları ayrı raporlanmış |

R1–R2 sırasında yeniden bütün uygulama yazılmaz. Her dilim hem ürün davranışı hem veri doğruluğu açısından incelenir. Arka uç testleri geçip kullanıcı akışı anlaşılmıyorsa kullanılabilir sürüm kapısı kapanmış sayılmaz. Kullanıcının v0.1 deneyimi nedeniyle yalnız renk/panel düzeni düzeltip ilerlemek yeterli değildir.

## 10. Kabul senaryoları ve ölçümler

1. İlk açılıştan hazır oturuma en fazla iki karar adımıyla girilir; dosya veya kart hazırlama gerekmez. Bu bir tasarım hedefidir, bilimsel eşik değildir.
2. Bilmiyorum yanıtı öğretime yönlenir; sonraki adım yalnız “bir başka zor soru” olmaz.
3. İki kavramı karıştıran kullanıcı kısa karşılaştırma ve farklı alıştırma görür; anahtar itirazı ayrı işlenir.
4. İpucu veya kaynak açılan görev bağımsız/yardımsız başarı sayılmaz. Yanıtı görmek önceki yanıtı değiştirmez.
5. Oturum kapanıp uygulama yeniden açıldığında kayıtlı yanıt ve devam noktası korunur.
6. Gerçek takvim ilerlediğinde zamanı gelen tekrar görünür. Boş gün kayıt üretmez; kapasite düşüşü anlaşılır erteleme oluşturur.
7. Kontrol ailesi daha önce açılmışsa yeni görev başarısı etiketi verilmez; aynı oturum onarımı gecikmeli öğrenme sayılmaz.
8. Android tablet yatay/dikey, ekran klavyesi ve büyütülmüş yazıyla çalışır; çevrimdışı yeniden açılış ve yedek geri alma cihazda sınanır.
9. 0.1 yedeğindeki kurgusal kayıtlar ayrı kalır. Önceki öz değerlendirmeler yeni sürümde nesnel başarıya dönüştürülmez. Geçişte yedek ve geri dönüş yolu doğrulanır.
10. Kullanıcı “Şimdi ne yapacağım?” ve “Bu neden önerildi?” sorularını yardım almadan cevaplayabilir. Hangi ekranda takıldığı kaydedilir; bunun yerine teknik test sayısı sunulmaz.

Kullanılabilirlik: başlama adımı/süresi, gereksiz gezinme, yazma yükü, yardım isteme, yarım bırakma, kaynak hazırlama dahil toplam emek. Öğrenme: gecikmeli ipucusuz doğruluk, ayrı ailede ilk deneme sonucu, tekrarlayan hata, açıklama ölçütleri ve gerçek gecikme. Gözlem/beyan ayrımı korunur.

İlk 1–2 haftalık kullanım yalnız uygulanabilirlik ve ölçüm akışını sınar; etkinlik kanıtı değildir. Daha sonraki pilotta benzer hedef kümeleri yöntemlere önceden atanır, çalışma süresi/ön bilgi/görev türü kaydedilir, değerlendirme aileleri ayrılır. Aynı soruyu iki yöntemde çalışıp sonuçları bağımsız karşılaştırma saymayız. Az sayıda hedef ve tek kişi ile istatistiksel kesinlik/puan artışı iddiası kurulmaz. Karmaşıklık artıp yeni görev sonucu veya yönetim maliyeti iyileşmiyorsa ilgili özellik kaldırılır.

## 11. Şimdilik eklenmeyecekler

Tam kitap OCR/RAG otomasyonu, sürekli sohbet asistanı, otomatik tıbbi yayın, kişisel öğrenme stili testi, rozet/seri baskısı, büyük bilgi grafı, TUS puanı tahmini, çok cihaz eşzamanlama ve Mac kabuğu. Görsel maskeleme sonraki anatomi pilotunda değerlendirilebilir; her bilginin zorla karta çevrilmesi gerekmez.

Android ilk hedef olmaya devam eder. Dağıtım kararı R2 sırasında, ilk gerçek dikey dilimden önce verilecek: sadece HTML indirmek bazı Android tarayıcılarında güvenilir açılış sağlamıyor. Cihazda basit açılış, çevrimdışı yeniden açılış, güncelleme sırasında kaydın korunması ve sürüm geri dönüşü kabul ölçütleridir. HTTPS üzerinden ilk kurulum/PWA veya paketli Android seçenekleri bu hedefe göre değerlendirilecek; yeni barındırma, ücret veya açık yayın bu planla otomatik yetkilendirilmiş sayılmaz. Yerel sunucu geliştirici denemesi için kalabilir, uzun vadeli kullanıcı akışının zorunlu parçası yapılmaz.

## 12. Kaynaklar ve erişim sınırı

10 Eylül 2026 erişimleri. Kaynaklar yalnız yanlarında açıklanan iddiaları destekler; bu yazılımın eğitimsel etkinliği ayrıca sınanmalıdır.

- **S1:** Trumble ve ark., *Systematic review of distributed practice and retrieval practice in health professions education*, 2024 (çevrimiçi 2023). Tam HTML, özet/sonuçlar/sınırlılıklar. [Kaynağı aç](https://link.springer.com/article/10.1007/s10459-023-10274-3)
- **S2:** Bisra ve ark., *Inducing Self-Explanation: a Meta-Analysis*, 2018. Yayıncı özeti/önizleme; tam yöntem erişilmedi. [Kaynağı aç](https://link.springer.com/article/10.1007/s10648-018-9434-x)
- **S3:** Wisniewski ve ark., *The Power of Feedback Revisited*, 2020. Tam HTML, özet ve etki heterojenliği. [Kaynağı aç](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.03087/full)
- **S4:** Pan ve Rickard, *Transfer of test-enhanced learning*, 2018. Önceki turda doğrulanan yayıncı/PubMed özeti; bu tur doğrudan PubMed açılışı boş döndü; tam metin okundu iddiası yok. [Kaynağı aç](https://doi.org/10.1037/bul0000151)
- **S5:** Latimier ve ark., *Does pre-testing promote better retention than post-testing?*, 2019. Yayıncı HTML ilk erişimi; takip erişiminde teknik hata. Ana planın sınırlı bulgusu korundu. [Kaynağı aç](https://www.nature.com/articles/s41539-019-0053-1)
- **P1:** Anki resmi kullanım belgesi, *Deck Options*. Algoritma/ayar davranışı; öğrenme etkinliği deneyi değildir. [Kaynağı aç](https://docs.ankiweb.net/deck-options.html)