# TUS oturum çekirdeği sözleşmesi

Belge sürümü: 0.1.0 · Şema sürümü: 1 · TUS-005 ilk kod dilimi

`prototype/session-core.js`, mevcut 0.1 `prototype/core.js` modülüne dokunmadan çalışan bağımlılıksız bir komut → olay günlüğü çekirdeğidir. CommonJS ile `require(...)`, tarayıcıda IIFE ile `globalThis.TusSessionCore` sunar. Bu belge yalnız sentetik veya açıkça insan incelemesinden geçmiş içerikle kullanılan saf oturum/yanıt dilimini tanımlar.

## API

| İşlev | Sonuç |
|---|---|
| `createState()` | `{schemaVersion: 1, revision: 0, events: []}` üretir. |
| `validateCatalog(catalog)` | Tam alanlı katalog ve görev sürümlerini doğrular. |
| `validateState(state[, catalog])` | Olay günlüğünü sırayla replay eder; zarf/komut, geçiş, referans ve revizyon bozukluklarını reddeder. Katalog verilirse başlangıç origin snapshot'ını o katalogla da karşılaştırır. |
| `dispatch(state, catalog, command)` | Önce bütün geçmiş origin snapshot'larını katalogla doğrular, sonra tek komutu uygular ve yeni state döndürür. Girdileri değiştirmez. |
| `dispatchBatch(state, catalog, commands)` | Komutları sıralı olarak geçici state'e uygular. Herhangi biri geçersizse sonuç dönmez ve giriş state'i değişmez. |
| `project(state)` | Olay günlüğünden açık oturum, deneme, maruziyet, ilk yanıt, güven beyanı, değerlendirme ve itiraz görünümünü yeniden türetir. Dönen görünüm state ile nesne paylaşmaz. |

State içinde ayrıca güvenilecek bir `currentSession`, `score` veya değerlendirme cache'i yoktur. `revision`, olay sayısıyla aynı olmak zorundadır. `project` her çağrıda yetkili olay günlüğünü replay eder. `project(state)` katalog almadığı için yalnız daha önce güven sınırında doğrulanmış state üzerinde görünüm üretme aracıdır; dışarıdan alınmış veya arşivden yüklenmiş state, karar üretmeden önce `validateState(state, catalog)` ile doğrulanmalıdır. Katalogsuz projeksiyon veri kökenini kanıtlamaz.

## Katalog ve güvenli içerik sınırı

Katalog şekli:

```js
{
  schemaVersion: 1,
  tasks: [{
    id: "synthetic-task", version: "1.0.0",
    objective: { id: "objective-1", version: "1.0.0" },
    family: { id: "family-1", version: "1.0.0" },
    source: { id: "source-1", version: "1.0.0" },
    key: { id: "key-1", version: "1.0.0" },
    policy: { id: "policy-1", version: "1.0.0" },
    bank: "training",
    status: "synthetic",
    vettedContent: false,
    optionKeys: ["option-a", "option-b"],
    correctOptionKey: "option-a"
  }]
}
```

Bir görev yalnız şu iki durumda başlayabilir:

- `status: "synthetic"` ve `bank: "training"`;
- `status: "production"`, `vettedContent: true` ve `bank: "training"`.

`draft`, `suspended`, açıkça incelenmemiş production ve bütün `control` görevleri reddedilir. `vettedContent: true` bu teknik API'de çağıranın açık kapı beyanıdır; çekirdek insan incelemesini kendisi doğrulayamaz. Gerçek tıbbi içeriği sentetik etiketiyle geçirmek sözleşme ihlalidir. Bu dilimde kontrol ailesinin bağımsızlığı veya uygunluğu uygulanmadığından control bankası destekleniyormuş gibi yorumlanamaz.

Başlangıç olayı görev, hedef, aile, kaynak, anahtar ve politika kimlik/sürümlerini snapshot olarak taşır. Anahtar snapshot'ı doğru seçenek anahtarını, görev snapshot'ı seçenek anahtarlarını ve içerik kapısını da korur. Sonraki bütün olaylar aynı origin snapshot'ına bağlıdır. `validateState(state, catalog)` aktif güven sınırında origin'in sağlanan katalogdan türediğini kontrol eder. Eski olayları doğrulamak için kullanılan eski katalog sürümlerinin dış katmanda saklanması gerekir.

