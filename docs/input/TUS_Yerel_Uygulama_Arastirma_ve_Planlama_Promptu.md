# TUS için yerelde çalışan, araştırma temelli öğrenme uygulaması
## Üst düzey modele verilecek araştırma ve ürün planlama promptu

Sen; öğrenme bilimleri, bilişsel psikoloji, bellek araştırmaları, tıp eğitimi, ölçme-değerlendirme ve yerel yazılım mimarisi perspektiflerini birlikte kullanarak çalışacaksın.

TUS'a hazırlanan bir kişinin sınırlı çalışma zamanını daha iyi kullanmasına yardımcı olacak, yerelde çalışan bir uygulama geliştirmek istiyorum. Şu an senden uygulamayı kodlamanı değil; literatürü araştırarak bilimsel gerekçesi, ürün kapsamı, öğrenme mekanizmaları, teknik mimarisi ve doğrulama yöntemi belirlenmiş bir geliştirme planı hazırlamanı istiyorum.

Amacım; gösterişli bir panel, genel bir sohbet botu, yalnızca PDF özetleyici veya başka bir kart uygulamasının kopyası değil. Kullanıcının neyi gerçekten bildiğini, neyi unuttuğunu, neyi yanlış anladığını ve bilgisini yeni sorulara ne ölçüde aktarabildiğini değerlendirerek bir sonraki çalışma eylemini gerekçelendiren bir sistem istiyorum.

Başarıyı uygulamada geçirilen süre, üretilen kart sayısı veya günlük seri uzunluğu üzerinden tanımlama. Öncelikli sonuçlar; gecikmeli hatırlama, önceden görülmemiş TUS benzeri sorularda performans, uygun hız-doğruluk dengesi ve sürdürülebilir çalışma yükü olsun. Kesin puan artışı vaat etme.

## 1. Çalışma sınırları ve varsayımlar

Bu aşamada üretim kodu yazma. Gerektiğinde karar tablosu, veri modeli taslağı ve sözde kod kullanabilirsin. Önce problemi, kanıtı ve kapsamı netleştir; teknoloji seçimini bunlardan türet.

Başlangıç kapsamını tek kullanıcılı, kişisel kullanıma yönelik bir ürün olarak ele al. Çok kullanıcılı platform, sosyal ağ, abonelik sistemi ve büyük içerik pazaryeri tasarlama.

Hedef işletim sistemi, donanım, sınav tarihi, başlangıç düzeyi, hedef puan, günlük süre ve kaynak formatları verilmemişse bunları açık varsayım olarak belirt. Kullanıcının kendisinin sınava hazırlandığını veya belirli bir cihaza sahip olduğunu varsayma. Nöbetli çalışan ve tam zamanlı hazırlanan iki örnek kullanıcı profiliyle tasarımın dayanıklılığını sınayabilirsin; bunları gerçek kullanıcı verisi gibi sunma.

Eksik bilgiler yüzünden çalışmayı durdurma. Makul bir başlangıç planı çıkar; sonunda yalnızca mimariyi veya öğrenme yaklaşımını gerçekten değiştirecek soruları belirt.

## 2. Kanıt standardı: bilimsel bulgudan ürün kararına

Araştırma yaparken güncel literatürü ve temel çalışmaları birlikte incele. PubMed, ERIC ve erişebildiğin akademik veri tabanları ile yayıncıların makale sayfalarını kullan. Sistematik derlemeleri ve meta-analizleri, ilgili kontrollü deneyler ve tıp eğitimi çalışmalarıyla birlikte değerlendir. Blogları veya ürün pazarlamasını birincil bilimsel dayanak yapma.

Hangi kaynaklarda, hangi tarihte ve hangi arama terimleriyle araştırma yaptığını kısaca raporla. Erişmediğin veri tabanında tarama yapmış gibi davranma. Tam metne erişemediğin bir araştırmadan yöntem ayrıntıları çıkarma; yalnızca özetine eriştiğini belirt. Gerçek bir sistematik derleme yapmadıysan çıktını öyle adlandırma.

