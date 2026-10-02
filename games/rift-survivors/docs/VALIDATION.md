# 검증 결과 — 2026-10-02, 버전 1.5.2

검증한 게임 소스 커밋: 76ff8d690c96a235fe2e79875d437db0d2372add  
[검증/빌드 실행](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36954484372)

## 완료

- TouchEvent 지원 여부로 휴대폰 터치 경로를 선택하며 소유한 손가락 식별자로 시작·이동·끝·취소를 추적. 포인터 호환 이벤트나 다른 손가락이 이동을 빼앗지 않음. 화면 resize는 좌표 기준만 보정하고 유지 중인 이동을 끊지 않음.
- 새 화면 이동 입력은 이전 키를 지우며, 조이스틱을 누른 동안에는 키보드 방향 입력이 덮어쓰지 않음. 왼쪽 키가 먼저 또는 이동 도중 눌려도 오른쪽 터치 이동을 검사.
- 세 영웅 각각 상하좌우·대각선 8방향, 같은 손가락의 방향 전환, resize, 보조 손가락의 시작/끝, 터치 취소 후 정지 및 재시작 검사 통과.
- 걷기는 실제 이동 거리로 진행. 정지·벽 앞에서 프레임 진행 중지, 상하 이동에서 마지막 좌우 방향 유지. 기사는 기존 걷기 2개 그림, 궁수·마법사는 각 4개 그림을 사용하며 공격 중에는 걷는 하체와 공격 상체를 함께 그림.
- 세 영웅 모두 일반 이동 및 공격 중 걷기에서 두 걸음 자세의 하체 픽셀 100개 이상 변경 검사 통과. 각 브라우저 보고서에 걷기/공격 중 걷기 이미지 첨부.
- Chromium 이동 검사는 CDP로 브라우저 터치를 전달. WebKit 방향 드래그 및 보조 손가락 검사는 DOM에 터치 형태의 이벤트와 좌표를 전달하는 시뮬레이션. 기존 실제 tap 및 포커스/일시정지 검사도 통과. 실제 iPhone의 연속 드래그를 직접 재현한 검사는 아님.
- 화면이 보이는 상태의 포커스 변경(window blur)을 백그라운드 전환으로 처리하지 않도록 수정. 실제 visibilitychange/document.hidden 및 pagehide에서 일시정지·입력 초기화·효과음 중단은 유지.
- 실제 브라우저 터치 이벤트 도중 blur를 전달한 뒤 전투 지속, 누른 채 드래그 도중 blur가 발생해도 이동 유지, 일시정지 버튼 터치 시 정지, 숨김 전환 시 전투·소리 정지, 화면 복귀 후 명시적 재개와 이동 확인. Chromium과 WebKit 모두 통과. 물리적 iPhone에서 해당 증상을 재현한 검사라는 뜻은 아님.
- 전투·성장·저장·시간·입력 Node 테스트 **35개** 통과.
- 모바일 화면 Chromium **36개**, WebKit **36개** 통과. 자동 검사 합계 **107개**, 실패 0개.
- 세 영웅 각각 seed 11/22/33: 정상 이동·회피·스킬 선택을 사용하는 9회 완주 모두 보스 처치.
- 궁수·마법사의 준비 이전 탄환/피해 없음, 발사 1회, 실제 탄환 이동 후 충돌, 빗나간 탄환의 명중음 없음, 일시정지 시 준비 동작 정지, 공격 속도와 진화 시 발사 수·관통·회복 시간 확인.
- 궁수·마법사의 실제 명중에서 각자 arrow-hit/bolt-hit 녹음 음원 재생과 명중 연출 확인. 기존 검술·사운드 설정·백그라운드 중단·음원 실패 후 재시도도 통과.
- 15초 검술·궁술·마법 연습의 완료 화면, 고유 영웅·무기, 경험치/보상 없음, 보석·점수·영구 저장 변경 없음 확인.
- 기존 저장·성장·조작·작은 화면·부하 장면·무기 조합과 진화 검사 통과.
- 그림 WebP **53개**, 로컬 제목 글꼴/라이선스까지 **1,895,108 bytes**. 녹음 MP3 **19개**, **756,569 bytes**. 대형 원본 PNG/음원 ZIP은 출시 번들에 포함하지 않음.
- [모바일 화면 캡처](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36881105306): 실제 390×844 및 360×640 렌더러에서 세 영웅의 준비·발사·명중 장면 확인, 실행 오류 없음. .evidence/rift-1.5/에 WebP 캡처와 manifest가 있음. 전투 정지 이미지는 가까운 목표를 배치한 디자인 검증 장면이며 사람이 플레이한 기록을 뜻하지 않음.
- Vite 및 Apps in Toss .ait 빌드, 출시 DEV 도구 제거, 등록용 아이콘·게임 이미지 규격 검사 통과.

