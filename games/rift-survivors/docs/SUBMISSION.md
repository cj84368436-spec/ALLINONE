# 토스 미니앱 등록 자료
표시 이름: **균열의 수호자**
기본 appName: **rift-keepers**
앱 종류: **게임** / 액션
SDK: Apps in Toss WebView 3.x
화면 방향: 세로
한 줄 소개: 직업 전용 스킬을 조합해 유적의 균열을 닫는 2D 생존 액션

## 앱 설명
룬 기사, 별빛 궁수, 서리 마법사 중 영웅을 선택하세요. 회오리와 출혈, 다중 사격과 독, 연쇄 번개와 운석 등 직업마다 다른 전용 스킬 6종을 조합해 나만의 전투를 만들어요. 레벨업할 때 네 가지 선택과 성장 룬 8종으로 힘을 키우고, 회피와 직업별 필살기로 위기를 넘기세요. 유적의 균열을 봉인하고 5분 뒤 깨어나는 균열의 군주를 물리쳐 주세요. 모은 보석은 다음 모험을 위한 영구 강화에 사용할 수 있어요.

## 출시 산출물
성공한 GitHub Actions 실행의 **rift-keepers-toss-release** 아티팩트:
- *.ait: 토스 콘솔 업로드 번들
- release/icon.png: 600 × 600 PNG 아이콘
- release/home.png, gameplay.png, skills.png: 각 636 × 1048 PNG 게임 화면 3장
- release/thumbnail.png: 1932 × 828 PNG 게임 썸네일
- 성능·정상 조작 완주·브라우저 상세 보고서: [자동 검증 실행](https://github.com/cj84368436-spec/ALLINONE/actions/runs/37021546641)의 release 및 test-evidence 아티팩트를 함께 참고
- release/build-manifest.json: appName, 버전, 파일 크기와 SHA256
- dist: 같은 소스에서 빌드한 토스 내부 웹 콘텐츠
- docs: 제출 문구, 데이터 안내, 검증 상태

인게임 등록 이미지는 개발 테스트 장면에서 캡처한다. 최종 콘솔 QR 테스트 후 실제 토스 화면으로 교체할 수 있다.

## 등록 순서
1. 앱인토스 콘솔에서 새 앱을 **게임**으로 등록한다.
2. 이름, 아이콘, 실제 고객센터와 게임물 이용등급 관련 항목을 입력한다. 고객센터와 등급을 임의로 확정하지 않는다.
3. 실제 appName이 rift-keepers와 다르면 저장소 Settings → Secrets and variables → Actions → Variables에 **TOSS_APP_NAME**을 등록하고 다시 빌드한다. 워크플로 직접 실행의 app_name 입력으로도 변경할 수 있다.
4. 생성된 .ait 파일을 콘솔에 업로드한다.
5. 콘솔 QR로 iPhone 토스 앱에서 아래 항목을 확인한다. QR 테스트 사용자는 토스 로그인 상태의 해당 워크스페이스 멤버여야 하며 만 19세 이상이어야 한다. SDK 3.x는 기존 샌드박스 앱 테스트 방식과 다르다.
6. 실기기 테스트 완료 후 검토 요청을 보낸다.
7. 토스 심사 승인 후 콘솔에서 공개한다.

## 실기기 확인
- 10초 내 첫 화면, 익명 사용자 키와 기록 로딩
- 우측 상단 토스 더보기·X 표시, 다른 버튼과 겹침 없음
- X와 Android 뒤로가기, 내부 종료 버튼의 종료 확인 및 저장
- Dynamic Island와 홈 인디케이터 Safe Area
- 드래그 이동과 두 번째 손가락의 회피·궁극기
- 백그라운드 전환 시 전투·사운드 중단, 돌아와 계속하기
- 시스템 무음과 사운드 설정
- 4개 레벨업 선택/직업 전용 공격 18종/성장 룬 8종/다시 뽑기 3회/무기 4개 제한/공격 18종 진화/정예와 인력 상자/5분 보스/승패/재시작
- 자동/부드럽게/배터리 절약 모드 각각 장시간 전투와 발열
- 썸네일과 세로 이미지 규격 및 실제 콘솔 미리보기
- 종료·재접속 후 점수, 보석, 강화와 설정 유지
- 익명 키/기록 저장 실패의 재시도와 사용자 안내

이번 버전에는 기기 권한 요청, 실제 돈 결제, 인앱 광고, 별도 서버가 없다. 기기를 바꾸면 게임 기록이 동기화되지 않는다.

이 작업에는 토스 콘솔 로그인 세션과 앱 등록 정보가 연결되지 않았다. 소스/번들 준비와 실제 심사 신청·공개 완료는 구분해야 한다.

## 자동 테스트 번들 업로드
선택 사항: GitHub 저장소 Settings → Secrets and variables → Actions에서 앱 단위 토스 API 키를 **TOSS_API_KEY** secret으로 저장하고 실제 appName을 **TOSS_APP_NAME** variable로 설정한다. API 키를 채팅이나 소스에 적지 않는다. Actions의 **Run workflow**에서 upload_to_toss를 켜면 검증을 마친 .ait만 `npx ait deploy --api-key`로 테스트 업로드한다. 이 작업은 심사 신청·공개를 수행하지 않는다. 업로드가 성공하면 Actions 결과에서 토스가 발급한 테스트 스킴을 확인한다.

## 공식 문서
- https://developers-apps-in-toss.toss.im/documentation/integration/sdk-3.x
- https://developers-apps-in-toss.toss.im/checklist/app-game
- https://developers-apps-in-toss.toss.im/guide/operation/deploy