## Komut zarfı ve olay kimliği

Bütün komutlar şu ortak alanlara sahiptir:

```js
{
  id: "event-1",
  type: "open_material",
  at: "2026-09-10T10:00:01.000Z",
  expectedRevision: 1,
  sessionId: "session-1",
  attemptId: "attempt-1"
}
```

Zaman tam üç haneli milisaniye içeren gerçek UTC ISO-8601 biçimindedir. Olay günlüğünde zaman geriye gidemez; eşit zamanlar günlük sırasıyla replay edilir. Kimlikler en çok 128 karakterlik sınırlı ASCII kimlikleridir. Şekiller kapalıdır: eksik ve fazladan alan reddedilir.

Aynı `id` ve birebir aynı komut tekrar gelirse, `expectedRevision` artık eski olsa bile aynı state nesnesi no-op olarak döner. Aynı `id` farklı içerikle gelirse hata oluşur. Yeni kimlikli komutun `expectedRevision` değeri güncel revision değilse komut reddedilir. Bu sıra, ağ tekrarını güvenli kılarken aynı kimlikle içerik değiştirmeyi gizlemez.

`dispatchBatch` saf bellekte ya bütünüyle bir sonuç üretir ya da hata verir. Bu özellik IndexedDB, dosya sistemi veya başka kalıcı ortamda atomik transaction garantisi değildir. Kalıcılık adaptörü, başarılı yeni snapshot'ı kendi transaction'ı içinde yazmalı ve çökme/restore davranışını ayrıca sınamalıdır.

## Desteklenen akış

| Komut | Ek alanlar | Kural |
|---|---|---|
| `start_session` | `taskRef: {id, version}`, `step` | Yeni session/attempt açar; tam görev sürümünü katalogdan çözer ve origin snapshot'ı üretir. |
| `open_material` | `material` | `root`, `source`, `hint`, `study`, `answer` veya `feedback` açılışını zamanı ile kaydeder. Feedback yalnız değerlendirmeden sonra açılabilir. |
| `submit_answer` | `response` | Denemenin geri dönülmez ilk yanıtını kaydeder. Aynı attempt için ikinci gönderim reddedilir. |
| `declare_confidence` | `answerEventId`, `confidence` | İlk yanıttan sonra, değerlendirmeden önce en fazla bir güven beyanı kaydeder. |
| `evaluate_answer` | `answerEventId` | İlk yanıtı origin anahtar snapshot'ıyla değerlendirir. İstemciden correctness/result alanı kabul etmez. |
| `advance_step` | `step` | Açık session'ın son adımını değiştirir. |
| `pause_session` | — | Aktif session'ı duraklatır. |
| `resume_session` | — | Yalnız duraklatılmış session'ı sürdürür. |
| `end_session` | — | Aktif session'ı yalnız geçerli yanıt değerlendirildikten sonra tamamlar. Tamamlanan session yeniden açılamaz, ilerletilemez veya yanıt alamaz. |
| `dispute_answer` | `answerEventId`, `scope: "objective"`, `category`, `note` | İlk yanıtı silmeden hedef kapsamındaki etkili değerlendirmeleri inceleme bekler durumuna getirir. |

Şema 1 bir session içinde tek attempt taşır. Görevler arası session ilerletme bu ilk dilime dahil değildir; tam oturum yönlendirmesi tamamlanmış değildir. Ancak açık attempt, `currentStep`, yanıt, güven beyanı ve maruziyetler JSON serialize/reload sonrasında replay ile aynı biçimde geri gelir. `end_session`, yanıtı değerlendirilmiş aktif session'ı `completed` yapar. Tamamlanmış bir session'da `open_material`, `submit_answer`, `declare_confidence`, `evaluate_answer`, `advance_step`, `pause_session`, `resume_session` ve ikinci `end_session` reddedilir. Tamamlanan değerlendirilmiş yanıta itiraz edilebilir; bu durumda aynı objective kapsamındaki session durumu `review_pending` olur. Bu, verinin gerçekten diske yazıldığı iddiası değildir.

## Gözlem, beyan, değerlendirme ve maruziyet

Seçenek yanıtı ham gözlemdir:

```js
response: { kind: "option", selectedOptionKey: "option-a" }
```

