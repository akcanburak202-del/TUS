const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const KEY='tus-yerel-prototype-v1';
function boot(initial,options={}){
 const records=new Map(initial===undefined?[]:[[KEY,initial]]), elements=new Map();let dynamic=[];
 class El{
  constructor(id='',attrs={}){this.id=id;this.attrs=attrs;this.dataset={};this.listeners={};this.classList={toggle(){}};this.hidden=false;this.value='';this.textContent='';this.disabled=false;for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
  set innerHTML(s){this.html=s;if(this.id==='main'){dynamic=[];for(const m of s.matchAll(/<(button|input|textarea|select|div|p|form)\b([^>]*)>/g)){const a={};for(const x of m[2].matchAll(/([\w-]+)="([^"]*)"/g))a[x[1]]=x[2];const e=new El(a.id,a);dynamic.push(e);if(a.id)elements.set('#'+a.id,e);}}}
  get innerHTML(){return this.html||'';}addEventListener(type,fn){this.listeners[type]=fn;}focus(){}append(){}click(){return this.onclick?.()||this.listeners.click?.({target:this});}remove(){}showModal(){this.returnValue='ok';queueMicrotask(()=>this.listeners.close?.());}
 }
 for(const id of ['main','notice','storage-status','confirm-dialog','confirm-title','confirm-text'])elements.set('#'+id,new El(id));
 elements.set('.brand',new El('brand'));
 const nav=['today','library','records','backup'].map(v=>new El('',{'data-view':v}));
 const doc={querySelector(s){return elements.get(s)||null;},querySelectorAll(s){if(s==='[data-view]')return nav;const match=s.match(/^\[(data-[\w-]+)\]$/);return match?dynamic.filter(e=>Object.hasOwn(e.attrs,match[1])):[];},createElement(){return new El();},body:{append(){}}};
 const storage={getItem(k){if(options.denyRead)throw Error('denied');return records.get(k)??null;},setItem(k,v){if(options.failWrites||options.failKey===k)throw Error('quota');records.set(k,v);},removeItem(k){records.delete(k);}};
 const win={listeners:{},addEventListener(k,v){this.listeners[k]=v;}};
 const context=vm.createContext({document:doc,localStorage:storage,navigator:options.navigator||{},location:{protocol:options.protocol||'file:'},window:win,console,Date,TextEncoder,setTimeout:()=>0,queueMicrotask,URL,Blob,crypto:require('node:crypto').webcrypto,CSS:{escape:x=>x},FormData:class{constructor(f){this.f=f;}get(k){return this.f[k];}}});
 for(const n of ['core.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,'prototype',n),'utf8'),context,{filename:n});
 return {records,elements,doc,context,options,nav,win,click(s){const el=doc.querySelector(s);assert.ok(el,s);return el.click();},data(attr,value){const e=doc.querySelectorAll(`[data-${attr}]`).find(e=>e.attrs[`data-${attr}`]===value);assert.ok(e,attr+'='+value);return e.click();},state(){return JSON.parse(records.get(KEY));},html(){return doc.querySelector('#main').innerHTML;}};
}
test('fresh app boots with planned tasks and a working answer/reveal/grade path',()=>{
 const h=boot();assert.match(h.html(),/Oturumu başlat/);h.click('#start');assert.match(h.html(),/Yanıtın/);
 h.elements.get('#response').listeners.input({target:{value:'Mavi'}});h.click('#reveal');assert.equal(h.state().demo.events.length,1);assert.equal(h.state().demo.events[0].mode,'answer');h.data('grade','correct');
 const es=h.state().demo.events;assert.equal(es.length,2);assert.equal(es[1].answer,'Mavi');assert.equal(es[1].answerShown,true);assert.equal(es[1].result,'correct');h.click('#next');assert.match(h.html(),/Yanıtın/);
});
test('unknown answer persists separately, and a hint is an exposure before reveal',()=>{
 const h=boot();h.click('#start');h.click('#hint');assert.equal(h.state().demo.events[0].mode,'hint');h.click('#unknown');const es=h.state().demo.events;assert.equal(es[2].result,'unknown');assert.equal(es[2].hintUsed,true);assert.equal(es[2].answer,'');
});
test('0 minutes schedules no tasks and creates no false failure',()=>{const h=boot();h.data('minutes','0');assert.match(h.html(),/Bugün ara verebilirsin/);assert.equal(h.state().demo.events.length,0);});
test('personal workspace does not borrow demo tasks or events',async()=>{const h=boot();h.click('#start');h.click('#unknown');await h.click('#pause');h.data('mode','personal');assert.match(h.html(),/Henüz kendi sorun yok/);assert.equal(h.state().personal.events.length,0);assert.equal(h.state().demo.events.length,2);});
test('corrupt stored data remains untouched and surfaces recovery',()=>{const h=boot('{bad json');assert.equal(h.records.get(KEY),'{bad json');assert.match(h.html(),/ham kaydı/i);assert.match(h.elements.get('#notice').textContent,/otomatik silinmedi/);});
test('failed persistence does not reveal an unrecorded answer',()=>{const h=boot();h.click('#start');h.elements.get('#response').listeners.input({target:{value:'a'}});h.options.failWrites=true;h.click('#reveal');assert.equal(h.state().demo.events.length,0);assert.match(h.html(),/Yanıtın/);assert.match(h.elements.get('#notice').textContent,/uygulanmadı/);});
test('personal content is escaped and valid questions can be studied',()=>{
 const h=boot();h.data('mode','personal');h.nav.find(e=>e.dataset.view==='library').click();h.click('#toggle-editor');
 h.elements.get('#card-form').listeners.submit({preventDefault(){},target:{objective:'A <img onerror=alert(1)>',kind:'recall',estimate:'2',prompt:'<script>alert(1)</script>',answer:'answer',explanation:'explanation',source:'User book p.2',approval:'on'}});
 assert.equal(h.state().tasks.length,1);assert.match(h.html(),/&lt;script&gt;/);assert.doesNotMatch(h.html(),/<script>alert/);h.nav.find(e=>e.dataset.view==='today').click();h.click('#start');assert.match(h.html(),/&lt;script&gt;/);
});
test('backup validation rejects catalog mismatch and extra keys without modifying existing state',()=>{
 const h=boot();const good=h.records.get(KEY);h.context.payload=good;assert.doesNotThrow(()=>vm.runInContext('TusAppValidation.validateEnvelope(JSON.parse(payload))',h.context));
 h.context.payload=JSON.stringify({...JSON.parse(good),unexpected:1});assert.throws(()=>vm.runInContext('TusAppValidation.validateEnvelope(JSON.parse(payload))',h.context));assert.equal(h.records.get(KEY),good);
 h.click('#start');h.click('#unknown');const mutated=h.state();mutated.demo.events[0].objectiveId='fake';h.context.payload=JSON.stringify(mutated);assert.throws(()=>vm.runInContext('TusAppValidation.validateEnvelope(JSON.parse(payload))',h.context));
});
test('valid import replaces only after validation, and undo restores prior state',async()=>{
 const h=boot();h.data('minutes','5');const before=h.records.get(KEY);const next=h.state();next.demo.settings.minutes=30;h.nav.find(e=>e.dataset.view==='backup').click();
 await h.elements.get('#import-file').listeners.change({target:{files:[{size:500,text:async()=>JSON.stringify(next)}],value:'x'}});
 assert.equal(h.state().demo.settings.minutes,30);await h.click('#undo-import');assert.equal(h.records.get(KEY),before);
});
test('malformed import never alters active or undo snapshots',async()=>{
 const h=boot();const before=h.records.get(KEY);h.nav.find(e=>e.dataset.view==='backup').click();await h.elements.get('#import-file').listeners.change({target:{files:[{size:9,text:async()=>'{invalid'}],value:'x'}});assert.equal(h.records.get(KEY),before);assert.equal(h.records.has(KEY+'-before-import'),false);
});
test('storage event from another tab stops subsequent writes',()=>{const h=boot();h.click('#start');h.win.listeners.storage({key:KEY});const raw=h.records.get(KEY);h.nav.find(e=>e.dataset.view==='today').click();h.data('minutes','30');assert.equal(h.records.get(KEY),raw);});
test('cross-tab change is detected before storage event is delivered',()=>{const h=boot();const altered=h.state();altered.demo.settings.minutes=60;const raw=JSON.stringify(altered);h.records.set(KEY,raw);h.data('minutes','5');assert.equal(h.records.get(KEY),raw);assert.match(h.elements.get('#notice').textContent,/başka bir sekmede/);});
test('unapproved content is not saved even if a submit handler is invoked directly',()=>{const h=boot();h.data('mode','personal');h.nav.find(e=>e.dataset.view==='library').click();h.click('#toggle-editor');h.elements.get('#card-form').listeners.submit({preventDefault(){},target:{approval:null}});assert.equal(h.state().tasks.length,0);});
test('failed second import preserves undo for the first successful import',async()=>{const h=boot();h.data('minutes','5');const original=h.records.get(KEY);h.nav.find(e=>e.dataset.view==='backup').click();const next=h.state();next.demo.settings.minutes=30;const imported=x=>({target:{files:[{size:500,text:async()=>JSON.stringify(x)}],value:'x'}});await h.elements.get('#import-file').listeners.change(imported(next));const committed=h.records.get(KEY);h.options.failKey=KEY;next.demo.settings.minutes=60;await h.elements.get('#import-file').listeners.change(imported(next));assert.equal(h.records.get(KEY),committed);assert.equal(h.records.get(KEY+'-before-import'),original);h.options.failKey=null;await h.click('#undo-import');assert.equal(h.records.get(KEY),original);});
test('backup size validation shares the export/import limit',()=>{const h=boot();vm.runInContext(`const huge=TusAppValidation.empty();for(let i=0;i<700;i++)huge.tasks.push({id:'u'+i,objectiveId:'o'+i,objectiveTitle:'t',familyId:'f'+i,kind:'recall',prompt:'p',answer:'a',explanation:'x'.repeat(20000),hint:'',bank:'training',status:'approved',estimatedMinutes:2,version:1,source:'s',reviewedAt:'2026-09-10T01:00:00.000Z'});globalThis.huge=huge`,h.context);assert.throws(()=>vm.runInContext('TusAppValidation.validateEnvelope(huge)',h.context),/10 MB/);assert.equal(h.state().tasks.length,0);h.context.raw=h.records.get(KEY);assert.equal(vm.runInContext('new TextEncoder().encode(TusAppValidation.backupJSON(TusAppValidation.validateEnvelope(JSON.parse(raw)))).byteLength<=TusAppValidation.MAX_BACKUP_BYTES',h.context),true);});
test('HTTP writer lock prevents another tab from mutating even during event delay',()=>{let held=false;const locks={request(key,opts,fn){if(held)return Promise.resolve(fn(null));held=true;return Promise.resolve(fn({name:key}));}};const a=boot(undefined,{protocol:'http:',navigator:{locks}});const b=boot(a.records.get(KEY),{protocol:'http:',navigator:{locks}});assert.match(b.elements.get('#notice').textContent,/başka bir sekmede/);b.nav.find(e=>e.dataset.view==='today').click();b.data('minutes','30');assert.equal(b.state().demo.settings.minutes,15);a.data('minutes','30');assert.equal(a.state().demo.settings.minutes,30);});
