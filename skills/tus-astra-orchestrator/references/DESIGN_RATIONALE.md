# Tasarım gerekçesi ve incelenen örnekler

**İnceleme tarihi:** 10 Eylül 2026. **Yöntem:** aşağıdaki birincil/resmî sayfa ve açık kaynak skill metinlerinin hedefli okunması. Bu, bütün ekosistemin sistematik karşılaştırması veya bu paketin performans kıyası değildir. Değişken web belgelerinin bu tarihte erişilen sürümleri kullanılmıştır.

## Kaynak → kullanılan fikir → bilinçli ayrım

| Kaynak | İncelenen fikir | Bu paketteki yorum |
|---|---|---|
| Agent Skills specification | YAML başlık + SKILL.md; ayrıntının gerektiğinde yüklenmesi. | Kısa çekirdek, görev anında açılan protokoller. Tüm arşiv ana bağlama yüklenmez. |
| OpenAI, Subagents | Ana ajan/alt ajan ayrımı, ayrı bağlam, model/efor ve izinlerin çalışma ortamına bağlılığı. | Araç keşfi ve istenen/etkili ayar ayrımı. Sınırsız paralellik yerine 2 yürütme/1 ortak yazıcı başlangıcı. |
| OpenAI Cookbook, PLANS.md / ExecPlans | Yeni bağlamda sürdürülebilen uygulama planı ve somut kabul. | Görev kartı + kısa STATE. Her görevde büyük ve tamamen tekrarlanan bir proje planı zorunlu değil. |
| Anthropic, Multi-agent research system | Orkestratör–araştırmacı iş bölümü, sınırları açık delege görevler ve kaynak maliyeti. | Karar sorusuna odaklı araştırma; ayrık soruları paralelleştirme. Araştırma iç değerlendirme sonuçlarını kodlama/TUS üstünlüğüne genellememe. |
| Anthropic, Effective harnesses for long-running agents | Küçük ilerleme, kalıcı durum ve taze oturumda toparlanma. | Kanıtlı checkpoint ve ilk doğrulama. Yüzlerce ayrıntılı spekülatif özelliği baştan oluşturmama. |
| obra/superpowers, subagent-driven-development | Taze görev bağlamı ve uygulama sonrası şartname/kalite incelemesi. | Riskle orantılı review. Düşük riskte gereksiz komite yok; kritik işte ayrı görüş korunur. |
| obra/superpowers, verification-before-completion | Tamamlanma iddiasından önce gerçek doğrulama. | Hedef sürüme bağlı test/CI kanıtı. Aynı geçerli snapshot'ın kanıtını gereksiz tekrar çalıştırmama; değişince yeniden doğrulama. |

### Doğrudan erişilen adresler

- Agent Skills: `https://agentskills.io/specification`
- OpenAI alt ajan belgesi: `https://developers.openai.com/codex/multi-agent` (erişimde resmî `learn.chatgpt.com/docs/agent-configuration/subagents` sayfasına yönlendi).
- OpenAI ExecPlans: `https://developers.openai.com/cookbook/articles/codex_exec_plans`
- Anthropic araştırma sistemi: `https://www.anthropic.com/engineering/multi-agent-research-system`
- Anthropic uzun görev düzeni: `https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents`
- Superpowers proje sayfası: `https://github.com/obra/superpowers`
- İncelenen görev skill'i: `https://raw.githubusercontent.com/obra/superpowers/main/skills/subagent-driven-development/SKILL.md`
- İncelenen doğrulama skill'i: `https://raw.githubusercontent.com/obra/superpowers/main/skills/verification-before-completion/SKILL.md`

Framework'lerin kaynak kodu ve skill metinleri pakete alınmadı; bu dosyadaki kısa karşılaştırma dışında yeniden yayımlanmadı. Verilen dosyalar bu proje için özgün yazılmıştır. Kullanmak için Superpowers, LangGraph, CrewAI veya başka bir orkestrasyon framework'ü kurulması gerekmez.

## Projeye özgü tasarım katkıları

**Açık iş ile kanıtlı geçmiş ayrımı:** Kullanıcının tamamlanan işi backlogdan çıkarma isteği korunur; geçmiş karar/test kanıtı silinmez. Sadece bir “done” kutusu değil, sürüme bağlı kapanış vardır.

**Tek durum kaynağı:** BACKLOG açık durumları, CLOSED kapanışları, task kartları kabul şartlarını taşır. STATE'in görevi yeniden başlatma ve aktif sahipliktir; ikinci bir görev panosu değildir. Başka issue sistemi kullanılacaksa hangisinin yetkili olduğu kararlaştırılmadan iki yönlü bağımsız durum tutulmaz.

**Üç doğrulama kapısı:** Yazılım, tıbbi içerik ve öğrenme yararı farklıdır. Genel coding skill'lerinde bulunması gerekmeyen bu ayrım TUS planının temel sınırıdır. Araştırma sonucu da doğrudan ürün özelliği onayına dönüşmez.

**Tamamlanma–yayın ayrımı:** Bir kod görevi testlenip kabul edilebilir; ürünün tıbbi/eğitimsel yayın kapısı yine açık kalabilir. Kodu bitirmenin uygulamanın bütün amaçlarını kanıtladığı iddia edilmez.

**Kabiliyet farkındalığı:** Model etiketi ve dosya protokolü gerçek alt ajan aracı yaratmaz. Eksik bağımsız inceleme, saklanmayan bir tamamlanma açığıdır. Bu, olmayan ajanları rol yaparak canlandırmaktan daha güvenilir bir çalışma sınırıdır.

**Süreç yükünü sınırlama:** Bir risk sınıfı, tek canlı backlog, tek kısa checkpoint ve göreve özel paket. Ayrı veritabanı, otomatik mesajlaşma servisi veya token yönlendirme motoru yok. Başlangıç limitlerini ancak gerçek iş kayıtlarıyla değiştirme.

## Bilinmeyenler

Bu düzenin GPT-6 Astra için bütün alternatiflerden hızlı veya ucuz olduğu ölçülmedi. İki yürütme limiti, high efor tercihi ve risk katmanları başlangıç politikalarıdır. Kullanılacağı istemcinin gerçek alt ajan/model/izolasyon seçenekleri ilk çalışma sırasında doğrulanmalıdır. Sağlanan TUS planının bütün kaynakları bu orkestrasyon çalışmasında yeniden taranmadı.
