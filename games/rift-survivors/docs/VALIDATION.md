# 검증 결과 — 2026-10-01, 버전 1.4.0

검증한 게임 소스 커밋: 18bacd609400a3b198ef743f181be77762d7035f  
[성공한 검증/빌드 실행](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36860312441)

## 완료

- 전투·성장·저장·시간·입력 Node 테스트 29개 통과.
- 모바일 화면 Chromium 26개, WebKit 26개 통과. 자동 검사 합계 **81개**, 실패 0개.
- 세 영웅 각각 seed 11/22/33: 정상 이동·회피·스킬 선택을 사용하는 9회 완주 모두 보스 처치.
- 검 공격의 준비 90ms, 접촉 140ms, 회복 완료 340ms를 검사. 접촉 이전 피해 없음, 한 공격의 중복 피해 없음, 방향 범위 밖과 빗나간 공격의 명중음 없음, 일시정지/입력 보류 중 공격 진행 중단 확인.
- 녹음 음원 15개 디코딩과 유효 PCM, 재생 상태, 여러 적을 맞힌 한 번의 검 공격에서 명중음이 겹치지 않는 동작, 일시정지/백그라운드 시 음원 중단 확인.
- 15초 검술 연습의 완료 화면, 보상/경험치 없음, 보석·점수·영구 저장 변경 없음 확인.
- 음원 실패 후 재시도, 기존 저장·성장·조작·작은 화면·부하 장면 검사 통과.
- 8개 기사 공격 포즈와 진행하는 참격 궤적을 실제 390×844 및 360×640 렌더러로 검토. .evidence/rift-1.4/의 전투 정지 이미지는 디자인 검증 장면이며, knight-15s.mp4는 공개 연습 모드를 실제로 실행한 녹화다.
- 그림 WebP 29개 및 로컬 제목 글꼴/라이선스 **1,164,544 bytes**; 녹음 MP3 15개 **729,056 bytes**. 원본 대형 PNG/음원 ZIP은 출시 번들에 포함하지 않음.
- Vite 및 Apps in Toss .ait 빌드, 출시 DEV 도구 제거, 등록용 600×600 아이콘·636×1048 게임 이미지·1932×828 썸네일 규격 검사 통과.

## 출시 파일

- .ait: **1,867,351 bytes**
- SHA-256: 0c4eebd783d0b384286760ce62a59049d83e91eb26fbe2bf0006400dc3820373
- [토스용 파일 ZIP](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36860312441/artifacts/11161892469)
- [검사 증거 ZIP](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36860312441/artifacts/11161237958)

## 공개 플레이 미리보기

- [일반 생존 게임](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.4)
- [15초 검술 연습](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.4&practice=blade)
- [실제 게임 영상과 효과음](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/sword.html?v=1.4)
- 게임 배포 소스: 33512a7a5326157de44180714e4c321eaccc4235. 같은 사이트의 영상 배포 소스: f2fa13b3058257bfdcdabb2896686abdba16cdc3.
- [게임 주소 검증](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36860478713): Chromium/WebKit 모두 버전 1.4, 그림 29개와 녹음 음원 15개 로딩, 시작·이동·회피·궁극기·일시정지·재개, 연습 완료 후 영구 기록 유지, 실행 오류 없음 확인.
- [게시 주소와 영상 재생 검증](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36865803105): Google Chrome와 WebKit 모두 일반 게임·검술 연습·H.264/AAC 영상 재생 통과. 게시된 MP4 바이트가 원본과 동일함을 확인. [영상 포함 Pages 배포](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36864711428) 성공. 영상 검사는 H.264 지원이 없는 Playwright 기본 Chromium 대신 Google Chrome 채널을 사용한다.
- 미리보기 기록은 이전과 같은 브라우저 저장 키를 사용하며 토스 기록과 별도 저장.
- MP4는 390×844 H.264/AAC, 길이 15.045초, 2,215,459 bytes. 게임의 출력 음원을 함께 녹음했으며 FFmpeg 검사에서 평균 -28.9dB, 최대 -7.2dB. 외부 영상 서버에 의존하지 않는다.

## 검증의 범위

자동 음원 검사는 디코딩된 샘플, 음량과 재생 동작을 확인한다. 사람이 직접 청음한 결과를 뜻하지 않는다. 이번 작업의 8단계 공격 애니메이션과 새 검술 연출은 룬 기사/검에 집중한다. 실제 iPhone 토스 앱 내 FPS·발열·사운드·네이티브 종료와 QR 테스트, 콘솔 appName 등록, 운영자/이용등급 정보, 심사 제출과 정식 공개는 완료하지 않았음.

## 이전 검증 기록

[1.3 검증/빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36852287229): 테스트 73개, 9회 완주, .ait 1,711,621 bytes.  
[1.2 검증/빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36840597270): 테스트 65개, 9회 완주, .ait 573,763 bytes. 비교 방법과 1.1 성능 기록은 PERFORMANCE.md 참조.
