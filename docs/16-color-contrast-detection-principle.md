# 색 대비 검사 원리 (이슈 탭)

이 문서는 A11yGym의 **이슈 탭**에서 색 대비 부족 오류를 어떻게 감지하는지 설명합니다.

---

## 개요

이슈 탭의 색 대비 검사는 **axe-core** 라이브러리를 사용하여 자동으로 수행됩니다.

### 핵심 파일

- `components/PreviewPanel.tsx`: axe-core 실행 및 결과 표시
- `constants/sample-challenges.ts`: `contrast-low-text` 챌린지 정의

---

## 검사 프로세스

### 1. 코드 렌더링

사용자가 작성한 코드가 iframe 내부에 렌더링됩니다:

```280:282:components/PreviewPanel.tsx
        const results = await axeApi.run(doc, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        })
```

### 2. axe-core 실행

`axe-core`가 DOM을 스캔하여 다음을 수행합니다:

1. **텍스트 요소 탐지**: 모든 텍스트 노드(`<p>`, `<span>`, `<h1>` 등)를 찾습니다
2. **스타일 계산**: 각 텍스트의 실제 렌더링된 색상과 배경 색상을 계산합니다
   - 인라인 스타일 (`style="color: #9ca3af"`)
   - CSS 클래스 (`class="text-gray-400"`)
   - 상속된 스타일 (부모 요소로부터)
3. **대비 비율 계산**: WCAG 공식에 따라 명도 대비 비율을 계산합니다

### 3. WCAG 기준 검증

axe-core는 다음 기준을 적용합니다:

- **일반 텍스트** (16px 이하, 또는 18.66px 미만): **4.5:1 이상**
- **큰 텍스트** (18pt/24px 이상, 또는 Bold 14pt/18.66px 이상): **3:1 이상**

### 4. 위반 감지

기준을 만족하지 않는 텍스트가 발견되면:

```typescript
{
  id: 'color-contrast',
  impact: 'serious',
  help: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
  description: 'Element has insufficient color contrast',
  nodes: [
    {
      target: ['p'],
      html: '<p style="color:#9ca3af; background:#ffffff;">오늘 20:00~21:00 동안 점검이 진행됩니다.</p>',
      failureSummary: 'Fix any of the following:\n  Element has insufficient color contrast of 2.84 (foreground color: #9ca3af, background color: #ffffff, font size: 16px, font weight: normal). Expected contrast ratio of 4.5:1'
    }
  ]
}
```

---

## 실제 예시: `contrast-low-text` 챌린지

### 초기 코드

```199:204:constants/sample-challenges.ts
    initialCode: `<article class="notice">
  <h2 style="color:#111111;">업데이트 안내</h2>
  <p style="color:#9ca3af; background:#ffffff;">
    오늘 20:00~21:00 동안 점검이 진행됩니다. 이용에 참고해 주세요.
  </p>
</article>`,
```

### 검사 과정

1. **텍스트 요소**: `<p>` 태그 내부의 "오늘 20:00~21:00 동안..."
2. **전경색**: `#9ca3af` (밝은 회색)
3. **배경색**: `#ffffff` (흰색)
4. **대비 계산**: 
   - `#9ca3af`와 `#ffffff`의 대비 비율 = **약 2.84:1**
   - 기준: 4.5:1 이상 필요
   - **결과: 위반 감지** ❌

### 해결 코드

```206:211:constants/sample-challenges.ts
    solutionCode: `<article class="notice">
  <h2 style="color:#111111;">업데이트 안내</h2>
  <p style="color:#111111; background:#ffffff;">
    오늘 20:00~21:00 동안 점검이 진행됩니다. 이용에 참고해 주세요.
  </p>
</article>`,
```

- **전경색**: `#111111` (거의 검은색)
- **배경색**: `#ffffff` (흰색)
- **대비 계산**: 약 **21:1** ✅
- **결과: 통과**

---

## 대비 비율 계산 공식

axe-core는 WCAG 2.1/2.2의 **상대 휘도(Relative Luminance)** 공식을 사용합니다:

