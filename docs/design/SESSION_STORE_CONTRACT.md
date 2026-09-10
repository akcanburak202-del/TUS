# TUS IndexedDB oturum deposu sözleşmesi

Belge sürümü: 0.1.0 · Veritabanı sürümü: 1 · State şema sürümü: 1 · TUS-005 IndexedDB dilimi

`prototype/session-store.js`, `prototype/session-core.js` olay günlüğünü tarayıcı IndexedDB'sinde workspace başına atomik olarak saklar. CommonJS ile `require(...)`, tarayıcıda IIFE ile `globalThis.TusSessionStore` sunulur. Varsayılan veritabanı adı `tus-learning-demo-v2`'dir. Bu adaptör eski `localStorage` verisini okumaz, değiştirmez veya göç ettirmez.

## API

| İşlem | Davranış |
|---|---|
| `await TusSessionStore.open({catalog, indexedDB?, dbName?})` | Kataloğu giriş anında snapshot'lar ve doğrular; depo handle'ı açar. `indexedDB` test/host enjeksiyonu, `dbName` ise yalıtım içindir. |
| `await store.load(workspaceId)` | Kayıt yoksa yeni `Core.createState()` döndürür. Kayıt varsa bütün olay geçmişini tam katalogla doğrulayıp döndürür. |
| `await store.dispatch(workspaceId, commandsArray)` | Workspace state'ini okur, `Core.dispatchBatch` uygular ve sonucu aynı `readwrite` transaction içinde yazar. Transaction tamamlanınca yeni state döner. |
| `store.close()` | Handle'ı kapatır; bu handle ile sonraki işlemler reddedilir. |

`workspaceId` 1–128 karakterli, NUL içermeyen bir string'dir. Komut dizisi ve katalog, ilk asenkron IndexedDB adımından önce derin snapshot'lanır; çağıranın daha sonraki değişiklikleri işlem sonucunu değiştiremez.

## Atomiklik, eşzamanlılık ve tekrar

Workspace okuması, saf `Core.dispatchBatch` çağrısı ve `put`, tek `readwrite` transaction'ın request callback'inde yapılır. Aktif transaction içinde Promise veya başka asenkron bekleme yoktur. İşlem yalnız `transaction.oncomplete` sonrasında başarılı sayılır. Request/transaction error, abort, blocked open ve version change reddedilir.

Aynı object store üzerindeki `readwrite` transaction'ları IndexedDB tarafından sıralanır. Bu nedenle ayrı handle'ların eşzamanlı yazıları en son committed state'i okur. Eski `expectedRevision` taşıyan yeni olay reddedilir. Çekirdeğin birebir komut tekrarı aynı state'i üretir ve bu doğrulanmış snapshot yine transaction içinde `put` edilir; farklı içerikli aynı kimlik reddedilir.

Batch hesaplama veya `put` başarısızsa transaction abort edilir. Daha önceki committed snapshot korunur; batch'in bir bölümü kalıcılaşmaz. Quota benzeri yazma abort testleri yalnız abort/rollback davranışını kanıtlar, fiziksel cihaz kotası hakkında iddia kurmaz.

## Doğrulama ve katalog sorumluluğu

Her yükleme ve yazma öncesinde `Core.validateState(state, catalog)` çalışır. Bozuk, bilinmeyen veya katalogla origin eşleşmesi olmayan geçmiş boş state ile değiştirilmez; işlem reddedilir ve kayıt olduğu gibi kalır. Sağlanan katalog, state içindeki **bütün** tarihi `start_session` task kimlik/sürümlerini ve değişmez origin alanlarını içermelidir. Eski katalog sürümlerinin değişmeden saklanması çağıranın sorumluluğudur; yalnız güncel görev sürümünü vermek eski state'i doğrulamak için yeterli değildir.

Bu depo içerik incelemesi, FSRS/zamanlama, control uygunluğu, dosya sistemi yedeği, migration, imza veya saldırgan yerel değişikliğe karşı kimlik doğrulama eklemez. Teknik kalıcılık testleri içerik doğruluğu, eğitimsel etki veya fiziksel kota dayanıklılığı kanıtı değildir.
