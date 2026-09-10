"use strict";

const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");

function loadPlaywright() {
  try { return require("playwright"); } catch (firstError) {
    const modules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
    if (!modules) throw firstError;
    return require(path.join(modules, "playwright"));
  }
}

function localServer() {
  const mime = {
    ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8", ".svg": "image/svg+xml"
  };
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const relative = requestPath === "/" ? "prototype/preview/index.html" : requestPath.replace(/^\/+/, "");
    let file = path.resolve(repoRoot, relative);
    if (!file.startsWith(repoRoot + path.sep)) { response.writeHead(403).end(); return; }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      response.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
      fs.createReadStream(file).pipe(response);
    } catch (_) { response.writeHead(404).end("not found"); }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve({
      baseURL: `http://127.0.0.1:${server.address().port}/prototype/preview/`,
      close: () => new Promise((done) => server.close(done))
    }));
  });
}

async function openFresh(browser, baseURL, options = {}) {
  const context = await browser.newContext({ viewport: { width: 800, height: 1100 } });
  if (options.portable) {
    await context.addInitScript(() => {
      window.TUS_PORTABLE_DEMO = true;
      Storage.prototype.getItem = function () { throw new DOMException("blocked", "SecurityError"); };
      Storage.prototype.setItem = function () { throw new DOMException("blocked", "SecurityError"); };
    });
  }
  const page = await context.newPage();
  await page.goto(baseURL + "?testMode=1");
  await page.getByTestId("start").waitFor();
  return { context, page };
}

async function begin(page) {
  await page.getByTestId("start").click();
  await page.getByTestId("option-power-up").waitFor();
}

async function answer(page, option, confidence) {
  await page.getByTestId("option-" + option).click();
  await page.getByTestId("submit").click();
  await page.getByRole("heading", { name: "Ne kadar emindin?" }).waitFor();
  if (confidence) await page.getByRole("button", { name: confidence }).click();
  await page.getByTestId("evaluate").click();
  await page.getByTestId("feedback").waitFor();
}

