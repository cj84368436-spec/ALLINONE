# Rift Keepers 5.0 — five regions

The first lord no longer ends a victory run. Defeat each region boss, select the next-region button and continue with the same level, XP, attacks, runes and evolutions. Regions 1–4 show an intermission; only region 5 awards victory. Death or retirement ends the whole run and settles earned gems once.

| Region | Boss | Waves before boss | Enemy HP multiplier | Boss HP |
|---|---|---|---|---|
| 1 Starlight Ruins | Rift Lord | 300 s | 1.00 | 5,600 |
| 2 Ashen Citadel | Iron Executioner | 150 s | 1.65 | 9,000 |
| 3 Eclipse Garden | Eclipse Priest | 150 s | 2.35 | 14,500 |
| 4 Glacial Throne | Frost Queen | 165 s | 3.20 | 21,500 |
| 5 Collapsing Abyss | Abyss Emperor | 180 s | 4.30 | 32,000 |

Seven enemy roles have distinct original sprites and behavior: directional shield guard, telegraphed rushing hound, delayed explosive bomber, briefly steering wisp projectiles, capped nearby healing priest, delayed locked-direction sniper, delayed frost-area shaman. Later bosses add sequential line eruptions, slow steering volleys, enclosing ice warnings and staggered mixed pressure. Warning areas and projectile positions remain the authoritative collision geometry.

Every transition restores 50% maximum HP (capped), resets dash/ultimate cooldowns, starts a new local region clock, clears old attacks/danger and grants the new attack for the chosen hero at Lv.1. Each arrival adds one attack slot; the maximum becomes 10 after Lv.10 in region 5. New attacks are offered for further growth, with Lv.3/Lv.5 behavioral milestones and a Lv.5 + partner-rune Lv.2 evolution. Other classes' attacks and future-region attacks cannot be forged into choices.

| Arrival | Knight | Ranger | Mage |
|---|---|---|---|
| 2 | Crossed Moonlight | Explosive Arrow | Spectral Spears |
| 3 | Flash Afterimages | Celestial Falcon | Blackflame Path |
| 4 | Judgment Greatsword | Storm Arrow | Gravity Seal |
| 5 | Thousand Swords | Constellation Ballista | Azure Dragon Breath |

Twelve new painted skill icons, seven enemy sprites, five boss sprites and clean falcon/dragon spell sprites are original generated artwork, cropped and compressed to WebP. Region floors reuse the painted courtyard with cached region-specific materials and motifs. New attack visuals are live Canvas geometry and material frames synchronized to hit timing, not screenshots pasted over attacks. Recorded sound layers use the existing credited sample library; new cast, flight and impact routes are throttled and voice-limited. No franchise character art, recordings or code are copied. MapleStory/anime/RPG references inform attack rhythm, silhouettes, chained cuts and transformations.

Each codex technique has a 15-second practice entry, including later-region attacks, without currency or saved scores. A full run takes roughly 17 minutes for the tested rule-based completion paths; human play can differ. Browser/CI checks do not establish native iPhone performance or subjective art/audio quality. Native Toss testing and console publication remain separate, uncompleted checks.