Her önemli bulgu için şu ayrımları koru: araştırma deseni; katılımcı grubu; öğrenilen materyal; karşılaştırma koşulu; eşit çalışma süresi kullanılıp kullanılmadığı; testin gecikmesi; aynı veya yeni sorularla ölçüm; varsa etki büyüklüğü ve belirsizliği; sınırlılıklar. İstatistiksel anlamlılığı eğitimsel olarak önemli kazançla eşitleme. Birkaç olumlu çalışma sayarak etkiyi kanıtlanmış ilan etme.

Kanıtın gücünü ve TUS'a uygulanabilirliğini ayrı değerlendir. Laboratuvardaki kelime öğrenme deneyini, tıp öğrencilerinde bilgiyi hatırlamayı ve TUS performansını aynı sonuç gibi sunma. Öğrenme tercihleri ile belirli bir öğretim yönteminden daha fazla yararlanma iddiasını da ayır.

Sinirbilimsel mekanizma, davranışsal öğrenme etkisi, belirli bir yazılım özelliğinin yararı ve kişiye özel algoritmanın başarısı farklı kanıt gerektirir. Bir beyin mekanizmasının varlığı, o mekanizmanın adıyla sunulan uygulama özelliğini kendiliğinden doğrulamaz.

Her ana özellik için şu zinciri oluştur:

**Kaynak → gözlenen bulgu → geçerlilik sınırı → öğrenme ilkesi → önerilen ürün davranışı → ölçülebilir kabul ölçütü.**

Bilimsel bulgu, tasarım çıkarımı ve henüz sınanmamış hipotezi açıkça etiketle. “Güçlü”, “orta”, “sınırlı/çelişkili” gibi kendi değerlendirme kategorilerini kullanırsan ölçütlerini tanımla; bunları resmî bir kanıt derecelendirmesi gibi sunma. Kaynak veya DOI uydurma. Kanıt bulamadığında bunu belirt ve özelliği buna göre sınırla.

## 3. İncelenecek araştırma alanları

### 3.1. Aktif hatırlama ve testle öğrenme

Retrieval practice, testing effect, generation effect ve successive relearning çalışmalarını incele. Serbest hatırlama, kısa cevap, boşluk doldurma, görsel üzerinde hatırlama ve çoktan seçmeli soruların farklı öğrenme amaçlarına uygunluğunu değerlendir. Hiç öğrenilmemiş içerikte ön test ile öğrenilmiş bilgiyi geri getirmeyi birbirine karıştırma.

Uygulama kullanıcıya cevabı göstermeden önce hangi zihinsel eylemi yaptırmalı? Hatırlayamama sonrası ne tür öğretim veya geri bildirim gelmeli? Bir soruyu hemen yeniden doğru yapmak neden bağımsız bir uzun süreli öğrenme ölçümü sayılmamalı? Bu soruları araştırmaya dayanarak yanıtla. Her bilgi parçasını karta dönüştürmeyi peşinen doğru kabul etme.

### 3.2. Aralıklı çalışma ve bellek modelleme

Spacing effect, dağıtılmış çalışma, geri getirme aralıkları, yeniden öğrenme ve hedeflenen hatırlama tarihini incele. Sabit, genişleyen ve uyarlamalı tekrar aralıklarının hangi koşullarda değerlendirildiğini karşılaştır.

“Aralıklı çalışma yararlıdır” bulgusu ile “şu algoritma TUS için en iyisidir” iddiasını ayır. Basit bir zamanlayıcıyı, SM-2/FSRS gibi mevcut yaklaşımları ve yeni bir model geliştirmenin maliyetini karşılaştır. Kullanılan algoritmanın güncel teknik belgelerini doğrula; belgeleri eğitimsel etki araştırması yerine koyma.

Kartın hatırlanma olasılığı, kavramı anlama, klinik bağlamda uygulama ve sınav puanı aynı değişkenler değildir. Hedef hatırlama düzeyiyle tekrar iş yükü arasındaki değiş tokuşu; sınava kalan süreyi; yeni içerik için ayrılacak zamanı ve veri azlığında kişiselleştirmenin sınırlarını planla. Evrensel bir “1-3-7-21 gün” takvimini biyolojik yasa gibi sunma.

### 3.3. Karışık alıştırma ve benzer kavramları ayırt etme

Interleaving, blocking, discrimination learning ve interference literatürünü incele. Rastgele ders değiştirmek ile birbirine karışan kavramları karşılaştırmalı çalışmak arasındaki farkı açıkla.

