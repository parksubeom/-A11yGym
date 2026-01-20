# PreviewPanel 접근성 분석 기능 문제 해결 가이드

## 개요

PreviewPanel 컴포넌트에서 접근성 분석 기능(A11y Tree, Issues 탭)을 구현하는 과정에서 발생한 주요 문제들과 해결 방법을 정리한 문서입니다.

## 발생한 문제들

### 문제 1: ReferenceError: exports is not defined

#### 증상
- "A11y 트리" 탭과 "이슈" 탭에서 "접근성 분석 중 오류가 발생했습니다" 메시지 표시
- 브라우저 콘솔에 `ReferenceError: exports is not defined` 오류 발생
- axe-core 라이브러리가 iframe 내부에서 정상적으로 로드되지 않음

#### 원인 분석

1. **환경 불일치 문제**
   - `import axe from 'axe-core'`로 가져온 `axe.source`는 Node.js 환경(CommonJS)을 지원하기 위해 코드 내부에 `exports` 또는 `module.exports` 키워드를 포함
   - 브라우저의 iframe(window 환경)에는 `exports`나 `module`이라는 전역 변수가 존재하지 않음
   - `eval(axe.source)` 실행 시 브라우저가 "exports가 정의되지 않았다"고 판단하여 스크립트 실행 중단

2. **실행 컨텍스트 문제**
   - axe-core는 실행 컨텍스트(window/document)에 강하게 결합되어 있음
   - 부모(window)에서 import한 axe로 iframe Document를 직접 분석하면 "axe.run arguments are invalid" 오류 발생 가능
   - 해결책: axe 소스를 iframe 내부에 주입한 뒤, `iframeWindow.axe.run(...)`으로 실행해야 함

#### 해결 방법

**Option A: 호환성 변수(Shim) 선언 후 주입 (권장)**

```typescript
// 1. CommonJS 환경 호환성을 위한 Shim 스크립트 준비
const compatibilityScript = `
  var module = { exports: {} };
  var exports = module.exports;
  var process = { env: { NODE_ENV: 'production' } };
`;

// 2. iframeWindow 컨텍스트에서 Shim과 axe 소스를 함께 실행
(iframeWindow as any).eval(compatibilityScript + axe.source)

// 3. 주입 결과 확인
// 먼저 전역 window.axe를 확인
let axeApi = (iframeWindow as any).axe

// 전역에 없으면 CommonJS 방식(module.exports)으로 로드되었는지 확인
if (!axeApi) {
  const iframeModule = (iframeWindow as any).module;
  if (iframeModule && iframeModule.exports && iframeModule.exports.run) {
    axeApi = iframeModule.exports;
    // 다음 사용을 위해 전역 객체에 할당
    (iframeWindow as any).axe = axeApi;
  }
}
```

**Option B: CDN 스크립트 로드 (Fallback)**

```typescript
// eval 실패 시 CDN으로 재시도
try {
  await new Promise<void>((resolve, reject) => {
    const script = iframeDoc.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('CDN 스크립트 로드 실패'));
    iframeDoc.head.appendChild(script);
  });
  axeApi = (iframeWindow as any).axe;
} catch (cdnError) {
  throw new Error(`axe-core 로드 실패 (Eval 및 CDN 모두 실패): ${cdnError}`);
}
```

#### 해결 이유

- **Shim 스크립트**: 브라우저 환경에서 CommonJS 코드가 실행될 수 있도록 필요한 전역 변수들을 미리 선언
- **이중 확인 로직**: axe가 전역 객체에 할당되지 않은 경우 `module.exports`에서 찾아서 전역에 할당하여 재사용 가능하도록 함
- **CDN Fallback**: eval이 보안 정책(CSP)이나 번들링 문제로 실패할 경우를 대비한 안전 장치

---

### 문제 2: Axe is already running

#### 증상
- 브라우저 콘솔에 `Error: Axe is already running. Use 'await axe.run()' to wait for the previous run to finish before starting a new run.` 오류 반복 발생
- "코드 실행" 버튼을 빠르게 여러 번 클릭하거나, 여러 이벤트가 동시에 발생할 때 오류 발생
- 접근성 분석이 중단되고 오류 메시지 표시

