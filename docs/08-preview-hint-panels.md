# 08. 미리보기 패널 및 힌트 패널 구현

## 작업 개요

사용자가 작성한 코드를 렌더링하는 미리보기 패널과 3단계 힌트 시스템을 구현했습니다.

- **PreviewPanel.tsx**: iframe을 활용한 안전한 코드 렌더링 + Error Boundary
- **HintPanel.tsx**: 3단계 힌트 아코디언 UI + 스크린 리더 지원 (aria-live)

## 요구사항 분석

### PreviewPanel 요구사항
- 사용자 코드를 안전하게 실행하여 렌더링 (iframe 활용)
- 런타임 에러 발생 시 에러 메시지 표시 (Error Boundary 포함)

### HintPanel 요구사항
- 3단계 힌트 시스템 (1단계: 단순 가이드 → 3단계: 정답 코드 일부)
- "힌트 보기" 버튼 클릭 시 단계별로 내용이 펼쳐지는 아코디언 UI (shadcn/ui 활용)
- 스크린 리더가 새로운 힌트를 즉시 읽을 수 있도록 `aria-live="polite"` 적용

## 추론 과정

### 1. iframe을 사용한 코드 렌더링

**문제**: 사용자가 작성한 코드를 안전하게 실행하면서도 DOM에 직접 주입하지 않아야 함

**결정**: iframe + sandbox 속성 사용
- `sandbox="allow-scripts allow-same-origin"`: 스크립트 실행 허용, 같은 origin 접근 허용
- iframe 내부의 에러는 외부 페이지에 영향을 주지 않음

**이유**:
- 보안: 사용자 코드가 메인 페이지의 DOM/스크립트에 접근하지 못함
- 격리: 각 미리보기 세션이 독립적으로 실행됨

### 2. Error Boundary vs iframe 에러 핸들링

**문제**: iframe 내부의 런타임 에러를 어떻게 잡을 것인가?

**결정**: 두 가지 방법 병행
- **Error Boundary**: React 컴포넌트 레벨 에러 처리 (컴포넌트 자체 에러)
- **iframe window.onerror**: iframe 내부 JavaScript 런타임 에러 리스닝

**이유**:
- Error Boundary는 React 컴포넌트 트리 내부의 에러만 잡을 수 있음
- iframe 내부의 JavaScript 에러는 별도의 컨텍스트이므로 window.onerror 리스너 필요

### 3. 힌트 시스템 구조

**문제**: 3단계 힌트를 어떻게 구조화할 것인가?

**결정**: `HintLevel[]` 배열로 받아서 아코디언으로 표시
- 각 힌트는 `level`, `title`, `content`를 가짐
- 레벨 순서대로 정렬하여 표시

**이유**:
- 유연성: 챌린지별로 다른 힌트 구조를 가질 수 있음
- 확장성: 향후 4단계, 5단계로 확장 가능

### 4. aria-live 적용 위치

**문제**: 스크린 리더가 새로운 힌트를 언제 읽어야 하는가?

**결정**: 힌트 내용이 표시되는 `AccordionContent` 내부에 `aria-live="polite"` 적용
- `polite`: 현재 읽는 내용이 끝난 후에 읽음 (interruptive하지 않음)
- `aria-atomic="true"`: 전체 영역을 하나의 단위로 읽음

**이유**:
- 사용자가 힌트를 펼칠 때만 읽히도록 함
- 긴급하지 않은 정보이므로 `polite` 사용

## 구현 방법

### 1. PreviewPanel.tsx

**파일 경로**: `components/PreviewPanel.tsx`

**구현 내용**:

#### Error Boundary 클래스 컴포넌트
```typescript
class ErrorBoundary extends React.Component<...> {
  static getDerivedStateFromError(error: Error)
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo)
  componentDidUpdate() // 코드 변경 시 에러 상태 초기화
}
```

**이유**:
- React의 Error Boundary는 클래스 컴포넌트로만 구현 가능
- 컴포넌트 트리 내부의 에러를 잡아서 UI에 표시

#### iframe 에러 리스닝
```typescript
iframeWindow.addEventListener('error', errorHandler)
iframeWindow.addEventListener('unhandledrejection', ...)
```

**이유**:
- iframe 내부의 JavaScript 런타임 에러를 잡기 위함
- Promise rejection도 처리

#### iframe sandbox 속성
```typescript
<iframe
  sandbox="allow-scripts allow-same-origin"
  ...
/>
```

