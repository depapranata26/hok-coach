const E = require('../engine.js');
const HEROES = require('../data/heroes.json');
const ITEMS = require('../data/items.json');
const ARCANA = require('../data/arcana.json');

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.log('FAIL:', msg); } };
const byName = n => HEROES.find(h => h.name.toLowerCase() === n.toLowerCase().replace(/-/g,' '));

// Skenario 1: musuh full magic burst (Daji, Angela, Xiao Qiao, Milady, Mai Shiranui)
const e1 = ['daji', 'angela', 'xiao-qiao', 'milady', 'mai-shiranui'].map(n => { const x = HEROES.find(h => h.id === n); return x ? x.id : null; }).filter(Boolean);
console.log('e1 enemies:', e1.length);
const an1 = E.analyzeEnemy(e1, HEROES);
ok(an1.mag >= 4, 'e1 magic dominan, got ' + an1.mag);
ok(an1.burst >= 3, 'e1 burst tinggi');
const team1 = E.recommendTeam(e1, HEROES, an1);
ok(team1.length === 5 && team1.every(t => t.hero), 'e1 team 5 hero terisi');
ok(new Set(team1.map(t => t.hero.id)).size === 5, 'e1 hero unik');
ok(!team1.some(t => e1.includes(t.hero.id)), 'e1 tidak pick hero musuh');
const mm = team1.find(t => t.lane === 'Farm Lane');
ok(mm && mm.hero, 'e1 farm lane ada');
const b1 = E.buildFor(mm.hero, an1, ITEMS);
ok(b1.situational.some(s => /succubus|longnight|runic/i.test(s.item.name)), 'e1 ada anti-magic situasional: ' + b1.situational.map(s => s.item.name).join(','));
const ar1 = E.arcanaFor(mm.hero, ARCANA);
ok(ar1 && ar1.red && ar1.blue && ar1.green, 'e1 arcana lengkap utk ' + mm.hero.name);

// Skenario 2: musuh physical / marksman (Hou Yi, Lady Sun, Loong, Alessio, Marco Polo)
const e2 = ['hou-yi', 'lady-sun', 'loong', 'alessio', 'marco-polo'].map(n => { const x = HEROES.find(h => h.id === n); return x ? x.id : null; }).filter(Boolean);
const an2 = E.analyzeEnemy(e2, HEROES);
ok(an2.phys >= 4, 'e2 physical dominan, got ' + an2.phys);
const team2 = E.recommendTeam(e2, HEROES, an2);
ok(team2.every(t => t.hero), 'e2 team lengkap');
const tank2 = team2.find(t => t.lane === 'Roaming');
const b2 = E.buildFor(tank2.hero, an2, ITEMS);
const b2all = b2.core.concat(b2.situational.map(s => s.item)).map(i => i.name);
ok(b2all.some(n => /ominous|frigid|spikemail|protector/i.test(n)), 'e2 ada anti-physical: ' + b2all.join(','));

// Skenario 3: racik 1 hero — Lam (jungle assassin)
const lam = byName('Lam');
ok(!!lam, 'Lam ada di data');
const an3 = E.analyzeEnemy([], HEROES);
const b3 = E.buildFor(lam, an3, ITEMS);
ok(b3.boots.item, 'boots ada: ' + b3.boots.item.name);
ok(b3.core.length === 5, 'core 5 item, got ' + b3.core.length);
ok(b3.core.every(i => i.category === 'attack'), 'core Lam kategori attack');
const ar3 = E.arcanaFor(lam, ARCANA);
ok(ar3 && ar3.archetype === 'physical-burst-assassin', 'arcana Lam = burst assassin, got ' + (ar3 && ar3.archetype));

// Skenario 4: racik mage — Daji
const daji = byName('Daji');
const b4 = E.buildFor(daji, an3, ITEMS);
ok(b4.core.every(i => i.category === 'magic'), 'core Daji kategori magic');
const ar4 = E.arcanaFor(daji, ARCANA);
ok(ar4 && ar4.red && ar4.red.name === 'Nightmare', 'arcana Daji red=Nightmare, got ' + (ar4 && ar4.red && ar4.red.name));

// Skenario 5: tank — Zhang Fei
const zf = byName('Zhang Fei');
const b5 = E.buildFor(zf, an3, ITEMS);
ok(b5.core.every(i => i.category === 'defense'), 'core Zhang Fei defense');
ok(b5.boots.item.name === 'Boots of Fortitude' || b5.boots.item, 'boots tank ok: ' + b5.boots.item.name);

// Skenario 6: strategi tidak kosong & anti-heal muncul saat musuh heal
const e6 = ['cai-yan', 'dyadia', 'biron', 'yaria', 'zhang-fei'].map(n => { const x = HEROES.find(h => h.id === n); return x ? x.id : null; }).filter(Boolean);
const an6 = E.analyzeEnemy(e6, HEROES);
ok(an6.heal >= 2, 'e6 heal terdeteksi: ' + an6.heal);
const b6 = E.buildFor(byName('Hou Yi') || HEROES[0], an6, ITEMS);
ok(b6.situational.some(s => /mortal punisher|venomous/i.test(s.item.name)), 'e6 anti-heal direkomendasikan');
const tips = E.makeStrategy(an6);
ok(tips.length >= 2, 'tips ada');

// Skenario 7: heroCounters
const hc = E.heroCounters('daji', HEROES);
ok(hc && hc.hero.name === 'Daji', 'heroCounters jalan');

// Skenario 8: lane-fit — tiap lane dipick role yang wajar
const teamFit = E.recommendTeam(e1, HEROES, an1);
const laneRole = { 'Roaming': ['Tank','Support'], 'Clash Lane': ['Fighter'], 'Mid Lane': ['Mage'], 'Jungle': ['Assassin'], 'Farm Lane': ['Marksman'] };
let fitOk = true;
for (const t of teamFit) {
  if (!t.hero || !(t.hero.class||[]).some(c => laneRole[t.lane].includes(c))) { fitOk = false; console.log('lane-fit miss:', t.lane, t.hero && t.hero.name, t.hero && t.hero.class); }
}
ok(fitOk, 'tiap lane dipick role yang sesuai');

console.log(`\n${pass} lolos, ${fail} gagal`);
process.exit(fail ? 1 : 0);
