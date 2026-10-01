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

## 궁수와 마법사 — 1.5

별빛 궁수는 원래의 초록·금빛 장궁 디자인, 서리 마법사는 은빛 머리와 푸른 로브·보석 지팡이를 유지한다. 두 캐릭터마다 공격 8프레임과 걷기 4프레임을 새로 제작했다. 공격과 걷기 이미지는 같은 발 위치로 정렬한 투명 352×288 WebP다. 큰 시작 화면과 영웅 선택 카드는 기존 초상화를 사용한다. 공격/걷기는 좌우 방향에 따라 뒤집으며, 8방향 애니메이션은 아니다.

궁수의 공격은 활을 들고 시위를 당긴 후 130ms에 화살을 발사하고 400ms에 자세를 회복한다. 마법사는 마력을 모은 후 200ms에 마력탄을 발사하고 540ms에 회복한다. 공격 속도와 Lv.5 강화에 따라 동작 시간도 함께 줄어든다. 발사 시점에 살아 있는 원래 목표를 다시 조준하며, 제거된 목표는 가까운 다른 적으로 바꾼다. 목표가 사라져 빗나간 탄환에는 명중 효과음이 나오지 않는다. 공격력, 탄속, 레벨별 발사 수·관통 수와 진화 조건은 유지한다.

별빛 화살에는 금빛 화살대·깃, 가늘어지는 초록 궤적, 발사 반응과 작은 명중 파편을 붙였다. 마력 창에는 푸른 마력 수렴·회전 룬, 길쭉한 서리 결정 탄환과 충돌 시 흩어지는 얼음 파편을 붙였다. 진화된 화살과 마력탄은 더 뚜렷한 궤적과 광휘를 사용한다. 명중 반응은 실제 탄환 충돌에서 발생하며, 근접 검의 정지 효과를 원거리 연사에 반복 적용하지 않는다. 효과 줄이기에서는 장식 파편을 줄이고 동작·탄환·명중 중심은 유지한다.

소리는 각 무기의 발사와 명중을 별도 녹음 샘플로 혼합했다. 활 발사에는 녹음 휘두름과 작은 장력 소리, 화살 명중에는 낮은 천 마찰과 날 끝 소리, 마력 발사와 충돌에는 기존 라이선스 주문 음원을 편집했다. 합성 발진음과 생성 잡음은 쓰지 않는다. 원거리 명중에 검의 명중음을 재사용하지 않으며, 다중 발사·관통 명중음은 무기별 재생 제한을 적용한다. 출처와 편집 내역은 public/audio/CREDITS.txt에 포함한다.

게임 이미지는 WebP 53개이며 제목 글꼴·라이선스까지 1,895,108 bytes다. 녹음 음원은 19개, 756,569 bytes다. 대형 애니메이션 원본 PNG 두 장은 출시 번들에 포함하지 않는다. source 시트의 가장 큰 알파 연결 영역들을 추출해 일관된 크기·발 기준점으로 맞췄다. 생성 이미지는 원래 캐릭터를 기준으로 제작했고, 개별 프레임 그림은 수작업 리깅과 다를 수 있다.

15초 검술·궁술·마법 연습은 같은 전투 코드를 실행하며 경험치, 보석, 영구 기록을 변경하지 않는다. .evidence/rift-1.5/의 준비·발사·명중 캡처는 실제 렌더러에 가까운 목표를 배치해 동작 시점을 검토한 장면이다.
