# TUS öğrenme akışı teknik demosu

Bu klasör eski `prototype/app.js` uygulamasından ayrı bir çalışma alanıdır. Tıbbi içerik içermez. Ekranlarda kullanılan “ısı denetleyicisi”, yalnız yanıt, yardım, güven, değerlendirme, itiraz, ara verme ve geri dönme mekaniklerini sınayan açıkça kurgusal bir modeldir. Teknik testlerin geçmesi içerik doğruluğu, öğrenme etkisi, TUS başarısı, ustalık veya üretime hazır Android teslimi anlamına gelmez.

`index.html`, üst dizindeki `session-core.js` ve `session-store.js` dosyalarını global `TusSessionCore` ve `TusSessionStore` adlarıyla yükler. Beklenen store API’si:

```js
await TusSessionStore.open({ catalog, dbName: "tus-learning-demo-v2" })
// => { load(workspaceId), dispatch(workspaceId, commandsArray), close() }
```

Her alıştırma kendi session/attempt kimliğini kullanır. İkinci alıştırma aynı hedefe bağlıdır ve başlangıçta `study` maruziyeti kaydedildiği için açıkça desteklidir; bağımsız ilerleme veya kontrol sonucu olarak sunulmaz. Adım değişimleri `advance_step` ile kaydedilir. Tamamlanan session `end_session` ile kapanır. Yeniden yüklemede rota yetkili state projeksiyonundaki session durumu, `currentStep`, yanıt ve değerlendirmeden türetilir.

“Yeni demo denemesi” yeni bir workspace kimliği üretir. Önceki workspace ve olay günlüğü silinmez. Yeni alan yüklenemezse mevcut kimlik ve state korunur. Yalnız güvenli metin JSON dışa aktarımı vardır; içe aktarma yoktur. Kalıcı modda workspace kimliği `localStorage` içinde sadece demo tercihi olarak tutulur; öğrenme state’i store’dadır. Tercih depolaması engellenirse demo bu sekmede çalışır ve yeniden açılışta aynı kayda otomatik dönemeyebileceğini açıkça gösterir. Memory store veya `TUS_PORTABLE_DEMO` kullanılan taşınabilir paket `localStorage` ve service worker kullanmaz; başlıkta kapatınca kayıtların silineceğini açıkça belirtir.

Yerel geliştirme için repo kökünde statik bir HTTP sunucusu açın ve `/prototype/preview/` yolunu ziyaret edin. Service worker, scope ve sürüm adını taşıyan ayrı cache’e kabuğu ve iki bağımlılığı install sırasında birlikte alır; gezinmeleri aynı cache’teki `index.html` ile, diğer kabuk isteklerini cache-first karşılar ve cache’i ağ yanıtlarıyla parçalı güncellemez. `CACHE_VERSION` yayın paketinde tam asset hash’iyle değiştirilir. Ham geliştirme dosyaları değiştiğinde `CACHE_VERSION` artırılmalı veya hash üreten build kullanılmalıdır. Kurulum ve güvenilir çevrimdışı kullanım sabit bir **HTTPS** adresi gerektirir. Bu repo durumunda hosting yapılmamıştır; yerel sunucu nihai Android teslim yolu değildir.

Browser kontrolü, core ve store entegre edildikten sonra repo kökünden çalışır:

```sh
node tests/browser/preview.spec.cjs
```

`PREVIEW_BASE_URL` verilirse test mevcut sunucuyu kullanır; verilmezse test kendi yerel sunucusunu açar. Playwright, `CODEX_PRIMARY_RUNTIME_NODE_MODULES` üzerinden de çözümlenebilir.
Özel bir Chromium ikilisi kullanılacaksa yolu `PREVIEW_CHROMIUM_PATH` ile verilebilir.
