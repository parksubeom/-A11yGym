# 05. Zustand 전역 스토어 설계 및 구현

## 작업 개요

앱 전역 상태 관리를 위해 Zustand 스토어를 구현했습니다.

- 파일: `store/useAppStore.ts`
- 요구 상태:
  - **User**: `currentUser`, `isAuthenticated`
  - **Challenge**: `currentChallenge`, `userCode`, `isCodeRunning`
  - **UI**: `isSidebarOpen`, `currentTab` (`'editor' | 'preview'`)
  - **Feedback**: `showHint`, `hintLevel(1~3)`, `testResult`(성공/실패 메시지)
- 추가 요구:
  - `persist` 미들웨어를 사용해 **작성 중인 코드(`userCode`)를 로컬 스토리지에 저장**

## 추론 과정(설계 이유)

### 1) persist 범위를 `userCode`로 제한

요구사항이 “작성 중인 코드 저장”에 초점이 있으므로, `persist`는 **userCode만** 저장하도록 제한했습니다.

- 장점:
  - 로그인 정보/테스트 결과 등 민감하거나 휘발성인 상태가 브라우저에 남지 않음
  - hydrate 시 예기치 않은 UI 상태(사이드바/탭 등) 복원으로 인한 혼란 방지

### 2) Next.js(App Router) 환경의 SSR 안전성

Next.js에서는 서버 렌더링 단계에서 `window`/`localStorage`가 없습니다.
따라서 `createJSONStorage` + `typeof window !== "undefined"` 가드로 **클라이언트에서만 localStorage를 사용**하도록 했습니다.

### 3) 타입 안전성

- `currentTab`: `"editor" | "preview"` 유니언 타입
- `hintLevel`: `1 | 2 | 3`로 제한
- `testResult`: `idle/success/failure` 유니언으로 상태/메시지를 명확히 표현

## 구현 내용

### 파일: `store/useAppStore.ts`

- 상태(`AppState`) + 액션을 한 곳에서 정의
- `persist` 적용:
  - 저장 키: `a11y-training-platform:app-store`
  - `partialize`로 `userCode`만 저장

## 실행/사용 예시

```ts
import { useAppStore } from "@/store/useAppStore"

// 코드 저장(자동 persist)
useAppStore.getState().setUserCode("<button>Run</button>")

// UI 탭 전환
useAppStore.getState().setCurrentTab("preview")
```

## 재현 절차(이 문서만으로)

1. `store/useAppStore.ts` 파일 생성
2. Zustand 및 미들웨어 import
3. `AppState`에 요구된 상태/액션 정의
4. `persist` 적용 + `partialize`로 `userCode`만 저장
5. Next.js 환경을 위해 `createJSONStorage`와 `window` 가드 적용

## 다음 단계

- `currentChallenge`를 `constants/sample-challenges.ts`의 `Challenge` 타입과 연결(또는 id 기반 참조 강화)
- `testResult`를 실제 코드 실행/정규식 검증 결과와 연결하는 서비스 레이어 추가


