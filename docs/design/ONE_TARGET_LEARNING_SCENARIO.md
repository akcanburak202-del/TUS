# TUS-011 — Tek hedefin öğrenme senaryosu

Belge sürümü: 0.1.1 · 10 Eylül 2026 · **Kullanıcı değerlendirmesine sunulan taslak; tıbbi içerik onayı değildir.** E1–E3 görev sürümleri 0.1.0, revize C1 görev/rubrik sürümü 0.1.1.

Temel depo: `akcanburak202-del/TUS`, `main` başı `32804e32dcd88c2a27ea390d38dbf86d27f5c8a6`. Dayanak: NEXT_CHAT_PROMPT, ASTRA_ORCHESTRATOR, orkestrasyon skill'i ve ilgili araştırma/işletim/değişmez belgeleri, STATE, BACKLOG, RUNTIME, TUS-011, revizyon v2 ve ADR-003. Eski ana planın §3–6 kuralları korunur; Android önceliğinde v2 geçerlidir.

Bu teslim senaryo ve içerik taslağıdır. Uygulama kodu, dağıtım kararı ve genel plan değişikliği içermez. Aşağıdaki ekranlar çalışan uygulama ekranı değil, önerilen metinlerdir. Kaynak ve inceleme kayıtları son bölümlerdedir.

## 1. Değerlendireceğimiz deneyim

**Tek öğrenme hedefi — THY-FB-01:** Hipotalamus ve hipofiz işlevi korunurken tiroid hormonlarındaki değişimin TSH yanıtını, negatif geri bildirim üzerinden açıklayabilmek.

Başlangıç sorusunda yalnız yön; sonraki görevlerde nedensel bağlantı görünür olur. Tek soru doğrusundan mekanizmanın öğrenildiği sonucu çıkarılmaz. Primer/merkezi hastalık tanısı, tedavi, TRH testi veya ilaç yönetimi bu hedefe dahil değildir.

İlk oturum üç eğitim görevi içerir: kısa yoklama → gerekirse açıklama ve destekli tamamlama → açıklama kapalı mekanizma alıştırması. Desteğe ihtiyaç duymayan ikinci görevi atlayabilir. Ayrı kontrol ilk oturumda açılmaz. Tahmini 5–8 dakika bu **tek hedef** için denenebilir süre etiketidir; bilimsel süre önerisi değildir ve v2'nin daha geniş paket tahminini değiştirmez.

**Tıbbi çerçeve:** Sorular basitleştirilmiş fizyoloji modelidir. Hipotalamus ve hipofiz sağlam; ilaç etkisi, ağır sistemik hastalık ve hormon direnci yok; hormon değişimi geri bildirim yanıtının gelişmesine yetecek kadar sürüyor. Ani değişimde anlık laboratuvar sonucu veya gerçek hastada tanı sorulmuyor. Kısa koşullar soru kökünde bulunur; doğruyu veren açıklama cevap sonrasındadır.

T3/T4 ifadeleri bu modelde **serbest hormon düzeylerini** anlatır; yalnız taşıyıcı protein değişikliğiyle total hormonun değişmesi kastedilmez. Bu koşul öğrenci ekranındaki kısa **Sorunun koşulları** ayrıntısında da bulunur.

## 2. İlk ekran ve ilk soru — E1

**Başlangıç ekranı**

> Tiroid ekseni · Yaklaşık 5–8 dakika  
> TSH’nin neden değiştiğini açıkla.  
> Önce bir soru; gerekirse kısa açıklama.

Ana eylem: **Başla**. İkincil eylem: **Doğrudan açıklamayla başla**. İkinci yol E1 yanıtı üretmez; öğretim karşılaşması kaydedilir, öğretim → E2 → E3 → kapanış izlenir. Kapanış “Açıklamayla başladın” der; “İlk soruda bilmiyordun” demez. Her ekranda **Ara ver** vardır.

**E1 — Yönü yoklama**

> Hipotalamus ve hipofiz işlevi normal. Serbest T3 ve T4 düzeyleri bir süredir düşük. Başka etkileyen durum yok. Geri bildirim yanıtı geliştiğinde TSH hangi yönde değişir?

- A — Artar.
- B — Azalır.
- C — Değişmez.
- D — Bu koşullarda yönü belirlenemez.

Seçeneklerin altında tek bir **Bilmiyorum** eylemi bulunur; ayrı bir Bilmiyorum seçeneği/gönderimi yoktur. Bu eylem `bilmiyorum` yanıtını kaydedip ilgili sonuç kartına geçer. A–D seçildikten sonra isteğe bağlı güven satırı açılır: **Eminim / Emin değilim / Tahmin ettim**. Varsayılan seçim yoktur. Güven, cevap açılmadan kaydedilir. Seçenek yanıtı için ana eylem **Yanıtı gönder**. Yanıt gönderilmeden öğretim açılırsa yardım kaydı oluşur.

**Anahtar:** A. **Kısa cevap açıklaması:** “T3/T4 azaldığında hipotalamus ve hipofiz üzerindeki negatif geri bildirim azalır. Bu, TSH salınımının artmasına izin verir.” [M1, M2]

**Ölçtüğü:** TSH değişim yönünü seçeneklerden tanıma. **Ölçmediği:** Açıklamayı kendisinin üretebilmesi. E1'de yalnız doğru seçenek, mekanizma başarısı değildir.

| Yanıt | Açıklamadaki odak | Çıkarım sınırı |
|---|---|---|
| B | Tiroid hormonunun düşmesiyle TSH'nin aynı yönde düşmesi arasındaki ayrım | “Aynı yönlü düşündün” kesin teşhisi konmaz |
| C | Baskının azalmasına sağlam hipofizin yanıt verebilmesi | Tek cevap “geri bildirimi bilmiyor” etiketi üretmez |
| D | Kökün sağlam eksen ve yanıt süresi koşullarını vermesi | Gerçek klinik istisnaları bilen kişi otomatik hatalı inanç sahibi sayılmaz |

