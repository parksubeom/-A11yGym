# 09. 챌린지 상세 페이지 (/challenges/[id])

## 작업 개요

`/app/challenges/[id]/page.tsx`를 구현하여, 챌린지 학습 화면(가이드/에디터/미리보기/결과)을 제공합니다.

## 레이아웃

### 데스크톱

- **왼쪽(Resizable)**: 문제 설명 + 가이드라인 + 힌트(아코디언)
- **중앙(Resizable)**: `CodeEditor`
- **오른쪽(Resizable)**: `PreviewPanel` 및 Result 탭

### 모바일

가이드/에디터/미리보기를 **Tabs로 전환**할 수 있게 구성했습니다.

## 기능

- **코드 실행**: 현재 `userCode`를 `previewCode`로 스냅샷하여 `PreviewPanel` 갱신
- **제출**: 챌린지의 `validationRule`(정규식)을 실행하고 결과를 모달로 표시
- **결과 탭**: `useAppStore().testResult`에 저장된 메시지를 표시

## 구현 포인트

- Markdown 렌더링: `react-markdown` + `remark-gfm`
- 리사이즈 패널: shadcn/ui `resizable`
- 탭/모달/버튼: shadcn/ui `tabs`, `dialog`, `button`
- 상태: Zustand `useAppStore`의 `userCode`, `testResult`, `isCodeRunning` 사용

## 재현 절차(요약)

1. `shadcn/ui` 컴포넌트 추가: `button`, `tabs`, `dialog`, `resizable`
2. Markdown 패키지 설치: `react-markdown`, `remark-gfm`
3. `app/challenges/[id]/page.tsx` 구현
4. `CodeEditor`, `PreviewPanel`, `HintPanel` 연결