## 출시 파일

- .ait: **2,631,268 bytes**
- SHA-256: eb085a82d1603c3ad9ffae48fe3478775d5bb4ab7c16cf2aadc6d119a07302b2
- [토스용 파일 ZIP](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36954484372/artifacts/11206100509)
- [검사 증거 ZIP](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36954484372/artifacts/11206120154)

## 공개 플레이 미리보기

- [일반 생존 게임](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5.2-touch2)
- [15초 검술 연습](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5.2-touch2&practice=blade)
- [15초 궁술 연습](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5.2-touch2&practice=arrow)
- [15초 마법 연습](https://cj84368436-spec.github.io/privacy-policy/play/rift-keepers/?v=1.5.2-touch2&practice=bolt)
- 배포 소스: 075e0426c6b7c90728be13b10c006548ade8d3db.
- [게시 주소 검증](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36954496192): Google Chrome와 WebKit 모두 버전 1.5.2, 그림 53개·녹음 음원 19개 로딩, 일반 게임 시작·이동·회피·궁극기·일시정지·재개, 세 연습 완료와 영구 기록 유지, 실행 오류 없음 확인. 터치 중 포커스 변경 후 전투·이동 유지 및 숨김 전환 시 전투·소리 중단, 명시적 재개도 확인. 기존 기사 영상의 재생도 통과.
- [Pages 배포](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36954495203) 성공.
- 기존 브라우저 저장 키를 유지하며 토스 기록과 별도 저장. 원거리 연습도 점수·보석·영구 기록을 변경하지 않는다.
- 기존 sword.html은 1.4 시점의 기사 검술 영상이다. 궁수·마법사의 변경 내용을 보여 주는 영상이 아니다.

## 검증의 범위

자동 음원 검사는 디코딩된 샘플, 음량과 재생 동작을 확인한다. 사람이 직접 청음한 결과를 뜻하지 않는다. 궁수·마법사는 각각 공격 8프레임·걷기 4프레임을 사용하며 좌우 반전으로 방향을 표현한다. 8방향 애니메이션은 아니다. 실제 iPhone 토스 앱 내 FPS·발열·사운드·네이티브 종료와 QR 테스트, 콘솔 appName 등록, 운영자/이용등급 정보, 심사 제출과 정식 공개는 완료하지 않았음.

## 이전 검증 기록

[1.5.1 검증/빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36895603237): 테스트 97개, 9회 완주, .ait 2,630,688 bytes.

[1.5 검증/빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36881550705): 테스트 93개, 9회 완주, .ait 2,630,684 bytes.

[1.4 검증/빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36860312441): 테스트 81개, 9회 완주, .ait 1,867,351 bytes.  
[1.3 검증/빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36852287229): 테스트 73개, 9회 완주, .ait 1,711,621 bytes. 비교 방법과 1.1 성능 기록은 PERFORMANCE.md 참조.

공개 게임의 방향 검사는 [보고서](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36954496192/artifacts/11205217487)에 기록했습니다. Chrome는 브라우저 터치, WebKit은 시뮬레이션한 터치 이벤트로 세 영웅의 8방향·전환·resize·취소·걷기 거리 진행을 확인했습니다. HTML의 data-build=1.5.2-touch2를 확인한 뒤 검사하므로 이전 수정본의 결과를 사용하지 않습니다.
