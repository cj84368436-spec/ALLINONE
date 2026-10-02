# 균열의 수호자 — 토스 2D 미니앱

토스 앱 안에서 실행하는 한국어 2D 생존 액션 게임입니다. Apps in Toss WebView SDK 3.x를 사용하며 별도 Unity, Unreal, Xcode 프로젝트가 필요하지 않습니다.

- 룬 기사 / 별빛 궁수 / 서리 마법사
- 드래그 이동, 자동 공격, 회피, 영웅별 필살기
- 레벨업 4지선다와 다시 뽑기 3회, 직업별 공격 6종·성장 룬 8종, 무기 4개, 공격 18종 진화
- 5분 생존 후 2단계 보스전
- 보석 보상, 영구 강화, 최고 점수 저장
- 사운드, 일시정지, 종료 확인, Safe Area, 자동/60FPS 목표/배터리 절약 모드
- 손그림풍 기사·궁수·마법사와 별빛 유적 배경, 황금 참격·명중 반응·녹음한 휘두름·명중·마법 효과음
- 이번 버전에는 로그인 화면, 실제 돈 결제, 광고 없음

## 출시 파일 받기

[GitHub Actions](https://github.com/cj84368436-spec/ALLINONE/actions/workflows/rift-survivors.yml)에서 성공한 실행을 열고 **rift-keepers-toss-release** 아티팩트를 내려받으세요.

.ait 번들, 600px PNG 아이콘, 게임 이미지, 빌드 manifest와 등록 문서가 포함됩니다. 실제 검증 상태는 [docs/VALIDATION.md](docs/VALIDATION.md), 등록 절차는 [docs/SUBMISSION.md](docs/SUBMISSION.md)에 기록합니다.

기본 appName은 **rift-keepers**입니다. 콘솔에 등록한 실제 값이 다르면 **TOSS_APP_NAME** 환경 변수/Actions 변수로 바꾸어 다시 빌드해야 합니다. 앱 종류는 콘솔에서 **게임**으로 등록합니다.

## Windows에서 개발

Node.js 22 LTS와 Git을 준비한 뒤 이 폴더에서 실행:

~~~powershell
npm install
npm run dev
~~~

개발 모드에서는 토스 네이티브 저장소를 로컬 대체 경로로 테스트합니다. 출시 빌드는 토스 익명 사용자 키와 토스 SDK Storage를 사용합니다. DEV 검증 도구는 출시 번들에서 제거됩니다.

~~~powershell
npm test
npx playwright install chromium webkit
npm run test:e2e
npm run benchmark
npm run build
npm run check:release
~~~

## 구성

- src/core.js: 전투, 성장, 저장 모델
- src/runtime.js: 고정 시간 전투와 자동 화면 성능 조절
- src/spatial.js: 탄환 충돌을 위한 공간 격자
- src/art.js: 게임 이미지 로딩과 캐시
- src/render.js: 손그림풍 Canvas 2D 전장, 스킬과 타격 효과
- src/icons.js: 독자적인 룬 스킬 아이콘
- src/main.js: 게임 전체 흐름, 터치와 UI
- src/platform.js: 토스 저장/익명 키/화면 제어
- src/audio.js: 사운드와 배경 전환 대응
- tests: 로직 및 실제 브라우저 테스트
- docs: 출시 등록 자료와 데이터 안내

기록은 해당 기기 토스 저장소에 남습니다. 이번 버전은 기기 간 서버 동기화와 멀티플레이를 제공하지 않습니다. 실제 토스 콘솔 제출/심사/공개 여부는 빌드 성공과 별도로 확인해야 합니다.

버전 1.1.0의 변화와 측정 방법은 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)를 참고하세요. 자동 검증에는 Chromium과 WebKit을 사용하며 실제 iPhone 토스 QR 테스트는 별도로 필요합니다.

## 2.0 — 별빛 유적과 새로운 전투

[최신 플레이](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=2.1.0-class-skills)

회청색 유적 바닥과 남색·금빛 UI, 가운데 영웅 전신을 새로 구성했습니다. 기사는 태양의 심판, 궁수는 유성 일제사격, 마법사는 영원의 서리로 서로 다른 전투를 수행합니다. 전투 중 선택형 균열을 봉인하면 회복·성장·필살기 재충전을 얻습니다. 분마다 추가 편대와 방향을 예고하는 정예 돌진이 등장합니다. 성장 카드에는 다음 실제 수치와 진화 연결을 표시합니다.

사용자의 비개발자 요청을 해석하는 개발자·게임 디자이너·아트 디렉터 역할과 기준은 [docs/DESIGN-2.0.md](docs/DESIGN-2.0.md)에 정리했습니다. 이전 조작과 저장 키를 유지합니다.

## 바로 플레이하는 미리보기

[균열의 수호자 플레이](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/)

이 링크는 2.0 게임의 플레이 체험용입니다. 기록은 이 브라우저에 따로 저장됩니다. 토스용 .ait와 실제 콘솔 등록/출시 과정은 별도로 유지합니다. 미리보기 소스는 preview/index.html에 있고, 실행용 사본은 본인 GitHub Pages의 play/rift-keepers/index.html 경로에서 제공합니다.

## 디자인과 사운드 1.4

어두운 초록 숲과 금빛 룬 기사를 중심으로 시작 화면, 세 영웅, 적과 보스, 스킬 효과와 UI를 개편했습니다. 자세한 범위와 이미지 제작 방법은 [docs/ART_DIRECTION.md](docs/ART_DIRECTION.md)를 참고하세요. 게임용 WebP 이미지는 public/art/에 포함돼 있어 별도 이미지 서버 연결 없이 실행합니다. 기사는 대기·걷기·공격 자세를 사용하며 궁수·마법사는 개별 이미지와 코드로 움직임을 표현합니다.

