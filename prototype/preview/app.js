(function () {
  "use strict";

  var DB_NAME = "tus-learning-demo-v2";
  var WORKSPACE_KEY = "tus.preview.workspace.v2";
  var WORKSPACE_LIST_KEY = "tus.preview.workspaces.v2";
  var TASKS = {
    "heat-signal-1": {
      title: "İlk deneme",
      prompt: "Kurgusal ısı denetleyicisinde sensör sinyali düşük. Bu, ortamın hedef sıcaklığın altında olduğu anlamına geliyor. Denetleyici hedefe dönmek için ısıtıcı gücünü nasıl değiştirmeli?",
      options: [
        ["power-up", "Artırmalı"],
        ["power-down", "Azaltmalı"],
        ["power-hold", "Değiştirmemeli"]
      ],
      answer: "Artırmalı",
      rationale: "Düşük sinyal, hedefin altında olunduğunu bildirir. Bu kurgusal kuralda denetleyici hedefe yaklaşmak için ısıtıcı gücünü artırır.",
      hint: "Hedefin altında kalan ortamı hedefe yaklaştıracak yönü düşün.",
      source: "Kurgusal teknik kural: düşük sinyal → ısıtıcı gücü artar; yüksek sinyal → ısıtıcı gücü azalır. Bu bir tıbbi bilgi değildir."
    },
    "heat-signal-2": {
      title: "Destekli alıştırma",
      prompt: "Ortam hedefi aştı ve sensör sinyali artık yüksek. Aynı kurgusal kurala göre denetleyici ısıtıcı gücünü nasıl değiştirmeli?",
      options: [
        ["power-up", "Artırmalı"],
        ["power-down", "Azaltmalı"],
        ["power-hold", "Değiştirmemeli"]
      ],
      answer: "Azaltmalı",
      rationale: "Yüksek sinyal, hedefin aşıldığını bildirir. Verilen kuralda denetleyici hedefe yaklaşmak için ısıtıcı gücünü azaltır.",
      hint: "Bu alıştırmada kuralı birlikte uyguluyoruz: yüksek sinyalde güç azaltılır.",
      source: "Kurgusal teknik kural: düşük sinyal → güç artar; yüksek sinyal → güç azalır."
    }
  };

  var CATALOG = {
    schemaVersion: 1,
    tasks: [
      makeTask("heat-signal-1", "heat-direction-first", "power-up"),
      makeTask("heat-signal-2", "heat-direction-supported", "power-down")
    ]
  };

  var app = document.getElementById("app");
  var notice = document.getElementById("notice");
  var store = null;
  var state = null;
  var workspaceId = "";
  var draft = { selected: null, confidence: null, category: null, note: "" };
  var localRoute = null;
  var pending = null;
  var errorState = null;
  var busy = false;
  var testMode = new URLSearchParams(location.search).get("testMode") === "1";
  var injectedFailure = null;
  var injectedLoadFailure = null;
  var memoryMode = Boolean(globalThis.TUS_PORTABLE_DEMO);
  var preferenceWarning = "";

  function makeTask(id, familyId, correctOptionKey) {
    return {
      id: id,
      version: "1.0.0",
      objective: { id: "synthetic-heat-control", version: "1.0.0" },
      family: { id: familyId, version: "1.0.0" },
      source: { id: "fictional-controller-rules", version: "1.0.0" },
      key: { id: "key-" + id, version: "1.0.0" },
      policy: { id: "technical-demo-policy", version: "1.0.0" },
      bank: "training",
      status: "synthetic",
      vettedContent: false,
      optionKeys: ["power-up", "power-down", "power-hold"],
      correctOptionKey: correctOptionKey
    };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[char];
    });
  }

  function id(prefix) {
    var suffix = globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    return prefix + "-" + suffix;
  }

  function readWorkspacePreference() {
    if (memoryMode) return null;
    try { return localStorage.getItem(WORKSPACE_KEY); }
    catch (_) {
      preferenceWarning = "Çalışma alanı tercihi okunamadı. Bu sekmede devam edebilirsin; yeniden açınca aynı kayda otomatik dönmeyebilir.";
      return null;
    }
  }

  function rememberWorkspace(value) {
    if (memoryMode) return true;
    try {
      localStorage.setItem(WORKSPACE_KEY, value);
      var list;
      try { list = JSON.parse(localStorage.getItem(WORKSPACE_LIST_KEY) || "[]"); } catch (_) { list = []; }
      if (!Array.isArray(list)) list = [];
      if (list.indexOf(value) === -1) list.push(value);
      localStorage.setItem(WORKSPACE_LIST_KEY, JSON.stringify(list.slice(-50)));
      return true;
    } catch (_) {
      preferenceWarning = "Çalışma alanı tercihi saklanamadı. Bu sekmede devam edebilirsin; yeniden açınca aynı kayda otomatik dönmeyebilir.";
      return false;
    }
  }

  function nowSeries(count) {
    var latest = state && state.events.length ? Date.parse(state.events[state.events.length - 1].at) : 0;
    var start = Math.max(Date.now(), latest + 1);
    return Array.from({ length: count }, function (_, i) { return new Date(start + i).toISOString(); });
  }

  function commands(specs) {
    var times = nowSeries(specs.length);
    return specs.map(function (spec, index) {
      return Object.assign({
        id: id("cmd"),
        type: spec.type,
        at: times[index],
        expectedRevision: state.revision + index,
        sessionId: spec.sessionId,
        attemptId: spec.attemptId
      }, spec.fields || {});
    });
  }

  function project() { return TusSessionCore.project(state); }

  function latestContext() {
    if (!state || !state.events.length) return null;
    var starts = state.events.filter(function (event) { return event.type === "start_session"; });
    if (!starts.length) return null;
    var command = starts[starts.length - 1].command;
    var view = project();
    return {
      session: view.sessions[command.sessionId],
      attempt: view.attempts[command.attemptId],
      sessionId: command.sessionId,
      attemptId: command.attemptId,
      taskId: starts[starts.length - 1].origin.task.id,
      view: view
    };
  }

  function routeFor(context) {
    if (!context) return "intro";
    if (context.session.status === "review_pending" || context.attempt.dispute) return "review";
    if (context.session.status === "paused") return "paused";
    if (localRoute === "dispute") return "dispute";
    if (context.session.status === "completed") return "summary";
    if (context.session.currentStep === "dispute") return "dispute";
    if (context.attempt.evaluation) return "result";
    if (context.attempt.answer) return "confidence";
    return "question";
  }

  function shell(body, className) {
    app.innerHTML = '<section class="screen"><div class="screen-card ' + (className || "") + '">' + body + preferenceWarningMarkup() + errorMarkup() + "</div></section>";
    bindCommon();
    app.focus({ preventScroll: true });
  }

  function errorMarkup() {
    if (!errorState) return "";
    if (errorState.workspace) {
      return '<div class="material error-panel"><strong>Yeni deneme açılamadı.</strong><p>Önceki deneme korunuyor. ' + escapeHtml(errorState.message) + '</p><button class="button button-danger" data-action="dismiss-error">Kapat</button></div>';
    }
    if (errorState.stale) {
      return '<div class="material error-panel"><strong>Kayıt başka bir durumda.</strong><p>Güncel kaydı yükleyip bu ekrandan yeniden karar ver.</p><button class="button button-danger" data-action="reload-state">Kaydı yeniden yükle</button></div>';
    }
    return '<div class="material error-panel"><strong>Kayıt tamamlanamadı.</strong><p>Seçimin korunuyor. Aynı kayıt komutunu yeniden deneyebilirsin.</p><button class="button button-danger" data-action="retry">Kaydı yeniden dene</button></div>';
  }

  function preferenceWarningMarkup() {
    if (!preferenceWarning || memoryMode) return "";
    return '<div class="material error-panel" role="status"><strong>Dönüş tercihi kullanılamıyor.</strong><p>' + escapeHtml(preferenceWarning) + '</p></div>';
  }

  function bindCommon() {
    app.querySelectorAll("[data-action]").forEach(function (button) {
      button.addEventListener("click", handleAction);
    });
    app.querySelectorAll("textarea[data-note]").forEach(function (field) {
      field.addEventListener("input", function () { draft.note = field.value; });
    });
  }

  function render() {
    var context = latestContext();
    var route = routeFor(context);
    if (route === "intro") renderIntro();
    else if (route === "question") renderQuestion(context);
    else if (route === "confidence") renderConfidence(context);
    else if (route === "result") renderResult(context);
    else if (route === "paused") renderPaused(context);
    else if (route === "dispute") renderDispute(context);
    else if (route === "review") renderReview(context);
    else renderSummary(context);
  }

  function renderIntro() {
    shell(
      '<p class="eyebrow">Sentetik · teknik demo</p>' +
      '<h1>Öğrenme akışını dene</h1>' +
      '<p class="lede">Tıbbi içerik incelemesi sürüyor. Bu demo, kurgusal bir ısı denetleyicisiyle ekranları ve kayıt akışını denetir.</p>' +
      '<div class="synthetic-note"><strong>Tıbbi içerik değildir.</strong><br>Yanıtın kaydı, isteğe bağlı güven, kısa destek, ara verme ve itiraz yollarını deneyebilirsin.</div>' +
      '<div class="meta-row"><span class="chip">Tek hedef</span><span class="chip">2–3 dakika</span><span class="chip">Büyük dokunma alanları</span></div>' +
      '<div class="action-stack"><button class="button button-primary" data-action="start" data-testid="start">Başla</button></div>' +
      '<div class="utility-row"><button class="button button-quiet" data-action="export">Bu boş denemeyi dışa aktar</button></div>'
    );
  }

  function exposures(attempt) {
    return attempt.exposures.reduce(function (set, item) { set[item.material] = true; return set; }, {});
  }

  function renderQuestion(context) {
    var task = TASKS[context.taskId];
    var seen = exposures(context.attempt);
    var supported = context.taskId === "heat-signal-2";
    var optionHtml = task.options.map(function (option, index) {
      var selected = draft.selected === option[0];
      return '<button class="option" data-action="select" data-value="' + option[0] + '" aria-pressed="' + selected + '" data-testid="option-' + option[0] + '">' +
        '<span class="option-key">' + String.fromCharCode(65 + index) + '</span><span>' + option[1] + '</span><span class="option-check" aria-hidden="true">✓</span></button>';
    }).join("");
    var material = "";
    if (seen.source) material += '<div class="material" data-testid="source"><strong>Kural kaydı</strong><p>' + task.source + "</p></div>";
    if (seen.hint) material += '<div class="material" data-testid="hint"><strong>İpucu</strong><p>' + task.hint + "</p></div>";
    shell(
      '<p class="eyebrow">' + (supported ? "Destekli alıştırma · bağımsız ilerleme değil" : "1 / 2 · İlk yanıt") + '</p>' +
      '<h1>' + task.title + '</h1>' +
      (supported ? '<div class="synthetic-note"><strong>Destek açık.</strong> Bu alıştırma aynı hedefi birlikte uygular ve bağımsız ilerleme sayılmaz.</div>' : "") +
      '<p class="question">' + task.prompt + '</p>' + material +
      '<div class="options two-column" role="group" aria-label="Yanıt seçenekleri">' + optionHtml + '</div>' +
      '<div class="action-stack"><button class="button button-primary" data-action="submit" data-testid="submit" ' + (!draft.selected || busy ? "disabled" : "") + '>Yanıtı kaydet</button>' +
      '<button class="button button-secondary" data-action="unknown" data-testid="unknown" ' + (busy ? "disabled" : "") + '>Bilmiyorum</button></div>' +
      '<div class="utility-row"><button class="button button-quiet" data-action="hint">İpucunu aç</button><button class="button button-quiet" data-action="source">Kurgusal kuralı gör</button><button class="button button-quiet" data-action="pause">Ara ver</button></div>'
    );
  }

  function answerLabel(attempt) {
    if (attempt.answer.response.kind === "unknown") return "Bilmiyorum";
    var task = TASKS[attempt.origin.task.id];
    var row = task.options.find(function (option) { return option[0] === attempt.answer.response.selectedOptionKey; });
    return row ? row[1] : attempt.answer.response.selectedOptionKey;
  }

  function renderConfidence(context) {
    var confidence = [["sure", "Eminim"], ["unsure", "Emin değilim"], ["guess", "Tahmin ettim"]];
    shell(
      '<p class="eyebrow">Yanıt kaydedildi</p><h1>Ne kadar emindin?</h1>' +
      '<p class="answer-lock">İlk yanıtın kilitli: <strong>' + escapeHtml(answerLabel(context.attempt)) + '</strong></p>' +
      '<p class="supporting">Bu beyan isteğe bağlıdır ve yanıtının doğruluğunu değiştirmez.</p>' +
      '<div class="confidence-grid" role="group" aria-label="Güven beyanı">' + confidence.map(function (item) {
        return '<button class="option" data-action="confidence" data-value="' + item[0] + '" aria-pressed="' + (draft.confidence === item[0]) + '">' + item[1] + '</button>';
      }).join("") + '</div>' +
      '<div class="action-stack"><button class="button button-primary" data-action="evaluate" data-testid="evaluate">Sonucu gör</button></div>' +
      '<div class="utility-row"><span class="supporting">Seçmeden devam edebilirsin.</span><button class="button button-quiet" data-action="pause">Ara ver</button></div>'
    );
  }

  function resultCopy(context) {
    var attempt = context.attempt;
    var result = attempt.evaluation.effectiveResult;
    var confidence = attempt.answer.confidence && attempt.answer.confidence.value;
    if (result === "correct" && confidence === "guess") return ["Doğru yanıt", "Tahmin ettiğini belirttin. Yanıt doğru olarak kalıyor; nedenini ayrı çalışabilirsin."];
    if (result === "correct" && confidence === "sure") return ["Doğru yanıt", TASKS[context.taskId].rationale];
    if (result === "correct") return ["Doğru yanıt", "Yönü doğru seçtin. " + TASKS[context.taskId].rationale];
    if (result === "unknown") return ["Bilmiyorum yanıtın kaydedildi", "Önce kısa bağlantıyı kuralım. " + TASKS[context.taskId].rationale];
    return ["Yanıt anahtarla uyuşmuyor", "Beklenen: " + TASKS[context.taskId].answer + ". " + TASKS[context.taskId].rationale];
  }

  function renderResult(context) {
    var copy = resultCopy(context);
    var wrong = context.attempt.evaluation.result !== "correct";
    var second = context.taskId === "heat-signal-2";
    shell(
      '<p class="eyebrow">' + (second ? "Destekli sonuç" : "İlk yanıt sonucu") + '</p>' +
      '<h1>Yanıt kaydı tamamlandı</h1>' +
      '<div class="result-card ' + (wrong ? "wrong" : "") + '" data-testid="feedback"><h2>' + copy[0] + '</h2><p>' + copy[1] + '</p></div>' +
      (second ? '<p class="supporting">Bu sonuç destekli alıştırmaya aittir; bağımsız ilerleme veya ustalık sonucu değildir.</p>' : '<p class="supporting">İlk seçim, güven beyanı ve varsa yardım kaydı ayrı tutuldu.</p>') +
      '<div class="action-stack"><button class="button button-primary" data-action="' + (second ? "finish" : "next") + '" data-testid="next">' + (second ? "Denemeyi bitir" : "Destekli alıştırmaya geç") + '</button></div>' +
      '<div class="utility-row"><button class="button button-quiet" data-action="dispute">Anahtara itiraz</button><button class="button button-quiet" data-action="pause">Ara ver</button></div>'
    );
  }

  function renderPaused(context) {
    var step = context.session.currentStep === "confidence" ? "güven beyanı" : context.session.currentStep === "feedback" ? "yanıt sonucu" : "soru";
    shell(
      '<p class="eyebrow">Ara verildi</p><h1>' + (memoryMode ? "Kaldığın yer bu sayfada duruyor" : "Kaldığın yer kayıtlı") + '</h1>' +
      '<p class="lede">Kaldığın yer: <strong>' + step + '</strong>. Gönderilmiş ilk yanıt yeniden oluşturulmayacak.</p>' +
      '<p class="supporting">' + (memoryMode ? "Bu geçici deneme sayfa kapatılınca silinir. " : "") + 'Gönderilmemiş ekran seçimi bir yanıt kaydı değildir.</p>' +
      '<div class="action-stack"><button class="button button-primary" data-action="resume" data-testid="resume">Devam et</button></div>'
    );
  }

  function renderDispute(context) {
    var categories = [["key", "Yanıt anahtarı"], ["root", "Sorunun koşulları"], ["source", "Kural/kaynak çelişkisi"], ["other", "Başka bir neden"]];
    shell(
      '<p class="eyebrow">Yanıt kaydı korunur</p><h1>Bu anahtarla ilgili sorun ne?</h1>' +
      '<fieldset class="radio-list"><legend class="supporting">Bir kategori seç</legend>' + categories.map(function (item) {
        return '<label class="radio-row"><input type="radio" name="category" data-action="category" value="' + item[0] + '" ' + (draft.category === item[0] ? "checked" : "") + '><span>' + item[1] + '</span></label>';
      }).join("") + '</fieldset>' +
      '<label for="dispute-note">İsteğe bağlı not</label><textarea id="dispute-note" data-note maxlength="1000" placeholder="Kısa notunu yazabilirsin">' + escapeHtml(draft.note) + '</textarea>' +
      '<div class="action-stack"><button class="button button-primary" data-action="save-dispute" data-testid="save-dispute" ' + (!draft.category ? "disabled" : "") + '>İtirazı kaydet</button><button class="button button-secondary" data-action="cancel-dispute">Vazgeç</button></div>'
    );
  }

  function renderReview(context) {
    var dispute = context.attempt.dispute;
    shell(
      '<p class="eyebrow">Hedef askıda</p><h1>Bu soru inceleme bekliyor</h1>' +
      '<div class="score-neutral"><strong>' + (memoryMode ? "Yanıtın bu geçici denemede duruyor." : "Yanıtın saklandı.") + '</strong><p>İtiraz nedeniyle bu hedefin etkili sonuçları nötr durumda. Bu demo bir inceleme kararı üretmez.</p></div>' +
      '<ul class="summary-list"><li>Kategori: <strong>' + escapeHtml(dispute ? dispute.category : "kayıtlı") + '</strong></li>' +
      (dispute && dispute.note ? '<li>Not: ' + escapeHtml(dispute.note) + '</li>' : "") + '</ul>' +
      '<p class="supporting">' + (memoryMode ? "İtiraz yalnız bu açık geçici denemede durur." : "İtiraz bu cihazdaki çalışma alanında kayıtlıdır.") + '</p>' +
      '<div class="action-stack"><button class="button button-primary" data-action="new-workspace" data-testid="new-workspace">Yeni demo denemesi</button></div>' +
      '<div class="utility-row"><button class="button button-quiet" data-action="export">Bu denemeyi dışa aktar</button></div>'
    );
  }

  function allAttempts() {
    var view = project();
    return state.events.filter(function (e) { return e.type === "start_session"; }).map(function (e) {
      return view.attempts[e.command.attemptId];
    });
  }

  function renderSummary() {
    var attempts = allAttempts();
    var rows = attempts.map(function (attempt, index) {
      var evaluation = attempt.evaluation;
      var label = evaluation.result === "correct" ? "anahtarla uyumlu" : evaluation.result === "incorrect" ? "anahtarla uyumsuz" : "bilmiyorum";
      return '<li><strong>' + (index === 0 ? "İlk yanıt" : "Destekli alıştırma") + ':</strong> ' + label + (attempt.answer.assistance === "assisted" ? " · destekli" : " · yardım açılmadan") + '</li>';
    }).join("");
    shell(
      '<p class="eyebrow">Demo tamamlandı</p><h1>Bu denemede ne kaydedildi?</h1>' +
      '<ul class="summary-list" data-testid="summary">' + rows + '</ul>' +
      '<p class="lede">Bu kayıt teknik akışı gösterir. Ustalık, öğrenme etkisi, sınav puanı veya sonraki çalışma tarihi çıkarılmaz.</p>' +
      '<div class="action-stack"><button class="button button-primary" data-action="new-workspace" data-testid="new-workspace">Yeni demo denemesi</button></div>' +
      '<div class="utility-row"><button class="button button-quiet" data-action="summary-dispute">Son yanıta itiraz</button><button class="button button-quiet" data-action="export">Bu denemeyi dışa aktar</button></div>'
    );
  }

  function handleAction(event) {
    var action = event.currentTarget.dataset.action;
    if (busy) return;
    if (action === "select") { draft.selected = event.currentTarget.dataset.value; errorState = null; pending = null; render(); return; }
    if (action === "confidence") { draft.confidence = event.currentTarget.dataset.value; errorState = null; pending = null; render(); return; }
    if (action === "category") { draft.category = event.currentTarget.value; render(); return; }
    if (action === "start") startFirst();
    else if (action === "submit") submitAnswer(false);
    else if (action === "unknown") submitAnswer(true);
    else if (action === "evaluate") evaluate();
    else if (action === "hint" || action === "source") openMaterial(action);
    else if (action === "pause") pause();
    else if (action === "resume") resume();
    else if (action === "next") nextExercise();
    else if (action === "finish") finish();
    else if (action === "dispute") openDispute();
    else if (action === "summary-dispute") { localRoute = "dispute"; render(); }
    else if (action === "cancel-dispute") cancelDispute();
    else if (action === "save-dispute") saveDispute();
    else if (action === "new-workspace") newWorkspace();
    else if (action === "export") exportState();
    else if (action === "retry") retryPending();
    else if (action === "reload-state") reloadState();
    else if (action === "dismiss-error") { errorState = null; render(); }
  }

  function run(key, commandList, after) {
    pending = { key: key, commands: commandList, after: after };
    busy = true;
    errorState = null;
    return dispatchPending();
  }

  async function dispatchPending() {
    if (!pending) return;
    var activePending = pending;
    try {
      if (injectedFailure) { var message = injectedFailure; injectedFailure = null; throw new Error(message); }
      var next = await store.dispatch(workspaceId, activePending.commands);
      TusSessionCore.validateState(next, CATALOG);
      state = next;
      var after = activePending.after;
      pending = null;
      busy = false;
      errorState = null;
      if (after) after();
      render();
    } catch (error) {
      busy = false;
      var message = error && error.message ? error.message : String(error);
      errorState = { stale: /stale|revision/i.test(message), message: message };
      render();
    }
  }

  function retryPending() {
    if (busy || !pending) return;
    busy = true;
    errorState = null;
    dispatchPending();
  }

  async function reloadState() {
    try {
      state = await loadWorkspace(workspaceId);
      TusSessionCore.validateState(state, CATALOG);
      pending = null;
      errorState = null;
      busy = false;
      localRoute = null;
      render();
    } catch (error) { showFatal("Güncel kayıt yüklenemedi", error); }
  }

  async function loadWorkspace(idValue) {
    if (injectedLoadFailure) {
      var message = injectedLoadFailure;
      injectedLoadFailure = null;
      throw new Error(message);
    }
    return store.load(idValue);
  }

  function startFirst() {
    var sessionId = id("session"); var attemptId = id("attempt");
    run("start", commands([
      { type: "start_session", sessionId: sessionId, attemptId: attemptId, fields: { taskRef: { id: "heat-signal-1", version: "1.0.0" }, step: "question" } },
      { type: "open_material", sessionId: sessionId, attemptId: attemptId, fields: { material: "root" } }
    ]), function () { draft.selected = null; });
  }

  function submitAnswer(unknown) {
    var context = latestContext();
    var response = unknown ? { kind: "unknown", selectedOptionKey: null } : { kind: "option", selectedOptionKey: draft.selected };
    run("answer", commands([
      { type: "submit_answer", sessionId: context.sessionId, attemptId: context.attemptId, fields: { response: response } },
      { type: "advance_step", sessionId: context.sessionId, attemptId: context.attemptId, fields: { step: "confidence" } }
    ]), function () { draft.confidence = null; });
  }

  function evaluate() {
    var context = latestContext();
    var answerId = context.attempt.answer.eventId;
    var specs = [];
    if (draft.confidence) specs.push({ type: "declare_confidence", sessionId: context.sessionId, attemptId: context.attemptId, fields: { answerEventId: answerId, confidence: draft.confidence } });
    specs.push({ type: "evaluate_answer", sessionId: context.sessionId, attemptId: context.attemptId, fields: { answerEventId: answerId } });
    specs.push({ type: "open_material", sessionId: context.sessionId, attemptId: context.attemptId, fields: { material: "feedback" } });
    specs.push({ type: "advance_step", sessionId: context.sessionId, attemptId: context.attemptId, fields: { step: "feedback" } });
    run("evaluate", commands(specs), null);
  }

  function openMaterial(material) {
    var context = latestContext();
    if (exposures(context.attempt)[material]) return;
    run("material-" + material, commands([{ type: "open_material", sessionId: context.sessionId, attemptId: context.attemptId, fields: { material: material } }]), null);
  }

  function pause() {
    var context = latestContext();
    run("pause", commands([{ type: "pause_session", sessionId: context.sessionId, attemptId: context.attemptId }]), null);
  }

  function resume() {
    var context = latestContext();
    run("resume", commands([{ type: "resume_session", sessionId: context.sessionId, attemptId: context.attemptId }]), null);
  }

  function nextExercise() {
    var context = latestContext();
    var sessionId = id("session"); var attemptId = id("attempt");
    run("next", commands([
      { type: "end_session", sessionId: context.sessionId, attemptId: context.attemptId },
      { type: "start_session", sessionId: sessionId, attemptId: attemptId, fields: { taskRef: { id: "heat-signal-2", version: "1.0.0" }, step: "question" } },
      { type: "open_material", sessionId: sessionId, attemptId: attemptId, fields: { material: "study" } },
      { type: "open_material", sessionId: sessionId, attemptId: attemptId, fields: { material: "root" } }
    ]), function () { draft.selected = null; draft.confidence = null; });
  }

  function finish() {
    var context = latestContext();
    run("finish", commands([
      { type: "advance_step", sessionId: context.sessionId, attemptId: context.attemptId, fields: { step: "summary" } },
      { type: "end_session", sessionId: context.sessionId, attemptId: context.attemptId }
    ]), null);
  }

  function openDispute() {
    var context = latestContext();
    draft.category = null; draft.note = "";
    run("open-dispute", commands([{ type: "advance_step", sessionId: context.sessionId, attemptId: context.attemptId, fields: { step: "dispute" } }]), function () { localRoute = "dispute"; });
  }

  function cancelDispute() {
    var context = latestContext();
    localRoute = null;
    draft.category = null; draft.note = "";
    if (context.session.status === "completed") { render(); return; }
    run("cancel-dispute", commands([{ type: "advance_step", sessionId: context.sessionId, attemptId: context.attemptId, fields: { step: "feedback" } }]), null);
  }

  function saveDispute() {
    var context = latestContext();
    run("dispute", commands([{ type: "dispute_answer", sessionId: context.sessionId, attemptId: context.attemptId, fields: {
      answerEventId: context.attempt.answer.eventId, scope: "objective", category: draft.category, note: draft.note
    } }]), function () { localRoute = null; });
  }

  async function newWorkspace() {
    var previousWorkspaceId = workspaceId;
    var previousState = state;
    var candidateId = id("workspace");
    try {
      var candidateState = await loadWorkspace(candidateId);
      TusSessionCore.validateState(candidateState, CATALOG);
      workspaceId = candidateId;
      state = candidateState;
      rememberWorkspace(candidateId);
      draft = { selected: null, confidence: null, category: null, note: "" };
      localRoute = null; pending = null; errorState = null;
      render();
    } catch (error) {
      workspaceId = previousWorkspaceId;
      state = previousState;
      errorState = { workspace: true, message: error && error.message ? error.message : String(error) };
      render();
    }
  }

  function exportState() {
    var payload = { format: "tus-learning-demo-export", version: 1, exportedAt: new Date().toISOString(), workspaceId: workspaceId, state: state };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "text/plain;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tus-demo-kaydi.json.txt";
    link.click();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
  }

  function showFatal(title, error) {
    shell('<p class="eyebrow">Demo başlatılamadı</p><h1>' + escapeHtml(title) + '</h1><p class="lede">' + escapeHtml(error && error.message ? error.message : error) + '</p><p class="supporting">Bu teknik demo, session core ve store bağımlılıkları olmadan kayıt yapıyormuş gibi davranmaz.</p>', "error-panel");
  }

  function setupOfflineStatus() {
    var label = document.getElementById("offline-status");
    if (memoryMode) { label.textContent = "Geçici ekran denemesi"; return; }
    if (!("serviceWorker" in navigator)) { label.textContent = "Çevrimdışı kurulum desteklenmiyor"; return; }
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).then(function () {
      return navigator.serviceWorker.ready;
    }).then(function (registration) {
      var worker = registration.active;
      if (!worker) throw new Error("Etkin service worker yok");
      return new Promise(function (resolve, reject) {
        var channel = new MessageChannel();
        var timeout = setTimeout(function () { reject(new Error("Önbellek doğrulama zaman aşımı")); }, 4000);
        channel.port1.onmessage = function (event) {
          clearTimeout(timeout);
          if (event.data && event.data.ready) resolve();
          else reject(new Error("Uygulama kabuğu eksik"));
        };
        worker.postMessage({ type: "CHECK_OFFLINE" }, [channel.port2]);
      });
    }).then(function () {
      label.textContent = "Çevrimdışı hazır";
    }).catch(function () {
      label.textContent = "Çevrimdışı hazırlık tamamlanmadı";
    });
  }

  async function init() {
    if (!globalThis.TusSessionCore || !globalThis.TusSessionStore) {
      showFatal("Kayıt bağımlılığı eksik", new Error("TusSessionCore veya TusSessionStore yüklenemedi."));
      return;
    }
    try {
      TusSessionCore.validateCatalog(CATALOG);
      store = await TusSessionStore.open({ catalog: CATALOG, dbName: DB_NAME });
      var persistence = TusSessionStore.persistence || store.persistence;
      memoryMode = memoryMode || persistence === "memory";
      document.getElementById("storage-label").textContent = memoryMode ? "Geçici deneme · kapatınca kayıtlar silinir" : "Bu cihazda kayıtlı teknik demo";
      workspaceId = readWorkspacePreference() || id("workspace");
      rememberWorkspace(workspaceId);
      state = await loadWorkspace(workspaceId);
      TusSessionCore.validateState(state, CATALOG);
      if (testMode) {
        globalThis.__TUS_PREVIEW_TEST__ = {
          failNextDispatch: function (message) { injectedFailure = message || "Test storage failure"; },
          failNextLoad: function (message) { injectedLoadFailure = message || "Test load failure"; },
          workspaceId: function () { return workspaceId; }
        };
      }
      render();
      setupOfflineStatus();
    } catch (error) { showFatal("Kayıt alanı açılamadı", error); }
  }

  window.addEventListener("pagehide", function (event) {
    if (!event.persisted && store && store.close) store.close();
  });
  init();
})();
