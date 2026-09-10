# Kapanış · TUS-###

Task-ID: TUS-###
Outcome: done
Risk: <gerçek R0/R1/R2>
Review-mode: <self-review | independent-context | human-review>
Target: <gerçek commit veya kapsamı belirtilmiş dosya manifest özeti>
Accepted-by: <Astra oturum/inceleme kimliği>
Accepted-on: <ISO tarih>

## Acceptance evidence

| Criterion | Result | Evidence |
|---|---|---|
| AC1 | PASS | <doğrudan gözlem / kayıt yolu ve ilgili bölüm> |
| AC2 | PASS | <gerçek kanıt> |

Bu alanlar şablondur; gerçek kanıt olmadan CLOSED'a ekleme. N/A yalnız kapsam açısından uygulanamazsa ve Astra gerekçeyi yazmışsa kullanılabilir. NOT_RUN, FAIL, INCONCLUSIVE ile done kapanışı yok.

## Verification

Tam komutlar; cwd; ortam/toolchain; hedef commit/manifest; çıkış kodu; beklenen testlerin gerçekten çalıştığı sonuç ve log/CI konumu. Belge/araştırma işinde yapılan kontrolü belirt; ürün testi koşulmuş gibi yazma.

## Review

Gerçek bağımsız inceleme/öz-inceleme/human-review ayrımı; hedef sürüm; kapatılmış bulgular. R0'da Astra öz-incelemesi neden yeterli? R1/R2'de hangi ayrı inceleme yapıldı? Tıbbi içerikte gerekli gerçek insan onayı nerede?

## Residual work

Kalan kapsam dışı takip kimlikleri veya NONE. Görevin zorunlu maddesi burada saklanamaz. Yayın ve eğitimsel etkinlik iddiası bu görevin kabulünden otomatik türemez.

## Başarı dışı kapanış biçimi

İptalde `Outcome: cancelled`, yerine başka iş geldiyse `Outcome: superseded` kullan. Bu durumda asgari Task-ID, Outcome, tarih ve `## Reason` bölümüyle gerekçe/yerine geçen işi kaydet. Done kanıt tablosu doldurulmaz; başarı iddiası kurulmaz. Bağımlı işler yeniden değerlendirilir.
