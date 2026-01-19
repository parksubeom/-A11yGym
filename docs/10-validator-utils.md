# 10. 사용자 코드 접근성 검증 유틸리티 (`/lib/validator.ts`)

## 작업 개요

사용자 코드(HTML/React JSX 문자열)를 분석하여 접근성 준수 여부를 판단하는 유틸리티 함수를 구현했습니다.

- 파일: `lib/validator.ts`
- 결과 타입: `{ success: boolean, message: string }`

## 구현한 함수

1. `validateAltText(code)`
   - `<img>` 태그의 `alt` 속성 존재 및 비어있지 않음 검사
2. `validateLabel(code)`
   - `<input id="...">`와 대응하는 `<label for="...">` 존재 검사
3. `validateKeyboard(code)`
   - `onClick`이 있는 비대화형 요소(`div`, `span`)에 `role="button"` + `tabIndex="0"` 존재 검사

## 설계 포인트

- AST 대신 **정규식 기반**으로 구현해 학습용 환경에서 빠르고 예측 가능하게 동작하도록 했습니다.
- React JSX 표기(`htmlFor`, `tabIndex={0}`)를 HTML 속성 표기와 맞추기 위해 간단한 **normalize 단계**를 추가했습니다.
  - `htmlFor="x"` → `for="x"`
  - `tabIndex={0}` / `tabIndex="0"` → `tabindex="0"`
  - `role={"button"}` → `role="button"`

## 사용 예시

```ts
import { validateAltText, validateLabel, validateKeyboard } from "@/lib/validator"

const r1 = validateAltText('<img src=\"/a.png\">')
// { success: false, message: '...' }
```

## 다음 단계

- AST 기반(예: `@babel/parser`) 검증으로 정확도 향상
- `<button>` 등 이미 대화형 요소인 경우 예외 처리(현재는 div/span만 대상)


