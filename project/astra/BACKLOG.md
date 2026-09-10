# Açık işler

Açık durumun tek kaynağı. Tamamlanınca satır CLOSED'a taşınır; kart ve kabul kanıtı korunur. Başlangıç denetimi TUS-001 kapandı; Android teknik prototip TUS-009 kapandı; üretim kapıları açık.

`queued`: sırada; `ready`: yürütmeye hazır; `active`: gerçek yürütmesi var; `review`: kabul bekliyor; `blocked`: engeli var. Bir işi ready yapmak için oturumun ilgili yetkisi kontrol edilir. TUS-001 keşif işi için yalnız keşif yetkisi ve okunacak kaynak gerekir; bulunması hedeflenen bilinmeyenleri önceden çözmek gerekmez.

P0: kapı/kritik bağımlılık; P1: mevcut dilim; P2: sonraki dar iyileştirme. R0/R1/R2 tanımı ana skill'dedir. Hücre içinde `|` kullanma; bağımlılıkları virgülle ayır.

| ID | Durum | Öncelik | Risk | Bağımlılıklar | Kart | Başlık |
|---|---|---|---|---|---|---|
| TUS-002 | blocked | P0 | R1 | TUS-001 | project/astra/tasks/TUS-002.md | Mevcut araç ve bağımsız ürün kapısını değerlendir |
| TUS-003 | blocked | P0 | R2 | TUS-011 | project/astra/tasks/TUS-003.md | İlk tek hedefin tıbbi içerik ve ayrı kontrol incelemesi |
| TUS-005 | ready | P0 | R2 | TUS-004 | project/astra/tasks/TUS-005.md | En küçük sürümlü veri ve olay sözleşmesini kur |
| TUS-006 | queued | P1 | R2 | TUS-003, TUS-005, TUS-007 | project/astra/tasks/TUS-006.md | Tek hedefin Android üzerinde tam öğrenme döngüsünü uygula |
| TUS-007 | queued | P0 | R2 | TUS-005 | project/astra/tasks/TUS-007.md | Çift kayıt, çökme ve gerçek geri yüklemeyi sınayıp sağlamlaştır |
| TUS-008 | queued | P1 | R2 | TUS-006, TUS-007, TUS-010 | project/astra/tasks/TUS-008.md | Aşama 1 birleşik kabulünü ve sonraki backlog dilimini hazırla |
| TUS-010 | queued | P1 | R1 | TUS-006 | project/astra/tasks/TUS-010.md | Gerçek Android tablette açılış ve çevrimdışı kabul |
| TUS-013 | queued | P1 | R2 | TUS-008 | project/astra/tasks/TUS-013.md | Kabul edilmiş tek hedefi üç hedefe genişlet |

Geçerli sıra: TUS-011 tasarım kabulüyle kapandı; TUS-012 ve TUS-004 tasarım olarak kapandı; TUS-005 ilk saf çekirdek dilimi test ve ayrı incelemeden geçti; kalan kalıcılık ve oturum işleri ready. Aktif worker yok. Tablo satır sırası yürütme sırası değildir. v2 kapsam/bağımlılık değişiklikleri ADR-003 ve kartların tarihli eklerinde. TUS-002 gerçek karşılaştırmalı ölçüm bekler; dar tasarım çalışmasının kilidi değildir.
