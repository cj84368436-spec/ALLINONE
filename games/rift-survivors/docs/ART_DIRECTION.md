# Visual and audio release 1.4.0

The direction is dark emerald woodland, a copper-haired rune knight in gold/silver armor and an emerald cape, textured golden sword magic, and violet corrupted enemies.

## Included
- Four knight poses, independent ranger/mage artwork and painted enemies. Full directional animation sheets remain future work.
- A transparent, textured gold crescent with fine rune and filigree details replaces the plain procedural sweep. It animates along the attack direction; impact recoil, sparks, dash afterimages and spell effects remain.
- Larger combat heroes and enemies, a slightly closer camera, depth-sorted painted tree/ruin scenery, and subtle light shafts. Nearby scenery fades when it would cover the player. Enemy hit flashes preserve artwork detail.
- Six painted weapon badges, gold/emerald mobile frames, and a locally bundled Noto Serif KR title subset under SIL OFL.
- Recorded sword whooshes, impacts and spell effects replace runtime oscillators and generated noise. Each sword attack mixes one whoosh with one delayed impact; per-enemy sword impact events do not stack additional sounds. Category voice limits, gentle gain ramps and output compression control bursts. The background is a quiet edited cave ambience recording, not an orchestral music track.
- CC0 sources: artisticdude Swishes (OpenGameArt) and Kenney RPG Audio. CC BY 3.0: Little Robot Sound Factory Fantasy Sound Effects Library. Credits, source links, licenses and edit details are bundled in public/audio/CREDITS.txt and shown in game information.
- Existing combat rules, controls, saves, fixed 60Hz simulation, render budgets and entity caps remain supported. Reduced motion suppresses shake and decorative light shafts.

## Reproducible assets
Original painted sources: art-source/. Preparation: scripts/prepare-art.mjs and scripts/prepare-audio.mjs; workflows rift-art.yml and rift-audio.yml.
Production art and title font/license: 1,164,544 bytes. Recorded MP3 assets: 729,056 bytes. Original large PNGs and source sound packs are not shipped. Gameplay loads bundled assets without a runtime CDN or font server.

## Verification
Actual running mobile screenshots are committed at repository-root .evidence/rift-1.4/. The combat screenshot is a renderer verification fixture. It is not a concept image or a recorded human playthrough.
The release workflow checks game logic, Chromium and WebKit mobile behavior, decoded audio buffers, multi-enemy sound grouping, load-failure retry, UI assets, stress scene responsiveness, nine legal-input playthroughs and the Apps in Toss .ait bundle.
Automated audio tests validate playback behavior and decoded samples; subjective listening quality requires player feedback. Native iPhone Toss testing, console registration and release review remain separate pending steps.

## Focused knight and sword slice

The knight has eight aligned, isolated attack poses extracted by alpha components, at one shared source scale and foot pivot. The game state owns the swing: 90ms anticipation, 140ms contact and 340ms recovery completion. Damage is resolved once at contact, against enemies currently inside the locked attack direction and range. Normal and evolved blade attacks use different cone widths. Misses do not emit a contact sound. A 24ms/38ms impact hold is quantized by the 60Hz simulation; reduced effects disable that hold and camera shake.

The trail grows along the sword arc, narrows toward both ends, and fades. Small directional cut sparks, enemy stagger and controlled recoil support contact. Background foliage is subdued so the hero and attack remain legible.

Sword contact sounds now mix recorded knife-edge, low pitched cloth body and quiet metal resonance. A chopped-wood layer is removed; playback follows the actual contact event. Background ambience ducks briefly at contact. Browser audio URLs include a version key to refresh changed clips.

The optional 15-second sword-practice mode uses these production combat, rendering and audio paths. Practice does not grant experience, currency or permanent statistics. A recorded MP4 with actual Web Audio is captured from that mode in .evidence/rift-1.4/knight-15s.mp4. The still anticipation/contact/recovery captures use an explicit scene fixture. This slice improves the knight and blade; full directional locomotion, ranger/mage animation and bespoke VFX for every other skill remain future work.
