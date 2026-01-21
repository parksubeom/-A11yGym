# 2026-01-20 A11yGym 개발 진행상황 핸드오프(요약 리포트)

이 문서는 `docs/` 폴더의 모든 마크다운 문서를 읽고, **다른 에이전트가 즉시 이어서 작업할 수 있도록** 현재까지의 구현/의도/핵심 이슈/다음 액션을 한 번에 정리한 핸드오프 문서입니다.

---

## 1) 프로젝트 목표(한 줄)

Next.js(App Router) 기반의 **웹 접근성 실습 플랫폼**으로, 사용자가 코드(HTML/JSX)를 수정하고 미리보기/검증/힌트를 통해 학습할 수 있게 한다.

---

## 2) 현재까지 “구현 완료”된 큰 덩어리

### 2.1 기본 앱 골격/스택

- Next.js 14(App Router) + TS + Tailwind + shadcn/ui 기반 초기화 (`docs/01-project-initialization.md`)
- React Query Provider 구성(초기엔 파일 구조 문제/순환참조 이슈가 있었고 리포트에서 수정 완료로 정리됨) (`docs/report/2026-01-19-build-and-type-errors.md`)

### 2.2 KWCAG 지침 데이터(상수)

- `constants/kwcag-guidelines.ts`를 CSV로부터 **자동 생성하는 파이프라인** 구축
  - CP949/EUC-KR → UTF-8 변환 스크립트
  - 변환된 CSV → TS 상수 자동 생성 스크립트
  - 지침은 CSV의 “고유 번호(1~33)”를 기준으로 중복 제거하여 생성
  - principle(POUR)은 CSV에 컬럼이 없어 번호 구간으로 매핑(경험 기반) (`docs/03-kwcag-guidelines-from-csv.md`)
- 참고: 초기에는 WCAG 성공기준 형태(예: 1.1.1/2.1.1)로 49개를 수기 정의한 문서가 존재함 (`docs/02-kwcag-guidelines-definition.md`).
  - 이후 CSV 기반(1~33) 생성 방식으로 전환되었고, 이 둘은 “코드 체계”가 다름(혼동 포인트).

### 2.3 실습(챌린지) 데이터/타입

- 초기에는 `validationRule`(정규식 등) 기반의 샘플 챌린지 구조를 문서화 (`docs/04-sample-challenges-data-structure.md`)
- 이후 진행에서 `Challenge` 타입이 “실습 UX”에 맞게 확장됨(멀티라인 initialCode, highlightLines, assets 등).  
  - 이 내용은 별도 문서보다 코드/대화 기반으로 진화했으므로, **현재 타입의 소스(`types/challenge.ts`)를 기준으로 확인** 필요.

### 2.4 Zustand 전역 스토어

- `store/useAppStore.ts`에 사용자/챌린지/UI/피드백 상태를 통합 (`docs/05-zustand-app-store.md`)
- 원래 요구는 `userCode`를 persist로 저장이었으나, 이후 “새로고침 시 초기화” 요구가 들어와 **persist 정책이 변경/제거/마이그레이션 이슈가 반복적으로 다뤄짐**(문서에는 초기 요구 중심으로 남아있음).

### 2.5 React Query + Supabase hooks

- `hooks/useQueries.ts`에 `useGuidelines`, `useChallenge`, `useUserProgress`, `useSubmitSolution` 구성 (`docs/06-react-query-supabase-hooks.md`)
- Supabase 테이블/스키마가 필요하며, seed 스크립트도 별도 존재

### 2.6 코드 에디터

- `components/CodeEditor.tsx`는 `react-simple-code-editor` + Prism 기반 (`docs/07-code-editor.md`)
- 키보드 트랩 방지(ESC blur), aria-label/aria-describedby 등 접근성 고려
- 라인 하이라이트(문제 라인 강조)도 적용 방향이 있었고, “하이라이트가 입력을 막지 않도록” CSS/구현을 조정해왔음(코드 기준 확인 필요)

### 2.7 PreviewPanel(미리보기) + HintPanel(힌트)

