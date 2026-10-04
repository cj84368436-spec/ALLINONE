# Rift 5.2 — Painted material combat pass

The 5.1 implementation was functional, but its flat constructed VFX did not match the painted characters and scenery. This pass replaces the most visible material mismatch with original painted components, bounded contact effects and a foreground audio bus. It is a concrete revision, not a claim that automated checks prove commercial art quality.

- Thousand blades use detailed sword silhouettes and acceleration into actual mark timing. The final wave uses an asymmetric painted crescent.
- Ballista assembles an ornate physical weapon, loads an arrow and recoils on its existing shot event. Its painted bolt nose follows the real projectile coordinate.
- Dragon uses scaled body slices along the actual collision paths, aligned closed/open heads, neck anchor and a dissolving mist tail. Back/front layers protect the hero.
- Barrier, whirlwind and frost crown use painted blades, crescent strokes and varied crystal clusters. Fire and vertical lightning use the same material atlas.
- Normal damage text coalesces over a longer interval. Recent signature attacks dim supporting friendly effects; enemy warning cues retain priority.
- Licensed sound material replaces 17 aliases and adds 6 cues: bow draw, heavy sword swing/hit, dragon growl/roar/breath. Windup, release, contact and finish remain event driven. Foreground cues duck the supporting bus and pause clears the automation.
- Native bundles load assets locally. The public play preview pins new material/audio URLs to immutable source commit 71402d679a100bbea340f88049f8bd926d1e46a2; source preview and native runtime use local assets.

Attribution: JC Sounds Fantasy SFX Pack Vol 1, CC BY 4.0; rubberduck creature vocals, CC0. Authors, source links and processing are included in public/audio/CREDITS.txt, the source index and in-game credits. The sound pack includes designed fantasy cues; it is not described as entirely physical Foley.

The actual staged animation review is in .evidence/rift-5.2-review. A decoded-alpha report and opaque stone composite confirm that the source atlas has no large colored rectangles in gameplay. Full .evidence/rift-5.2 captures and browser/mobile-emulation/build results are recorded after integration. PCM onset, peak and RMS checks do not establish timbre quality. Real iPhone/Toss testing and console registration remain pending.