Benzer hastalıklar, ilaç sınıfları veya mekanizmalar arasında ayırıcı özellikleri çalıştıran görevler değerlendir. Başlangıç öğrenmesinde bloklu çalışma, sonraki aşamada karışık alıştırma gibi geçişlerin gerekçesini araştır. Henüz ön bilgisi olmayan kullanıcıya sürekli karışık zor soru vermeyi otomatik olarak yararlı kabul etme.

### 3.4. İlk öğrenme, bilişsel yük ve öğretim tasarımı

Working memory, cognitive load, worked examples, scaffolding, guidance fading ve expertise reversal araştırmalarını incele. Uygulama yalnızca bildiklerini tekrar ettiren değil, henüz anlamadığı içeriği öğrenmesine de yardımcı olan bir sistem olmalı.

Kısa kaynak çalışması, çözülmüş örnek, kısmen tamamlanmış çözüm, kendi çözümü ve bağımsız hatırlama arasında hangi geçişlerin kullanılacağını belirle. Görsel-metin bütünleşmesi, gereksiz bilgi ve arayüz yükünü azaltma yaklaşımlarını değerlendir. Sabit çalışma belleği sayılarından ekran başına kesin öğe sınırı türetme.

### 3.5. Anlamlandırma, şemalar ve tıbbi akıl yürütme

Self-explanation, elaborative interrogation, causal understanding, schema formation, illness scripts ve temel bilim-klinik bilgi bütünleşmesini araştır.

“Doğru cevap nedir?” yanında “Neden?”, “Diğer seçenek neden uygun değil?”, “Hangi bulgu değişirse cevap değişir?” gibi görevleri değerlendir. Ezberlenecek olguyla mekanizması anlaşılacak süreç için farklı etkinlikler öner. Kavram haritalarını veya görselleri yalnızca kullanıcı yararı varsa kullan; sırf karmaşık göründüğü için zorunlu bir bilgi grafı kurma.

### 3.6. Üstbiliş ve öz düzenlemeli öğrenme

Metacognition, judgments of learning, confidence calibration, overconfidence, study allocation ve self-regulated learning araştırmalarını incele.

Kullanıcının “biliyorum” hissiyle gözlenen performansını karşılaştırmanın düşük zahmetli yollarını değerlendir. Yanıttan önce güven değerlendirmesi, tahmin ettiğini belirtme, gecikmeli kontrol ve kısa haftalık plan gözden geçirmesi aday araçlardır; her soruda uzun form doldurtma.

Yüksek güvenli yanlış yanıtın, düşük güvenli doğru yanıtın ve tutarlı doğru yanıtın nasıl farklı ele alınabileceğini açıkla. Bu işaretlerden otomatik psikolojik tanı veya kesin bilişsel neden üretme.

### 3.7. Geri bildirim ve hatadan öğrenme

Corrective feedback, explanatory feedback, feedback timing ve error correction çalışmalarını incele. Geri bildirimi yalnızca doğru cevabın gösterilmesi veya övgü olarak ele alma.

Bilgi eksikliği, kavram yanılgısı, benzer kavramları karıştırma, soruyu yanlış okuma, süre baskısı ve tahminle yanıtlama gibi hata türlerini operasyonel olarak tanımla. Bunları tek bir yanlış yanıttan kesin teşhis etme; kullanıcı beyanı ve sonraki gözlemlerle güncellenen hipotezler olarak tut.

Önerilen müdahale hata türüne göre değişmeli: hedefli kaynak okuma, karşılaştırmalı örnek, mekanizma açıklama, yeni bir uygulama sorusu veya gecikmeli tekrar. Bütün yanlışları aynı kart kuyruğuna atmak yeterli kabul edilmesin.

### 3.8. Transfer, soru kalitesi ve ölçme-değerlendirme

Transfer-appropriate processing, yakın/uzak aktarım, çoktan seçmeli madde yazımı, çeldirici kalitesi, test güvenirliği, içerik kapsamı, hız-doğruluk dengesi ve gerektiğinde madde tepki kuramını araştır.