Soru, anahtar ve açıklama sürümleri: `E1@0.1.0`, `K-E1@0.1.0`, `FB-TEACH@0.1.0`. Aile: `TRAIN-DIRECTION`.

## 3. Dört yanıt yolu: görünen metin ve sonraki eylem

### A. “Bilmiyorum”

1. **Yanıt sonucu:** “Bilmiyorum yanıtını kaydettik. Önce bağlantıyı kuralım.” Ana eylem: **Kısa açıklamaya geç**. Kullanıcı daha önce bu hedefte bağımsız doğru yapmışsa: “Şu an hatırlayamadığını kaydettik. Bağlantıyı kısaca gözden geçirelim.” Her iki durumda da unutma veya başarısızlık teşhisi yoktur.
2. **Öğretim ekranı:** “Hipotalamus TRH, hipofiz TSH salgılar. TSH tiroidi uyarır. Tiroid hormonları hipotalamus ve hipofizde geri bildirimi sağlar. Hormon azalınca baskı azalır; sağlam hipofiz daha fazla TSH salgılayabilir.” Alt örnek: **T3/T4 azalır → geri bildirim baskısı azalır → TSH artar.** [M1, M2]
3. Ana eylem **Eksik adımı tamamla** → E2. Ardından **Açıklamayı kapat, kendin dene** → E3. E2 doğru yapılsa bile E1 “doğru”ya çevrilmez.

Kaynak ayrıntısı isteyen için: “Geri bildirimde hücre içi T3 önemlidir; T4 yerel olarak T3'e dönüştürülebilir. Kısa ekran, bu ayrıntıyı T3/T4 geri bildirimi olarak özetler.” [M1, M2] Bu ayrıntı yeni zorunlu öğrenme hedefi değildir.

### B. Yanlış cevap

**B seçeneği örneği:**

> Yanıtın: TSH azalır.  
> Beklenen: TSH artar.  
> Burada azalan, hipofize uygulanan baskıdır. Baskı azalınca TSH artabilir.

Ana eylem **Bağlantıyı tamamla** → E2. İkincil **Bu açıklama bana uymadı** → “Hangisi yardımcı olur?” seçenekleri **Eksenin kısa açıklaması / Sorunun koşulları / Anahtara itiraz**. Seçim yeni doğruluk puanı üretmez.

**Eksenin kısa açıklaması** §3A öğretim metnini açar; **Eksik adımı tamamla** → E2. **Sorunun koşulları** “Serbest hormon düzeylerini ve sağlam ekseni düşünüyoruz. İlaç/ek hastalık etkisi yok; yanıt gelişmesine yeterli süre geçti.” metnini açar; **Alıştırmaya geç** → E2 veya **İtiraz et** → §3D. İkincil **Geri** önceki sonuç kartına döner; ilk yanıt değişmez.

**C için metin:** “TSH'nin değişmemesi beklenmiyor. Hormonların azalması geri bildirim baskısını azaltır; sağlam hipofiz TSH'yi artırabilir.”

**D için metin:** “Kökte eksenin sağlam olduğu ve yanıt için süre geçtiği belirtiliyor. Bu modelde beklenen yön artıştır. Gerçek hastada ek etkenler değerlendirmeyi değiştirebilir.”

**Eminim + yanlış:** İlk kartta “Yanıtın anahtarla uyuşmuyor. Önce kaynak ve koşulları kontrol edebilirsin.” **Kaynak ve anahtar** görünür bağlantısı sunulur. Anahtar ekranında **Açıklamayla devam et** veya **İtiraz et** seçilir; zorunlu uzun makale okuma yoktur. Kaynak doğruluğuna güvenilmeden öğrenciye hata tanısı konmaz.

E2 sonrasında E3'e geçilir. Aynı yanlışın sonraki eğitimde tekrarı bir gözlemdir; tek başına kavram yanılgısı tanısı değildir.

### C. Doğru ama tahmin

> Doğru: TSH artar.  
> Tahmin ettiğini belirttin. Yanıt doğru olarak kalacak; nedenini ayrı çalışabiliriz.

Ana eylem **Nedenini kendin dene** → E3. İkincil **Önce kısa açıklama** → öğretim → E2 → E3. Uzun öğretim zorunlu değildir. E1 doğruluğu korunur; “tahmin” ayrı beyan olarak saklanır ve yüzdeye çevrilmez.

E3'te sonuç ve bağlantılar doğruysa: “Bu oturumda yönü ve bağlantıyı doğru seçtin. Başka bir gün yeniden deneyeceğiz.” E3 desteği veya açıklaması açılırsa ilgili sonuç destekli olarak görünür. Tahmin doğrusu otomatik FSRS notuna, ustalık düzeyine veya yanlışa çevrilmez.

**Doğru + tahmin beyanı yok:** “Doğru: TSH artar. Şimdi yönün nedenini dene.” → E3. Güven boşsa “emin” varsayılmaz.

### D. Cevap anahtarına itiraz

Yanıt sonrası her geri bildirim ve ölçüt ekranında ikincil **Anahtara itiraz** bağlantısı vardır. Kaynak karşılaştırması eğitim içeriğini açtığı için karşılaşma olarak saklanır.

**İtiraz ekranı:**

> Bu anahtarla ilgili sorun ne?  
> Yanıt anahtarı / Sorunun koşulları / Kaynak çelişkisi / Başka bir neden

İsteğe bağlı tek kısa not veya kaynak bağlantısı. Not yazmak zorunlu değildir. **İtirazı kaydet** veya **Vazgeç**. Vazgeç önceki ekrana döner ve itiraz olayı üretmez; bu sırada görülen kaynak/cevap karşılaşmaları kalır.

