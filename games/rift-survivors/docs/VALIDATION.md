# 검증 결과 — 2026-10-02, 버전 2.0.0

검증한 런타임 소스: 08888e21c7761c29fafdf2574a5b1a24f8ef9a02  
[최종 검사·토스 빌드](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36962036060)  
[실제 게시 게임 검사](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36962359234)

## 완료

- Node 규칙 검사 42개, Chromium 모바일 화면 41개, WebKit 모바일 화면 41개: **124개 통과**, 최종 실행 실패 0개.
- 세 기본 영웅 × seed 11/22/33: 정상 이동·회피·필살기·제시된 성장 선택만 사용하는 9회 완주 모두 보스 처치. 시작 영구 강화·무적·강제 진화를 사용하지 않음.
- 기사 광역 참격/기절, 궁수 9발 관통 일제사격, 마법사 4초 서리 지대의 실제 피해·쿨다운·지속·일시정지 검사.
- 균열 개방 위치, 3초 누적 봉인, 원 밖 진행 감소, 일시정지, 만료, 중복 보상 방지, 연습 보상 제외, 이후 균열 및 보스 전환 검사.
- 정예 돌진은 방향 고정과 0.7초 준비 후 이동. 성장 선택은 다음 실제 수치와 진화 진행을 표시하고 필요한 룬을 함께 제안.
- 기존 8방향 터치·전환·보조 손가락·resize·취소·걷기 픽셀 변경, 일시정지/백그라운드, 저장·설정·영구 강화 검사 유지.
- Chromium 드래그는 CDP로 브라우저 터치 전달. WebKit 연속 드래그는 DOM 터치 이벤트 시뮬레이션. 실제 tap 검사도 유지.
- 부하 장면의 엔티티 제한과 유한한 프레임 비용, 충돌 벤치마크, Vite 및 Apps in Toss 빌드, DEV 도구 제거 검사 통과.
- [실제 렌더러 화면 13장](https://github.com/cj84368436-spec/ALLINONE/tree/main/.evidence/rift-2.0) 검토. 390×844 및 360×640 화면. 전투 이미지는 적·시간·성장을 배치한 검토 장면이며 인간 플레이의 재미를 증명하는 자료는 아님.
- 공개 preview에서도 그림 54개·음원 19개, 실제 버전/data-build, 균열 봉인, 영웅별 필살기, 이동·재개·백그라운드, 세 연습의 기존 기록 유지와 실행 오류 없음 확인. [Pages 게시](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36962358851) 성공.

## 출시 파일

[rift-keepers-toss-release](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36962036060/artifacts/11208181674)

- rift-keepers.ait: 2,750,738 bytes
- SHA256: d74b898c0dace42cd453f1f3b8b116f974f5ea333d57f6265e57bf8b52e5c5b9
- 기본 appName: rift-keepers. 실제 콘솔 등록 값이 다르면 해당 값으로 다시 빌드해야 함.
- [Node/브라우저 보고서](https://github.com/cj84368436-spec/ALLINONE/actions/runs/36962036060/artifacts/11208376473)
- [게시 게임 보고서](https://github.com/cj84368436-spec/privacy-policy/actions/runs/36962359234/artifacts/11208307416)

## 브라우저 검사 환경

첫 실행에서는 80개가 통과하고 Linux WebKit 프로세스 종료로 2개가 완료되지 못했다. Linux DMA-BUF compositor를 비활성화하고 최종 실행에서 82개 브라우저 검사를 모두 통과했다. CI에는 일시적인 프로세스 오류를 위한 재시도 1회가 설정되어 있으며 최종 실행 보고서에는 flaky/재시도 통과 항목이 없다. 이를 실물 iPhone의 오류 원인으로 단정하지 않는다.

## 검증의 범위

자동 음원 검사는 디코딩·음량·재생 동작을 확인하며 사람이 직접 청음한 결과를 뜻하지 않는다. 영웅 애니메이션은 기존 2/4개 걷기와 8개 공격 그림을 좌우 반전해서 표현하며 8방향 전용 애니메이션은 아니다.

실제 iPhone의 토스 앱 내 FPS·발열·청감·네이티브 종료 및 QR 테스트, 콘솔 appName/운영자/이용등급 등록, 심사 제출과 정식 공개는 완료하지 않았다. 브라우저 미리보기 게시와 .ait 빌드 성공은 토스 출시 승인을 뜻하지 않는다.

검증 런타임 이후 문서·미리보기 소스 사본·아트 manifest 합계만 동기화했다. .ait와 SHA는 위 검증 실행의 산출물이다.

## 이전 기록

[1.5.2 검증](https://github.com/cj84368436-spec/ALLINONE/blob/17d38ba7f2345b3ebc84e3273b32fd43ef0a0084/games/rift-survivors/docs/VALIDATION.md): 자동 검사 107개, 정상 조작 9회 완주, .ait 2,631,268 bytes.