Tekrar edilen soruda ustalaşma, yeni biçimde sorulan aynı bilgiyi kullanma ve gerçekten yeni bir problemi çözmeyi ayrı ölç. Tek kullanıcının küçük veri setinden güvenilir madde güçlüğü, yetenek parametresi, yüzdelik dilim veya kesin TUS puanı çıkardığını iddia etme. Uyarlamalı çalışmadaki doğru yüzdesini, farklı zorluktaki standart denemelerle doğrudan karşılaştırma.

### 3.9. Uyku, dikkat, yorgunluk ve sürdürülebilirlik

Uyku ve bellek konsolidasyonu, dikkat kesintileri, görev değiştirme, zihinsel yorgunluk, sınav kaygısı ve sürdürülebilir çalışma alışkanlıkları araştırmalarını değerlendir. Bunların uygulama kararlarına doğrudan mı, dolaylı mı dayanak olduğunu belirt.

Nöbet sonrası günler, kısa çalışma fırsatları, dinlenme ve kaçırılmış günler için kullanıcı kontrollü plan uyarlaması düşün. Kullanıcı beyanını biyometrik ölçüm gibi sunma. Sabit Pomodoro süresini veya “beynin en verimli olduğu saat” iddiasını herkese geçerli bilimsel yasa yapma. Tıbbi tedavi, takviye önerisi veya uyku bozukluğu tanısı ürün kapsamı dışında kalsın.

### 3.10. Öğrenme analitiği ve insan-bilgisayar etkileşimi

Knowledge tracing, bellek tahmini, belirsizlik kalibrasyonu, uyarlamalı öğretim, kullanıcı kontrolü ve dikkat dağıtmayan arayüz araştırmalarını incele.

Güzel bir grafik ile kullanıcının kararını değiştiren bilgi arasındaki farkı koru. Bir modelin gelecek yanıtı tahmin edebilmesi, en iyi öğretim müdahalesini seçtiğini kanıtlamaz. Kestirim doğruluğunu öğrenme kazancından ayrı sınamayı planla.

## 4. TUS'a özgü problem modeli

Güncel sınav yapısını, testleri, kapsamı, süreleri ve puan hesaplama esaslarını ilgili ÖSYM kılavuzundan doğrula; kaynağı ve sürümünü belirt. Doğrulayamadığın sayıları tahmin etme. Sınav kurallarını değiştirilebilir ve sürümlü tutmayı planla.

Ders, konu, öğrenme hedefi, bilgi parçası ve soru düzeylerini ayır. Derslere ilişkin resmî dağılımla geçmiş sorulardan tahmin edilen konu sıklığını aynı kesinlikte kullanma. Az sayıdaki yayımlanmış sorudan geleceğin sınavına kesin ağırlık türetme.

Tam TUS kapsamını tek seferde yapılandırmak yerine küçük ve temsil edici bir pilot kapsam öner. Pilot; bir doğrudan bilgi hatırlama, bir mekanizma anlama ve bir ayırıcı tanı/uygulama ağırlıklı içerik türünü sınayabilsin. Sınırlı pilotun bütün TUS için etkinlik kanıtı olmayacağını belirt.

Anatomi görselleri, fizyolojik mekanizmalar, farmakolojik ilişkiler ve klinik olgular için tek bir içerik şablonunun yeterli olup olmadığını değerlendir. Kullanıcının dışarıda kitap veya soru bankasıyla yaptığı çalışmanın düşük zahmetle kaydedilmesini düşün; uygulama dışındaki öğrenmeyi yok sayma veya gözlemlemiş gibi davranma.

## 5. Öğrenci modeli ve öğrenme döngüsü

Öğrenci modelinde doğrudan gözlemi, kullanıcı beyanını ve algoritmik tahmini ayrı sakla. En azından yanıt, doğruluk, zaman damgası, ipucu kullanımı, önceki gösterimler, soru ailesi, kaynak sürümü ve gerektiğinde güven değerlendirmesini düşün. Yanıt süresinin kesinti, okuma uzunluğu ve görev türünden etkilenebileceğini hesaba kat.

“Konu öğrenildi” durumuna tek doğru yanıtla geçme. Tahminle doğruluk, ipucuyla doğruluk, aynı oturumdaki tekrar, bağımsız gecikmeli başarı ve yeni soruya aktarımın nasıl farklı kanıt sağlayacağını tanımla. Veri azsa “yetersiz kanıt” gösterebil.

