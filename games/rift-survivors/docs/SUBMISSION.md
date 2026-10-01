# 토스 미니앱 등록 자료
표시 이름: **균열의 수호자**
기본 appName: **rift-keepers**
앱 종류: **게임** / 액션
SDK: Apps in Toss WebView 3.x
화면 방향: 세로
한 줄 소개: 스킬을 조합하고 숲의 균열을 닫는 2D 생존 액션

## 앱 설명
룬 기사, 별빛 궁수, 서리 마법사 중 영웅을 선택하세요. 몰려오는 적을 물리치며 경험치를 모으고 서로 다른 스킬을 조합해 나만의 전투 방식을 만들 수 있어요. 회피와 별빛 폭풍으로 위기를 넘기고, 5분 뒤 깨어나는 균열의 군주를 처치해 숲을 지켜 주세요. 플레이로 모은 보석은 다음 모험을 위한 영구 강화에 사용할 수 있어요.

## 출시 산출물
성공한 GitHub Actions 실행의 **rift-keepers-toss-release** 아티팩트:
- *.ait: 토스 콘솔 업로드 번들
- release/icon.png: 600 × 600 PNG 아이콘
- release/home.png, gameplay.png, skills.png: 제작한 게임 화면
- release/build-manifest.json: appName, 버전, 파일 크기와 SHA256
- dist: 같은 소스에서 빌드한 토스 내부 웹 콘텐츠
- docs: 제출 문구, 데이터 안내, 검증 상태

인게임 등록 이미지는 개발 테스트 장면에서 캡처한다. 최종 콘솔 QR 테스트 후 실제 토스 화면으로 교체할 수 있다.

## 등록 순서
1. 앱인토스 콘솔에서 새 앱을 **게임**으로 등록한다.
2. 이름, 아이콘, 실제 고객센터와 게임물 이용등급 관련 항목을 입력한다. 고객센터와 등급을 임의로 확정하지 않는다.
3. 실제 appName이 rift-keepers와 다르면 저장소 Settings → Secrets and variables → Actions → Variables에 **TOSS_APP_NAME**을 등록하고 다시 빌드한다. 워크플로 직접 실행의 app_name 입력으로도 변경할 수 있다.
4. 생성된 .ait 파일을 콘솔에 업로드한다.
5. 콘솔 QR로 iPhone 토스 앱에서 아래 항목을 확인한다. SDK 3.x는 기존 샌드박스 앱 테스트 방식과 다르다.
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
- 레벨업/무기 4개 제한/스킬 5레벨/5분 보스/승패/재시작
- 종료·재접속 후 점수, 보석, 강화와 설정 유지
- 익명 키/기록 저장 실패의 재시도와 사용자 안내

이번 버전에는 기기 권한 요청, 실제 돈 결제, 인앱 광고, 별도 서버가 없다. 기기를 바꾸면 게임 기록이 동기화되지 않는다.

이 작업에는 토스 콘솔 로그인 세션과 앱 등록 정보가 연결되지 않았다. 소스/번들 준비와 실제 심사 신청·공개 완료는 구분해야 한다.

## 공식 문서
- https://developers-apps-in-toss.toss.im/documentation/integration/sdk-3.x
- https://developers-apps-in-toss.toss.im/checklist/app-game
- https://developers-apps-in-toss.toss.im/guide/operation/deploy