- PreviewPanel: iframe 기반으로 사용자 코드 렌더링 + 에러 처리 (`docs/08-preview-hint-panels.md`)
- HintPanel: 아코디언/aria-live 기반 힌트 제공 (`docs/08-preview-hint-panels.md`)
- 이후 PreviewPanel은 “렌더링 + axe 분석 + 탭 유지”까지 포함하도록 크게 확장되었고, 문제/해결 과정이 별도 문서로 정리됨 (`docs/14-previewpanel-axe-core-issues-resolution.md`)

### 2.8 챌린지 상세 페이지

- `/app/challenges/[id]/page.tsx`에서 데스크톱(Resizable) + 모바일(Tabs) 레이아웃 제공 (`docs/09-challenge-page.md`)
- UX 개선(홈으로 가기 네비게이션, Preview JSX→HTML 변환, Result 기본값/초기화) 문서화 (`docs/13-challenge-page-improvements.md`)

### 2.9 검증 유틸

- 초기: alt/label/keyboard 3종 정규식 기반 검사 + normalize (`docs/10-validator-utils.md`)
- 이후: `validateChallenge(challengeId, userCode)` 방식으로 “챌린지별 맞춤 검증”까지 확장(정확한 최신 구현은 `lib/validator.ts` 확인 필요)

### 2.10 시딩 스크립트

- `scripts/seed.ts`로 Supabase guidelines/challenges 최소 5개 삽입(upsert) (`docs/11-supabase-seeding.md`)

### 2.11 플랫폼 자체 접근성 체크리스트 + 자동 테스트(axe/playwright)

- 포커스 링/대비/aria-label/다크모드 점검 + Playwright + @axe-core/playwright 가이드 (`docs/12-platform-a11y-checklist.md`)

---

## 3) “가장 중요했던 이슈/결정” (다른 에이전트가 반드시 알아야 함)

### 3.1 KWCAG 코드 체계 혼동(지침 코드가 모두 1.1.1로 보였던 문제의 배경)

- 지침 데이터에는 2가지 “코드 체계”가 섞여 있음
  - (A) 초기 수기 문서: WCAG 성공기준 형태(예: `1.1.1`, `2.1.1`) (`docs/02-kwcag-guidelines-definition.md`)
  - (B) CSV 자동 생성: “고유 번호(1~33)” 체계 (`docs/03-kwcag-guidelines-from-csv.md`, `docs/kwcag-guidelines.utf8.csv`)
- 챌린지(실습) 쪽은 대체로 WCAG 성공기준 형태(예: 1.1.1)를 사용하려는 흐름이 강했음.  
→ **다음 작업에서 “지침/챌린지의 코드 체계를 하나로 정리(매핑 레이어 추가)”**하는 게 중요.

### 3.2 PreviewPanel의 핵심 난제: iframe + axe-core

PreviewPanel 접근성 분석 기능은 아래 이슈가 반복적으로 발생했음:
- `exports is not defined` (axe.source를 iframe에서 eval할 때 CommonJS 환경 부재)
- `axe.run arguments are invalid` (부모 컨텍스트에서 iframe doc을 잘못 실행)
- `Axe is already running` (중복 실행/레이스)
- 탭 이동 후 Render UI 사라짐(탭 언마운트로 iframe 파괴)
- sandbox 경고: `allow-scripts allow-same-origin` 조합은 탈출 가능성 경고
- srcdoc 파싱 깨짐(axe source 문자열이 HTML 파서/`</script>` 등과 충돌 가능)

해결/완화 전략은 문서에 정리됨:
- CommonJS shim + eval/주입 후 `iframeWindow.axe.run(...)` 방식
- 분석/axe.run 직렬화(ref로 Promise 추적)
- `TabsContent forceMount`로 iframe 유지
(`docs/14-previewpanel-axe-core-issues-resolution.md`)

그리고 **가장 최근 사용자 요청**은:
- PreviewPanel 로직을 “화면(Render) + 이슈(Issues)”만 **우선 정상 동작**하게 단순화(검증 후 커밋)  
→ 현재 브랜치/코드 상태는 이 의도를 반영했을 가능성이 높음(최신 `components/PreviewPanel.tsx` 확인 필요).