**Kayıttan sonraki ekran:**

> Bu soru inceleme bekliyor.  
> Yanıtın saklandı; inceleme süresince bu sonuç çalışma planını etkilemeyecek.

İtirazdan önce bu denemeden türemiş plan değişiklikleri varsa, askıya alma bunları da nötrleştirir; yalnız gelecekteki etkisini durdurmak yetmez. İlk yanıt ve eski türetim denetim izi olarak korunur, güncel sonuç inceleme bekler.

Ana eylem: **İtirazsız alıştırmaya geç**; uygun içerik yoksa **Oturumu bitir**. Bağlantı: **İtirazımı gör**. Çevrimdışı metin: “İtiraz bu cihazda kayıtlı.” Birine gönderildiği veya bir uzmanın arka planda incelediği söylenmez.

Varsayılan, kapsam sınıflanana kadar bu tek hedefi askıya almak ve **Oturumu bitir** sunmaktır. Kullanıcının kategori seçimi tek başına kapsam kararı sayılmaz. **İtirazsız alıştırmaya geç** yalnız önceden doğrulanmış bağımlılık/kapsam kaydı, adayın itirazdan etkilenmediğini gösteriyorsa görünür; aksi halde gösterilmez. Sonraki açılışta “Bu hedef inceleme bekliyor” kartındaki **İtirazımı gör** ile aynı kayda dönülür. Başka hedefler olduğunda bu bilgi hedefin ayrıntısında kalır; bu senaryo yeni genel gezinme ekranı tasarlamaz.

**Somut kapsam örnekleri:**

- “Kökte süre belirsiz” itirazında E1 ve onun varyantları askıya alınır. Ortak fizyolojik ilke açıkça itiraz dışında kalmışsa ve ayrı inceleme kaydı varsa E3'e geçilebilir.
- “T3/T4 geri bildiriminin yönü yanlış” itirazı ortak açıklama ve anahtarları etkiler: E1–E3 ve C1 askıya alınır. Bu tek hedeflik oturum **“Bu hedef inceleme bekliyor. Bugünlük burada bitirebilirsin.”** diyerek kapanır. İçerik bitmiş gibi başarı rozeti verilmez.
- Kapsam anlaşılamıyorsa dar bir öğe sanıp devam etmek yerine bu hedef geçici olarak askıda kalır; inceleyici kapsamı belirler.

**İnsan incelemesi sonrası iki çıkış:**

- Anahtar geçerliyse: “Kaynak ve koşullar incelendi; anahtar korunuyor. Gerekçe: [inceleyicinin kısa açıklaması].” **Açıklamayla devam et / Daha sonra**. İlk yanıt eski sürüm ve zamanı ile korunur; yeni gösterilmiş açıklama yeni yardımsız deneme sayılmaz. İnceleme kararıyla güncel plan sürümlü olarak yeniden türetilir; eski öneri yeni olay gibi çoğaltılmaz. Açıklamayla devam, ilgili kısa öğretim → E2 → E3 → kapanış yoludur.
- Anahtar/kök düzeltildiyse: “Bu soruyu düzelttik. Eski yanıtın duruyor; sonuç düzeltildi.” Düzeltme sürümü ve gerekçesi eklenir, etkilenen plan/sonuçlar yeniden türetilir. Kök belirsizse eski deneme değerlendirme dışı kalabilir. Eski yanıt yeni köke verilmiş gibi puanlanmaz. **Düzeltilmiş açıklamayı gör / Daha sonra**.

Bu yollar tasarım sözleşmesidir; onay ve yeniden hesaplama yazılımının yapılmış olduğu anlamına gelmez.

**Daha sonra** kararı silmez; aynı hedef kartındaki **İtirazımı gör** üzerinden tekrar açılır. **Düzeltilmiş açıklamayı gör** sonunda **Oturumu bitir** vardır; düzeltilmiş soruyu yeniden çalışma ayrı bir eğitim denemesidir.

## 4. Diğer iki eğitim görevi

### E2 — Destekli eksik adım

Aile `TRAIN-COMPLETION`; soru `E2@0.1.0`, anahtar `K-E2@0.1.0`. M1–M2. Destek düzeyi görünür: **Açıklamayla alıştırma**.

> T3/T4 azaldığında TSH'nin artmasını tamamla:  
> T3/T4 azalır → geri bildirim baskısı [azalır / artar] → TSH artar.

**Anahtar:** azalır. **Neden:** Hormonların baskılayıcı etkisi azaldığından hipofiz TSH yanıtını artırabilir.

- Doğru: “Bağlantıyı tamamladın. Şimdi açıklama kapalıyken dene.” → E3.
- Yanlış veya Bilmiyorum: “Eksik adım ‘baskı azalır’. Hormonun azalması, baskının da azalmasıdır.” → **Örneği yeniden gör** veya **Açıklamayı kapat, dene** → E3; isteyen **Ara ver** ile çıkar. Otomatik sonsuz tekrar yoktur.

Artar çeldiricisi baskının yönünü sınar; öğrencinin neden seçtiği kesin bilinmez. E2, E1 ile aynı ilişkinin destekli kardeşidir; farklı aile kimliği verilse de **bağımsız aktarım kanıtı değildir**.

### E3 — Kısa açıklama denemesi ve mekanizma bağlantılarını seçme

Aile `TRAIN-CAUSAL-CONSTRUCTION`; soru `E3@0.1.0`, anahtar `K-E3@0.1.0`. M1–M2. Ekranda önceki açıklama yoktur.

