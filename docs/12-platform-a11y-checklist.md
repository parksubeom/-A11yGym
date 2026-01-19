# 12. 플랫폼 자체 접근성 점검 체크리스트 & 수정 가이드

이 문서는 **A11yGym(플랫폼 자체)**의 접근성을 점검하고 개선하기 위한 체크리스트입니다.  
요구사항(포커스 링, 명도 대비, aria-label 문구, 다크 모드 가독성)과 함께 **수정 가이드** 및 **axe-core 자동 테스트 설정**을 포함합니다.

---

## 1) 키보드 포커스 링(outline)이 명확한가?

### 체크리스트

- **Tab** 키로 모든 인터랙티브 요소(버튼/링크/입력/탭/아코디언/모달 닫기 등)에 접근 가능한가?
- 포커스가 갔을 때 **시각적으로 명확한 포커스 링**(outline/ring)이 보이는가?
- 포커스가 사라지는 “스타일 리셋”이 없는가?
  - 예: `outline: none`만 있고 대체 스타일이 없음
- 포커스 순서가 논리적인가? (시각적/DOM 순서 일치)
- 모달/드롭다운 내부에서 키보드 이동이 정상이며, **ESC로 닫기/탈출**이 가능한가?

### 수정 가이드

- Tailwind 기준 권장 패턴:
  - `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- shadcn/ui 컴포넌트는 기본적으로 포커스 스타일이 포함되지만,
  - **커스텀 버튼/링크**를 만들 때도 동일 패턴을 적용하세요.
- `:focus` 대신 `:focus-visible` 사용을 권장 (마우스 클릭 시 불필요한 링 방지).

---

## 2) 명도 대비가 4.5:1 이상(WCAG AA)인가?

### 체크리스트

- 본문 텍스트(일반 크기)는 **4.5:1 이상**인가?
- 큰 텍스트(대략 18pt/24px 이상 또는 Bold 14pt/18.66px 이상)는 **3:1 이상**인가?
- 비활성(Disabled) 텍스트/보조 텍스트(`muted-foreground`)가 너무 옅지 않은가?
- 다크 모드에서도 동일 기준을 만족하는가?

### 수정 가이드

- 텍스트 대비를 깨뜨리는 대표 원인:
  - 회색 텍스트 + 회색 배경 (특히 다크 모드)
  - 투명도(`opacity`)로 텍스트를 옅게 만드는 것
- 해결 방법:
  - 팔레트(예: `foreground`, `muted-foreground`, `background`)를 시스템적으로 관리
  - “보조 텍스트”라도 최소 대비를 만족하도록 색상 조정
- 빠른 점검 도구:
  - Chrome DevTools → Lighthouse / Rendering / CSS Overview
  - Figma 대비 플러그인/컬러 대비 계산기

---

## 3) aria-label에 불필요한 단어(\"이미지\", \"버튼\" 등)가 포함되지 않았는가?

### 체크리스트

- `aria-label`에 **역할(role) 자체를 중복**해서 쓰지 않았는가?
  - 예: `aria-label=\"제출 버튼\"` (X) → `aria-label=\"제출\"` (O)
  - 스크린 리더가 이미 “버튼”을 읽기 때문
- 이미지의 경우:
  - 의미 있는 이미지는 **`alt`로 설명**하고, `aria-label`로 역할을 중복하지 않는가?
  - 장식 이미지면 `alt=\"\"` + 필요 시 `aria-hidden=\"true\"`
- 링크 텍스트/버튼 텍스트가 충분히 설명적이라면 `aria-label`을 굳이 추가하지 않았는가?

### 수정 가이드

- 좋은 aria-label의 기준:
  - “무엇을 하는가(동작)” 또는 “무엇인가(대상)”를 짧고 명확하게
  - 중복/군더더기 제거
- `aria-label` 남용을 피하고, 가능한 경우:
  - **시각적 텍스트를 개선**하거나,
  - `aria-labelledby`로 기존 텍스트를 참조하는 것을 우선 고려

---

## 4) 다크 모드 전환 시 텍스트 가독성이 유지되는가?

### 체크리스트

- 다크 모드에서:
  - 본문/보조 텍스트 대비가 충분한가?
  - 테두리/구분선이 너무 흐리지 않은가?
  - 입력 필드 placeholder가 너무 흐리지 않은가?
- 테마 전환 시 포커스 링이 유지되는가?

### 수정 가이드

- 다크 모드 전환은 “색상 반전”이 아니라 **토큰 기반 컬러 시스템**으로 접근
- `bg-background`, `text-foreground`, `text-muted-foreground` 같은 토큰을 일관되게 사용
- placeholder는 최소 대비가 낮기 쉬우므로 특별히 점검

---

## 5) axe-core 자동 접근성 테스트 설정 (Playwright)

이 프로젝트는 Next.js(App Router) 기반이므로, “실제 페이지 렌더링”을 검사하기 위해 **Playwright + @axe-core/playwright** 조합을 권장합니다.

### 설치

```bash
npm i -D @playwright/test @axe-core/playwright
npx playwright install --with-deps
```

### 설정 파일

- `playwright.config.ts` 추가
- 테스트 파일 `tests/a11y.spec.ts` 추가

### 실행

먼저 dev 서버 실행:

```bash
npm run dev
```

다른 터미널에서 axe 테스트 실행:

```bash
npm run test:a11y
```

### 운용 팁

- 라우트가 늘어날수록 `tests/a11y.spec.ts`에 케이스를 추가하세요.
- 특정 위반을 “의도적으로” 허용해야 한다면(권장하지 않음):
  - axe rule을 disable하거나, 특정 selector를 exclude하여 점진적으로 개선하세요.


