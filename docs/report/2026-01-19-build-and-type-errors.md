# 2026-01-19 개발 서버/빌드 컴파일 에러 분석 및 수정 리포트

## 요약

개발 서버 실행 시 발생한 `ModuleBuildError (Expected '>', got 'client')`를 포함해, 레포 내 잠재 컴파일/타입 에러를 **`next build` + `tsc --noEmit` 기준으로 전수 점검**하고 수정했습니다.

## 1) 에러 1 — `hooks/use-query.ts`에서 SWC 파싱 실패

### 증상

콘솔 에러(요약):

- `Expected '>', got 'client'`
- 파일: `hooks/use-query.ts`
- JSX 구문(`\<QueryClientProvider client={...}\>`) 파싱 실패

### 원인

`hooks/use-query.ts`는 **확장자가 `.ts`**인데, 내부에 **JSX(TSX)**가 포함되어 있었습니다.  
Next.js(SWC)는 `.ts`를 TSX로 파싱하지 않으므로, JSX 토큰을 만나면 위와 같은 파싱 에러가 발생합니다.

### 조치

- `hooks/use-query.ts`에서 JSX 컴포넌트 구현을 제거하고, **`app/providers.tsx`의 Providers를 re-export**하도록 변경했습니다.

## 2) 에러 2 — `app/providers.tsx`와 `hooks/use-query.ts`의 순환 import로 스택 오버플로우

### 증상

`next build` 중 prerender 단계에서:

- `RangeError: Maximum call stack size exceeded`
- 대상 페이지: `/`, `/_not-found`

### 원인

아래와 같은 **순환 참조(circular import)**가 존재했습니다.

- `app/providers.tsx` → `hooks/use-query.ts`의 `QueryProvider`를 import
- `hooks/use-query.ts` → `app/providers.tsx`의 `Providers`를 re-export

결과적으로 Providers 렌더링 과정에서 함수가 재귀적으로 호출되어 스택 오버플로우가 발생했습니다.

### 조치

- `app/providers.tsx`에 `QueryClientProvider` 래핑을 **직접 구현**하여 순환 참조를 제거했습니다.
- `hooks/use-query.ts`는 (호환성 목적) `Providers`를 `QueryProvider`로 re-export만 수행합니다.

## 3) 에러 3 — `components/ui/resizable.tsx`와 `react-resizable-panels` API 불일치

### 증상

`PanelGroup`, `PanelResizeHandle`가 없다는 에러:

- `Attempted import error: 'PanelGroup' is not exported from 'react-resizable-panels'`
- TypeScript 에러도 동일하게 발생

### 원인

설치된 `react-resizable-panels@4.4.1`의 실제 export는:

- `Group`, `Panel`, `Separator`

하지만 shadcn/ui 템플릿은 `PanelGroup`, `PanelResizeHandle`을 기대하는 형태가 있어 불일치가 발생했습니다.

### 조치

- `components/ui/resizable.tsx`를 `Group`/`Separator` 기반으로 수정했습니다.
- 챌린지 페이지에서 `direction="horizontal"`을 `orientation="horizontal"`로 변경해 타입을 맞췄습니다.

## 4) 에러 4 — PrismJS 타입 선언 누락

### 증상

- `Could not find a declaration file for module 'prismjs'`
- 파일: `components/CodeEditor.tsx`

### 원인

`prismjs`는 타입 선언이 기본 포함되어 있지 않아, TypeScript에서 `any`로 처리되며 빌드가 실패했습니다.

### 조치

- `@types/prismjs`를 dev dependency로 추가했습니다.

## 5) 에러 5 — react-simple-code-editor의 타입 정의 누락(또는 불완전)

### 증상

- `textareaRef` prop이 타입에 없다는 에러
- `el`, `e` 파라미터가 implicit any

### 원인

라이브러리 런타임은 `textareaRef`를 지원하지만, 타입 정의가 해당 prop을 포함하지 않아 TS 에러가 발생했습니다.

### 조치

- `types/react-simple-code-editor.d.ts`를 추가해 `textareaRef`를 포함한 최소 타입을 보완했습니다.
- `components/CodeEditor.tsx`에서 이벤트/엘리먼트 타입을 명시했습니다.

## 6) 에러 6 — Zustand persist storage SSR 타입 불일치

### 증상

- `Storage | undefined`가 `StateStorage`에 할당 불가
- 파일: `store/useAppStore.ts`

### 원인

SSR 환경에서 `window.localStorage`가 없으므로 `undefined`를 반환하도록 구현했는데, `createJSONStorage`의 타입은 항상 `StateStorage`를 반환해야 합니다.

### 조치

- 서버에서는 no-op `StateStorage`를 반환하도록 수정하여 타입/런타임을 동시에 안전하게 처리했습니다.

## 7) 에러 7 — `tailwind.config.ts` 중복 키(accordion keyframes/animation)

### 증상

- `An object literal cannot have multiple properties with the same name.`

### 원인

shadcn/ui 컴포넌트를 추가하는 과정에서 `accordion-down`, `accordion-up`이 중복으로 삽입되었습니다.

### 조치

- 중복된 `keyframes`/`animation` 키를 제거했습니다.

## 최종 검증

다음 명령 기준으로 에러가 해소되었습니다.

- `npx tsc --noEmit`
- `npm run build`

## 수정된 파일 목록(핵심)

- `hooks/use-query.ts`
- `app/providers.tsx`
- `components/ui/resizable.tsx`
- `app/challenges/[id]/page.tsx`
- `components/CodeEditor.tsx`
- `types/react-simple-code-editor.d.ts`
- `store/useAppStore.ts`
- `tailwind.config.ts`



