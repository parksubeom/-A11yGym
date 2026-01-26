# axe-core로 찾을 수 있는 접근성 문제 종류

이 문서는 A11yGym의 **이슈 탭**에서 `axe-core`가 감지할 수 있는 접근성 문제의 종류를 정리합니다.

---

## 현재 설정

A11yGym은 다음 WCAG 기준으로 필터링합니다:

```280:282:components/PreviewPanel.tsx
        const results = await axeApi.run(doc, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        })
```

- **wcag2a**: WCAG 2.0 Level A (최소 기준)
- **wcag2aa**: WCAG 2.0 Level AA (일반 기준)
- **wcag21aa**: WCAG 2.1 Level AA
- **wcag22aa**: WCAG 2.2 Level AA

---

## 주요 검사 규칙 카테고리

### 1. 색상 및 대비 (Color & Contrast)

#### `color-contrast`
- **문제**: 텍스트와 배경의 명도 대비가 부족
- **기준**: 
  - 일반 텍스트: 4.5:1 이상
  - 큰 텍스트 (18pt/24px 이상, 또는 Bold 14pt/18.66px 이상): 3:1 이상
- **예시**: `color: #9ca3af` + `background: #ffffff` = 2.84:1 ❌

#### `color-contrast-enhanced`
- **문제**: 향상된 대비 기준 미달 (AAA 레벨)
- **기준**: 일반 텍스트 7:1 이상

---

### 2. 이미지 및 미디어 (Images & Media)

#### `image-alt`
- **문제**: 의미 있는 이미지에 `alt` 속성 누락 또는 부적절
- **예시**: `<img src="banner.jpg">` (alt 없음) ❌

#### `image-redundant-alt`
- **문제**: alt 텍스트가 이미지 파일명이나 중복 정보 포함
- **예시**: `<img src="logo.png" alt="logo.png">` ❌

#### `video-caption`
- **문제**: 비디오에 자막 없음
- **WCAG**: 1.2.2 (자막 제공)

---

### 3. 링크 및 버튼 (Links & Buttons)

#### `link-name`
- **문제**: 링크에 접근 가능한 이름(텍스트) 없음
- **예시**: `<a href="/page"><img src="icon.png" alt=""></a>` (텍스트 없음) ❌

#### `button-name`
- **문제**: 버튼에 접근 가능한 이름 없음
- **예시**: `<button><img src="icon.png" alt=""></button>` (텍스트 없음) ❌

#### `link-in-text-block`
- **문제**: 링크 텍스트가 모호함 (예: "더보기", "여기")
- **WCAG**: 2.4.4 (링크 목적 이해)

---

### 4. 폼 및 입력 (Forms & Inputs)

#### `label`
- **문제**: 입력 필드에 레이블(`<label>`) 없음
- **예시**: `<input type="text" id="name">` (label 없음) ❌

#### `label-title-only`
- **문제**: `title` 속성만 있고 `<label>` 없음
- **예시**: `<input type="text" title="이름">` ❌

#### `select-name`
- **문제**: `<select>`에 접근 가능한 이름 없음

#### `form-field-multiple-labels`
- **문제**: 하나의 입력 필드에 여러 레이블이 중복 연결됨

---

### 5. 헤딩 구조 (Headings)

#### `heading-order`
- **문제**: 헤딩 레벨이 논리적 순서를 따르지 않음
- **예시**: `<h1>` → `<h3>` (h2 건너뜀) ❌

#### `page-has-heading-one`
- **문제**: 페이지에 `<h1>` 없음

#### `heading-order`
- **문제**: 헤딩 레벨이 건너뛰어짐

---

### 6. ARIA 속성 (ARIA Attributes)

#### `aria-required-attr`
- **문제**: ARIA 역할에 필수 속성 누락
- **예시**: `<div role="dialog">` (aria-label 또는 aria-labelledby 없음) ❌

#### `aria-valid-attr-value`
- **문제**: ARIA 속성 값이 유효하지 않음
- **예시**: `aria-label=""` (빈 문자열) ❌

#### `aria-valid-attr`
- **문제**: ARIA 속성 이름이 유효하지 않음
- **예시**: `aria-lable="text"` (오타: lable → label) ❌

#### `aria-hidden-focus`
- **문제**: `aria-hidden="true"`인 요소에 포커스 가능한 요소 포함
- **예시**: `<div aria-hidden="true"><button>클릭</button></div>` ❌

#### `aria-required-parent`
- **문제**: ARIA 자식 요소가 필수 부모 요소 없음
- **예시**: `<li role="option">` (부모에 `role="listbox"` 없음) ❌

---

### 7. 키보드 접근성 (Keyboard Accessibility)

#### `keyboard`
- **문제**: 키보드로 접근 불가능한 인터랙티브 요소
- **예시**: `<div onclick="...">` (tabindex 없음) ❌

#### `focus-order-semantics`
- **문제**: 포커스 순서가 논리적이지 않음

#### `focusable-content`
- **문제**: 포커스 가능한 요소가 숨겨져 있음

#### `tabindex`
- **문제**: `tabindex` 값이 부적절함 (예: `tabindex="1"` 이상)

---

### 8. 랜드마크 및 구조 (Landmarks & Structure)

#### `landmark-one-main`
- **문제**: 페이지에 `<main>` 랜드마크 없음

#### `landmark-unique`
- **문제**: 같은 유형의 랜드마크가 여러 개 있음 (예: 여러 `<main>`)

#### `region`
- **문제**: 콘텐츠 영역에 적절한 랜드마크 없음

---

### 9. 마크업 오류 (Markup Errors)

