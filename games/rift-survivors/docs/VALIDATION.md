# 검증 결과 — 2026-10-01

검증한 게임 소스 커밋: 8dda8309f187fd6dff87ba7e395ec1b36cb73e19

[성공한 자동 검증/빌드 실행](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36803427410)

## 완료

- Node.js 게임 로직 테스트: 12개 통과, 실패 0개
- 모바일 크기 Chromium UI 테스트: 9개 통과
- 영웅 선택, 드래그 이동, 레벨업, 일시정지/배경 전환, 결과 보상, 저장 후 재접속, 영구 강화, 사운드 설정, 종료 확인, 작은 화면 대응 검증
- Vite 제작 빌드 성공
- Apps in Toss 제작 빌드 성공: rift-keepers.ait
- 출시 번들에서 DEV 검증 도구 제거 확인
- 외부 코드 eval/iframe 없는 게임 소스 확인
- 600 × 600 PNG 아이콘과 게임 이미지 생성
- 출시 파일과 테스트 증거 아티팩트 업로드 완료

## 출시 번들

- appName: rift-keepers (실제 콘솔 등록값 확인 필요)
- 버전: 1.0.0
- 파일: rift-keepers.ait
- 크기: 43,689 bytes
- SHA256: a5fd67948c9ac30c37d1a728f81934a263ed5a0574c9ee27d81e94231d2b9302

[출시 파일 ZIP 다운로드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36803427410/artifacts/11135869133)

[테스트 보고서/화면 이미지](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36803427410/artifacts/11135983991)

출시 ZIP에는 .ait, dist, 아이콘/화면 이미지, 설치에 사용한 package-lock.json과 등록 자료가 포함된다. GitHub 아티팩트 다운로드에는 계정 로그인이 필요할 수 있다. 이 실행의 아티팩트 보관 기한은 2026-12-30이며 필요하면 소스에서 다시 빌드한다.

## 아직 확인하지 않은 항목

- 토스 콘솔의 앱 등록 및 실제 appName 일치 여부
- 토스 iPhone/Android 실기기에서 네이티브 저장, 익명 키, 캡슐 X, 시스템 무음, Safe Area와 멀티터치 동작
- 실제 고객센터/게임 이용등급 등 등록 필수 정보
- 심사 신청, 승인과 실제 서비스 공개

브라우저 자동 검증은 토스 네이티브 실행을 대체하지 않는다. 등록/실기기 절차는 [SUBMISSION.md](SUBMISSION.md)를 따른다.

이 문서는 게임 소스를 변경하지 않는 검증 결과 기록이다. 출시 ZIP 안의 초기 검증 문구보다 본 문서와 해당 실행의 성공 상태를 우선 확인한다.
