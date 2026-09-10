# TUS-005 — 0.1 yedeğini anlamını koruyarak devralma sözleşmesi

10 Eylül 2026 · Tasarım kaydı; import/geri yükleme kodu henüz uygulanmadı.

Gözlenen kaynak: prototype/app.js içindeki empty/validateEnvelope/grade/export/import ve prototype/core.js şema1. 0.1 anahtarları tus-yerel-prototype-v1 ve tus-yerel-prototype-v1-before-import. Format tus-android-prototype, version1; alanlar demo, personal, tasks, mode. Her alt state schemaVersion1. Mevcut import byte sınırı 10 MiB; sınır değişirse sürümlü karar gerekir.

## Korunacak anlam

| 0.1 alanı | v2 import yaklaşımı | Yasak çıkarım |
|---|---|---|
| demo ve kurgusal katalog | Ayrı legacy/demo arşivi; kaynak sürümü ve orijinal byte özeti | Gerçek tıbbi çalışma sayılmaz |
| personal.events attempt.result | Legacy öz değerlendirme; eski ham event değişmeden tutulur | Yeni anahtarla nesnel correct diye yükseltilmez |
| result unknown | Orijinal Bilmiyorum gözlemi | incorrect'e çevrilmez |
| confidence 0..3 veya null | Ham legacy beyanı, eski alan etiketi ile | sure/unsure/guess veya yüzdeye tahmini eşleme yapılmaz |
| answerShown/hintUsed/exposure | O sırada kaydedilmiş destek ve karşılaşma | Eski uygulama her kök açılışını kaydetmediği için görünmemişlik varsayılmaz |
| task.status approved, reviewedAt | Eski kişisel içerik kontrolü, legacy provenance | Yeni tıbbi bankanın insan uzman/yayın onayı sayılmaz |
| source düz metni | Ham kaynak metni, old task version1 | Sonradan DOI veya kaynak sürümü uydurulmaz |
| mode/minutes | Ayrı eski ayar alanı; yeni varsayılanı açık seçimle etkileyebilir | Boş/kaçırılan günler başarısızlık oluşturmaz |
| Oturum sırası ve gönderilmemiş yanıt | Yedekte yok; bilgi yokluğu korunur | Kaldığı yer icat edilmez |

## Uygulanacak işlem sınırı

1. Kullanıcı dosyası önce staging alanında bütünüyle doğrulanır: format/sürüm, boyut, görev ve aile referansları, tekrar kimlikleri, durum ve tarih alanları. Mevcut validateEnvelope kuralları kaynak; yeni bağımsız importer UI/global DOM'a bağlı olmamalı.
2. Ham yedek ve hash'i saklanır. Yeni v2 workspace'e legacy arşivi olarak yazılır; mevcut workspace ve 0.1 localStorage anahtarları değiştirilmez. Geçiş yeni cevap/evaluation/control olayı üretmez.
3. Arşiv ve import-manifest yazımı tek IndexedDB transaction içinde; complete olmadan başarı/aktif workspace değişimi yok. Aynı import kimliği + aynı bytes tekrarında ikinci arşiv etkisi oluşmaz; farklı bytes çakışması reddedilir.
4. Başarısız doğrulama, quota veya abort aktif/önceki workspace'i değiştirmez. Başarılı geçişten sonra yeni yazıları kaybetmeden geri dönüş davranışı kullanıcıya açıklanır; v2 şema verisi v0.1 uygulamasına yüklenmez.
5. Geri alma arşivi silmek değildir: önceki aktif workspace'e kontrollü dönüş; gerekirse yeni v2 alanı ayrıca yedeklenir. Gerçek kullanıcı alanına otomatik göç yok.

## TUS-007'de gerekli gerçek kanıt

Dolu demo+personal fixture, duplicate/conflict import, bozuk referans/hash, boyut sınırı, eski öz değerlendirme anlamı, ikinci import arızasında önceki undo'nun korunması, staging abort, yeniden açılış ve geri dönüş. Yalnız saf reducer veya dosya varlığı bu kapıyı kapatmaz. Fiziksel tarayıcı/cihaz sonucu TUS-010'da ayrıca kaydedilir.
