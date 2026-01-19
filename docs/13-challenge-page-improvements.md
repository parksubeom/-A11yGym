# 13. 챌린지 페이지 개선 작업

## 작업 개요

챌린지 페이지에서 발견된 3가지 문제를 해결했습니다:

1. **네비게이션 부재**: 챌린지 페이지에서 메인 화면으로 돌아갈 방법이 없었음
2. **Preview 기능 미작동**: PreviewPanel이 React JSX 코드를 제대로 렌더링하지 못함
3. **Result 기본값 오류**: Result 탭의 기본 메시지가 "정답입니다"로 잘못 표시됨

## 문제 분석

### 문제 1: 네비게이션 부재

**발견 경로**: 사용자 피드백 - "각 챌린지에서 메인화면으로 돌아갈 방법이없어"

**원인 분석**:
- 챌린지 페이지(`/app/challenges/[id]/page.tsx`)에는 상단 액션 바만 존재
- 홈으로 돌아가는 링크나 버튼이 전혀 없었음
- 브라우저의 뒤로가기 버튼에만 의존해야 하는 상황

**영향**:
- 사용자 경험(UX) 저하
- 접근성 문제: 키보드만으로 다른 페이지로 이동 불가
- 플랫폼 내부 네비게이션 일관성 부족

### 문제 2: Preview 기능 미작동

**발견 경로**: 사용자 피드백 - "preview는 어떤용도야? 마크업된 ui를 보여줘야하는거아니야? 지금으로썬 무용지물이야"

**원인 분석**:
1. **코드 형식 불일치**: 챌린지 데이터의 `initialCode`와 `solutionCode`가 React JSX 형식으로 작성됨
   - 예: `<div onClick={() => alert("clicked")}>구독하기</div>`
   - 예: `tabIndex={0}`, `htmlFor="email"`, `className="..."`

2. **PreviewPanel의 한계**: 
   - `PreviewPanel.tsx`는 iframe에 코드를 직접 주입하는 방식
   - React JSX 문법을 HTML로 변환하지 않음
   - 결과: iframe 내부에서 JSX 문법이 그대로 문자열로 표시되거나 파싱 오류 발생

3. **구체적 문제점**:
   ```typescript
   // 기존 코드 (문제)
   iframeDoc.write(`
     <body>
       ${code}  // React JSX가 그대로 들어감
     </body>
   `)
   ```
   - `onClick={() => alert("clicked")}` → HTML에서 인식 불가
   - `tabIndex={0}` → HTML 속성명은 `tabindex` (소문자)
   - `htmlFor` → HTML 속성명은 `for`
   - `className` → HTML 속성명은 `class`

**영향**:
- 사용자가 작성한 코드의 시각적 결과를 확인할 수 없음
- 학습 목적 달성 불가: 접근성 개선 전/후 비교 불가능
- 핵심 기능 중 하나가 완전히 작동하지 않음

### 문제 3: Result 기본값 오류

**발견 경로**: 사용자 피드백 - "result의 기본값이 정답입니다야"

**원인 분석**:
1. **초기 상태 확인**:
   ```typescript
   // store/useAppStore.ts
   testResult: { status: "idle" } as const
   ```
   - 초기값은 `{ status: "idle" }`로 정상

2. **표시 로직 문제**:
   ```typescript
   // app/challenges/[id]/page.tsx (기존)
   <div className="mt-2 text-sm">
     {testResult.message ?? '아직 결과가 없습니다.'}
   </div>
   ```
   - `testResult.status === 'idle'`일 때 `testResult.message`는 `undefined`
   - 하지만 localStorage에 이전 챌린지의 결과가 남아있을 수 있음
   - 또는 챌린지 변경 시 `testResult`가 초기화되지 않음

3. **챌린지 변경 시 초기화 누락**:
   - `useEffect`에서 챌린지가 변경될 때 `testResult`를 초기화하지 않음
   - 이전 챌린지의 성공 메시지("정답입니다! ✅")가 그대로 표시됨

**영향**:
- 사용자 혼란: 아무것도 하지 않았는데 "정답입니다"가 표시됨
- 잘못된 피드백으로 인한 학습 효과 저하

## 해결 과정

### 해결 1: 네비게이션 추가

**추론 과정**:
1. **위치 결정**: 상단 액션 바의 왼쪽에 배치 (제목 앞)
2. **UI 패턴**: 홈 아이콘 버튼 사용 (일반적인 웹 패턴)
3. **접근성 고려**: `aria-label` 추가, 키보드 접근 가능

