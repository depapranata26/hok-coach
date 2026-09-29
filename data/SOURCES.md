# SOURCES — HoK Coach Data (Honor of Kings Global, Sept 2026)

All sources accessed 2026-09-29. Patch context: global client, Season 16
("Spriteling Playverse" era). Data prioritized from sources updated Sept 2026.

## Hero data (heroes.json, 111 heroes)

- https://honor-of-kings.fandom.com/wiki/Heroes — roster baseline:
  "110 Heroes · 6 Roles" (14 Tanks, 33 Fighters, 20 Assassins, 29 Mages,
  19 Marksmen, 15 Supports); plus individual hero pages (skills, class, lane)
- https://liquipedia.net/honorofkings/Portal%3AHeroes — hero roster verification
- https://hokstats.gg/heroes/ — in-game range/damage-type verification
  (HoK Global v11.x captures), global naming (Loong = Ao'yin)
- https://raw.githubusercontent.com/andylusheng/hokmeta/main/data/heroes.json
  (+ heroes-index.json) — community dataset: class, lane, skills (Camp HOK
  bilingual, updated 2026-07-19), counters/counteredBy. NOTE: community data,
  not official; counters are community-sourced.
- https://esports.gg/news/mobile/honor-of-kings-loong/ — confirms "Loong" is
  the GLOBAL name for Ao'yin (merged into one entry, alias kept)
- https://www.pocketgamer.com/honor-of-kings-global/2026-first-update/ —
  Haya (Hai Yue) new mid-laner, Jan 2026
- https://www.videogameschronicle.com/guide/honor-of-kings-tier-lists/ —
  lane per hero
- https://vintagevinylnews.com/honor-of-kings-tier-list/ (Sept 2026),
  https://www.LagoFast.com/en/blog/honor-of-kings-hero-classes-and-roles/,
  https://www.lootbar.com/blog/en/honor-of-kings-tier-list.html,
  https://www.talkesport.com/guides/honor-of-kings-tier-list-2026-best-heroes-ranked-for-every-role/
  — roster cross-check, new heroes (Arke, Feyd, Fatih, Garuda, Chicha, Dyadia,
  Umbrosa, Luara, Sakeer, Haya, Dunshan, Wang Wei)
- https://hokbuild.com/ — per-hero builds, skills (Nezha, Dharma, Chicha,
  Umbrosa, Fang, Consort Yu, Di Renjie, Dolia, Donghuang, Fuzi, Dian Wei)
- https://gaminggblog.com/ — per-hero builds; "Hero Master Difficulty" 0–100
  scale (see unverified notes)
- https://onemoregame.ph/2026/09/honor-of-kings-sept-new-heroes-honor-royale/ —
  Wang Wei (releases Oct 8, 2026) & Dunshan (Sept 2026); Flowborn classes
- https://www.sportskeeda.com/esports/honor-kings-equipment-arcana-more-explained
  — Dun skills/roles

## Item data (items.json, 109 items)

- https://zilliongamer.com/honor-of-kings/c/physical-items/ (+ novice subpage)
- https://zilliongamer.com/honor-of-kings/c/magical-items/ (+ novice subpage)
- https://zilliongamer.com/honor-of-kings/c/defense-items/novice-defense-items-hok
- https://zilliongamer.com/honor-of-kings/c/movement-items/
- https://zilliongamer.com/honor-of-kings/c/jungling-items/ (+ novice subpage)
- https://zilliongamer.com/honor-of-kings/c/roaming-items/
  (guardian / stormchaser / knowledge-gem / crimson-shadow pages)
  — all updated 2026-09-25 → 2026-09-28; preferred on conflicts
- https://sites.google.com/view/patchnotology/honor-of-kings/items
  (+ physical/magic/defense/boots/jungle/support subpages) — older tree,
  used for cross-check only
- https://www.sportskeeda.com/esports/honor-kings-equipment-arcana-more-explained
- https://gaminggblog.com/honor-of-kings-equipment/ · https://hokbuild.com/items/