#### 원인 분석

1. **중복 실행 문제**
   - `runAnalysesWhenReady` 함수가 여러 번 호출될 수 있음 (iframe.onload, readyState 체크, DOMContentLoaded 이벤트 등)
   - 이전 `axe.run()` 실행이 완료되기 전에 새로운 실행이 시작됨
   - axe-core는 동시에 여러 분석을 실행할 수 없도록 설계되어 있음

2. **이벤트 중복 발생**
   - `iframe.onload` 이벤트
   - `iframe.contentDocument?.readyState === 'complete'` 체크
   - `DOMContentLoaded` 이벤트 리스너
   - 이 세 가지 경로가 모두 `runAnalysesWhenReady()`를 호출할 수 있음

#### 해결 방법

**1단계: 분석 프로세스 레벨에서 중복 방지**

```typescript
const analysisInProgressRef = useRef<Promise<void> | null>(null);

const runAnalysesWhenReady = async () => {
  // 이미 분석이 진행 중이면 이전 분석이 완료될 때까지 대기
  if (analysisInProgressRef.current) {
    try {
      await analysisInProgressRef.current;
    } catch {
      // 이전 분석이 실패해도 계속 진행
    }
  }
  
  // 새로운 분석 시작
  const analysisPromise = (async () => {
    // ... 분석 로직 ...
  })();
  
  // 진행 중인 분석 추적
  analysisInProgressRef.current = analysisPromise;
  
  try {
    await analysisPromise;
  } finally {
    // 분석 완료 후 참조 제거
    if (analysisInProgressRef.current === analysisPromise) {
      analysisInProgressRef.current = null;
    }
  }
};
```

**2단계: 스케줄링 중복 방지**

```typescript
// 중복 호출 방지를 위한 플래그
let hasScheduledAnalysis = false;

const scheduleAnalysis = () => {
  if (hasScheduledAnalysis) return;
  hasScheduledAnalysis = true;
  void runAnalysesWhenReady();
};

iframe.onload = () => {
  scheduleAnalysis();
};

if (iframe.contentDocument?.readyState === 'complete') {
  scheduleAnalysis();
} else {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.addEventListener('DOMContentLoaded', () => {
      scheduleAnalysis();
    }, { once: true });
  }
}
```

**3단계: axe.run() 레벨에서 중복 방지**

```typescript
const axeRunInProgressRef = useRef<Promise<unknown> | null>(null);

// axe.run 실행 전에 이전 실행이 완료될 때까지 대기
if (axeRunInProgressRef.current) {
  try {
    await axeRunInProgressRef.current;
  } catch {
    // 이전 실행이 실패해도 계속 진행
  }
}

// axe.run 실행
const axePromise = axeApi.run(iframeDoc, {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'],
  },
});

// 진행 중인 axe 실행 추적
axeRunInProgressRef.current = axePromise;

let results;
try {
  results = await Promise.race([axePromise, timeoutPromise]);
} finally {
  // 실행 완료 후 참조 제거
  if (axeRunInProgressRef.current === axePromise) {
    axeRunInProgressRef.current = null;
  }
}
```

#### 해결 이유

- **이중 보호 메커니즘**: 외부 레벨(분석 프로세스)과 내부 레벨(axe.run 호출)에서 각각 중복 실행을 방지
- **스케줄링 플래그**: 동일한 이벤트에서 여러 번 호출되는 것을 방지
- **순차 실행 보장**: 이전 실행이 완료될 때까지 대기하여 axe-core의 요구사항을 충족
- **안전한 오류 처리**: 이전 실행이 실패해도 새 실행을 진행할 수 있도록 처리

---

## 추가 개선 사항

### iframe 로딩 대기 로직 개선

