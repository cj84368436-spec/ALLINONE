# 균열의 수호자 — 토스 2D 미니앱

토스 앱 안에서 실행하는 한국어 2D 생존 액션 게임입니다. Apps in Toss WebView SDK 3.x를 사용하며 별도 Unity, Unreal, Xcode 프로젝트가 필요하지 않습니다.

- 룬 기사 / 별빛 궁수 / 서리 마법사
- 드래그 이동, 자동 공격, 회피, 별빛 폭풍
- 레벨업 3지선다와 다시 뽑기 3회, 무기 4개, 무기 6종 진화
- 5분 생존 후 2단계 보스전
- 보석 보상, 영구 강화, 최고 점수 저장
- 사운드, 일시정지, 종료 확인, Safe Area, 자동/60FPS 목표/배터리 절약 모드
- 직접 그리는 픽셀 그래픽과 합성 음향
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
- src/render.js: 픽셀 그래픽과 Canvas 2D 전장
- src/main.js: 게임 전체 흐름, 터치와 UI
- src/platform.js: 토스 저장/익명 키/화면 제어
- src/audio.js: 사운드와 배경 전환 대응
- tests: 로직 및 실제 브라우저 테스트
- docs: 출시 등록 자료와 데이터 안내

기록은 해당 기기 토스 저장소에 남습니다. 이번 버전은 기기 간 서버 동기화와 멀티플레이를 제공하지 않습니다. 실제 토스 콘솔 제출/심사/공개 여부는 빌드 성공과 별도로 확인해야 합니다.

버전 1.1.0의 변화와 측정 방법은 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)를 참고하세요. 자동 검증에는 Chromium과 WebKit을 사용하며 실제 iPhone 토스 QR 테스트는 별도로 필요합니다.

## 바로 플레이하는 미리보기

[균열의 수호자 플레이](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/)

이 링크는 검증한 1.1 게임의 플레이 체험용입니다. 기록은 이 브라우저에 따로 저장됩니다. 토스용 .ait와 실제 콘솔 등록/출시 과정은 별도로 유지합니다. 미리보기 소스는 preview/index.html에 있고, 실행용 사본은 본인 GitHub Pages의 play/rift-keepers/index.html 경로에서 제공합니다.
