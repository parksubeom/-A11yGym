refactor: 접근성 자동화 테스트 기능 제거 및 별도 프로젝트 분리

접근성 자동화 테스트(Playwright + axe-core) 기능을 별도 프로젝트로
분리하기 위해 현재 프로젝트에서 관련 파일 및 설정을 제거했습니다.

제거된 항목:
- Playwright 테스트 파일 (a11y-challenges.spec.ts, a11y-sitemap.spec.ts, a11y.spec.ts)
- Playwright 설정 파일 (playwright.config.ts)
- 스크린샷 캡처 스크립트 (scripts/capture-screenshots.ts)
- GitHub Actions 워크플로우 (.github/workflows/a11y-tests.yml)
- 관련 문서 (docs/18~23번 문서, docs/screenshots/)
- package.json 의존성 (@axe-core/playwright, @playwright/test)
- package.json 스크립트 (test:a11y:* 명령어들)
- README.md 자동화 시스템 섹션

유지된 항목:
- axe-core: PreviewPanel에서 런타임 접근성 검사에 사용
- eslint-plugin-jsx-a11y: 개발 시점 JSX 접근성 린터