## Arcana data (arcana.json, 30 arcana)

- https://zilliongamer.com/honor-of-kings/c/wiki/honor-of-king-arcana
  (updated 2026-09-28) — all 30 arcana level-5 effects
- https://www.sportskeeda.com/esports/honor-kings-equipment-arcana-more-explained
  — per-role upgrade priorities
- https://itemlevel.net/honor-of-kings-complete-arcana-guide-best-arcanas-for-all-role/
  — best arcana per role
- https://buffget.com/news/honor-of-kings-arcana-guide-best-inscriptions-for-mages-and-marksmen-5a6wj
  — mage arcana breakpoints (community heuristics, not official)

## UNVERIFIED / intentionally null (do NOT invent)

1. **difficulty: null on 97/111 heroes.** No source publishes a 1–10 difficulty
   scale. 14 heroes have difficulty values DERIVED from gaminggblog's 0–100
   "Hero Master Difficulty" ÷ 10 (Nakoruru 3, Nuwa 7, Pei 8, Prince of Lanling 5,
   Princess Frost 4, Shangguan 10, Shouyue 9, Sima Yi 7, Ukyo Tachibana 7,
   Wukong 5, Xiao Qiao 3, Ying 8, Zhou Yu 7, Zilong 6) — treat as heuristic,
   not official.
2. **counters: null on 41/111 heroes.** Filled only where community guides or
   the hokmeta dataset named counters; thin entries (1–2 names) are flagged in
   research notes. All counters are community-sourced, not official matchup data.
3. **Yinxing** — no distinct Global hero found (searches return Yixing only);
   entry is all-null placeholder. Verify/remove before engine use.
4. **Wang Wei** — unreleased at cutoff (announced Oct 8, 2026); skills null,
   class/lane preview-derived and unverified.
5. **Umbrosa** — partial kit (skill names from hokbuild); full descriptions
   and difficulty unverified.
6. **Xuance** — kit from pre-release leaks; translations may differ in client.
7. **Flowborn** — custom hero, single entry class ["Custom"], range null
   (varies per form); 5 class forms unite Sept 2026.
8. **Dunshan** — new Sept 2026 hero; skills unverified.
9. **Chicha** — skill names unverified (five weapon forms).
10. **Roaming item tree reworked (Sept 2026):** old 12-item tree (Shield of
    Encourage, Glory of Guardians, Wind Spirit Coat, etc.) NO LONGER EXISTS
    in global client. Current tree is 4 items: Knowledge Gem → Guardian /
    Crimson Shadow / Stormchaser. Old tree excluded from items.json.
    Old-tree reference: patchnotology support-items page above.
11. **No stealth-reveal item** confirmed in the current global item tree —
    counter_logic.md marks this unverified; engine must not recommend one.
12. **Zhuangzi cleanse mechanics, CDR cap, pierce breakpoints** — community
    heuristics, not official numbers; marked as such in counter_logic.md.
13. **Item stat conflicts resolved toward Zilliongamer (Sept 2026):**
    Mortal Punisher AS vs HP variant; Axe of Torment 15% vs 10% CDR;
    Augur's Word 1100 vs 1000 HP; Boots of Fortitude/Dexterity Season 4 values.
    Older values documented in research notes.
14. **Giant's Grip stack/burn numbers** — approximate (older tree values).
15. **Crimson Shadow "Reward" stacking passive** — assumed from tree pattern,
    not confirmed on its item page.
16. Global item names used; alternates seen: Eternity Edge (not Blade),
    Stave of Sorcery, Twilight Stream, Red Lotus Cape, Darknight Guardian,
    Moon Spirit, Alchemist's Amulet, Sparkforged Dagger.
17. damageType/range for heroes without explicit sources were inferred from
    kit descriptions + class convention (grounded, not stat invention);
    Kui & Guiguzi = magical per Support/Mage convention.
