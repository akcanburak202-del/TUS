// DOM/IndexedDB emulation only. These tests do not prove browser persistence or layout.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
function dep(name) {
  try { return require(name); }
  catch (e) { if (!process.env.TUS_TEST_MODULES) throw e; return require(path.join(process.env.TUS_TEST_MODULES, name)); }
}
const {parseHTML} = dep('linkedom');
const fake = dep('fake-indexeddb');
const nativeClone = global.structuredClone;
test.after(()=>{global.structuredClone=nativeClone;});
const flush = async () => { for (let i=0;i<8;i++) await new Promise(resolve=>setImmediate(resolve)); };
async function boot({portable=false, database=new fake.IDBFactory(), records=new Map()}={}) {
  const htmlPath=portable ? 'release/learning-preview/TUS-Ogrenme-Akisi-Deneme.html' : 'prototype/preview/index.html';
  const html=fs.readFileSync(path.join(root, htmlPath),'utf8');
  const {document}=parseHTML(html);
  document.getElementById('app').focus=()=>{};
  const listeners={};
  const sandbox={document, console, setTimeout, clearTimeout, URL, URLSearchParams, Blob,
    crypto:require('node:crypto').webcrypto, indexedDB:database, navigator:{},
    location:{search:'?testMode=1',protocol:portable?'file:':'http:'},
    addEventListener:(name,fn)=>{listeners[name]=fn;},
    localStorage:{getItem(k){if(portable)throw new Error('Storage access denied');return records.get(k)||null;},setItem(k,v){if(portable)throw new Error('Storage access denied');records.set(k,v);}}
  };
  sandbox.window=sandbox;
  const context=vm.createContext(sandbox);
  // fake-indexeddb runs in Node; emulate browser clone results in the page realm.
  global.structuredClone=value=>value===undefined?undefined:vm.runInContext("JSON.parse("+JSON.stringify(JSON.stringify(value))+")",context);
  if(portable) {
    for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(match[1],context);
  } else {
    for(const file of ['session-core.js','session-store.js','preview/app.js']) vm.runInContext(fs.readFileSync(path.join(root,'prototype',file),'utf8'),context,{filename:file});
  }
  await flush();
  const query=s=>{const el=document.querySelector(s);assert.ok(el,'Missing element '+s+'; '+document.getElementById('app').textContent);return el;};
  return {document,context,database,records,listeners,html:()=>document.getElementById('app').innerHTML,
    text:()=>document.getElementById('app').textContent,
    async click(action,value){const el=query('[data-action="'+action+'"]'+(value?'[data-value="'+value+'"]':''));assert.ok(!el.hasAttribute('disabled'),action+' disabled');el.click();await flush();},
    query, async state(){const id=context.__TUS_PREVIEW_TEST__.workspaceId();return await new Promise((resolve,reject)=>{const req=database.open('tus-learning-demo-v2',1);req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result;const get=db.transaction('workspaceStates').objectStore('workspaceStates').get(id);get.onsuccess=()=>{resolve(get.result.state);db.close();};};});}
  };
}
async function answer(h, choice='power-up', confidence) {
  await h.click('select',choice);await h.click('submit');assert.match(h.text(),/Ne kadar emindin/);
  if(confidence)await h.click('confidence',confidence);await h.click('evaluate');
}
test('portable demo boots without localStorage and completes a temporary trial',async()=>{
  const h=await boot({portable:true});assert.match(h.text(),/Öğrenme akışını dene/);
  await h.click('start');await answer(h,'power-up','guess');assert.match(h.text(),/Yanıt doğru olarak kalıyor/);
  await h.click('next');await answer(h,'power-down');await h.click('finish');assert.match(h.text(),/Demo tamamlandı/);
  assert.match(h.document.getElementById('storage-label').textContent,/Geçici/);
});
test('emulated IDB: correct guess, supported exercise, completion and late dispute preserve separate records',async()=>{
  const h=await boot();await h.click('start');await answer(h,'power-up','guess');
  let state=await h.state();assert.equal(state.events.filter(e=>e.type==='declare_confidence').length,1);
  await h.click('next');await answer(h,'power-down');await h.click('finish');assert.match(h.text(),/Demo tamamlandı/);
  await h.click('summary-dispute');h.query('input[value="key"]').click();await flush();await h.click('save-dispute');
  state=await h.state();const view=vm.runInContext("TusSessionCore.project(JSON.parse("+JSON.stringify(JSON.stringify(state)) + "))",h.context);
  assert.ok(Object.values(view.attempts).every(a=>a.evaluation.effectiveResult===null));assert.match(h.text(),/inceleme bekliyor/);
});
test('emulated DOM: unknown and incorrect routes show distinct teaching messages',async()=>{
  const a=await boot();await a.click('start');await a.click('unknown');await a.click('evaluate');assert.match(a.text(),/Bilmiyorum yanıtın kaydedildi/);
  const b=await boot();await b.click('start');await answer(b,'power-down');assert.match(b.text(),/anahtarla uyuşmuyor/);
});
test('emulated IDB: reload resumes paused state and preserves committed first answer',async()=>{
  const h=await boot();await h.click('start');await h.click('select','power-up');await h.click('submit');await h.click('pause');
  const next=await boot({database:h.database,records:h.records});assert.match(next.text(),/Ara verildi/);await next.click('resume');assert.match(next.text(),/İlk yanıtın kilitli/);
  assert.equal((await next.state()).events.filter(e=>e.type==='submit_answer').length,1);
});
test('emulated DOM: failed dispatch retains selection and retry does not duplicate answer',async()=>{
  const h=await boot();await h.click('start');await h.click('select','power-up');h.context.__TUS_PREVIEW_TEST__.failNextDispatch('Injected storage failure');
  await h.click('submit');assert.match(h.text(),/Kayıt tamamlanamadı/);assert.doesNotMatch(h.text(),/Yanıt kaydedildi/);
  await h.click('retry');assert.match(h.text(),/İlk yanıtın kilitli/);assert.equal((await h.state()).events.filter(e=>e.type==='submit_answer').length,1);
});
test('emulated DOM: rapid retry taps commit one answer without a false error',async()=>{
  const h=await boot();await h.click('start');await h.click('select','power-up');
  h.context.__TUS_PREVIEW_TEST__.failNextDispatch('Injected storage failure');await h.click('submit');
  const retry=h.query('[data-action="retry"]');retry.click();retry.click();await flush();
  assert.match(h.text(),/İlk yanıtın kilitli/);assert.doesNotMatch(h.text(),/Kayıt tamamlanamadı/);
  assert.equal((await h.state()).events.filter(e=>e.type==='submit_answer').length,1);
});
test('emulated DOM: evaluate failure exposes no feedback or uncommitted evaluation',async()=>{
  const h=await boot();await h.click('start');await h.click('select','power-up');await h.click('submit');await h.click('confidence','guess');
  h.context.__TUS_PREVIEW_TEST__.failNextDispatch('Injected evaluation failure');await h.click('evaluate');
  assert.equal(h.document.querySelector('[data-testid="feedback"]'),null);
  let events=(await h.state()).events;assert.equal(events.filter(e=>e.type==='evaluate_answer').length,0);assert.equal(events.filter(e=>e.type==='open_material'&&e.command.material==='feedback').length,0);
  await h.click('retry');events=(await h.state()).events;assert.ok(h.document.querySelector('[data-testid="feedback"]'));
  assert.equal(events.filter(e=>e.type==='evaluate_answer').length,1);assert.equal(events.filter(e=>e.type==='declare_confidence').length,1);assert.equal(events.filter(e=>e.type==='open_material'&&e.command.material==='feedback').length,1);
});
test('emulated IDB: source and hint remain exposed after reload and mark assisted response',async()=>{
  const h=await boot();await h.click('start');await h.click('hint');await h.click('source');
  const n=await boot({database:h.database,records:h.records});assert.ok(n.document.querySelector('[data-testid="source"]'));assert.ok(n.document.querySelector('[data-testid="hint"]'));
  await n.click('hint');await n.click('source');await answer(n);
  const state=await n.state();for(const material of ['hint','source'])assert.equal(state.events.filter(e=>e.type==='open_material'&&e.command.material===material).length,1);
  const view=vm.runInContext("TusSessionCore.project(JSON.parse("+JSON.stringify(JSON.stringify(state)) + "))",n.context);
  assert.equal(Object.values(view.attempts)[0].answer.assistance,'assisted');
});