**Seçenekler görünmeden önce:** “T3/T4 bir süredir yüksek; hipotalamus ve hipofiz sağlam, başka etken yok. TSH ne olur, neden? Kendine bir cümleyle açıkla; yazmak zorunda değilsin.” Ana eylem **Bağlantıları seçmeye geç**; ikincil **Açıklayamıyorum** → kısa öğretim → E3 bağlantı seçimi, artık destekli. İsteğe bağlı **Cümlemi yaz** alanı vardır. Ses kaydı, mikrofon veya konuşma tanıma gerekmiyor. Sessiz/sesli açıklamayı sistem gözlemlemez; devam düğmesi açıklama başarısı sayılmaz. Bu küçük üretim daveti öğretim tasarımıdır; getirisi ve ek adım yükü sınanacaktır.

> Hipotalamus ve hipofiz sağlam. T3/T4 düzeyi bir süredir yüksek; başka etken yok. Geri bildirim yanıtını tamamla.

Üç dokunma satırı sırayla açılır; tümü yanıt verilmeden varsayılan boştur. Önceki seçime dönülebilir; doğru/yanlış işareti son gönderimden önce gösterilmez:

1. Geri bildirim baskısı: **Artar / Azalır / Değişmez**.
2. Hipofizden TSH salınımı: **Artar / Azalır / Değişmez**.
3. Bağlantı: **Baskının artması TSH'yi azaltır / TSH ile tiroid hormonları aynı yönde değişmelidir / Tiroid hormonları hipofizi etkilemez**.

Ana eylem **Yanıtı gönder**. **Bilmiyorum** veya **İpucu al** her zaman ulaşılabilir. İpucu: “Hormon yüksekliğinin hipofize uygulanan baskısını düşün.” Bu açılırsa yardım işareti eklenir. Cevap öncesi kaynak açılışı da yardım sayılır.

**Anahtar:** 1 artar; 2 azalır; 3 ilk bağlantı. **Tam beklenen açıklama:** “Yüksek tiroid hormonları hipotalamus ve hipofizde negatif geri bildirimi artırır. Hipofizden TSH salınımı baskılanır.” [M1, M2]

**Üç ölçüt ayrı:** hormon–baskı ilişkisi; TSH yönü; baskı–TSH bağlantısı. Yalnız 2 doğruysa “TSH yönü doğru; neden bağlantısı eksik.” Üçü doğruysa “Mekanizma bağlantılarını doğru seçtin.” Her iki sonuçta ana eylem **Oturumu bitir** → §6 kapanışıdır. Bu, serbest açıklama üretiminin otomatik ölçümü değildir.

İsteğe bağlı yazılı yanıt otomatik LLM puanına girmez; cevap sonrası ölçütlere göre öz değerlendirme **öz değerlendirme** etiketiyle ayrı saklanır. İnsan değerlendirmesi varsa kimliği ve ölçüt sonucu ayrıca kaydedilir. Böyle bir değerlendirme yoksa hedefin açıklama üretme boyutu **değerlendirilmedi** olarak kalır; üç seçeneğin doğru olması bu boşluğu doldurmaz.

Yanlış/Bilmiyorum sonrası yalnız eksik bağlantı açıklanır. Örnek: “TSH yönünü doğru seçtin. Eksik adım: hormon yüksekliği baskıyı artırır.” Ana eylem **Oturumu bitir**; ikincil **Kısa açıklamayı gör**. Üçüncü eğitim sorusundan sonra sonsuz soru döngüsü yoktur. Aynı soruyu yeniden denemek isteyen için önceki sonucu değiştirmeyen tekrar olayı gerekir.

E3'ten açılan **Kısa açıklamayı gör** ekranı artan geri bildirim–azalan TSH açıklamasını gösterir; altındaki tek ana eylem **Oturumu bitir** → §6'dır. E3'e yeniden dönmek zorunlu değildir.

## 5. Ayrı kontrol taslağı — C1

**Yalnız içerik inceleme eki. Bu dosyayı okuyan kullanıcı bu kontrolü görmüş olur; onun için görülmemiş kontrol olarak uygun değildir.** Henüz uygulamada gerçek karşılaşma olayı oluşturulmadı. Pilot öncesi bu maruziyet kaydı taşınmalı; yoksa yenilik iddiası devre dışı bırakılmalıdır. Kullanıcıya göstermeden yeni kontrol hazırlamak ayrı içerik inceleme işidir.

Aday aile: `CONTROL-FEEDBACK-INTERRUPTION`; soru `C1@0.1.1`, rubrik `R-C1@0.1.1`; M1–M2, M4. Eğitimde sağlam geri bildirim altında yön seçimi/tamamlama; burada geri bildirim etkisinin seçici kesilmesini karşılaştırmalı bir düşünce deneyinde kullanma istenir. Bu **yakın mekanizma aktarımı adayıdır**, uzak klinik aktarım değildir. İlk incelemede yüzeysel varyant riski görülen açıklama-eleştirme sorusu bununla değiştirildi. Ayrı aile kimliği tek başına yeterli değil: TUS-003 aile sınırını ayrıca inceleyecek.

**Kontrol ekranı:**

> İki kurgusal hipofiz düzeneğine aynı, sabit TRH uyarısı veriliyor. İkisinde de tiroid hormonları artırılıyor.  
> A: Tiroid hormonlarının hipofizdeki geri bildirim etkisi çalışıyor.  
> B: Yalnız bu geri bildirim etkisi engellenmiş; diğer işlevler korunuyor.  
> Hormon artışına bağlı TSH baskılanmasını hangisinde beklersin? Neden?

İlk eylem tek seçimdir: **Yalnız A / Yalnız B / İkisinde de / İkisinde de değil**. Ardından cevap gösterilmeden kısa neden alanı açılır; bu tek kısa yazı isteğe bağlıdır. **Yazmadan geç** seçilirse yalnız seçme sonucu değerlendirilebilir. **Bilmiyorum / İpucu al** seçenekleri bulunur; ipucu bağımsız kontrol niteliğini kaldırır. Sabit TRH koşulu hipotalamus üzerinden ek bir farkı dışlar; gerçek hastalık tanısı veya bir deney protokolü sorulmuyor.