**이유**:
- `allow-scripts`: JavaScript 실행 허용
- `allow-same-origin`: 같은 origin으로 취급 (필요한 경우)

### 2. HintPanel.tsx

**파일 경로**: `components/HintPanel.tsx`

**구현 내용**:

#### 3단계 힌트 타입
```typescript
export interface HintLevel {
  level: 1 | 2 | 3
  title: string
  content: string
}
```

**이유**:
- 각 힌트의 레벨, 제목, 내용을 명확히 정의
- 타입 안정성 보장

#### 아코디언 UI (shadcn/ui)
```typescript
<Accordion type="multiple" onValueChange={handleValueChange}>
  {sortedHints.map((hint) => (
    <HintAccordionItem key={hint.level} hint={hint} />
  ))}
</Accordion>
```

**이유**:
- `type="multiple"`: 여러 힌트를 동시에 펼칠 수 있음
- shadcn/ui Accordion 사용으로 일관된 UI 제공

#### aria-live 적용
```typescript
<div
  aria-live="polite"
  aria-atomic="true"
  role="region"
  aria-label={`${hint.level}단계 힌트`}
>
  {isOpen && <div>{hint.content}</div>}
</div>
```

**이유**:
- `aria-live="polite"`: 스크린 리더가 현재 읽는 내용이 끝난 후에 읽음
- `aria-atomic="true"`: 전체 영역을 하나의 단위로 읽음
- `role="region"`: 의미 있는 영역임을 명시

## 사용 예시

### PreviewPanel
```tsx
import { PreviewPanel } from '@/components/PreviewPanel'

function ChallengePage() {
  const { userCode } = useAppStore()
  
  return (
    <PreviewPanel code={userCode} className="h-full" />
  )
}
```

### HintPanel
```tsx
import { HintPanel } from '@/components/HintPanel'

const hints = [
  {
    level: 1,
    title: '기본 가이드',
    content: '이미지 요소에 alt 속성을 추가해야 합니다.',
  },
  {
    level: 2,
    title: '구체적인 힌트',
    content: '<img> 태그에 alt="..." 속성을 추가하세요.',
  },
  {
    level: 3,
    title: '정답 코드 일부',
    content: '<img src="logo.png" alt="회사 로고" />',
  },
]

function ChallengePage() {
  return <HintPanel hints={hints} />
}
```

## 실행 순서

이 문서만으로 같은 결과물을 만들기 위한 단계별 실행 순서:

1. **shadcn/ui Accordion 추가**
   ```bash
   npx shadcn@latest add accordion
   ```

2. **PreviewPanel.tsx 생성**
   - Error Boundary 클래스 컴포넌트 구현
   - iframe을 사용한 코드 렌더링 로직
   - iframe 내부 에러 리스닝 (window.onerror, unhandledrejection)

3. **HintPanel.tsx 생성**
   - HintLevel 타입 정의
   - shadcn/ui Accordion 사용
   - aria-live 적용

## 검증 방법

1. **타입 체크**
   ```bash
   npx tsc --noEmit
   ```

2. **렌더링 테스트**
   - PreviewPanel에 유효한 HTML 코드 입력 → 정상 렌더링 확인
   - PreviewPanel에 오류가 있는 코드 입력 → 에러 메시지 표시 확인
   - HintPanel에서 힌트 펼치기 → 스크린 리더가 읽는지 확인

## 주의사항

1. **iframe sandbox 보안**: `allow-scripts`만 허용하면 더 안전하지만, 일부 기능이 제한될 수 있습니다. 필요에 따라 `allow-forms`, `allow-popups` 등을 추가할 수 있습니다.

2. **XSS 방지**: 사용자 코드를 그대로 iframe에 주입하므로, 실제 프로덕션에서는 추가적인 sanitization이 필요할 수 있습니다.

3. **aria-live 중복**: 여러 힌트를 동시에 펼치면 스크린 리더가 여러 번 읽을 수 있습니다. 필요시 `aria-live`를 하나만 활성화하도록 조정할 수 있습니다.

## 다음 단계

1. 코드 실행 결과를 실제 DOM과 비교하는 검증 로직 추가
2. 힌트 사용 횟수 추적 및 통계
3. PreviewPanel에 코드 실행 시간 제한 추가
4. 힌트 펼침/접힘 애니메이션 개선