“Bilmiyorum” ayrı bir gözlem türüdür; yanlış seçeneğe çevrilmez:

```js
response: { kind: "unknown", selectedOptionKey: null }
```

Güven ayrı bir `declare_confidence` olayı ve kullanıcı beyanıdır; değeri yalnız `"sure"`, `"unsure"` veya `"guess"` olabilir. Beyan yoksa projeksiyonda `answer.confidence` değeri `null` kalır; bundan emin olduğu çıkarılmaz. Beyan varsa event kimliği, zamanı ve değeri birlikte korunur. Yanlış answer referansı, ikinci beyan ve değerlendirme sonrası geç beyan reddedilir. `"guess"` doğru seçeneği yanlışa dönüştürmez. `evaluate_answer`, `selectedOptionKey` ile snapshot'taki `correctOptionKey` eşleşmesinden `correct`/`incorrect` türetir; unknown yanıtı `unknown` olarak kalır.

`source`, `hint`, `study` veya `answer` yanıt öncesi açılmışsa ilk yanıt `assistance: "assisted"` olur. `root` açılışı karşılaşmadır ama yardım değildir. Yanıt sonrasındaki açılışlar ilk yanıtın yardım durumunu geriye dönük değiştirmez. `feedback` ayrı, zamanlı maruziyettir ve değerlendirmeden önce açılamaz. Bu dilim maruziyetlerden gecikmeli bağımsız kontrol uygunluğu türetmez.

## İtiraz ve nötrleştirme

İtiraz için önce kilitli yanıt ve ona bağlı tek değerlendirme gerekir. Şema 1'in en dar güvenli kapsamı `objective`'dir. İtiraz olayı:

- orijinal answer event'i ve ham seçimi korur;
- denetim için ilk türetilmiş `evaluation.result` değerini korur;
- aynı objective snapshot kimliğindeki mevcut bütün değerlendirmelerin `effectiveResult` değerini `null`, durumunu `pending_review` yapar;
- aynı hedefteki session'ları `review_pending` yapar ve yeni başlangıcı engeller.

Kullanıcının seçtiği itiraz kategorisi kapsam kararı değildir. Tam insan incelemesi, anahtar/kök düzeltmesi, etki analizi ve sürümlü yeniden türetme bu dilimde uygulanmaz. Bu yüzden bir `resolve_dispute` komutu yoktur; uygulama review kararını varmış gibi üretemez. Gelecek genişletme, yeni bir insan karar olayı eklemeli, eski yanıtı değiştirmemeli ve hedefi ancak açık karar/kapsam snapshot'ıyla yeniden açmalıdır.

## Doğrulama ve bütünlük sınırı

`validateState` şu bozuklukları reddeder: bilinmeyen şema/komut, fazladan veya eksik alan, yinelenen olay kimliği, revision/log uyuşmazlığı, gerçek olmayan ya da sıra dışı zaman, zarf/komut uyuşmazlığı, origin değişimi, yanlış session/attempt/answer referansı, ikinci ilk yanıt, ikinci değerlendirme ve yasadışı pause/resume/dispute geçişi. Dışarıdan sağlanan bir türetilmiş cache alanı kapalı şekil nedeniyle kabul edilmez.

Bu şema veri kimlik doğrulaması, imza veya saldırgan yerel dosya değişikliğine karşı güvenlik sağlamaz. Aktif katalogla doğrulama katalog kökenini denetler; katalog dosyasının güvenilir dağıtımı dış katmanın sorumluluğudur.

## Bu dilimden sonra açık kalan TUS-005 kapsamı

- IndexedDB transaction adaptörü, gerçek çökme/restore ve kalıcı idempotency;
- sürümlü FSRS adaptörü ve zamanlayıcı sınırı;
- v0.1 anlamını koruyan import, yedek doğrulama ve geri dönüş;
- kontrol ailesi incelemesi, geçmiş maruziyete göre gecikmeli uygunluk ve aynı oturum kontrolü;
- insan inceleme/anahtar düzeltme olayı, kapsamlı etki analizi ve yeniden türetme;
- çok görevli session yaşam döngüsü ve uygulama/UI bağlantısı.

Bu çekirdeğin teknik testleri içerik doğruluğu, kontrol bağımsızlığı, eğitimsel yarar veya dayanıklı kalıcılık kanıtı değildir.
