// Harness: jalankan inline script index.html dengan DOM palsu untuk cari error referensi.
const fs = require('fs');
const html = fs.readFileSync('/home/hatch/workspace/hok-coach/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/);
if (!m) { console.log('FAIL: inline script tidak ketemu'); process.exit(1); }
let src = m[1];

class El {
  constructor(tag, id) { this.tag = tag; this.id = id || ''; this._html = ''; this.children = []; this.dataset = {}; this.style = {}; this.value = ''; this._cls = new Set(); this.onclick = null; this.oninput = null; this.scrollTop = 0; }
  set innerHTML(v) { this._html = v; this.children = []; }
  get innerHTML() { return this._html; }
  querySelectorAll() { return []; }
  querySelector() { return null; }
  addEventListener() {}
  scrollIntoView() {}
  get classList() { const s = this._cls; return { add: c => s.add(c), remove: c => s.delete(c), toggle: (c, f) => { f ? s.add(c) : s.delete(c); }, contains: c => s.has(c) }; }
}
const byId = {};
const document = {
  getElementById: id => byId[id] || (byId[id] = new El('div', id)),
  querySelectorAll: sel => [],
  querySelector: () => null,
  createElement: t => new El(t),
};
const HEROES = require('/home/hatch/workspace/hok-coach/data/heroes.json');
const ITEMS = require('/home/hatch/workspace/hok-coach/data/items.json');
const ARCANAS = require('/home/hatch/workspace/hok-coach/data/arcana.json');
const FLEX = require('/home/hatch/workspace/hok-coach/data/flex_picks.json');
const FAKE_FETCH = { 'data/heroes.json': HEROES, 'data/items.json': ITEMS, 'data/arcana.json': ARCANAS, 'data/flex_picks.json': FLEX };
global.window = global;
global.self = global;
global.document = document;
global.navigator = {};
global.alert = () => {};
global.fetch = url => Promise.resolve({ json: () => Promise.resolve(FAKE_FETCH[url]) });
global.localStorage = { getItem: () => null, setItem: () => {} };

let pass = 0, fail = 0;
const ok = (c, msg) => { c ? pass++ : (fail++, console.log('FAIL:', msg)); };
const __ok = ok;
const __log = m => console.log(m);
const __fail = m => { fail++; console.log('FAIL:', m); };

const driver = `
;(async()=>{
  try{
    await new Promise(r=>setTimeout(r,300));
    state.enemies=['daji','angela','hou-yi','zhang-fei','lam'];
    renderLawan();
    __ok(byId_gridLawan().innerHTML.includes('Daji'),'grid lawan render');
    __ok(byId_enemySlots().innerHTML.includes('Daji'),'slot musuh terisi');
    renderAnalisis();
    const ana=byId_anaWrap().innerHTML;
    __ok(ana.includes('Tim counter rekomendasi'),'analisis render tim');
    __ok(ana.includes('Strategi'),'analisis render strategi');
    renderRacikGrid();
    __ok(byId_gridRacik().innerHTML.length>100,'grid racik render');
    state.racik='daji'; renderRacik();
    __ok(byId_racikWrap().innerHTML.includes('Daji'),'racik render build');
    openHero('lam');
    __ok(byId_sheet().innerHTML.includes('Lam'),'modal hero render');
    openItem('doomsday');
    __ok(byId_sheet().innerHTML.includes('Doomsday'),'modal item render');
    state.dt='items'; renderData();
    __ok(byId_dataWrap().innerHTML.includes('Doomsday'),'data items render');
    state.dt='arcana'; renderData();
    __ok(byId_dataWrap().innerHTML.includes('Merah'),'data arcana render');
    const an0=E.analyzeEnemy([],HEROES);
    const an=E.analyzeEnemy(state.enemies,HEROES);
    const team=E.recommendTeam(state.enemies,HEROES,an);
    let berr=0;
    for(const t of team){ try{ buildHTML(t.hero, an); }catch(e){ berr++; __log('buildHTML err '+t.hero.name+' '+e.message); } }
    __ok(berr===0,'buildHTML tim tanpa error');
    let aerr=0;
    for(const h of HEROES){ try{ buildHTML(h, an0); }catch(e){ aerr++; __log('racik err '+h.name+' '+e.message); } }
    __ok(aerr===0,'buildHTML 111 hero tanpa error');
  }catch(e){ __fail('FATAL: '+e.message); }
})();`;
const __prevExports = module.exports;
eval(fs.readFileSync('/home/hatch/workspace/hok-coach/engine.js', 'utf8'));
global.HokEngine = module.exports.HokEngine || module.exports;
module.exports = __prevExports;
eval(src + `
function byId_gridLawan(){return document.getElementById('gridLawan');}
function byId_enemySlots(){return document.getElementById('enemySlots');}
function byId_anaWrap(){return document.getElementById('anaWrap');}
function byId_gridRacik(){return document.getElementById('gridRacik');}
function byId_racikWrap(){return document.getElementById('racikWrap');}
function byId_sheet(){return document.getElementById('sheet');}
function byId_dataWrap(){return document.getElementById('dataWrap');}
` + driver);
setTimeout(() => { console.log(`\n${pass} lolos, ${fail} gagal`); process.exit(fail ? 1 : 0); }, 1500);