**Anahtar:** Yalnız A. **Beklenen açıklama:** “A'da yüksek tiroid hormonlarının hipofizdeki negatif geri bildirim etkisi TSH'yi baskılar. B'de bu etki engellendiğinden aynı hormon artışına bağlı baskılanma beklenmez.” Bu, verilen ideal modelin çıkarımıdır. Gerçek bir reseptör değişikliğinin bütün etkilerinin bundan ibaret olduğu söylenmez; mutlak TSH miktarı veya sıfır salgı sonucu çıkarılmaz.

| Ölçüt | Karşılanan içerik |
|---|---|
| C-R1 | Hormon artışına bağlı TSH baskılanması için yalnız A'yı seçer |
| C-R2 | A'da artan tiroid hormonunun hipofizde negatif geri bildirimle TSH'yi baskıladığını açıklar |
| C-R3 | B'de kesilen etkinin bu baskılanmayı engellediğini, sabit TRH altında açıklar |

Yalnız düzenek seçimi doğruysa R1 gözlenir; R2–R3 otomatik tamamlanmaz. Serbest açıklama puanlaması önceden onaylanmış rubrik ve insan incelemesiyle yapılır; öz değerlendirme bağımsız puan değildir. Sonuç “1 kontrol görevinde baskılanmanın beklendiği düzeneği doğru seçti” gibi dar tutulur. **Yalnız B** ters yönü, **ikisinde de** engellenen etkiyi kullanmamayı, **ikisinde de değil** çalışan geri bildirimin sonucunu fark etmemeyi sınayan çeldiricilerdir; hata nedeni kesin tanılanmaz.

**C1 çıkışları (yalnız ileride uygun aile ve kullanıcı için):**

| Eylem / gözlem | Kısa sonuç metni | Sonraki eylem ve kayıt |
|---|---|---|
| Doğru seçim; yazmadan geç | “Düzeneği doğru seçtin. Kendi açıklaman değerlendirilmedi.” | **Kontrolü bitir** → kapanış; yalnız R1, gerçek gecikme ve yardım durumu |
| Yanlış seçim | “Yalnız A'da bu geri bildirim etkisi çalışıyor; hormon artışına bağlı TSH baskılanmasını burada bekleriz.” | Yanıt kilitlendikten sonra düzeltme; **Kontrolü bitir**. Sonraki açıklama ilk kontrol yanıtını değiştirmez |
| Bilmiyorum | “Yanıtın kaydedildi. A'da geri bildirim TSH'yi baskılar; B'de bu etki engellenmiş.” | **Kontrolü bitir**. Bilmiyorum ayrı yanıt, okunan düzeltme yeni karşılaşma |
| Kısa yazı gönderildi | “Açıklaman kaydedildi. İnsan değerlendirmesi bekliyor.” Yalnız atanmış bir inceleme varsa; aksi halde “Açıklaman kaydedildi; henüz değerlendirilmedi.” | **Kontrolü bitir**; R1 ayrı, R2/R3 bekleyen veya değerlendirilmemiş. Sahte otomatik inceleme yok |
| Yanıttan önce ipucu/kaynak/anahtar açıldı | “Destekle devam ediyorsun. Bu deneme bağımsız kontrol sayılmayacak.” İpucu: “Hormonun yüksek olmasıyla, hipofizin bu hormonun geri bildirim etkisine yanıt verebilmesini ayır.” | **Destekle tamamla / Bitir**. Eğitim/yardımlı alıştırma olarak devam; açılış ve varsa önceki yanıt korunur, C1 ailesi artık görülmüş |
| Ara ver / gönderilmeden bırak | “Bu soruya daha sonra devam edebilirsin.” | Kök görülmüş olduğu için yenilik geri gelmez. Devam edilen deneme kesintiyle raporlanır; yeni ilk deneme oluşturulmaz |
| Anahtara itiraz | “Bu soru inceleme bekliyor.” | §3D askı/nötrleştirme; **Kontrolü bitir** |

Kontrol kapanışında yanıt türü, gerçek gecikme ve yardım durumu gösterilir. İnsan incelemesi sonucu daha sonra geldiğinde aynı görev kaydına eklenir; yeni deneme değildir. Bu belgedeki **C1, aile incelemesi tamamlanmadığından şu an kontrol olarak uygun değildir**; kullanıcı da görmüştür. TUS-003 ayrı aileyi ve bu kullanıcı için görülmemiş, incelenmiş öğeyi sağlamadan bu çıkışlar gerçek bağımsız kontrol sonucu üretemez.

**Zaman koşulu:** Son ilgili karşılaşmadan en az 7 tam gün ve daha önce görülmemiş/kardeşi gösterilmemiş kontrol ailesi. 7 gün v2'nin raporlama eşiğidir, optimum öğrenme aralığı değildir. Kökü, seçenekleri, anahtarı/gerekçeyi, kaynağı, ipucunu veya öğretimi görmek ilgili karşılaşmadır; cevap göndermek şart değildir. Kontrolün kendi başlangıcı öncesindeki son karşılaşmaya göre uygunluk hesaplanır; kendi açılışı uygunluğu geriye dönük sıfırlamaz.

Örnek: Son öğretim 10 Eylül 18.00 Europe/Istanbul ise en erken 17 Eylül 18.00; 13 Eylül 20.00'de aynı hedef çalışılırsa en erken 20 Eylül 20.00. Aradaki normal eğitim engellenmez. Görünen metin: “Bu hedefi yeniden çalıştığın için gecikmeli kontrolün zamanı değişti.” Kontrol açılmadan **Şimdi alıştırma yap** seçeneği vardır; kontrol öğesi erken açılırsa artık eğitim karşılaşmasıdır ve görülmemişlik yeniden kazanılmaz.