```typescript
const runAnalysesWhenReady = async () => {
  // iframe이 완전히 로드되고 DOM이 준비될 때까지 대기
  let retries = 0;
  const maxRetries = 20; // 최대 2초 대기 (100ms * 20)
  
  while (retries < maxRetries) {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc && iframeDoc.body && iframeDoc.body.children.length > 0) {
      // DOM이 준비되었는지 확인
      const hasContent = iframeDoc.body.querySelector('*');
      if (hasContent) {
        await runAnalyses();
        setIsLoading(false);
        return;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
  }
  
  // 타임아웃 후에도 분석 시도
  try {
    await runAnalyses();
  } catch (e) {
    console.error('접근성 분석 최종 실패:', e);
    setAnalysisError('iframe이 완전히 로드되지 않았습니다. 코드를 다시 실행해주세요.');
  } finally {
    setIsLoading(false);
  }
};
```

**개선 이유**:
- DOM이 완전히 준비되지 않은 상태에서 분석을 시도하면 오류 발생 가능
- 재시도 로직으로 DOM 준비 상태를 확인하여 안정성 향상

---

### 문제 3: 탭 이동 후 “화면(Render)” 탭에서 UI가 사라짐(초기화됨)

#### 증상
- PreviewPanel에서 `A11y 트리`/`이슈` 탭으로 이동했다가 다시 `화면` 탭으로 돌아오면 **iframe 렌더 UI가 사라지거나 초기화됨**
- 사용자는 “어느 패널을 탐색하고 와도 그대로 유지되어야 한다”고 기대함

#### 원인 분석
- shadcn/ui의 `Tabs`는 Radix Tabs 기반이며, 기본 동작에서 `TabsContent`는 **비활성 탭을 언마운트(unmount)** 할 수 있음
- 기존 구현에서는 `<iframe>`이 `TabsContent value="render"` 내부에만 존재해서,
  - 다른 탭으로 이동 시 iframe이 언마운트 → 다시 돌아오면 새로 마운트
  - 그 결과 `srcdoc`이 다시 로드되거나(또는 상태가 초기화) 화면이 유지되지 않음

#### 해결 방법
- `TabsContent`에 `forceMount`를 적용하여 비활성 탭이어도 DOM을 유지하도록 변경
  - `render/a11y/issues` 모두 `forceMount` 적용(일관성 + 탭 전환 시 상태 유지)

예시:

```tsx
<TabsContent value="render" forceMount>...</TabsContent>
<TabsContent value="a11y" forceMount>...</TabsContent>
<TabsContent value="issues" forceMount>...</TabsContent>
```

#### 해결 이유
- iframe은 “미리보기 실행 결과”의 상태를 담고 있으므로 탭 전환으로 파괴되면 UX가 크게 저하됨
- `forceMount`는 Radix Tabs가 제공하는 표준 방식으로, 탭 UI를 유지하면서도 **컴포넌트 상태를 보존**할 수 있음

---

## 검증 방법

### 문제 1 해결 검증
1. 브라우저 콘솔에서 `ReferenceError: exports is not defined` 오류가 사라졌는지 확인
2. "A11y 트리" 탭에서 접근성 정보가 정상적으로 표시되는지 확인
3. "이슈" 탭에서 "현재 치명적인 이슈가 감지되지 않았습니다" 또는 실제 위반 목록이 표시되는지 확인

### 문제 2 해결 검증
1. "코드 실행" 버튼을 빠르게 여러 번 클릭해도 오류가 발생하지 않는지 확인
2. 브라우저 콘솔에서 "Axe is already running" 오류가 사라졌는지 확인
3. 여러 이벤트가 동시에 발생해도 분석이 정상적으로 완료되는지 확인

---

## 핵심 교훈

1. **환경 불일치 문제**: Node.js 환경용 코드를 브라우저에서 실행할 때는 호환성 Shim이 필요할 수 있음
2. **비동기 실행 관리**: Promise 기반 비동기 작업의 중복 실행을 방지하기 위해 ref를 사용한 추적이 필요
3. **이벤트 중복 처리**: 여러 이벤트 리스너가 동일한 함수를 호출할 수 있으므로 중복 방지 로직이 필수
4. **계층적 보호**: 외부 레벨과 내부 레벨에서 각각 중복 실행을 방지하는 이중 보호 메커니즘 적용

---

## 참고 자료

- [axe-core 공식 문서](https://github.com/dequelabs/axe-core)
- [CommonJS vs ES Modules](https://nodejs.org/api/modules.html)
- [iframe sandbox 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox)

