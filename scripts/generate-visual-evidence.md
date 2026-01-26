# 시각적 증거 생성 스크립트 가이드

이 문서는 접근성 자동화 시스템의 시각적 증거를 생성하는 방법을 설명합니다.

---

## 빠른 시작

### 1단계: 테스트 실행 및 리포트 생성

```bash
# 개발 서버 실행 (터미널 1)
npm run dev

# 테스트 실행 (터미널 2)
npm run test:a11y:all
```

### 2단계: HTML 리포트 확인

```bash
npx playwright show-report
```

브라우저가 자동으로 열리며 리포트를 확인할 수 있습니다.

---

## 시각적 증거 수집 체크리스트

### ✅ 필수 스크린샷

1. **테스트 실행 터미널 출력**
   - `npm run test:a11y:all` 실행 결과
   - 위반 사항 목록 (있는 경우)

2. **Playwright HTML 리포트**
   - 리포트 메인 페이지
   - 개별 테스트 상세 페이지
   - 위반 사항 상세 정보

3. **GitHub Actions 실행 결과** (GitHub에 푸시한 경우)
   - Actions 탭 스크린샷
   - 워크플로우 실행 로그
   - Artifacts 다운로드 링크

### 📸 스크린샷 저장 위치

```
docs/
  screenshots/
    ├── test-execution-terminal.png      # 터미널 실행 결과
    ├── playwright-report-main.png      # 리포트 메인
    ├── playwright-report-detail.png    # 리포트 상세
    ├── github-actions-workflow.png      # GitHub Actions
    └── axe-violations-example.png       # 위반 사항 예시
```

---

## 상세 가이드

### 1. 터미널 출력 캡처

**Windows**:
- `Win + Shift + S` → 영역 선택 → 캡처
- 또는 터미널 우클릭 → "Mark" → 영역 선택 → 복사

**Mac**:
- `Cmd + Shift + 4` → 영역 선택

**Linux**:
- `Shift + Print Screen` → 영역 선택

### 2. Playwright 리포트 캡처

1. `npx playwright show-report` 실행
2. 브라우저에서 리포트 열기
3. 전체 페이지 스크린샷:
   - Chrome: `F12` → `Cmd/Ctrl + Shift + P` → "Capture full size screenshot"
   - 또는 브라우저 확장 프로그램 사용

### 3. GitHub Actions 캡처

1. GitHub 저장소 → Actions 탭
2. 최근 실행 워크플로우 클릭
3. 전체 페이지 스크린샷

---

## README 업데이트

`README.md`에 다음 섹션 추가:

```markdown
## 접근성 자동화 시스템

### 테스트 실행

```bash
npm run test:a11y:all
```

### 시각적 증거

- [테스트 리포트 스크린샷](docs/screenshots/playwright-report-main.png)
- [GitHub Actions 실행 결과](docs/screenshots/github-actions-workflow.png)
```

---

## 이력서/포트폴리오용 요약

### 짧은 버전

```
접근성 자동화 시스템 구현

• Playwright + axe-core 자동 검사
• 12개 챌린지 페이지 자동 테스트
• WCAG 2.2 Level AA 기준 검증
• GitHub Actions CI/CD 통합

[스크린샷: 테스트 리포트, GitHub Actions]
```

### 긴 버전

```
접근성 진단 자동화 시스템

구현 내용:
- axe-core + Playwright 통합
- 챌린지 데이터 기반 자동 테스트
- 사이트맵 기반 라우트 자동 크롤링
- ESLint 통합 (eslint-plugin-jsx-a11y)

시각적 증거:
1. Playwright HTML 리포트
2. GitHub Actions 자동 실행
3. 위반 사항 상세 리포트

[스크린샷 첨부]
```

---

## 다음 단계

1. ✅ 테스트 실행
2. ✅ 리포트 확인
3. ✅ 스크린샷 캡처
4. ✅ README 업데이트
5. ✅ 이력서/포트폴리오에 추가

