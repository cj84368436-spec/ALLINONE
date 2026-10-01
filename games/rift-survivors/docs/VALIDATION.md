# 검증 상태 — 1.1.0
이번 버전의 코드 검증, Chromium/WebKit 테스트, 충돌 성능 비교와 .ait 제작 빌드는 GitHub Actions의 해당 실행 결과로 확인한다. 새 실행이 성공하기 전에는 이전 1.0.0 검증 결과를 1.1.0 결과로 간주하지 않는다.

- 기능과 성능 측정 방법: [PERFORMANCE.md](PERFORMANCE.md)
- 제출 파일과 QR 실기기 절차: [SUBMISSION.md](SUBMISSION.md)
- 토스 콘솔 등록값 확인: 미완료
- 실제 iPhone 토스 앱 테스트와 FPS/발열 측정: 미완료
- 심사 신청과 실제 공개: 미완료

이 버전의 최종 실행과 수치는 검증이 끝난 후 저장소 문서에 기록한다. 출시 ZIP의 build-manifest.json은 실제 버전/appName/.ait 크기와 SHA256을 기록하며 nativePhoneTestCompleted는 실제 테스트 전까지 false로 유지한다.
