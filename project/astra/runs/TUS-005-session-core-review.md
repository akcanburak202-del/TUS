# TUS-005 ilk saf çekirdek — kabul ve bağımsız inceleme

Date: 2026-09-10
Task-ID: TUS-005
Slice-result: accepted
Task-result: incomplete, ready for next slice
Risk: R2
Review-mode: independent-context
Worker: /root/session_core_impl
Reviewer: /root/session_core_review
Accepted-by: /root
Requested-model: gpt-5.6-sol
Requested-effort: high
Effective-model: unknown
Base: local f31563c, remote main4c251e5 üzerine tasarım commit'i

## İncelenen ve entegre edilen snapshot

| Yol | SHA-256 |
|---|---|
| prototype/session-core.js | 61a58b74f694dd8bae1e0539042b7a4678b7804411877f2bb47791da6a398dbe |
| tests/prototype/session-core.test.cjs | 0da3fe45df52d79da03681c7adbbaaacf778700432ca22830779a131f8cf6c87 |
| docs/design/SESSION_CORE_CONTRACT.md | 50ba48cfde1670a83af54a1d686bf2e293b3b087ac3e96e49ac71d0d9935ad1e |

İzole writer kodu dondurdu; root her hash'i kontrol ederek yalnız bu üç yeni dosyayı ana ağaca kopyaladı. Yönetim ve legacy import tasarım kayıtları root tarafından ayrı alanda yazıldı.

## Bulgular ve çözüm

1. Replay yalnız zarfı denetlediğinde ikinci start/submit, yanlış answer referansı ve değiştirilmiş origin kabul edilebiliyordu. Geçiş denetimi replay'e eklendi; yasadışı geçmiş reddediliyor.
2. Objective itirazı yalnız mevcut denemeyi etkiliyordu. Aynı objective.id'deki mevcut değerlendirmeler pending_review/null, oturumlar review_pending olur; yeni başlangıç bloke edilir, ilk yanıt korunur.
3. Feedback yanıt öncesi yardımsız sonucu kirletebiliyordu. Feedback evaluation öncesi reddedilir.
4. Ayrı reviewer, tüm origin anahtarları birlikte değiştirilmiş geçmişin katalog karşılaştırmasını atlayıp yanlış değerlendirme ürettiğini yeniden oluşturdu. dispatch artık validateState(state,catalog) kullanır; test bu yolu reddeder.
5. ADR004'teki güven beyanı ayrı olay sözleşmesi karşılanmıyordu. declare_confidence ayrı id/zaman/answerEventId ile, en fazla bir kez ve evaluation öncesi kaydedilir; doğru tahmin doğru kalır.

Son snapshot'ta reviewer engelleyici bulgu bulmadı. Ad hoc ikinci start/submit, paused-event ve forged-key örnekleri reddedildi; JSON reload güven beyanını korudu. Kalıcı test paketi13 yeni test içerir; ad hoc kontrolün her biri ayrı bir test adı sayılmaz.

## Root entegrasyon doğrulaması

- node --test tests/prototype/*.test.cjs:43 PASS,0 fail — TUS-005-session-core-node.txt.
- python3 -m unittest discover -s tests/astra -p 'test_*.py' -v:29 PASS — TUS-005-astra-tests.txt.
- node --check prototype/session-core.js: exit0.
- Yönetim yapısı: TUS-005-workflow-check.json.

Eski core.js/app.js/sw.js ve0.1 localStorage veri anahtarları değiştirilmedi. Sentetik fixture testidir; gerçek tıbbi soru öğrenci bankasına bağlanmadı.

## Kabulün sınırı ve kalan iş

project(state) tek başına köken kanıtlamaz; arşivden gelen state karar için tarihsel katalogla doğrulanmalıdır. Katalogdaki vettedContent alanı çağıranın beyanıdır, insan tıbbi onayı değildir. Tarihsel görev sürümlerini saklama dış katmanın sorumluluğudur.

IDB kalıcılığı, disk atomikliği, FSRS, import/restore, kontrol uygunluğu, çok görevli/terminal oturum ve UI bağlantısı bu dilimde yok. TUS005 kapanmaz; kalan işler kartta. TUS003/007/010 kapıları sürer. Yeni hosting/deployment yok.