Ana döngüyü somutlaştır: kısa başlangıç değerlendirmesi → uygun ilk öğrenme veya alıştırma → yanıt → hedefli geri bildirim → kayıt → bir sonraki müdahale → gecikmeli bağımsız kontrol. Kullanıcının uzun açıklamaya ihtiyaç duymadığı kolay görevlerde gereksiz adımları atlayabilsin.

En az üç farklı öğrenme hedefi için örnek etkileşim akışı göster. Klinik bilgi veya soru üretirsen eğitim örneği olarak etiketle, kaynağını doğrula ve önerilen uygulamanın bu içeriği hangi kontrolden geçireceğini belirt.

## 6. Günlük planlayıcı: hangi işi, neden şimdi?

Planlayıcının amacını açıkça tanımla. Yalnızca tekrar kuyruğunu bitirmeye, yalnızca zayıfları çalışmaya veya yalnızca sık sorulan konulara odaklanmasın. Kalıcı öğrenme, kapsam, uygulama becerisi, sınava kalan süre ve sürdürülebilir yük arasındaki dengeyi gerekçelendir.

Yeni konu öğrenme, hatırlama tekrarı, kavram onarımı, ayırt etme alıştırması, zamanlı soru bloğu ve deneme analizi arasından nasıl seçim yapılacağını göster. Günlük kullanılabilir süreyi, içerik hazırlama maliyetini, görev sürelerinin belirsizliğini, minimum kapsamı ve biriken tekrar yükünü dikkate al.

Öncelik puanı veya beklenen öğrenme kazancı/dakika formülü önerirsen her değişkeni, ölçüm yöntemini ve katsayı kaynağını açıkla. Ölçülmemiş kazançları kesin sayıya dönüştürme. Sezgisel başlangıç katsayılarını açıkça işaretle ve duyarlılık analizi öner. Gözlemsel başarı geçmişinden nedensel olarak en iyi müdahalenin öğrenildiğini varsayma.

Açıklanabilir, basit bir başlangıç yaklaşımını daha karmaşık modele karşı kıyasla. Bir üst modele geçmek için hangi veri ve doğrulamanın gerektiğini belirt. Kullanıcıya “Bunu şimdi öneriyorum, çünkü...” açıklaması ve öneriyi değiştirme imkânı sun.

Kaçırılan bir günün bütün işlerini ertesi güne yığma. Kapasite aşımında hangi işlerin erteleneceğini, yeni içerik alımının nasıl değişeceğini ve vazgeçilen hedeflerin nasıl gösterileceğini tanımla. Çalışılmayan günü otomatik yanlış yanıt olarak kaydetme. Önerilen plan ile gerçekten yapılan çalışma ayrı kalsın.

`select_next_activity`, `update_learning_state` ve `replan_after_missed_days` için anlaşılır sözde kod veya karar tabloları ver. Bir örnek haftanın planını, gerçekleşen sapmaları ve yeniden planlamayı göster; sayısal değerleri örnek varsayım olarak etiketle.

## 7. İçerik edinimi, doğruluk ve yapay zekâ sınırı

İçeriğin nereden geleceği ürünün temel tasarım kararıdır. Kullanıcının yasal olarak kullanabildiği notlar, metinler, PDF'ler, görseller ve soru kayıtları için gerçekçi bir giriş yolu öner. Tüm kitapları otomatik olarak kusursuz ders malzemesine dönüştürmeyi ilk sürümün ön koşulu yapma. Seçilmiş metin veya elle girilen az sayıda doğrulanmış içerikle işe yarayan çekirdeği göster.

Kaynak kimliği, baskı/tarih, sayfa veya bölüm, kısa dayanak, lisans/kullanım durumu ve doğrulama durumu tutulmalı. PDF işlemede önce mevcut metin katmanını kullan; taranmış sayfalarda gerektiğinde seçici yerel OCR ve önizleme düşün. Özellikle tablolar, sayılar, birimler, olumsuz ifadeler ve görsel etiketleri için kontrol tasarla.

Yapay zekâ üretimini doğrulanmış kaynak bilgisiyle aynı seviyede gösterme. Taslak → kaynak kontrolü → içerik/cevap anahtarı incelemesi → onay → kullanıma açılma akışını tasarla. Kaynak getirmeyle desteklenen üretim (RAG) veya kaynak bağlantısı bulunmasını otomatik doğruluk garantisi kabul etme; dayanağın gerçekten iddiayı destekleyip desteklemediği ayrıca kontrol edilmeli.

