# Visual and audio release 3.0.0

The game uses a blue stone courtyard, navy and gold UI, distinct painted heroes and violet corrupted enemies.

- Thirty original illustrated attack, growth rune and ultimate icons share a cached WebP atlas. Source rows are sampled separately to prevent adjacent illustrations showing through. Short portrait screens use four 54px images in a 2×2 growth grid.
- A transparent 36-frame WebP atlas, cached into softly fading per-cell canvases, animates gold cuts, whirlwinds, fire, electricity, ice and poison. Whirlwinds and frost storms draw behind actors. Primary effects remain visible with reduced effects and battery rendering; only decorative details are limited.
- Knight ultimate: a descending celestial blade followed by a painted ground cut, with damage at 0.30 seconds.
- Ranger ultimate: three timed waves of seven penetrating arrows, visible projectile trails and contact feedback.
- Mage ultimate: ice pillars and a four-second frost field. The overlay is translucent and the field draws underneath actors so enemies and the hero remain readable.
- Hero combat scale is 1.65 instead of 2.6, a 36.5% reduction. Ordinary enemy heights are 54–92px, elites larger, boss 185px. Home portraits keep their presentation size.
- Actual sword contact, projectile release, spell contact and ultimate impacts drive recorded audio. Nineteen recorded samples and existing author/license/edit attribution are retained from 2.1. This release changes impact timing, not the source recordings.
- Fixed 60Hz simulation, movement ownership, walking, save keys, load retries and the Toss SDK remain supported.

Original atlas PNGs live at repository-root .evidence/rift-3.0/masters/. Only WebP files ship. The two new atlases total 1,740,666 bytes. atlas-manifest.json records dimensions, byte counts, SHA256, alpha coverage and runtime sampling. No asset comes from another commercial game's files.

Actual renderer captures live at .evidence/rift-3.0/. These are staged scenes with seeded monsters and skills for review, not human playthrough footage. Automated tests compare ultimate pixels after excluding damage text and hit decoration, decode all images and audio, inspect growth images and exercise touch controls in Chromium and WebKit. Actual iPhone/Toss performance and listening quality require device testing; console review and public Toss release remain pending.
