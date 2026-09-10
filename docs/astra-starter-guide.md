# TUS Yerel · Astra Orkestrasyon Başlangıç Paketi

**Sürüm:** 1.0.0 · **Hazırlanma:** 10 Eylül 2026

Bu paket, GPT-6 Astra'nın TUS Yerel projesini yönetmesi için bir çalışma protokolüdür. Uygulamanın kendisi veya otomatik bir ajan sunucusu değildir. Önemli kararlar ve kabul Astra'da; dar araştırma, uygulama ve inceleme işleri alt ajanlardadır.

## Kullanım

Arşivi aç. Yeni bir depoda paket içeriğini köke yerleştir; mevcut depoda dosyaları önce karşılaştır ve yalnız çakışmayan ekleri uygula. Var olan proje yönetimi dosyalarını veya CLAUDE.md/AGENTS.md'yi ezme. Bu dağıtım herhangi bir depoya commit/push yapmaz.

Astra'ya önce aşağıdaki başlangıç mesajını ver. İlk mesaj yalnız başlangıç denetimi ve görevleştirme ister; ürün geliştirme yetkisi ayrı açık olmalıdır.

> `ASTRA_ORCHESTRATOR.md` dosyasını oku ve bu TUS Yerel projesinin orkestratörü olarak uygula. Önce gerçek araç/alt ajan erişimini, mevcut depo durumunu, proje planını ve açık işleri doğrula. Yalnız başlangıç denetimi ile backlog düzenlemesini yap; ürün koduna henüz başlama. Mevcut CLAUDE.md/Fable düzenini değiştirme. Eksik zorunlu araçları, seçtiğin en küçük ilk dilimi ve gerçekten açık kalan kararları bildir.

Geliştirme aşamasındaki örnek çalışma emri:

> Başlangıç kararlarında kabul edilen kapsam içinde sıradaki hazır işi yürüt. Kodlama ve araştırmayı gerçek alt ajanlara delege et; nihai karar, entegrasyon ve kabul sende kalsın. Yerel proje dosyalarında çalışabilirsin. Commit, push, merge, yayın, ücretli hizmet veya veri paylaşımı için ayrıca yetki verilmiş sayma. Tamamlanan işi ancak kanıtlı kabulden sonra açık backlogdan çıkar. Test veya bağımsız inceleme eksikse işi açık tut.

Sadece sohbet arayüzü kullanılıyorsa skill, plan ve güncel durum dosyaları erişilebilir olmalıdır. Dosya eklemek tek başına yerel bilgisayara, depoya veya alt ajan çalıştırmaya erişim vermez. Bağlı/yerel araç bulunmadığında paket gerçek sınırı görünür kılar.

## Dosya haritası

```text
ASTRA_ORCHESTRATOR.md           Açıkça seçilen giriş; diğer model protokolünden ayrı.
skills/tus-astra-orchestrator/
  SKILL.md                     Günlük çekirdek yönetim kuralları.
  references/                  Gerektiğinde okunan altı protokol/gerekçe.
  templates/                   Görev, delegasyon, inceleme, kapanış, araştırma ve ADR.
project/astra/
  STATE.md                     Yeni oturumun devam noktası.
  RUNTIME.md                   Gerçek araçlar, model ayarları, izinler ve komutlar.
  BACKLOG.md                   Yalnız açık işler; durumun tek yetkili kaydı.
  CLOSED.md                    Kapanmış işler; açık listeyi şişirmez.
  ROADMAP.md                   Aşamalar ve geçiş koşulları.
  tasks/                       İlk sekiz işin kabul odaklı kartları.
  decisions/ evidence/         Kararlar ve kanıtlar; ihtiyaç oldukça oluşur.
  runs/ closures/              Görev sonuçları ve kabul kayıtları.
docs/input/                    Sağlanan plan/promptun değiştirilmemiş kopyaları.
tools/astra/check_workflow.py   Haricî bağımlılıksız, salt okunur tutarlılık denetimi.
tests/astra/                   Denetleyicinin otomatik testleri.
```

Normal bir oturum bütün klasörü okumaz. Çekirdek skill, STATE, BACKLOG ve yalnız seçili görevin gereken bölümleriyle başlar. Görev durumunu hem kartta hem tabloda tutmayız; tarihçeyi de her seferinde ana bağlama taşımayız.

## Tamamlanmış iş neden silinip tamamen kaybolmuyor?

İstenen davranış korunur: tamamlanan satır **BACKLOG'dan çıkar**. Ancak yaptığı değişiklik, hedef sürüm, inceleme ve test kanıtı `CLOSED.md` ile `closures/` içinde kalır. Böylece yeni oturum geçmişi baştan okumadan devam edebilir; bir hata çıkınca kararın dayanağı bulunabilir. İptal, yerine başka iş açılması ve başarı ayrı sonuçlardır.

## Başlangıç ayarları

Astra orkestratör; kullanıcı tercihi olarak alt ajan GPT-5.6 Sol / high; aynı anda en çok iki yürütme ve paylaşılan ağaçta bir yazıcı. Model/efor isimleri API kimliği değildir. Etkili ayar ancak araç/yürütücü tarafından doğrulanınca kaydedilir. Bütün sayısal sınırlar proje için muhafazakâr başlangıç seçimleridir, en hızlı yapılandırma oldukları ölçülmemiştir.

İlk BACKLOG sadece sekiz işi ayrıntılandırır. Gelecek bütün aşamalar ROADMAP'ta kalır. İlk iş gerçek ortam/yetki keşfidir. Ana uygulama geliştirme kapısı, sağlanan plandaki mevcut araç karşılaştırması ve mimari karara bağlıdır.

## Yapısal kontrol

Depo kökünde, Python 3.10 veya üstüyle:

```bash
python3 tools/astra/check_workflow.py --root .
python3 -m unittest discover -s tests/astra -p 'test_*.py' -v
```

Denetleyici ağ çağrısı yapmaz ve dosya değiştirmez. Kimlik, durum, bağımlılık döngüsü, erken başlatma, kart/kanıt yolu, kapanış biçimi ve aktif iş sınırı gibi kuralları denetler. Testlerin gerçekten geçtiğini veya bir doktorun gerçekten onay verdiğini kanıtlamaz; bir erişim kontrol sistemi değildir. Gerçek kanıtı Astra ve gerekli inceleyici değerlendirir.

Kopyalama sonrası test dosyaları kendi geçici örneklerini kurar; proje ürün kodunu çalıştırmaz. Bu paketin ürün/ajan davranışı denemeleri `skills/tus-astra-orchestrator/references/QUALITY_AND_EVALS.md` içinde ayrı işaretlenmiştir.

## Kaynaklar ve sınırlar

Sağlanan proje planı ve prompt temel alınmıştır; bu çalışma yeni bir TUS literatür taraması veya planın bütün kaynaklarının tekrar doğrulanması değildir. İnternetten incelenen orkestrasyon örnekleri ve alınan/alınmayan fikirler `skills/tus-astra-orchestrator/references/DESIGN_RATIONALE.md` içindedir.

İçerikte hazır framework metni/kodu kopyalanmadı; kalıplar proje gereksinimleri için yeniden tasarlandı. Dış framework kurmak zorunlu değildir. Bu sürümün GPT-6 Astra üzerinde gerçek çok ajanlı üretkenlik üstünlüğü ölçülmemiştir. Paket test sonucu `VALIDATION_REPORT.md` dosyasındadır.