Yanlış ya da çelişkili içerik saptandığında ilgili görevlerin askıya alınması, kullanıcının bilgilendirilmesi ve etkilenen öğrenme kayıtlarının yeniden değerlendirilmesi için bir akış olsun. Eski kaynağı sessizce yeni bilgilerle değiştirme. Tarihsel sınav cevabı ile güncel tıbbi yaklaşım farklılaşırsa bunları açıkça ayır ve incelemeye gönder.

Soru üretiminde belirsiz kök, birden çok savunulabilir cevap, cevap sızıntısı ve anlamsız çeldiricileri yakalayacak kalite kontrolleri öner. LLM'nin Türkçe serbest yanıtı değerlendirmesini tek hakem yapma; gerekçe, itiraz ve elle düzeltme yolu sun. İkinci model onayını bağımsız uzman doğrulaması gibi sunma.

Gerçek hasta verisi gerektirmeyen bir ürün tasarla. Telif korumalarını aşmayı veya ücretli kaynakları izinsiz çekmeyi planlama. Uygulamayı klinik karar destek ya da tedavi öneri aracı olarak konumlandırma.

## 8. Yerelde çalışma ve teknik mimari

Geliştirici modelin güçlü olması, uygulamanın çalışırken LLM gerektirdiği anlamına gelmez. Önce LLM olmadan işleyen öğrenme, zamanlama, kayıt ve değerlendirme çekirdeğini tasarla. Yerel büyük dil modeli (LLM) ancak ölçülebilir yarar sağladığı görevler için isteğe bağlı bir modül olsun.

Kurulum ve isteğe bağlı içerik/model indirmelerinden sonra temel akış internet olmadan çalışmalı. Bulut hesabı, abonelik veya API anahtarı zorunlu olmasın. Uzak analiz, telemetri, yazı tipi veya başka gizli ağ bağımlılıkları bulunmasın. İçerik güncellemesi ile günlük çevrimdışı kullanımın sınırlarını açıkla.

Yerel masaüstü uygulaması ile yerel sunucu/tarayıcı yaklaşımını; kurulum, veri güvenliği, yedekleme, bakım, performans ve ileride tablet erişimi açısından karşılaştır. Birini gerekçeli seç. Yerel ağ üzerinden tablet erişimi ile tabletin tek başına çevrimdışı çalışmasının farklı kapsamlar olduğunu belirt.

Veri modeli; kaynaklar, kaynak sürümleri, öğrenme hedefleri, sorular/görevler, soru aileleri, denemeler, öğrenme olayları, zamanlama durumu ve plan kayıtlarını kapsasın. Çift kayıt, bozuk içe aktarma, saat değişimi, yarım kalan oturum, yedekten geri dönüş ve veri göçü için testleri planla.

Açık formatlarla dışa aktarma, kullanıcının verisini silmesi ve doğrulanabilir yedek geri yükleme olsun. “Yerel” olmayı “kendiliğinden şifreli ve güvenli” sayma. Büyük ölçek gerektirmeyen bir ürün için mikroservisler veya gereksiz altyapı kurma. Donanım performansını ölçmeden hız veya model kapasitesi vaat etme.

## 9. Arayüzün görevi

Ana ekran kullanıcının sıradaki yararlı çalışmaya başlamasını kolaylaştırsın. Bugünün gerçekçi planı, önerinin gerekçesi, gerektiğinde kaynak ve anlamlı ilerleme bilgisi yeterli olabilsin.

Beyin animasyonları, bilimsel olmayan “beyin gücü” puanları, dopamin söylemi, baskıcı seri mekanikleri ve gereksiz rozetleri başarı göstergesi olarak kullanma. Ancak sadeliği kullanışsızlıkla karıştırma: okunabilirlik, klavye kullanımı, erişilebilirlik ve hızlı geri bildirim önemli tasarım gereksinimleridir.

## 10. Gerçekten işe yaradığını nasıl sınayacağız?

Yazılımın doğru çalışmasını, içeriğin tıbben doğru olmasını ve öğrenmeye katkısını üç ayrı doğrulama katmanı olarak ele al. Bunlardan birinin başarısı diğerlerini kanıtlamaz.