## 6. Oturum sonu, tekrar ve kesinti

Örnek kapanış metni, Bilmiyorum → E2 doğru → E3 üç doğru yolu için:

> Bugün: İlk soruda bilmiyordun; destekle bir bağlantıyı tamamladın. Son alıştırmada bağlantıları açıklama kapalıyken doğru seçtin.  
> Sonraki adım: Başka bir gün kısa mekanizma alıştırması.

Ana eylem **Bitir**. Yan ayrıntı **Ne kaydedildi?**. “Tiroid tamamlandı”, “%100 öğrendin” veya gelecekteki başarı tahmini yoktur. E3 de eksikse: “TSH'nin değişim yönünü yeniden çalışacağız.” İtirazlıysa yalnız inceleme durumu gösterilir.

Bu mekanizma hedefinin tüm görevleri topluca FSRS kartına dönüştürülmez. Olgusal tekrar öğesi varsa kendi zamanlayıcısındadır; bu senaryonun mekanizma alıştırması ayrı plandadır. TUS-011'de gerçek zamanlayıcı uygulanmadığından güncel kullanıcıya uydurma tekrar tarihi verilmez. Ekran sözleşmesi gerçek plan var olduğunda “Sonraki alıştırma: [yerel tarih]”; tarih yoksa “Henüz planlanmadı”dır. Hangi mekanizma tekrar aralığının seçileceği sonraki uygulama sözleşmesinde sürümlü tasarım kararı olarak netleşir.

**Ara ver:** Gönderilmiş yanıt ve son açılan adım saklanır; dönüşte **“Kaldığın yer: açıklama / alıştırma”** ve **Devam et**. Kaydedilmiş cevap yeniden sorulup ilk deneme sayılmaz. Gönderilmemiş yanıt taslağı yanıt olayı değildir; ancak soru gösterimi karşılaşmadır. Kaynak açılmışsa ara vermek yardım kaydını temizlemez. **Bugün bırak** ertelemedir, yanlış değildir. Bunlar uygulama ve gerçek Android kabulünde sınanacak davranışlardır.

## 7. Kanıt, tasarım ve hipotez ayrı

Kaynak araştırma kaydı aşağıdadır. Bu bölümdeki sayısal ürün hedefleri deney sonucu değildir.

| [B] Bilimsel bulgu | [T] Bu senaryodaki karar | [H] Test edeceğimiz varsayım ve ölçüm |
|---|---|---|
| Geri getirme ve zamana yayma sağlık eğitimindeki birçok deneyde yararlı; desenler ve sonuçlar heterojen [L1] | Cevabı gösterme öncesi deneme; ayrı günlerde eğitim; gecikmeyi gerçek zamanla raporlama | Kısa tekrar, gecikmeli yardımsız sonucu artırır mı? Gerçek gecikme, doğru/deneme sayısı ve toplam çalışma süresi birlikte |
| Açıklama üretme müdahaleleri farklı alanlarda yarar gösterebilir; TUS ve dokunmalı zincir aynı müdahale değildir [L2] | E3'te nedensel bağlantı; isteğe bağlı kendi cümlesi | Üç dokunmalı bağlantı sırf yön sorusundan faydalı mı? Gecikmeli yeni açıklama sonucu ve ek süre |
| Geri bildirimin etkisi içeriğe ve bağlama bağlıdır [L3] | Yanlışın işaret ettiği bağlantıya kısa düzeltme; uymadıysa destek seçimi | Kısa düzeltme sonrası aynı ilişki hatası azalıyor mu? Sonraki ayrı eğitimde hata tekrarı; açıklama okundu diye başarı saymama |
| Bu dört dalın birlikte TUS başarısını artırdığına ilişkin doğrudan kanıt yok | Bilmiyorumda öğretim, tahminde doğruluğu koruma, itirazda nötrleştirme | Kullanıcı yardım istemeden bir sonraki eylemi bulabiliyor mu? Takıldığı ekran, yardım talebi ve bırakma nedeni |

**Android için tasarım kararları:** Tek sütun, tek ana eylem, kaynak gerektiğinde açılır. Zorunlu yazı E1–E3'te yok; sürükleme yerine dokunma. Dikey/yatay ve büyütülmüş metinle butonlara ulaşılabilmesi TUS-012/010'da sınanır. Bunlar bu aşamada cihazda test edilmiş değildir. Mac arayüzü bu işte tasarlanmaz.

**Küçük değerlendirme:** Önce kullanıcı dört yolu okuyup “Şimdi ne yaparım?”ı söyleyebiliyor mu; özellikle doğru tahmin dalında zorunlu öğretim hissediyor mu? İlk 1–2 haftada kullanım akışı ve toplam emek gözlenir. Öğrenme etkisi için önceden ayrılmış hedef/aileler, gecikme ve çalışma süresi gerekir. Tek hedef, tek kişi ve görülen C1 ile etkinlik karşılaştırması yapılamaz. Kullanıcı görevi inceliyorsa onun üzerinde “ilk karşılaşma” testi devre dışıdır.

## 8. Kaynak, sürüm ve hak kaydı

Erişim tarihi tüm kayıtlar için **10 Eylül 2026**. Bu dar doğrulama sistematik literatür taraması değildir. [M] tıbbi dayanak; [L] öğrenme araştırmasıdır. Ders kitabı/uzman derlemesi, birincil araştırma ve eğitimsel etki ayrı tutulur.