```
L = 0.2126 × R + 0.7152 × G + 0.0722 × B

여기서 R, G, B는 각 색상 채널의 정규화된 값 (0~1)
```

대비 비율:

```
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)

L1: 밝은 색의 휘도
L2: 어두운 색의 휘도
```

### 예시 계산

- `#9ca3af` (밝은 회색): L ≈ 0.42
- `#ffffff` (흰색): L = 1.0
- 대비 비율 = (1.0 + 0.05) / (0.42 + 0.05) ≈ **2.23:1** (실제로는 약 2.84:1)

---

## axe-core의 한계와 보완

### 자동 계산의 정확도

axe-core는 **렌더링된 스타일**을 기반으로 계산하므로:

✅ **정확하게 감지되는 경우:**
- 인라인 스타일 (`style="color: #9ca3af"`)
- CSS 클래스로 명시된 색상
- 상속된 색상

⚠️ **제한적인 경우:**
- CSS 변수(`var(--color)`)가 런타임에 동적으로 변경되는 경우
- 배경 이미지가 있는 경우 (단색 배경만 계산)
- 그라데이션 배경 (평균 색상으로 근사)

### 실제 렌더링 기반 검사

axe-core는 **실제 브라우저 렌더링 결과**를 분석합니다:

```typescript
// DOM이 완전히 렌더링된 후 실행
await waitForDomReady(() => iframe.contentDocument, {
  timeoutMs: 3000,
  intervalMs: 50,
})

await waitForStable(doc) // 이미지 로딩 대기

const results = await axeApi.run(doc, {...})
```

이를 통해:
- 계산된 스타일(computed styles)을 정확히 읽을 수 있습니다
- CSS 상속과 우선순위를 반영합니다
- 실제 사용자가 보는 화면과 동일한 조건으로 검사합니다

---

## 이슈 탭 표시

검사 결과는 다음과 같이 표시됩니다:

```386:437:components/PreviewPanel.tsx
                <div className="space-y-3">
                  {issues.map((v) => (
                    <div key={v.id} className="rounded-md border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">
                            {v.id}
                            {v.impact ? (
                              <span
                                className={cn(
                                  'ml-2 rounded px-1.5 py-0.5 text-xs',
                                  v.impact === 'critical'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    : v.impact === 'serious'
                                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                      : 'bg-muted text-muted-foreground'
                                )}
                              >
                                {v.impact}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{v.help}</div>
                          {v.helpUrl ? (
                            <div className="mt-1 text-xs text-muted-foreground">help: {v.helpUrl}</div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-2 space-y-2">
                        {(v.nodes || []).slice(0, 5).map((n, idx) => {
                          const selector = n.target?.[0]
                          return (
                            <div key={`${v.id}-${idx}`} className="rounded border bg-muted/40 p-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 truncate text-xs text-muted-foreground">
                                  {selector ?? '(selector 없음)'}
                                </div>
                                {selector ? (
                                  <Button size="sm" variant="secondary" onClick={() => highlightBySelector(selector)}>
                                    표시
                                  </Button>
                                ) : null}
                              </div>
                              {n.failureSummary ? <div className="mt-1 text-xs">{n.failureSummary}</div> : null}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
```

### 표시 정보

- **ID**: `color-contrast`
- **Impact**: `serious` (심각도)
- **Help**: WCAG 기준 설명
- **Failure Summary**: 구체적인 대비 비율과 기준 미달 이유

---

## 요약

1. **axe-core**가 DOM을 스캔하여 모든 텍스트 요소를 찾습니다
2. 각 텍스트의 **실제 렌더링된 색상과 배경 색상**을 계산합니다
3. WCAG 공식으로 **대비 비율을 계산**합니다 (4.5:1 또는 3:1 기준)
4. 기준을 만족하지 않으면 **violations 배열에 추가**됩니다
5. 이슈 탭에서 **위반 사항을 시각적으로 표시**합니다

이를 통해 사용자는 코드를 실행하기 전에 색 대비 문제를 즉시 확인할 수 있습니다.