Temel karşılaştırmayı makul bir aktif çalışma düzenine karşı kur: örneğin doğrulanmış sorular + standart aralıklı tekrar + basit çalışma planı. Yalnızca hiç çalışmama veya pasif yeniden okumaya üstünlük, daha karmaşık ürünü gerekçelendirmek için yeterli sayılmasın.

Gecikmeli hatırlama, görülmemiş soruda başarı, tamamlanan kapsam, güven-doğruluk uyumu ve toplam zaman maliyetini ölç. Toplam maliyete içerik hazırlama, doğrulama ve uygulamayı yönetme süresini ekle. Sınav puanı tahminiyle gerçek ölçülmüş sonucu ayır.

Öğrenme ve değerlendirme içeriklerini ayır. Aynı sorunun küçük varyasyonlarını aynı soru ailesinde tut; birbirinin cevabını sızdıran öğeleri bağımsız değerlendirme gibi sayma. Bir öğenin tekrarını test etmek ile o öğeyi ilk kez kullanarak bağımsız aktarımı ölçmek arasındaki farkı açıkla. Zaman içinde performans modellerini değerlendirirken gelecekteki verinin geçmiş tahminlere sızmasını önle.

Tek kullanıcıda uygulanabilir bir pilot tasarla. Eşleştirilmiş konu/öğe kümeleri ve rastgele atama gibi yöntemleri değerlendir; öğrenmenin kalıcı taşınma etkisi nedeniyle basit ABAB tasarımını otomatik çözüm olarak sunma. Başlangıç düzeyi, zorluk, çalışma süresi, test gecikmesi, tekrarın öğretici etkisi ve kümeler arası bilgi taşınmasını dikkate al.

Bir kullanıcının pilotunu topluma genellenen nedensel kanıt gibi sunma. Başarı ölçütlerini ve bir özelliğin kaldırılma koşullarını önceden tanımla. Küçük bileşen karşılaştırmalarıyla hangi özelliğin ek fayda sağladığını sınayabil. Öğrenme kazancını yalnızca artan uygulama kullanımından çıkarsama.

## 11. Kapsam, alternatifler ve geliştirme sırası

Sıfırdan geliştirmeyi peşinen doğru kabul etme. Mevcut araçları kullanmak, Anki benzeri bir araca tamamlayıcı katman eklemek veya bağımsız uygulama geliştirmek arasında karşılaştırma yap. Güncel özellik, lisans ve yerel entegrasyon imkânlarını doğrula. Yeni ürünün hangi eksikliği gerçekten kapattığını açıkla.

Özellikleri “ilk sürüm için gerekli”, “kanıt veya kullanım doğrulamasından sonra”, “şimdilik dışarıda” olarak ayır. Bu promptta adı geçen her araştırma alanı zorunlu bir yazılım modülü değildir. Kanıtı güçlü bir ilkenin bile kullanıcıya sağladığı fayda maliyetini karşılamıyorsa daha sade uygulanmasını veya kapsamdan çıkarılmasını savunabilirsin.

Geliştirmeyi en küçük işe yarar öğrenme döngüsünden başlat. Her aşamada çalışan çıktı, bağımlılıklar, kabul testleri ve sonraki aşamaya geçme koşulu ver. Araştırma raporu tamamlandı diye büyük içerik otomasyonu veya karmaşık uyarlamalı motor geliştirmeye hemen geçme.

## 12. İstediğim çıktı düzeni

Yanıtında sırasıyla: kısa ürün tezi ve kapsam dışı alanlar; varsayımlar; araştırma yöntemi ve kanıt matrisi; TUS'a uyarlama; önerilen temel öğrenme döngüsü; öğrenci modeli ve günlük karar mekanizması; içerik doğrulama; yerel mimari ve veri modeli; minimal arayüz akışları; MVP ve sonraki aşamalar; teknik/içerik/eğitimsel test planı; riskler ve açık kararlar yer alsın.

Kanıt matrisinde araştırma alanı, kaynak, desen, sonuç, sınırlılık, TUS'a aktarım güveni, ürün karşılığı ve ölçüm yöntemi bulunsun. Kaynakçadaki her önemli kaynağı somut bir karara bağla; yalnızca etkileyici bir bibliyografya oluşturma.