**구현**:
```typescript
// app/challenges/[id]/page.tsx
import Link from 'next/link'
import { Home } from 'lucide-react'

// 상단 액션 바 수정
<div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3">
  <div className="flex min-w-0 items-center gap-3">
    <Button variant="ghost" size="icon" asChild>
      <Link href="/" aria-label="홈으로 돌아가기">
        <Home className="h-4 w-4" />
      </Link>
    </Button>
    {/* ... 제목 ... */}
  </div>
  {/* ... 액션 버튼들 ... */}
</div>
```

**결과**:
- ✅ 홈으로 돌아가는 명확한 경로 제공
- ✅ 키보드 접근 가능 (Tab + Enter)
- ✅ 시각적 피드백 (호버 효과)

### 해결 2: PreviewPanel JSX → HTML 변환

**추론 과정**:

1. **문제 인식**: React JSX를 HTML로 변환해야 함
2. **변환 대상 식별**:
   - `className` → `class`
   - `htmlFor` → `for`
   - `tabIndex` → `tabindex` (소문자)
   - `onClick={...}` → `onclick="..."`
   - `{0}` → `"0"` (숫자 리터럴)
   - 자체 닫힘 태그: `<img />` → `<img>`

3. **제약사항 고려**:
   - 복잡한 JavaScript 함수는 HTML에서 직접 실행 불가
   - 예: `onClick={(e) => { if (e.key === "Enter") ... }}`
   - 해결: 간단한 `alert()` 호출만 변환, 복잡한 경우 주석 처리

4. **구현 전략**:
   - 정규식을 사용한 패턴 매칭 및 치환
   - 순서 중요: 더 구체적인 패턴을 먼저 처리
   - 예: `className={...}` 보다 `className="..."`를 먼저 처리

**구현**:
```typescript
// components/PreviewPanel.tsx
function convertReactJSXToHTML(code: string): string {
  let html = code

  // className → class
  html = html.replace(/\bclassName\s*=\s*["']([^"']+)["']/g, 'class="$1"')
  html = html.replace(/\bclassName\s*=\s*\{["']([^"']+)["']\}/g, 'class="$1"')

  // htmlFor → for
  html = html.replace(/\bhtmlFor\s*=\s*["']([^"']+)["']/g, 'for="$1"')
  html = html.replace(/\bhtmlFor\s*=\s*\{["']([^"']+)["']\}/g, 'for="$1"')

  // tabIndex → tabindex
  html = html.replace(/\btabIndex\s*=\s*\{0\}/g, 'tabindex="0"')
  html = html.replace(/\btabIndex\s*=\s*["']0["']/g, 'tabindex="0"')

  // onClick 간단한 경우만 변환
  html = html.replace(
    /\bonClick\s*=\s*\{\(\)\s*=>\s*alert\(["']([^"']+)["']\)\}/g,
    'onclick="alert(\'$1\')"'
  )

  // 복잡한 함수는 주석 처리
  html = html.replace(/\bonClick\s*=\s*\{[^}]+\}/g, 
    '<!-- onClick handler removed (not supported in HTML) -->'
  )

  // 자체 닫힘 태그 처리
  html = html.replace(/<(\w+)([^>]*)\s*\/>/g, '<$1$2>')

  // 중괄호로 감싸진 값 처리
  html = html.replace(/\{(\d+)\}/g, '"$1"')
  html = html.replace(/\{["']([^"']+)["']\}/g, '"$1"')

  return html
}
```

**추가 개선**:
- 기본 CSS 스타일 추가 (버튼, 입력 필드, 포커스 스타일)
- 접근성을 고려한 포커스 링 스타일 포함

**결과**:
- ✅ React JSX 코드가 HTML로 변환되어 렌더링됨
- ✅ 사용자가 작성한 마크업의 시각적 결과 확인 가능
- ✅ 접근성 개선 전/후 비교 가능

**제한사항**:
- 복잡한 JavaScript 이벤트 핸들러는 변환 불가 (HTML 제약)
- React 컴포넌트는 변환 불가 (순수 HTML만 지원)

### 해결 3: Result 기본값 수정

**추론 과정**:

1. **문제 원인 파악**:
   - 챌린지 변경 시 `testResult` 초기화 누락
   - `testResult.status === 'idle'`일 때 메시지 표시 로직 불명확

2. **해결 방안**:
   - 챌린지 변경 시 `testResult`를 `{ status: 'idle' }`로 초기화
   - Result 탭에서 `status`에 따라 명확하게 메시지 분기