### 3.3 빌드/타입 이슈는 한 차례 대규모 정리 완료

- `.ts` 파일에 JSX가 들어가 SWC 파싱 실패, 순환 import로 스택오버플로우, resizable API 불일치, prism 타입, zustand storage SSR 타입, tailwind 중복 키 등  
→ `next build` + `tsc --noEmit` 기준으로 정리한 리포트가 존재 (`docs/report/2026-01-19-build-and-type-errors.md`)

---

## 4) 현재 “남아있을 가능성이 큰” 문제(리스크)

아래 항목은 문서/히스토리 상 계속 등장했던 문제들이며, 현재도 남아있을 수 있음:

1. **PreviewPanel 분석 안정성**
   - `Axe is already running` 재발 여부(레이스/중복 트리거)
   - 코드 실행 직후 이슈가 간헐적으로만 잡히는 문제(iframe 로드/DOM 안정화 타이밍)
2. **sandbox 보안 경고 vs 기능 요구 충돌**
   - `allow-same-origin`을 제거하면 부모가 iframe DOM을 못 읽음(분석 모델 변경 필요)
   - `allow-same-origin`을 유지하면 보안 경고가 뜸(프로덕션 정책 결정 필요)
3. **스토어 persist 정책 불일치**
   - 문서(05)는 userCode 저장을 전제로 하나, 사용자 요구는 “새로고침 시 초기화”
4. **지침 코드 체계 정합성**
   - CSV(1~33) 기반 지침과 WCAG(1.1.1 등) 기반 챌린지가 섞이면 UX/데이터 연결이 어긋남

---

## 5) 다음 에이전트가 바로 시작할 “추천 작업 순서”

1. **현재 런타임에서 PreviewPanel이 실제로 어떤 탭/로직인지 확인**
   - `components/PreviewPanel.tsx` 최신 상태 확인
   - 탭 전환 시 Render 유지 여부(iframe 유지), Issues 분석 정상 동작 여부 확인
2. “코드 실행” 직후 이슈가 간헐적으로만 잡히는 문제 재현/원인 분리
   - 분석 트리거 타이밍, iframe ready 대기, axe 직렬화 상태 점검
3. 지침 데이터의 코드 체계를 정리
   - (안) guidelines는 CSV(1~33)로 유지하되 챌린지의 wcagCode(1.1.1 등)와 매핑 테이블 추가
   - (안) guidelines를 WCAG 성공기준 코드 기준으로 재정의(현재 CSV 컬럼상 난이도 있음)
4. persist 정책 최종 결정 후 스토어/문서 정합성 맞추기

---

## 6) 주요 문서/리포트 인덱스

- 프로젝트 초기화: `docs/01-project-initialization.md`
- KWCAG 지침(수기 정의): `docs/02-kwcag-guidelines-definition.md`
- KWCAG 지침(CSV→TS 자동 생성): `docs/03-kwcag-guidelines-from-csv.md`
- 샘플 챌린지 구조(초기): `docs/04-sample-challenges-data-structure.md`
- Zustand 스토어(초기 요구 중심): `docs/05-zustand-app-store.md`
- React Query hooks: `docs/06-react-query-supabase-hooks.md`
- CodeEditor: `docs/07-code-editor.md`
- Preview/Hint 패널(초기): `docs/08-preview-hint-panels.md`
- 챌린지 페이지(초기): `docs/09-challenge-page.md`
- validator(초기): `docs/10-validator-utils.md`
- Supabase seed: `docs/11-supabase-seeding.md`
- 플랫폼 접근성 체크리스트 + 자동테스트: `docs/12-platform-a11y-checklist.md`
- 챌린지 페이지 개선: `docs/13-challenge-page-improvements.md`
- PreviewPanel axe 이슈 해결 가이드(중요): `docs/14-previewpanel-axe-core-issues-resolution.md`
- 빌드/타입 에러 정리 리포트: `docs/report/2026-01-19-build-and-type-errors.md`