Ayrıca şu durumları kabul senaryolarıyla göster: başlangıç verisi olmayan kullanıcı; hiç bilmediği konu; aynı soruyu ezberleyip yeni soruda başarısız olma; yüksek güvenli yanlış cevap; üç gün ara verme; kapasiteyi aşan tekrar kuyruğu; sınava çok az süre kalması; yanlış cevap anahtarı; çelişkili kaynak; yerel modelin çalışmaması; internetin tamamen kapalı olması; yedekten geri dönme.

Son bölümde tasarımını eleştir: En zayıf bilimsel varsayımlar hangileri? Fazla karmaşık veya gereksiz özellikler hangileri? Hangi sonuç planı değiştirir? Yeni uygulama yerine mevcut araçları kullanmak hangi koşullarda daha mantıklıdır?

Yalnızca “araştırılmalı” diye bitirme: erişebildiğin kanıtlarla somut bir başlangıç kararı ver; doğrulanamayan noktaları ayrıca işaretle. Ana teslimat pazarlama metni değil, başka bir geliştiricinin uygulayabileceği ve daha sonra sınanabilecek bir ürün planı olsun.

## 13. Başlangıç literatürü: doğrula, eleştir ve güncelle

Aşağıdaki kaynaklar araştırma için başlangıç noktalarıdır; sonuçları koşulsuz benimseme veya bunlarla yetinme. İlgili yeni çalışmalar, karşıt bulgular ve uygulama sınırları için taramayı güncelle. DOI yılının yayın yılıyla her zaman aynı olmadığını dikkate al.

**K1 — Dunlosky ve ark. (2013).** Improving Students' Learning With Effective Learning Techniques. DOI: 10.1177/1529100612453266. Genel öğrenme tekniklerinin karşılaştırılması için başlangıç.

**K2 — Trumble ve ark. (2024; çevrimiçi 2023).** Systematic review of distributed practice and retrieval practice in health professions education. DOI: 10.1007/s10459-023-10274-3. Sağlık meslekleri eğitimindeki kanıt ve yöntem sınırlılıkları.

**K3 — Pan ve Rickard (2018).** Transfer of test-enhanced learning: Meta-analytic review and synthesis. DOI: 10.1037/bul0000151. Hatırlama alıştırmasının yeni görev ve bağlamlara aktarımı.

**K4 — Van Merriënboer ve Sweller (2010).** Cognitive load theory in health professional education: design principles and strategies. DOI: 10.1111/j.1365-2923.2009.03498.x. Sağlık eğitiminde öğretim tasarımı ve uzmanlık düzeyi.

**K5 — Bisra ve ark. (2018).** Inducing Self-Explanation: a Meta-Analysis. DOI: 10.1007/s10648-018-9434-x. Kullanıcının kendi açıklamasını üretmesine ilişkin araştırmalar.

**K6 — Wisniewski, Zierer ve Hattie (2020).** The Power of Feedback Revisited: A Meta-Analysis of Educational Feedback Research. DOI: 10.3389/fpsyg.2019.03087. Geri bildirim biçimleri ve sonuçların heterojenliği.

**K7 — Dobson, Linderholm ve Stroud (2019).** Retrieval practice and judgements of learning enhance transfer of physiology information. DOI: 10.1007/s10459-019-09881-w. Fizyoloji içeriği üzerinde kontrollü bir deney; TUS deneyi değildir.

**K8 — Rasch ve Born (2013).** About sleep's role in memory. DOI: 10.1152/physrev.00032.2012. Uyku-bellek araştırmalarına başlangıç; kişisel çalışma saatini otomatik belirleyen kanıt gibi kullanma.

**K9 — Pashler ve ark. (2008).** Learning Styles: Concepts and Evidence. DOI: 10.1111/j.1539-6053.2009.01038.x. Tercih temelli öğrenme stili iddialarını değerlendirmek için yöntemsel başlangıç.

**K10 — Teknik ve resmî belgeler.** Anki Manual / Deck Options / FSRS bölümü ve ilgili sınav döneminin ÖSYM TUS kılavuzu. Bunlar algoritma davranışı ve sınav kuralları içindir; uygulamanın öğrenme etkisini kanıtlayan deneyler yerine kullanılamaz.
