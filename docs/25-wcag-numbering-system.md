# WCAG 번호 체계 이해하기

## 📋 WCAG 번호 체계

WCAG(Web Content Accessibility Guidelines)의 번호는 다음과 같은 구조를 가집니다:

```
X.Y.Z
│ │ │
│ │ └─ 성공 기준 (Success Criterion)
│ └─── 지침 (Guideline)
└───── 원칙 (Principle)
```

---

## 🔢 각 숫자의 의미

### 첫 번째 숫자 (X): 원칙 (Principle)

WCAG는 4가지 원칙으로 구성됩니다:

1. **Perceivable (인식의 용이성)**
   - 정보와 사용자 인터페이스 구성요소는 사용자가 인식할 수 있는 방식으로 제시되어야 함

2. **Operable (운용의 용이성)**
   - 사용자 인터페이스 구성요소와 탐색은 운용 가능해야 함

3. **Understandable (이해의 용이성)**
   - 정보와 사용자 인터페이스 운용은 이해할 수 있어야 함

4. **Robust (견고성)**
   - 콘텐츠는 보조 기술을 포함한 넓은 범위의 사용자 에이전트에 의존하여 해석될 수 있도록 충분히 견고해야 함

### 두 번째 숫자 (Y): 지침 (Guideline)

각 원칙 아래에는 여러 지침이 있습니다.

예를 들어, 원칙 3 (Understandable) 아래에는:
- 3.1: 읽기 가능 (Readable)
- 3.2: 예측 가능 (Predictable)
- 3.3: 입력 지원 (Input Assistance)

### 세 번째 숫자 (Z): 성공 기준 (Success Criterion)

각 지침 아래에는 여러 성공 기준이 있습니다.

예를 들어, 지침 3.3 (Input Assistance) 아래에는:
- 3.3.1: 오류 식별 (Error Identification)
- 3.3.2: 레이블 또는 지시사항 (Labels or Instructions)
- 3.3.3: 오류 제안 (Error Suggestion)
- 3.3.4: 오류 방지 (Error Prevention)

---

## 🎯 3.3.2 상세 설명

### WCAG 3.3.2: Labels or Instructions (레이블 또는 지시사항)

**원칙**: 3. Understandable (이해의 용이성)  
**지침**: 3.3. Input Assistance (입력 지원)  
**성공 기준**: 3.3.2. Labels or Instructions  
**준수 수준**: Level A (필수)

### 목적

사용자가 입력 필드의 목적을 이해할 수 있도록 레이블이나 지시사항을 제공해야 합니다.

### 요구사항

입력 필드가 사용자 입력을 요구할 때:
- **레이블 제공**: `<label>` 요소를 사용하여 입력 필드의 목적을 명시
- **지시사항 제공**: 입력 형식, 필수 여부, 오류 방지를 위한 지시사항 제공

### 구현 방법

#### ✅ 올바른 예시

```html
<!-- 방법 1: label과 input 연결 -->
<label for="email">이메일</label>
<input id="email" type="email" />

<!-- 방법 2: label로 감싸기 -->
<label>
  이메일
  <input type="email" />
</label>

<!-- 방법 3: aria-label 사용 -->
<input type="email" aria-label="이메일" />

<!-- 방법 4: aria-labelledby 사용 -->
<span id="email-label">이메일</span>
<input type="email" aria-labelledby="email-label" />
```

#### ❌ 잘못된 예시

```html
<!-- 레이블 없음 -->
<input type="email" placeholder="이메일" />

<!-- placeholder만 사용 (스크린 리더가 무시할 수 있음) -->
<input type="email" placeholder="이메일을 입력하세요" />
```

### 왜 3.3.2인가?

1. **3**: Understandable 원칙 (이해의 용이성)
   - 사용자가 콘텐츠를 이해할 수 있어야 함

2. **3**: Input Assistance 지침 (입력 지원)
   - 사용자가 입력 오류를 방지하고 수정할 수 있도록 지원

3. **2**: 두 번째 성공 기준
   - 3.3.1 (오류 식별) 다음의 두 번째 기준
   - 입력 필드에 레이블이나 지시사항을 제공하는 것

---

## 📊 프로젝트에서의 사용

### KWCAG 매핑

프로젝트에서는 내부 체크리스트 id `29`가 WCAG `3.3.2`로 매핑됩니다:

```typescript
// constants/kwcag-mapping.ts
'29': '3.3.2', // 레이블 제공
```

### 챌린지 예시

`form-label-missing` 챌린지가 3.3.2를 다룹니다:

```typescript
{
  id: 'form-label-missing',
  kwcagCode: '3.3.2',
  title: '폼 레이블 누락 (input label)',
  description: '입력 필드는 스크린 리더 사용자가 용도를 이해할 수 있도록 레이블이 필요합니다.'
}
```

---

## 🔍 다른 번호 예시

### 1.1.1
- **1**: Perceivable (인식의 용이성)
- **1**: Text Alternatives (텍스트 대체)
- **1**: 첫 번째 성공 기준
- **내용**: 적절한 대체 텍스트 제공

### 2.4.1
- **2**: Operable (운용의 용이성)
- **4**: Navigable (탐색 가능)
- **1**: 첫 번째 성공 기준
- **내용**: 반복 영역 건너뛰기 (Skip Links)

### 4.1.1
- **4**: Robust (견고성)
- **1**: Compatible (호환 가능)
- **1**: 첫 번째 성공 기준
- **내용**: 구문 분석 (Parsing)

---

## 📚 참고 자료

- [WCAG 2.2 공식 문서](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG 3.3.2 상세 설명](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [KWCAG 2.2 가이드라인](https://www.kwacc.or.kr/)

