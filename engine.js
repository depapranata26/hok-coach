/* HoK Coach Engine — pure logic, no DOM. Works in browser and Node. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.HokEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LANES = ['Roaming', 'Clash Lane', 'Mid Lane', 'Jungle', 'Farm Lane'];

  const has = (hero, t) => (hero.traits || []).includes(t);
  const hasAny = (hero, ts) => ts.some(t => has(hero, t));

  // ---------- kit analysis (mirip kitWants MLBB Coach) ----------
  // Menghasilkan kebutuhan item dari traits/kit hero.
  function kitWants(hero) {
    const w = {}; // keyword -> weight
    const phys = hero.damageType === 'physical';
    const mag = hero.damageType === 'magical';
    const cls = hero.class || [];
    const isMM = cls.includes('Marksman');
    const isMage = cls.includes('Mage');
    const isTank = cls.includes('Tank') || has(hero, 'tank');
    const isSupp = cls.includes('Support') || hasAny(hero, ['support', 'heal', 'healing', 'shielding']);
    const isAsn = cls.includes('Assassin');
    const isFighter = cls.includes('Fighter');

    if (phys && (isMM || has(hero, 'attack-speed'))) { w['attack speed'] = 3; w['crit'] = 3; w['physical attack'] = 2; }
    if (phys && (isAsn || isFighter) && has(hero, 'burst')) { w['physical pierce'] = 3; w['cooldown'] = 2; w['physical attack'] = 3; }
    if (phys && !isMM && !has(hero, 'attack-speed')) { w['physical attack'] = (w['physical attack'] || 0) + 1; w['max health'] = (w['max health'] || 0) + 1; }
    if (mag) { w['magic power'] = 3; w['magic pierce'] = 3; w['cooldown'] = 2; }
    if (mag && hasAny(hero, ['sustain', 'poke', 'lifesteal'])) { w['magical lifesteal'] = 3; }
    if (hasAny(hero, ['lifesteal'])) { w['lifesteal'] = 3; }
    if (has(hero, 'true-damage')) { w['attack speed'] = (w['attack speed'] || 0) + 2; w['max health'] = (w['max health'] || 0) + 1; }
    if (isTank || (isSupp && !mag)) { w['max health'] = 3; w['physical defense'] = 2; w['magical defense'] = 2; }
    if (hasAny(hero, ['mobility', 'dash', 'dive'])) { w['movement speed'] = 1; }
    if (hero.damageType === 'mixed' || hero.damageType === 'hybrid') { w['physical attack'] = 1; w['magic power'] = 1; w['magic pierce'] = 1; w['physical pierce'] = 1; }
    return w;
  }

  function archetypeOf(hero) {
    const cls = hero.class || [];
    const phys = hero.damageType === 'physical', mag = hero.damageType === 'magical';
    const isMM = cls.includes('Marksman');
    const isTank = cls.includes('Tank') || has(hero, 'tank');
    const isSupp = cls.includes('Support') || hasAny(hero, ['support', 'heal', 'healing']);
    if (isTank) return 'tank';
    if (isSupp && !mag) return 'support-roam';
    if (isSupp && mag) return 'mage-sustain';
    if (isMM && has(hero, 'attack-speed')) return 'physical-attack-speed-marksman';
    if (isMM) return 'physical-crit-marksman';
    if (mag && has(hero, 'burst')) return 'mage-burst';
    if (mag) return 'mage-sustain';
    if (phys && (cls.includes('Assassin') || has(hero, 'burst'))) return 'physical-burst-assassin';
    if (phys && cls.includes('Fighter')) return 'fighter-clash';
    return 'fighter-clash';
  }

  // ---------- enemy analysis ----------
  function analyzeEnemy(enemyIds, HEROES) {
    const byId = Object.fromEntries(HEROES.map(h => [h.id, h]));
    const team = enemyIds.map(id => byId[id]).filter(Boolean);
    const a = {
      n: team.length,
      phys: 0, mag: 0, trueDmg: 0,
      burst: 0, cc: 0, heal: 0, mobility: 0, stealth: 0,
      tank: 0, poke: 0, shield: 0, dive: 0, attackSpeed: 0,
      names: team.map(h => h.name),
    };
    for (const h of team) {
      if (h.damageType === 'physical') a.phys++;
      else if (h.damageType === 'magical') a.mag++;
      else { a.phys += 0.5; a.mag += 0.5; }
      if (has(h, 'true-damage')) a.trueDmg++;
      if (has(h, 'burst')) a.burst++;
      if (hasAny(h, ['cc', 'crowd control', 'silence'])) a.cc++;
      if (hasAny(h, ['heal', 'healing', 'lifesteal', 'sustain'])) a.heal++;
      if (hasAny(h, ['mobility', 'dash'])) a.mobility++;
      if (has(h, 'stealth')) a.stealth++;
      if (hasAny(h, ['tank'])) a.tank++;
      if (has(h, 'poke')) a.poke++;
      if (hasAny(h, ['shield', 'shielding', 'barrier'])) a.shield++;
      if (has(h, 'dive')) a.dive++;
      if (has(h, 'attack-speed')) a.attackSpeed++;
    }
    return a;
  }

  // ---------- team recommendation ----------
  function scoreCounter(hero, an) {
    let s = 0; const why = [];
    const add = (pts, reason) => { s += pts; why.push(reason); };
    if (an.heal >= 2 && has(hero, 'burst')) add(3, 'burst untuk membunuh sebelum heal jalan');
    if (an.mobility >= 2 && hasAny(hero, ['cc', 'crowd control'])) add(3, 'CC kunci hero lincah');
    if (an.stealth >= 1 && hasAny(hero, ['cc', 'crowd control'])) add(2, 'CC untuk mengunci stealth');
    if (an.stealth >= 1 && has(hero, 'vision')) add(3, 'vision lawan stealth');
    if (an.mag >= 3 && hasAny(hero, ['shield', 'shielding', 'barrier'])) add(2, 'shield tahan burst magic');
    if (an.burst >= 3 && hasAny(hero, ['tank', 'sustain'])) add(2, 'badan tebal tahan burst');
    if (an.tank >= 2 && has(hero, 'true-damage')) add(3, 'true damage tembus tank');
    if (an.cc >= 3 && hasAny(hero, ['mobility', 'invulnerable', 'untargetability'])) add(2, 'sulit di-CC');
    if (an.poke >= 2 && hasAny(hero, ['dive', 'mobility'])) add(2, 'dive ke arah poke');
    if (an.attackSpeed >= 1 && hasAny(hero, ['cc', 'crowd control'])) add(1, 'CC hentikan marksman');
    if (an.shield >= 2 && has(hero, 'true-damage')) add(2, 'true damage abaikan shield');
    return { s, why };
  }

  function laneFit(hero, lane) {
    const cls = hero.class || [];
    const hasC = c => cls.includes(c);
    let s = 0; const why = [];
    if (lane === 'Roaming' && (hasC('Tank') || hasC('Support'))) { s += 3; why.push('role roam alami'); }
    if (lane === 'Clash Lane' && hasC('Fighter')) { s += 3; why.push('fighter clash lane'); }
    if (lane === 'Mid Lane' && hasC('Mage')) { s += 3; why.push('mage mid lane'); }
    if (lane === 'Jungle' && (hasC('Assassin') || has(hero, 'jungle'))) { s += 3; why.push('jungler alami'); }
    if (lane === 'Farm Lane' && hasC('Marksman')) { s += 3; why.push('marksman farm lane'); }
    return { s, why };
  }

  function recommendTeam(enemyIds, HEROES, analysis) {
    const an = analysis || analyzeEnemy(enemyIds, HEROES);
    const used = new Set(enemyIds);
    const picked = new Set();
    return LANES.map(lane => {
      const cands = HEROES.filter(h => !used.has(h.id) && !picked.has(h.id) && (h.roles || []).includes(lane));
      const scored = cands.map(h => {
        const c = scoreCounter(h, an);
        const f = laneFit(h, lane);
        return { hero: h, s: c.s + f.s, why: [...f.why, ...c.why] };
      }).sort((x, y) => y.s - x.s);
      const best = scored[0];
      if (!best) return { lane, hero: null, why: [] };
      picked.add(best.hero.id);
      return { lane, hero: best.hero, score: best.s, why: best.why.slice(0, 2) };
    });
  }

  // ---------- item build ----------
  const BOOTS = {
    'Boots of Resistance': 'boots-res',
    'Boots of Fortitude': 'boots-fort',
    'Boots of Tranquility': 'boots-tranq',
    'Boots of the Arcane': 'boots-arcane',
    'Boots of Dexterity': 'boots-dext',
    'Boots of Deftness': 'boots-deft',
    'Lightfoot Shoes': 'boots-light',
  };

  function pickBoots(hero, an, ITEMS) {
    const byName = n => ITEMS.find(i => i.name === n);
    let name = 'Lightfoot Shoes';
    const cls = hero.class || [];
    if (an.cc >= 2 && (cls.includes('Marksman') || cls.includes('Mage'))) name = 'Boots of Resistance';
    else if (an.phys >= 3) name = 'Boots of Fortitude';
    else if (hero.damageType === 'magical' && cls.includes('Mage')) name = 'Boots of the Arcane';
    else if (cls.includes('Marksman') || has(hero, 'attack-speed')) name = 'Boots of Dexterity';
    else if (cls.includes('Assassin') || has(hero, 'mobility')) name = 'Boots of Deftness';
    else if (cls.includes('Tank') || cls.includes('Support')) name = 'Boots of Fortitude';
    const item = byName(name) || byName('Lightfoot Shoes');
    const reason = an.cc >= 2 ? 'musuh banyak CC' : an.phys >= 3 ? 'musuh dominan physical' : 'standar role';
    return { item, reason };
  }

  function itemText(i) { return ((i.stats || '') + ' ' + (i.effect || '')).toLowerCase(); }

  function scoreItem(item, wants) {
    const t = itemText(item);
    let s = 0;
    for (const [kw, wt] of Object.entries(wants)) {
      if (t.includes(kw)) s += wt;
    }
    // hindari item jungle/roam kecuali role-nya cocok (ditangani caller)
    return s;
  }

  function coreCategories(hero) {
    const cls = hero.class || [];
    if (cls.includes('Tank') || cls.includes('Support')) return ['defense'];
    if (hero.damageType === 'physical') return ['attack'];
    if (hero.damageType === 'magical') return ['magic'];
    return ['attack', 'defense'];
  }

  function buildFor(hero, analysis, ITEMS, opts = {}) {
    const an = analysis;
    const wants = kitWants(hero);
    const boots = pickBoots(hero, an, ITEMS);
    const cats = coreCategories(hero);
    const pool = ITEMS.filter(i =>
      cats.includes(i.category) &&
      !Object.keys(BOOTS).includes(i.name) &&
      i.name !== boots.item?.name
    );
    const jungle = (hero.roles || []).includes('Jungle');
    const roam = (hero.roles || []).includes('Roaming') && (hero.class || []).includes('Support');
    let core = pool
      .map(i => ({ item: i, s: scoreItem(i, wants) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 5)
      .map(x => x.item);
    // fallback: isi dengan item kategori yg relevan kalau skor kosong
    if (core.length < 5) {
      const extra = pool.filter(i => !core.includes(i)).slice(0, 5 - core.length);
      core = core.concat(extra);
    }
    const byName = n => ITEMS.find(i => i.name === n);
    const situational = [];
    const addSit = (name, reason) => {
      const it = byName(name);
      if (it && !core.includes(it) && !situational.some(s => s.item.name === name)) situational.push({ item: it, reason });
    };
    if (an.heal >= 2) {
      if (hero.damageType === 'magical') addSit('Venomous Staff', 'musuh banyak heal/regen');
      else addSit('Mortal Punisher', 'musuh banyak heal/regen');
    }
    if (an.mag >= 3) {
      addSit('Succubus Cloak', 'musuh dominan magic burst');
      if (hero.damageType === 'physical' && (hero.class || []).includes('Marksman')) addSit('Runic Blade', 'konversi attack jadi magic defense');
    }
    if (an.phys >= 3) {
      addSit('Ominous Premonition', 'musuh dominan physical');
    }
    if (an.attackSpeed >= 1 && an.phys >= 2) addSit("Protector's Cuirass", 'lambatkan attack speed musuh');
    if (an.burst >= 3) addSit('Sage\'s Sanctuary', 'jaga-jaga kena burst (revive)');
    const notes = [];
    if (jungle) notes.push('Jungle: mulai dari Hunting Knife, upgrade sesuai kebutuhan.');
    if (roam) notes.push('Roam: Knowledge Gem dulu, upgrade ke Guardian / Crimson Shadow / Stormchaser.');
    return { boots, core, situational: situational.slice(0, 3), notes, wants, archetype: archetypeOf(hero) };
  }

  // ---------- arcana ----------
  function arcanaFor(hero, ARCANA) {
    const arch = archetypeOf(hero);
    const sets = ARCANA.recommended_sets || [];
    const set = sets.find(s => s.archetype === arch) || sets.find(s => s.archetype === 'fighter-clash');
    if (!set) return null;
    const findArc = name => {
      for (const c of ['red', 'blue', 'green']) {
        const f = (ARCANA[c] || []).find(a => a.name === name);
        if (f) return { ...f, color: c };
      }
      return null;
    };
    return {
      archetype: arch,
      red: findArc(set.red), blue: findArc(set.blue), green: findArc(set.green),
      note: set.note,
    };
  }

  // ---------- strategy tips ----------
  function makeStrategy(an) {
    const tips = [];
    if (an.mag >= 3) tips.push('🛡️ Musuh dominan MAGIC — semua hero bikin 1 item magic defense (Succubus Cloak / Longnight Guardian).');
    if (an.phys >= 3) tips.push('🛡️ Musuh dominan PHYSICAL — prioritaskan physical defense (Ominous Premonition / Frigid Charge).');
    if (an.burst >= 3) tips.push('💥 Burst musuh tinggi — jangan gerombol, jaga jarak, dan lindungi marksman/mage.');
    if (an.cc >= 3) tips.push('⛓️ CC musuh berat — carry pakai Boots of Resistance, tank inisiasi duluan.');
    if (an.heal >= 2) tips.push('💚 Musuh banyak heal — beli anti-heal (Mortal Punisher / Venomous Staff) sebagai item ke-2/3.');
    if (an.mobility >= 3) tips.push('💨 Musuh lincah — simpan CC untuk mengunci, jangan buang skill ke udara.');
    if (an.stealth >= 1) tips.push('👁️ Ada hero stealth — jaga vision di semak, jangan jalan sendirian.');
    if (an.tank >= 2) tips.push('🥩 Musuh tebal — andalkan true damage / %HP damage, hindari perang lama tanpa anti-tank.');
    if (an.poke >= 2) tips.push('🎯 Musuh main poke — paksa teamfight cepat (engage) atau bawa sustain.');
    if (an.trueDmg >= 1) tips.push('⚔️ Ada TRUE DAMAGE — defense kurang guna, jawab dengan HP tebal atau bunuh duluan.');
    if (an.dive >= 2) tips.push('🦅 Musuh suka dive — backline rapat, simpan peel untuk marksman.');
    if (!tips.length) tips.push('⚖️ Komposisi musuh seimbang — main standar, menangkan lane masing-masing.');
    tips.push('🐉 Kontrol objektif: Tyrant/Overlord & Dragon — ajak teamfight saat unggul jumlah.');
    return tips;
  }

  // ---------- hero counter lookup ----------
  function heroCounters(heroId, HEROES) {
    const byId = Object.fromEntries(HEROES.map(h => [h.id, h]));
    const h = byId[heroId];
    if (!h) return null;
    const named = (h.counters || []).map(n => HEROES.find(x => x.name === n)).filter(Boolean);
    return { hero: h, counters: named };
  }

  return {
    LANES, analyzeEnemy, recommendTeam, buildFor, arcanaFor,
    makeStrategy, kitWants, archetypeOf, heroCounters,
  };
});
