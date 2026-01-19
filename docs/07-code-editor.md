# 07. 코드 편집기 컴포넌트 (CodeEditor)

## 작업 개요

사용자가 HTML/React 코드를 수정할 수 있는 에디터 컴포넌트를 구현했습니다.

- 파일: `components/CodeEditor.tsx`
- 사용 라이브러리:
  - `react-simple-code-editor`
  - `prismjs` (Syntax Highlighting)

## 요구사항 대응

- `react-simple-code-editor` 사용: ✅
- Prism 기반 구문 강조: ✅ (`tsx/jsx/html/ts/js` 최소 언어 로드)
- 접근성:
  - 키보드 트랩 방지: ✅ **ESC 키로 blur 처리**
  - 적절한 `aria-label`: ✅ `ariaLabel` prop + 기본값 제공
  - 스크린리더에서 코드 입력으로 인식:
    - textarea 기반이므로 `role="textbox"`, `aria-multiline`
    - `aria-roledescription="code editor"`로 맥락 제공
- Props: `code`, `onChange`, `readOnly`: ✅

## 설계(추론 과정)

### 1) ESC로 포커스 탈출

코드 편집기는 키 입력을 많이 받기 때문에 사용자가 의도치 않게 “빠져나오기 어려운” 상황을 겪을 수 있습니다.
따라서 `onKeyDown`에서 `Escape` 입력 시 `textarea.blur()`로 포커스를 해제해 키보드 트랩을 예방했습니다.

### 2) SR(Screen Reader) 안내 텍스트 제공

에디터는 시각적으로는 명확하지만, 보조기기에서는 “어떤 입력 영역인지”가 불명확할 수 있습니다.
`sr-only` 도움말을 두고 `aria-describedby`로 연결해, “ESC로 종료” 힌트를 읽을 수 있게 했습니다.

### 3) 구문 강조

`react-simple-code-editor`는 highlight 함수를 받으므로 Prism의 `highlight()`를 활용했습니다.
필요한 최소 언어만 import해서 번들 사이즈를 과도하게 키우지 않도록 했습니다.

## 사용 예시

```tsx
import { useState } from "react"
import { CodeEditor } from "@/components/CodeEditor"

export function EditorExample() {
  const [code, setCode] = useState('<img src="/a.png">')

  return (
    <CodeEditor
      code={code}
      onChange={setCode}
      readOnly={false}
      language="html"
      ariaLabel="챌린지 코드 편집기"
    />
  )
}
```

## 커밋 메시지(복붙용) — 채팅에 제공

> 현재 정책상 커밋 메시지는 문서가 아니라 **채팅 텍스트로 제공**합니다.


