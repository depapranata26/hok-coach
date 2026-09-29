# Counter Logic — Honor of Kings (Global, 2026)

Rule-based counter rules for the HoK Coach engine. Each rule maps an enemy
threat archetype → recommended response (item / hero pick / arcana tweak).
Item names refer to `items.json`; hero names are GLOBAL names.

## 1. Damage-type counters

- Enemy team heavy on **magical burst** (Daji, Angela, Xiao Qiao, Milady)
  → Build `anti-magic-burst` items: Succubus Cloak, Longnight Guardian,
  Darknight Breastplate. Marksmen: Runic Blade (converts phys atk → magic def).
- Enemy team heavy on **physical burst / crit** (Hou Yi, Lady Sun, Loong)
  → Build `anti-physical-burst` items: Ominous Premonition, Frigid Charge,
  Glacial Buckler, Spikemail (reflects physical damage).
- Enemy has **true damage** (Lam, Lu Bu passive) → defenses don't help;
  answer with HP stacking (Overlord's Platemail, Belt of Might) or
  kill them first (burst + cc lock).

## 2. Sustain counters

- Enemy has **heal / lifesteal / regen** (Cai Yan, Dyadia, Yaria, Biron,
  Cheng Yaojin-style sustain, Eye of the Phoenix users)
  → Build `anti-heal` items: Venomous Staff (magic), Mortal Punisher (physical).
  Rule of thumb: buy anti-heal as 2nd–3rd item when 2+ enemies have sustain.
- Enemy relies on **physical lifesteal** (attack-speed marksmen)
  → `anti-attack-speed`: Protector's Cuirass / Ominous Premonition
  (attack-speed slow on being hit).

## 3. Mobility / stealth counters

- **High-mobility divers** (Prince of Lanling stealth, Wukong, Jing, Luna,
  Han Xin) → hard CC lock: pick Zhang Fei / Donghuang / Mozi / Liang;
  item Frigid Charge / Winter (group CC active).
- **Stealth** (Prince of Lanling, Arli?) → no dedicated reveal item verified
  in global 2026 item list; answer with vision control + CC. Mark as
  `unverified` — do NOT invent an item.
- **Blink-heavy mages** (Shangguan, Diaochan, Mai Shiranui) → point-click CC
  and burst; Boots of Resistance to cut CC chains against you.

## 4. CC counters

- Enemy has **heavy crowd control** (Donghuang, Zhang Fei, Mozi, Da Qiao comps)
  → Boots of Resistance (30% CC resistance) on carries; tanks go
  full defense + Sage's Sanctuary (revive) to survive the chain.
- **Suppress / long CC chains** → keep distance (poke comps: Shouyue, Gan & Mo),
  or pick cleanse-style supports (Zhuangzi purify-style ult — verify).

## 5. Shield counters

- Heavy **shield comps** (Yaria, Zhang Fei, Dun, Ming links)
  → `shield-break` effects where available; otherwise true damage
  (Lam, Lu Bu) or grievous-style anti-shield — verify item exists in
  current patch before recommending (mark unverified if unsure).

## 6. Poke / siege counters

- Enemy **poke comp** (Shouyue, Gan & Mo, Alessio, Xuance)
  → sustain (Cai Yan / Dyadia / Eye of the Phoenix), hard engage
  (Sun Ce, Nezha global ult) to collapse on them.
- Enemy **split-push** (Li Xin, Liu Bang global presence)
  → match with mobile hero or global-ult hero; don't 5v5 into their 4-1.

## 7. Lane / draft rules

- **Clash Lane**: pick Biron / Sun Ce / Li Xin into tanks; pick sustain
  fighters into poke. Never pick immobile mage into assassin clash.
- **Jungle**: if enemy picks early-invade jungler (Dian Wei, Arke),
  ward + pick scaling jungler only with peel support.
- **Farm Lane**: Hou Yi / Loong / Lady Sun scale hard — if enemy has
  hyper-carry marksman, end before 15 min or pick dive comp
  (Wukong + Sun Ce + Da Qiao).
- **Roaming**: Da Qiao / Yaria / Dolia are playmakers — ban or mirror
  with equal roam pressure; don't pick passive support into them.

## 8. Economy / timing rules

- Behind on gold → avoid full teamfights; trade objectives; build
  cost-efficient defense (Resilient Agate components) before completing
  big damage items.
- Ahead → force fights at 4-min / 10-min objective timers with
  Frigid Charge / Winter actives ready.

## Unverified / do-not-invent list

- Exact anti-heal item names/values for 2026 patch: VERIFY against items.json.
- Stealth-reveal item: none confirmed in global item list — engine must not
  recommend one.
- Zhuangzi cleanse mechanics: verify before encoding as rule.
- Cooldown-reduction cap and pierce breakpoints: community numbers, not
  official — treat as heuristics, not facts.