| Kimlik / kaynak | Erişilen kapsam ve desteklediği ifade | Sınır ve hak durumu |
|---|---|---|
| M1 — Betts ve ark., *Anatomy and Physiology 2e*, §17.4, 2022. [OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/17-4-the-thyroid-gland) | Tam HTML; özellikle “Regulation of TH Synthesis” ana metni. TRH–TSH–tiroid ve negatif geri bildirim yönü, özgün soruların temel fizyoloji dayanağı. Orkestratör ilgili pasajı doğrudan kontrol etti. | Ders kitabıdır, birincil deney değildir. Figure 17.13 erişilebilirlik alt metninde ana metinle çelişen düşük hormon/ TRH baskılanması ifadesi saptandı; o ifade ve şekil kullanılmadı. Sayfada CC BY-NC-SA ve AI kullanım sınırlaması yer alıyor. Kitap metni/şekli yeniden dağıtılmıyor; özgün eğitim soruları ve bağlantı veriliyor. |
| M2 — Sinha & Yen, *Cellular Action of Thyroid Hormone*, Endotext; güncelleme 20 Haziran 2018. [NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK285568/) | Tam HTML; “Binding of THs to Nuclear Receptors” bölümü doğrudan doğrulandı. T4'ün yerel T3'e dönüşümü ve hipofizde hücre içi T3 açıklamasının dayanağı. | Uzman derlemesi, birincil deney değildir. Bu bölümden insanda sayısal geri bildirim gecikmesi çıkarılmadı. Araştırmacı hak kaydı CC BY-NC-ND 2.0; kaynak metni/şekli uyarlanıp dağıtılmıyor. |
| M3 — Hadlow ve ark., *The relationship between TSH and free T4 in a large population is complex and nonlinear*, 2013. [PubMed](https://pubmed.ncbi.nlm.nih.gov/23671314/), [DOI](https://doi.org/10.1210/jc.2012-4223) | Araştırmacı yayın kaydı/özeti doğruladı: geniş laboratuvar verisinde TSH–fT4 ilişkisi ters yönlü fakat basit doğrusal değil. Orkestratörün takip PubMed erişimi boş, DOI erişimi hata verdi; tam metin doğrulanmadı. | Birincil gözlemsel insan verisi; mekanizmayı nedensel olarak kanıtlayan müdahale veya zaman yanıtı deneyi değildir. Açık yeniden kullanım lisansı doğrulanmadı; yalnız kaynak bağlantısı ve dar bulgu. |
| M4 — Matsushita ve ark., *Essential role of GATA2 in the negative regulation of thyrotropin beta gene by thyroid hormone and its receptors*, 2007. [PubMed](https://pubmed.ncbi.nlm.nih.gov/17244762/), DOI 10.1210/me.2006-0208 | Birincil hücre deneyi; özeti orkestratör doğrudan okudu. T3 ve reseptörünün TSHβ gen düzenlenmesindeki baskılayıcı etkisi, deney sistemindeki müdahalelerle inceleniyor. | Tam metin/method ayrıntıları erişilmedi. Hücre düzeyi bulgu, bütün insan ekseninin veya C1'in kurgusal düzeneğinin birebir deneyi değildir. C1 biyolojik bilgiden türetilmiş düşünce deneyidir. Açık yeniden kullanım lisansı doğrulanmadı; alıntı/şekil yok. |
| L1 — Trumble ve ark., *Systematic review of distributed practice and retrieval practice in health professions education*, 2024; çevrimiçi 2023. [Yayıncı](https://link.springer.com/article/10.1007/s10459-023-10274-3) | Tam HTML, özet/yöntem/sonuç ilgili bölümler. 56 çalışma, 63 deney; 43 deneyde anlamlı olumlu sonuç. Sağlık eğitiminde geri getirme/zamana yayma için dayanak. | Heterojen karşılaştırmalar; görevde geçen sürenin ölçülmesi önemli. Bu ürünün veya TUS sonucunun deneyi değil. CC BY 4.0. |
| L2 — Bisra ve ark., *Inducing Self-Explanation: a Meta-Analysis*, 2018. [Yayıncı](https://link.springer.com/article/10.1007/s10648-018-9434-x) | Yayıncı özeti/önizleme doğrudan doğrulandı; 64 rapordan 69 etki, ortalama g=0,55. Nedensel bağlantıları öğrencinin üretmesine ilişkin dayanak. | Tam yöntem erişilmedi; aynı süre ve gecikme koşulları tüm deneyler için doğrulanmadı. Üç dokunmalı görev aynı müdahale sayılmaz. Açık lisans doğrulanmadı; metin kopyalanmıyor. |
| L3 — Wisniewski, Zierer & Hattie, *The Power of Feedback Revisited*, 2020. [Tam metin](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.03087/full) | Tam HTML; sonuç ve heterojenlik bölümleri doğrudan kontrol edildi. Geri bildirimin yararı içerik ve bağlama göre değişiyor. | Genel etki, “en kısa açıklama en iyidir” sonucu vermez. Bilgi içerikli düzeltmenin bu üründeki biçimi tasarım çıkarımıdır. CC BY. |

**İddia–kaynak sınırı:** E1/E2/E3'ün fizyolojik yön anahtarları M1 ana metniyle; hücre içi T3 ayrıntısı M2'yle; hipofiz hücresindeki T3–TSH baskılanmasının deneysel mekanizma desteği M4 özetiyle doğrulandı. M3 yalnız insan verisindeki ilişkinin yönü ve karmaşıklığı için ek birincil destek sağlar. C1, bu bilgilerden verilen koşullar altında yapılan tasarım çıkarımıdır; gerçek bir deneyin kopyası değildir. M3'ü nedensel mekanizma kanıtı, M4'ü tüm insan eksenini tek başına doğrulayan deney olarak sunmuyoruz. TUS-003'te içerik inceleyici kaynak yeterliğini ve modelin uygunluğunu ayrıca onaylamalıdır.

**Özgün içerik/hak:** Sorular, çeldiriciler, rubrikler ve ekran metinleri bu görev için yazılmıştır; ticari soru bankasından alınmamıştır. Makale metni, şekli veya ekran görüntüsü pakete kopyalanmaz. Tam kaynakların uygulamada çevrimdışı sunulması ayrıca hak incelemesi gerektirir. E1–E3 ve anahtarları 0.1.0; C1 ve R-C1 0.1.1 sürümündedir. Tıbbi insan onayı kimliği/tarihi boş; öğrenci bankasına kabul yoktur. İnsan inceleyiciye hazır paket sunulacaktır; kullanıcıdan soru yazması beklenmez.

## 9. Kabul ve devam kaydı

TUS-011 kullanıcı değerlendirmesi bekler; tamamlandı sayılmaz. TUS-003 tıbbi insan incelemesi ve kontrol ailesinin uygunluğu için açık kalır. TUS-012'ye kod/dağıtım kararı olarak geçilmez.

- AC1: Tek hedef, özgün görevler, sürüm/hak ve ölçüt taslağı hazır; tıbbi/öğrenme kaynakları erişim sınırlarıyla §8'de kayıtlı. İnsan tıbbi onayı bekliyor; onay varmış gibi işaretlenmedi.
- AC2: Bilmiyorum, yanlış, doğru-tahmin ve itiraz yolları; E2/E3 sonrası çıkış, ara verme ve inceleme sonuçları yazıldı.
- AC3: İlk yanıt, yardım, tahmin, aynı oturum ve gecikme ayrıldı; C1'in bu kullanıcıya görülmemiş sayılmayacağı belirtildi.
- AC4: Okunabilir taslak ve ayrı bağlam incelemesi var; inceleme bulgularına göre akış düzeltildi. Uygulama kodu yazılmadı. Çalışan uygulama, cihaz testi veya eğitimsel etki iddiası yok.

Sıradaki eylem: Bu senaryonun öğretim yükünü ve kısa metinlerini kullanıcıyla değerlendirmek; değişiklik istenirse TUS-011 içinde revize etmek. Tasarım kabulü tıbbi yayın onayı yerine geçmez.

### Oturum ve inceleme izi

Araştırmacı `/root/thyroid_sources`; ayrı bağlam inceleyicisi `/root/scenario_review`; tasarım/entegrasyon `/root`. Alt ajan çağrılarında istenen model `gpt-5.6-sol`, efor `high`; araç etkin model/efor metadatası vermediği için etkin ayar `unknown`. Araştırma ve inceleme salt okunur; tek dosya yazıcısı orkestratördür.

İlk incelemede bulunan alt-dal çıkış eksikleri, çift anlamlı Bilmiyorum eylemi, karşılaşma cümlesinin belirsizliği, itiraz kapsamı/plan geri dönüşü ve ekran yoğunluğu düzeltildi. E3'e seçenek öncesi kısa açıklama daveti eklendi; gözlenmeyen açıklama başarı sayılmadı. Eğitim cümlesini eleştiren ilk C1 yerine geri bildirim etkisinin kesildiği karşılaştırmalı düşünce deneyi yazıldı. Kontrol ailesinin bağımsızlığı taslakta onaylanmış değildir; TUS-003 kapısı korunur.

İkinci ayrı bağlam incelemesi: Kullanıcıya taslak teslimini engelleyen akış/içerik kusuru bulunmadı; belge/öğe sürümü ve eski kabul cümleleri için istenen kayıt düzeltmeleri uygulandı. AC1 kaynaklı taslak düzeyinde karşılandı, insan tıbbi onayı bekliyor; AC2–AC4 taslak teslimi düzeyinde karşılandı. Bu sonuç tıbbi onay veya TUS-011 kullanıcı kabulü değildir. Her iki alt görev tamamlandı; çalışan arka plan ajanı bırakılmadı.

Bu çalışma alanı tam git checkout değildir; API ile doğrulanmış yönetim belgelerinin yerel çalışma kopyasıdır. `main` ve son commit doğrudan GitHub üzerinden okundu. Remote dosyalarda bu oturum değişiklik yapılmadı. Yerel BACKLOG'da TUS-011 kullanıcı incelemesi için `review` durumunda tutulur; uzak BACKLOG hâlâ önceki `ready` kaydındadır. Kapanış/CLOSED kaydı oluşturulmadı. Sonraki oturum bu dosyayı ve kullanıcı geri bildirimini esas alıp kayıtları yetkili repo değişikliği sırasında uzlaştırmalıdır.

Doğrulama: belge akışı ve kaynak pasajları incelendi. Uygulama testleri, gerçek Android yön/klavye/çevrimdışı testi, yönetim bütünlük komutu ve eğitimsel ölçüm **NOT_RUN**; bu taslak için çalıştırılmış uygulama sonucu yoktur. Önceki 30+29 test sonucu bu teslimin test sonucu olarak kullanılmadı.


## Tasarım kabulü ve repo entegrasyonu · 2026-09-10

Kullanıcı, senaryo sunulduktan sonra “Tamam bu planı repoya ekle ve işe giriş” dedi. TUS-011 tasarım/senaryo kabulü verilmiştir; önceki bölümdeki kullanıcı değerlendirmesi bekleme kayıtları tarihsel taslak durumudur. Bu talep belgeyi bu repoya gönderme ve kayıtlı sırada geliştirmeye başlama yetkisidir. Tıbbi insan incelemesi veya öğrenci bankasına yayın onayı değildir. TUS-003 açık; kontrolü gören kullanıcı için yeni-görev iddiası yok. TUS-012 aynı ekran sırasını Android teslim sözleşmesine dönüştürecek.