금빛 문양 참격, 더 큰 전투 캐릭터, 나무·유적의 앞뒤 배치, 손그림 스킬 배지와 로컬 제목 글꼴을 적용했습니다. 짧은 발진음 대신 녹음한 검 휘두름과 명중음을 사용하고, 한 번의 참격이 여러 적을 맞혀도 명중음이 적마다 겹치지 않게 했습니다. 음원 출처·라이선스·편집 내역은 public/audio/CREDITS.txt에 포함합니다.

## 검술 연습과 검 공격 1.4

[실제 전투 영상과 효과음](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/sword.html?v=1.4)으로 변경된 검술을 볼 수 있습니다.

[15초 검술 연습](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.4&practice=blade)은 같은 게임 코드로 실행하며 점수·보석·영구 기록을 변경하지 않습니다. 검의 준비 동작, 궤적, 실제 접촉 시점과 녹음 명중음을 한 전투 상태로 연결했습니다. 룬 기사는 8개 공격 포즈를 사용하고, 검은 바라보는 방향의 부채꼴 범위를 타격합니다. 강한 공격과 일반 공격에 짧은 정지, 밀림과 잘게 흩어지는 불꽃이 적용됩니다. 검에 맞지 않은 적이나 빗나간 공격에는 명중음이 재생되지 않습니다.

## 세 영웅의 전투 동작 — 1.5

별빛 궁수와 서리 마법사에도 각각 공격 8프레임·걷기 4프레임을 적용했습니다. 활시위를 놓는 순간의 발사, 마력을 모으고 내보내는 동작, 탄환의 실제 충돌과 각각의 효과음을 연결했습니다. 화살은 초록 별빛과 금빛 화살대, 마력 창은 푸른 서리 결정과 충돌 파편으로 구분합니다. 각 영웅의 무기 진화, 스킬 조합과 영구 기록을 유지합니다.

- [15초 궁술 연습](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5&practice=arrow)
- [15초 마법 연습](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5&practice=bolt)
- [일반 생존 게임](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5)

연습은 점수·보석·영구 기록을 변경하지 않습니다. 기존 검술 영상은 1.4 시점의 기사 검술 영상이며 궁수·마법사 변경을 보여 주는 영상은 아닙니다.

## 터치 조작 수정 — 1.5.1

화면이 보이는 상태에서 포커스가 바뀌어도 게임이 멈추지 않습니다. 화면 터치와 드래그 이동은 계속되고, 일시정지 버튼 또는 실제 백그라운드 전환 시에는 전투·소리가 멈춥니다. 기존 저장 키와 기록을 유지합니다.

[수정된 게임](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5.1) · [자동 검증과 토스 빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36895603237)

## 8방향 터치 이동과 걷기 — 1.5.2

이동을 소유한 손가락을 추적하며 상하좌우·대각선, 누른 채 방향 전환, 다른 손가락으로 스킬 사용과 resize 중 이동을 유지합니다. 새 이동 입력과 이동 중 키보드 입력이 충돌하지 않습니다. 손을 떼거나 터치가 취소되면 멈춥니다.

세 영웅의 걷기는 실제 이동 거리로 진행하고 정지하면 멈춥니다. 기사는 걷기 2개 그림, 궁수·마법사는 각 4개 그림을 사용하며 이동 중 공격에서도 하체 걸음을 유지합니다.

[1.5.2 수정본](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5.2-touch2) · [107개 자동 검사와 토스 빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36954484372)

Chrome 연속 드래그는 브라우저 터치 입력으로, WebKit 드래그는 터치 이벤트 시뮬레이션으로 확인했습니다. 실제 iPhone/Toss에서의 직접 검증 및 콘솔 출시 상태는 docs/VALIDATION.md에 구분합니다.

## 2.1 — 직업 전용 전투와 성장

공격 18종을 직업별 6종으로 분리했습니다. 전사는 회오리·검기·강타·출혈·칼날 방벽, 궁수는 다중·관통·독 사격·덫·화살 폭우, 마법사는 화염구·연쇄 번개·지속 눈보라·운석·방사형 빙결을 사용합니다. 기존 직업 기본 무기는 유지하며, 모든 공격에 개별 진화가 있습니다.

성장 룬은 8종이며 치명타·처치 회복·영역 확장이 추가됐습니다. 네 가지 성장 선택에는 장착 칸이 남아 있으면 새 직업 기술이 최소 하나 포함됩니다. 보유 기술 강화와 진화 연결도 함께 제시합니다. 게임 안의 ‘직업 스킬’에서 전체 전용 기술과 진화 조건을 확인할 수 있습니다.

검격은 금속 마찰과 칼 Foley로 다시 믹스했습니다. 연쇄 번개에는 InspectorJ의 실제 근거리 천둥 녹음과 3.4초 잔향을 사용합니다. 모든 음원은 public/audio/CREDITS.txt에 원작자·라이선스·편집 내용을 기재합니다. 원본 게임의 이미지·음원을 사용하지 않습니다.

자동 검증과 실제 기기 평가는 다릅니다. Chromium/WebKit 조작·렌더링·음원 디코딩, 정상 입력만 사용하는 9회 보스 완주, .ait 빌드를 확인하며 실제 iPhone의 토스 앱 내부 테스트와 콘솔 심사·공개는 별도 단계입니다.