#### `duplicate-id`
- **문제**: 페이지에 중복된 `id` 속성
- **예시**: `<div id="header">` 두 개 ❌

#### `duplicate-id-aria`
- **문제**: ARIA 속성에서 참조하는 `id`가 중복됨

#### `html-has-lang`
- **문제**: `<html>` 태그에 `lang` 속성 없음
- **WCAG**: 3.1.1 (기본 언어 표시)

#### `html-lang-valid`
- **문제**: `lang` 속성 값이 유효하지 않음
- **예시**: `lang="kr"` (올바른 값: `lang="ko"`) ❌

---

### 10. 표 (Tables)

#### `th-has-data-cells`
- **문제**: `<th>`가 있지만 데이터 셀(`<td>`)과 연결되지 않음

#### `table-duplicate-name`
- **문제**: 표에 중복된 접근 가능한 이름

#### `table-fake-caption`
- **문제**: `<caption>` 대신 일반 텍스트로 표 제목 제공

---

### 11. 리스트 (Lists)

#### `list`
- **문제**: 리스트가 `<ul>`, `<ol>`, `<dl>`로 마크업되지 않음
- **예시**: `<div><div>항목1</div><div>항목2</div></div>` ❌

#### `listitem`
- **문제**: 리스트 항목이 `<li>`로 마크업되지 않음

---

### 12. 메타데이터 및 문서 구조

#### `document-title`
- **문제**: 페이지에 `<title>` 없음
- **WCAG**: 2.4.2 (페이지 제목)

#### `meta-viewport`
- **문제**: 모바일 뷰포트 메타 태그 없음 또는 부적절

---

### 13. 기타

#### `bypass`
- **문제**: 반복되는 콘텐츠를 건너뛸 수 있는 링크 없음
- **WCAG**: 2.4.1 (건너뛰기 링크)

#### `frame-title`
- **문제**: `<iframe>`에 `title` 속성 없음

#### `scope-attr-valid`
- **문제**: `<th>`의 `scope` 속성 값이 유효하지 않음

#### `definition-list`
- **문제**: 정의 목록(`<dl>`) 구조가 올바르지 않음

---

## A11yGym에서 현재 감지되는 문제

현재 이슈 탭에서 자동으로 감지되는 주요 문제들:

### ✅ 자동 감지 가능

1. **색 대비 부족** (`color-contrast`)
   - 예: `contrast-low-text` 챌린지

2. **이미지 alt 누락** (`image-alt`)
   - 예: `informative-image-banner` 챌린지

3. **중복 ID** (`duplicate-id`)
   - 예: `duplicate-id` 챌린지

4. **표 헤더 누락** (`th-has-data-cells`)
   - 예: `table-header-missing` 챌린지

5. **링크 텍스트 모호** (`link-in-text-block`)
   - 예: `link-text-ambiguous` 챌린지

### ⚠️ 수동 검증 필요

다음 문제들은 axe-core로 직접 감지하기 어렵거나, 현재 프로젝트의 검증 로직으로 처리됩니다:

1. **포커스 아웃라인 제거** (`focus-outline-removed`)
   - CSS `outline: none` 감지는 가능하지만, 대체 스타일 존재 여부는 수동 검증 필요

2. **건너뛰기 링크 누락** (`skip-link-missing`)
   - DOM 구조 분석으로 감지 가능하지만, 현재는 정규식 기반 검증 사용

3. **색상만으로 필수 표시** (`color-only-required`)
   - 시맨틱 분석이 필요하여 수동 검증

---

## 검사 결과 구조

axe-core는 다음 구조로 결과를 반환합니다:

```typescript
{
  violations: [
    {
      id: 'color-contrast',           // 규칙 ID
      impact: 'serious',              // 심각도: critical, serious, moderate, minor
      description: '...',             // 문제 설명
      help: 'Ensures the contrast...', // 해결 방법
      helpUrl: 'https://...',         // 상세 문서 URL
      nodes: [                         // 위반된 요소들
        {
          target: ['p'],               // CSS 선택자
          html: '<p style="...">',     // HTML 코드
          failureSummary: 'Fix any...' // 구체적인 오류 메시지
        }
      ]
    }
  ],
  passes: [...],      // 통과한 검사
  incomplete: [...],  // 불완전한 검사 (수동 확인 필요)
  inapplicable: [...] // 적용 불가능한 검사
}
```

---

## 심각도 (Impact) 레벨

- **critical**: 즉시 수정 필요 (예: 키보드 접근 불가)
- **serious**: 심각한 문제 (예: 색 대비 부족)
- **moderate**: 중간 수준 (예: 헤딩 순서 오류)
- **minor**: 경미한 문제 (예: 중복 ID)

---

## 참고 자료

- [axe-core 규칙 전체 목록](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.2 성공 기준](https://www.w3.org/WAI/WCAG22/quickref/)
- [A11yGym 색 대비 검사 원리](./16-color-contrast-detection-principle.md)

---

## 요약

axe-core는 **70개 이상의 접근성 규칙**을 자동으로 검사합니다. A11yGym의 이슈 탭에서는 WCAG 2.2 Level AA 기준으로 필터링하여, 가장 중요한 접근성 문제들을 우선적으로 표시합니다.

주요 검사 영역:
- ✅ 색상 대비
- ✅ 이미지/미디어
- ✅ 링크/버튼
- ✅ 폼 입력
- ✅ ARIA 속성
- ✅ 키보드 접근성
- ✅ 마크업 구조
- ✅ 랜드마크

이를 통해 개발자는 코드 실행 시점에 접근성 문제를 즉시 확인하고 수정할 수 있습니다.

