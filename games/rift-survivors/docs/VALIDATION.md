# 검증 결과 — 2026-10-01, 버전 1.3.0

검증한 소스 커밋: af0d908d22ec8f7ed3138517354c4a1fd2a6097e
[성공한 검증/빌드 실행](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36852287229)

## 완료
- 전투·성장·저장·시간·입력 Node 테스트 25개 통과.
- 모바일 화면 Chromium 24개, WebKit 24개 통과. 자동 검사 합계 **73개**, 실패 0개.
- 세 영웅 각각 seed 11/22/33: 정상 이동·회피·스킬 선택을 사용하는 9회 완주 모두 보스 처치.
- 녹음 음원 15개 디코딩과 유효 PCM, 시작 후 오디오 재생 상태, 한 번의 검 공격이 적 10마리를 맞혀도 휘두름·명중 2음만 생성, 일시정지/백그라운드 시 음원 중단 검사 통과.
- 음원 실패 후 재시도, 그림 스킬 배지와 로컬 제목 글꼴 로딩, 기존 저장·성장·조작·작은 화면·부하 장면 검사 통과.
- 실제 390×844 및 360×640 화면 검토. 저장소 루트 .evidence/rift-1.3/에 캡처 있음. 전투 화면은 실제 렌더러를 사용하는 디자인 검증 장면.
- 그림 21개 및 로컬 제목 글꼴/라이선스 1,013,220 bytes; 녹음 MP3 15개 729,474 bytes. 원본 대형 PNG/음원 ZIP은 출시 번들에 포함하지 않음.
- Vite 및 Apps in Toss .ait 빌드, 출시 DEV 도구 제거, 등록용 아이콘/게임 화면 규격 검사 통과.

## 출시 파일
- .ait: **1,711,621 bytes**
- SHA-256: a1e6a732a457cc44e2999b928eb98613396649a327e18fc49607d2909206b4b0
- [토스용 파일 ZIP](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36852287229/artifacts/11156535436)
- [검사 증거 ZIP](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36852287229/artifacts/11156391563)

## 공개 플레이 미리보기
- [바로 플레이](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.3)
- 게임 배포 소스: aa5eaa5eed925f8b5fe2254a081b79ac36bed6ef
- [실제 주소 검증](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36852020998): Chromium/WebKit 모두 버전 1.3, 그림 21개와 녹음 음원 15개 로딩, 시작·이동·회피·궁극기·일시정지·재개, 실행 오류 없음 확인.
- Pages 배포 성공. 미리보기 기록은 이전과 같은 브라우저 저장 키를 사용하며 토스 기록과 별도 저장.

## 검증의 범위
자동 음원 검사는 디코딩된 샘플과 재생 동작을 확인한다. 사람이 직접 청음한 결과를 뜻하지 않는다. 실제 iPhone 토스 앱 내 FPS·발열·사운드·네이티브 종료와 QR 테스트, 콘솔 appName 등록, 운영자/이용등급 정보, 심사 제출과 정식 공개는 완료하지 않았음.

## 이전 검증 기록
[1.2 검증/빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36840597270): 테스트 65개, 9회 완주, .ait 573,763 bytes. 비교 방법과 1.1 성능 기록은 PERFORMANCE.md 참조.