**구현**:
```typescript
// app/challenges/[id]/page.tsx

// 1. 챌린지 변경 시 초기화
useEffect(() => {
  if (!challenge) return
  if (userCode.trim().length === 0) {
    setUserCode(challenge.initialCode)
    setPreviewCode(challenge.initialCode)
  }
  // 챌린지 변경 시 testResult 초기화
  setTestResult({ status: 'idle' })
}, [challenge?.id])

// 2. Result 탭 메시지 개선
<TabsContent value="result" className="mt-3">
  <div className="rounded-md border p-4">
    <div className="text-sm text-muted-foreground">테스트 결과</div>
    <div className="mt-2 text-sm">
      {testResult.status === 'idle'
        ? '아직 결과가 없습니다. 코드를 제출해주세요.'
        : testResult.status === 'success'
          ? `✅ ${testResult.message}`
          : `❌ ${testResult.message}`}
    </div>
  </div>
</TabsContent>
```

**결과**:
- ✅ 챌린지 변경 시 Result 탭이 올바른 기본 메시지 표시
- ✅ 상태별로 명확한 메시지 분기 (idle/success/failure)
- ✅ 사용자 혼란 제거

## 테스트 시나리오

### 시나리오 1: 네비게이션 테스트
1. 홈 페이지에서 챌린지 선택
2. 챌린지 페이지 상단의 홈 아이콘 클릭
3. ✅ 홈 페이지로 정상 이동 확인

### 시나리오 2: Preview 렌더링 테스트
1. "키보드 접근 불가 클릭 요소" 챌린지 선택
2. 초기 코드 확인: `<div onClick={() => alert("clicked")}>구독하기</div>`
3. "코드 실행" 버튼 클릭
4. Preview 탭에서 ✅ "구독하기" 텍스트가 표시되는지 확인
5. 클릭 시 ✅ alert가 표시되는지 확인 (변환된 `onclick` 작동)

### 시나리오 3: Result 기본값 테스트
1. 챌린지 A 선택 → 제출 → 성공 메시지 확인
2. 다른 챌린지 B로 이동
3. Result 탭 확인
4. ✅ "아직 결과가 없습니다. 코드를 제출해주세요." 메시지 표시 확인

## 재현 절차

### 1. 네비게이션 추가
```bash
# 필요한 import 추가
# app/challenges/[id]/page.tsx
import Link from 'next/link'
import { Home } from 'lucide-react'

# 상단 액션 바에 홈 버튼 추가
```

### 2. PreviewPanel 개선
```bash
# components/PreviewPanel.tsx에 convertReactJSXToHTML 함수 추가
# useEffect 내부에서 변환된 HTML 사용
const htmlCode = convertReactJSXToHTML(code)
iframeDoc.write(`...${htmlCode}...`)
```

### 3. Result 기본값 수정
```bash
# app/challenges/[id]/page.tsx
# useEffect에 testResult 초기화 추가
# Result 탭 메시지 로직 개선
```

## 관련 파일

- `app/challenges/[id]/page.tsx`: 네비게이션 추가, Result 메시지 개선
- `components/PreviewPanel.tsx`: JSX → HTML 변환 로직 추가

## 참고사항

### PreviewPanel의 제한사항
- React 컴포넌트는 변환 불가 (순수 HTML만 지원)
- 복잡한 JavaScript 이벤트 핸들러는 변환 불가
- JSX 표현식(`{variable}`)은 변환 불가 (정적 값만 지원)

### 향후 개선 가능성
- 더 정교한 JSX 파서 사용 (Babel, SWC 등)
- React 컴포넌트를 iframe 내부에서 실행 (React 런타임 포함)
- 코드 에디터에서 HTML/JSX 선택 옵션 제공

## 커밋 메시지(복붙용)

```
fix: 챌린지 페이지 UX 개선 및 Preview 기능 수정

- 챌린지 페이지에 홈으로 돌아가는 네비게이션 추가
- PreviewPanel이 React JSX를 HTML로 변환하여 렌더링하도록 수정
- Result 탭 기본 메시지 수정 및 챌린지 변경 시 초기화 로직 추가

문제:
1. 네비게이션 부재로 사용자가 메인 화면으로 돌아갈 수 없었음
2. PreviewPanel이 React JSX 코드를 렌더링하지 못해 무용지물이었음
3. Result 탭의 기본값이 이전 챌린지 결과로 표시되는 문제

해결:
1. 상단 액션 바에 홈 아이콘 버튼 추가 (Next.js Link 사용)
2. convertReactJSXToHTML 함수로 JSX 속성을 HTML로 변환
   - className → class, htmlFor → for, tabIndex → tabindex
   - onClick 간단한 경우 onclick으로 변환
3. 챌린지 변경 시 testResult 초기화 및 상태별 메시지 분기
```