(async () => {
  const suppliedURL = process.env.PREVIEW_BASE_URL;
  const server = suppliedURL ? null : await localServer();
  const baseURL = suppliedURL || server.baseURL;
  const { chromium } = loadPlaywright();
  const launchOptions = { headless: true };
  if (process.env.PREVIEW_CHROMIUM_PATH) launchOptions.executablePath = process.env.PREVIEW_CHROMIUM_PATH;
  const browser = await chromium.launch(launchOptions);
  let passed = 0;

  async function check(name, fn) {
    try { await fn(); passed += 1; process.stdout.write(`ok - ${name}\n`); }
    catch (error) { error.message = `${name}: ${error.message}`; throw error; }
  }

  try {
    await check("doğru + tahmin doğru kalır, reload sonucu korur ve destekli tur tamamlanır", async () => {
      const { context, page } = await openFresh(browser, baseURL);
      await begin(page);
      await answer(page, "power-up", "Tahmin ettim");
      assert.match(await page.getByTestId("feedback").innerText(), /Yanıt doğru olarak kalıyor/i);
      await page.reload();
      assert.match(await page.getByTestId("feedback").innerText(), /Doğru yanıt/i);
      await page.getByTestId("next").click();
      await page.getByText("Destek açık.").waitFor();
      assert.match(await page.locator("main").innerText(), /bağımsız ilerleme sayılmaz/i);
      await answer(page, "power-down", "Eminim");
      await page.getByTestId("next").click();
      await page.getByTestId("summary").waitFor();
      assert.match(await page.getByTestId("summary").innerText(), /Destekli alıştırma.*destekli/is);
      const previousSummary = await page.getByTestId("summary").innerText();
      await page.evaluate(() => window.__TUS_PREVIEW_TEST__.failNextLoad("Injected load failure"));
      await page.getByTestId("new-workspace").click();
      await page.getByText("Yeni deneme açılamadı.").waitFor();
      assert.equal(await page.getByTestId("summary").innerText(), previousSummary);
      await context.close();
    });

    await check("yanlış yanıt kısa öğretim desteği gösterir", async () => {
      const { context, page } = await openFresh(browser, baseURL);
      await begin(page);
      await answer(page, "power-down", null);
      assert.match(await page.getByTestId("feedback").innerText(), /anahtarla uyuşmuyor/i);
      assert.match(await page.getByTestId("feedback").innerText(), /Beklenen: Artırmalı/i);
      await context.close();
    });

    await check("Bilmiyorum ayrı yanıttır", async () => {
      const { context, page } = await openFresh(browser, baseURL);
      await begin(page);
      await page.getByTestId("unknown").click();
      assert.match(await page.locator(".answer-lock").innerText(), /Bilmiyorum/i);
      await page.getByTestId("evaluate").click();
      assert.match(await page.getByTestId("feedback").innerText(), /Bilmiyorum yanıtın kaydedildi/i);
      await context.close();
    });

    await check("ara verme ve reload aynı route'a döner", async () => {
      const { context, page } = await openFresh(browser, baseURL);
      await begin(page);
      await page.getByRole("button", { name: "Ara ver" }).click();
      await page.getByTestId("resume").waitFor();
      await page.reload();
      await page.getByTestId("resume").click();
      await page.getByTestId("option-power-up").waitFor();
      await context.close();
    });

    await check("itiraz orijinal yanıtı korur ve sonucu nötr gösterir", async () => {
      const { context, page } = await openFresh(browser, baseURL);
      await begin(page);
      await answer(page, "power-down", "Eminim");
      await page.getByRole("button", { name: "Anahtara itiraz" }).click();
      await page.getByLabel("Yanıt anahtarı").check();
      await page.getByLabel("İsteğe bağlı not").fill("Kurgusal kural metni belirsiz görünüyor.");
      await page.getByTestId("save-dispute").click();
      await page.getByRole("heading", { name: "Bu soru inceleme bekliyor" }).waitFor();
      assert.match(await page.locator("main").innerText(), /etkili sonuçları nötr/i);
      await page.reload();
      await page.getByRole("heading", { name: "Bu soru inceleme bekliyor" }).waitFor();
      await context.close();
    });

    await check("kayıt hatası seçimi korur ve aynı komutlarla tekrar eder", async () => {
      const { context, page } = await openFresh(browser, baseURL);
      await begin(page);
      await page.getByTestId("option-power-up").click();
      await page.evaluate(() => window.__TUS_PREVIEW_TEST__.failNextDispatch("Injected storage failure"));
      await page.getByTestId("submit").click();
      await page.getByRole("button", { name: "Kaydı yeniden dene" }).waitFor();
      assert.equal(await page.getByTestId("option-power-up").getAttribute("aria-pressed"), "true");
      await page.getByRole("button", { name: "Kaydı yeniden dene" }).click();
      await page.getByRole("heading", { name: "Ne kadar emindin?" }).waitFor();
      await context.close();
    });

    await check("stale revision kullanıcı eylemiyle yeniden yüklenir", async () => {
      const { context, page } = await openFresh(browser, baseURL);
      await begin(page);
      await page.getByTestId("option-power-up").click();
      await page.evaluate(() => window.__TUS_PREVIEW_TEST__.failNextDispatch("stale expectedRevision"));
      await page.getByTestId("submit").click();
      await page.getByRole("button", { name: "Kaydı yeniden yükle" }).waitFor();
      await page.getByRole("button", { name: "Kaydı yeniden yükle" }).click();
      assert.equal(await page.getByTestId("option-power-up").getAttribute("aria-pressed"), "true");
      await page.getByTestId("submit").click();
      await page.getByRole("heading", { name: "Ne kadar emindin?" }).waitFor();
      await context.close();
    });

    await check("portable memory modu localStorage ve service worker olmadan açılır", async () => {
      const { context, page } = await openFresh(browser, baseURL, { portable: true });
      await page.getByText("Geçici deneme · kapatınca kayıtlar silinir").waitFor();
      await page.getByText("Geçici ekran denemesi").waitFor();
      await begin(page);
      await context.close();
    });

    process.stdout.write(`# ${passed} preview browser checks passed\n`);
  } finally {
    await browser.close();
    if (server) await server.close();
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
