'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import axe from 'axe-core'
import { computeAccessibleName, computeAccessibleDescription } from 'dom-accessibility-api'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PreviewPanelProps {
  code: string
  className?: string
}

interface ErrorInfo {
  message: string
  stack?: string
}

type PreviewTab = 'render' | 'a11y' | 'issues'

type A11yNode = {
  selector: string
  tag: string
  role: string | null
  name: string
  description?: string
  focusable: boolean
}

type AxeIssue = {
  id: string
  impact: string | null
  help: string
  description: string
  helpUrl?: string
  nodes: Array<{
    target: string[]
    html: string
    failureSummary?: string
  }>
}

/**
 * Error Boundary 컴포넌트 (클래스 컴포넌트)
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: ErrorInfo) => void },
  { hasError: boolean; error: ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode; onError: (error: ErrorInfo) => void }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: ErrorInfo } {
    return {
      hasError: true,
      error: {
        message: error.message || '알 수 없는 오류가 발생했습니다.',
        stack: error.stack,
      },
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError({
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      stack: error.stack,
    })
  }

  componentDidUpdate(prevProps: { children: React.ReactNode }) {
    // 코드가 변경되면 에러 상태 초기화
    if (prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
            <h3 className="mb-2 text-lg font-semibold">렌더링 오류</h3>
            <p className="mb-4 text-sm text-muted-foreground" role="alert">
              {this.state.error.message}
            </p>
            {this.state.error.stack && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  상세 오류 정보
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * React JSX 코드를 HTML로 변환하는 유틸리티
 * - onClick={...} → onclick="..."
 * - tabIndex={0} → tabindex="0"
 * - htmlFor → for
 * - className → class
 * - 기타 React 속성을 HTML 속성으로 변환
 */
function convertReactJSXToHTML(code: string): string {
  let html = code

  // className → class
  html = html.replace(/\bclassName\s*=\s*["']([^"']+)["']/g, 'class="$1"')
  html = html.replace(/\bclassName\s*=\s*\{["']([^"']+)["']\}/g, 'class="$1"')

  // htmlFor → for
  html = html.replace(/\bhtmlFor\s*=\s*["']([^"']+)["']/g, 'for="$1"')
  html = html.replace(/\bhtmlFor\s*=\s*\{["']([^"']+)["']\}/g, 'for="$1"')

  // tabIndex={0} 또는 tabIndex="0" → tabindex="0"
  html = html.replace(/\btabIndex\s*=\s*\{0\}/g, 'tabindex="0"')
  html = html.replace(/\btabIndex\s*=\s*["']0["']/g, 'tabindex="0"')
  html = html.replace(/\btabIndex\s*=\s*\{-1\}/g, 'tabindex="-1"')
  html = html.replace(/\btabIndex\s*=\s*["']-1["']/g, 'tabindex="-1"')

  // onClick → onclick (간단한 함수만 처리)
  // onClick={() => alert("...")} → onclick="alert('...')"
  html = html.replace(
    /\bonClick\s*=\s*\{\(\)\s*=>\s*alert\(["']([^"']+)["']\)\}/g,
    'onclick="alert(\'$1\')"'
  )
  // onClick={() => ...} → onclick="..." (일반적인 경우는 주석 처리)
  html = html.replace(/\bonClick\s*=\s*\{[^}]+\}/g, (match) => {
    // 복잡한 함수는 제거하고 주석으로 표시
    return '<!-- onClick handler removed (not supported in HTML) -->'
  })

  // onKeyDown → onkeydown (간단한 경우만)
  html = html.replace(/\bonKeyDown\s*=\s*\{[^}]+\}/g, (match) => {
    // 복잡한 함수는 제거
    return '<!-- onKeyDown handler removed (not supported in HTML) -->'
  })

  // 자체 닫힘 태그 처리: <img /> → <img>
  html = html.replace(/<(\w+)([^>]*)\s*\/>/g, '<$1$2>')

  // 중괄호로 감싸진 문자열 속성 처리: {0} → "0"
  html = html.replace(/\{(\d+)\}/g, '"$1"')
  html = html.replace(/\{["']([^"']+)["']\}/g, '"$1"')

  return html
}

function isElementFocusable(el: Element): boolean {
  const element = el as HTMLElement
  const tag = element.tagName.toLowerCase()

  if (element.hasAttribute('disabled')) return false

  const tabIndexAttr = element.getAttribute('tabindex')
  if (tabIndexAttr !== null) {
    const n = Number(tabIndexAttr)
    if (!Number.isNaN(n)) return n >= 0
  }

  if (tag === 'a') return Boolean((element as HTMLAnchorElement).href)
  if (tag === 'button') return true
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return true
  if (element.getAttribute('contenteditable') === 'true') return true

  const role = element.getAttribute('role')
  if (role === 'button' || role === 'link' || role === 'checkbox' || role === 'tab') return true

  return false
}

function safeSelector(el: Element): string {
  const element = el as HTMLElement
  if (element.id) return `#${CSS.escape(element.id)}`

  // data-testid 같은 안정적인 식별자가 있으면 우선 사용
  const testId = element.getAttribute('data-testid')
  if (testId) return `[data-testid="${CSS.escape(testId)}"]`

  const tag = element.tagName.toLowerCase()
  const role = element.getAttribute('role')
  const name = (element.getAttribute('aria-label') || element.getAttribute('name') || '').trim()

  // 너무 긴 selector를 피하기 위해 핵심 속성만 사용
  const parts: string[] = [tag]
  if (role) parts.push(`[role="${CSS.escape(role)}"]`)
  if (name) parts.push(`[aria-label="${CSS.escape(name)}"]`)

  return parts.join('')
}

function injectHighlightStyles(doc: Document) {
  const id = '__a11ygym_highlight_style__'
  if (doc.getElementById(id)) return
  const style = doc.createElement('style')
  style.id = id
  style.textContent = `
    [data-a11ygym-highlight="true"] { outline: 3px solid #ef4444 !important; outline-offset: 2px !important; }
    [data-a11ygym-axe="true"] { outline: 3px dashed #f59e0b !important; outline-offset: 2px !important; }
  `
  doc.head.appendChild(style)
}

function clearHighlights(doc: Document) {
  doc.querySelectorAll('[data-a11ygym-highlight="true"]').forEach((el) => {
    ;(el as HTMLElement).removeAttribute('data-a11ygym-highlight')
  })
  doc.querySelectorAll('[data-a11ygym-axe="true"]').forEach((el) => {
    ;(el as HTMLElement).removeAttribute('data-a11ygym-axe')
  })
}

/**
 * 코드를 안전하게 렌더링하는 미리보기 패널
 * - iframe을 사용하여 사용자 코드를 격리된 환경에서 실행
 * - Error Boundary로 런타임 에러 처리
 * - React JSX 코드를 HTML로 변환하여 렌더링
 */
export function PreviewPanel({ code, className }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState<PreviewTab>('render')
  const [a11yTree, setA11yTree] = useState<A11yNode[]>([])
  const [issues, setIssues] = useState<AxeIssue[]>([])
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    setIsLoading(true)
    setError(null)
    setAnalysisError(null)
    setA11yTree([])
    setIssues([])

    try {
      // React JSX를 HTML로 변환
      const htmlCode = convertReactJSXToHTML(code)

      // iframe 내부 문서에 코드 주입
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        throw new Error('iframe 문서에 접근할 수 없습니다.')
      }

      const iframeWindow = iframe.contentWindow
      if (!iframeWindow) {
        throw new Error('iframe 윈도우에 접근할 수 없습니다.')
      }

      // iframe 내부 에러 리스너 설정
      const errorHandler = (event: ErrorEvent) => {
        setError({
          message: event.message || '런타임 오류가 발생했습니다.',
          stack: event.error?.stack,
        })
        setIsLoading(false)
      }

      const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
        setError({
          message: event.reason?.message || 'Promise가 거부되었습니다.',
        })
        setIsLoading(false)
      }

      iframeWindow.addEventListener('error', errorHandler)
      iframeWindow.addEventListener('unhandledrejection', unhandledRejectionHandler)

      const runAnalyses = async () => {
        try {
          injectHighlightStyles(iframeDoc)
          clearHighlights(iframeDoc)

          // A11y Tree(근사): focusable / aria / role 중심으로 요약
          const candidates = Array.from(
            iframeDoc.body.querySelectorAll(
              'a,button,input,select,textarea,[role],[tabindex],[aria-label],[aria-labelledby],[aria-describedby]'
            )
          )

          const nodes: A11yNode[] = candidates
            .filter((el) => el instanceof HTMLElement)
            .slice(0, 200) // 안전장치: 너무 커지면 UI가 무거워짐
            .map((el) => {
              const element = el as HTMLElement
              const role = element.getAttribute('role')
              const name = computeAccessibleName(element) || ''
              const description = computeAccessibleDescription(element) || ''
              const focusable = isElementFocusable(element)
              return {
                selector: safeSelector(element),
                tag: element.tagName.toLowerCase(),
                role,
                name: name.trim(),
                description: description.trim() || undefined,
                focusable,
              }
            })
            // 의미 없는 항목을 줄이기 위해 필터링(이름/role/focusable 중 하나라도 있으면 노출)
            .filter((n) => n.focusable || Boolean(n.role) || Boolean(n.name))

          setA11yTree(nodes)

          // Axe 분석:
          // axe-core는 실행 컨텍스트(window/document)에 강하게 결합되어 있어서
          // 부모(window)에서 import한 axe로 iframe Document를 직접 분석하면
          // 런타임에서 "axe.run arguments are invalid"가 발생할 수 있습니다.
          // 해결: axe 소스를 iframe 내부에 주입한 뒤, iframeWindow.axe.run(...)으로 실행합니다.
          const iframeAxe = (iframeWindow as unknown as { axe?: typeof axe }).axe
          if (!iframeAxe) {
            // eslint-disable-next-line no-eval
            ;(iframeWindow as unknown as { eval: (source: string) => unknown }).eval(axe.source)
          }

          const axeApi = (iframeWindow as unknown as { axe?: typeof axe }).axe
          if (!axeApi?.run) {
            throw new Error('axe를 iframe에 주입하지 못했습니다.')
          }

          const results = await axeApi.run(iframeDoc)

          const v = (results.violations || []) as unknown as AxeIssue[]
          setIssues(v)

          // 하이라이트: 각 violation의 첫 target에 표시(너무 과하면 UI가 난잡해져서 제한)
          const maxToMark = 40
          let marked = 0
          for (const violation of v) {
            for (const node of violation.nodes || []) {
              const selector = node.target?.[0]
              if (!selector) continue
              const el = iframeDoc.querySelector(selector)
              if (el) {
                ;(el as HTMLElement).setAttribute('data-a11ygym-axe', 'true')
                marked++
                if (marked >= maxToMark) break
              }
            }
            if (marked >= maxToMark) break
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : '접근성 분석 중 오류가 발생했습니다.'
          setAnalysisError(msg)
        }
      }

      // iframe 문서 초기화
      iframeDoc.open()
      iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="ko">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: system-ui, -apple-system, sans-serif; padding: 16px; }
              button, [role="button"] { cursor: pointer; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: #f0f0f0; }
              button:hover, [role="button"]:hover { background: #e0e0e0; }
              button:focus, [role="button"]:focus { outline: 2px solid #0066cc; outline-offset: 2px; }
              input, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
              label { display: block; margin-bottom: 4px; font-weight: 500; }
            </style>
          </head>
          <body>
            ${htmlCode}
          </body>
        </html>
      `)
      iframeDoc.close()

      // iframe 로드 완료 후 로딩 상태 해제
      iframe.onload = () => {
        // 렌더 후 분석 실행
        void runAnalyses().finally(() => setIsLoading(false))
      }

      // cleanup
      return () => {
        iframeWindow.removeEventListener('error', errorHandler)
        iframeWindow.removeEventListener('unhandledrejection', unhandledRejectionHandler)
      }
    } catch (err) {
      const errorInfo: ErrorInfo = {
        message: err instanceof Error ? err.message : '코드를 렌더링하는 중 오류가 발생했습니다.',
      }
      setError(errorInfo)
      setIsLoading(false)
    }
  }, [code])

  const highlightBySelector = (selector: string) => {
    const iframe = iframeRef.current
    const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document
    if (!iframeDoc) return
    injectHighlightStyles(iframeDoc)
    iframeDoc.querySelectorAll('[data-a11ygym-highlight="true"]').forEach((el) => {
      ;(el as HTMLElement).removeAttribute('data-a11ygym-highlight')
    })
    const el = iframeDoc.querySelector(selector)
    if (el) {
      ;(el as HTMLElement).setAttribute('data-a11ygym-highlight', 'true')
      ;(el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' })
    }
  }

  return (
    <div className={className}>
      <div className="relative h-full min-h-[300px] rounded-md border bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-sm text-muted-foreground">렌더링 중...</div>
          </div>
        )}

        <ErrorBoundary onError={setError}>
          <Tabs value={tab} onValueChange={(v) => setTab(v as PreviewTab)} className="h-full">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <TabsList className="grid w-full max-w-[360px] grid-cols-3">
                <TabsTrigger value="render">화면</TabsTrigger>
                <TabsTrigger value="a11y">A11y 트리</TabsTrigger>
                <TabsTrigger value="issues">이슈</TabsTrigger>
              </TabsList>
              <div className="text-xs text-muted-foreground">
                {analysisError ? '분석 오류' : `${issues.length}개 이슈`}
              </div>
            </div>

            <TabsContent value="render" className="h-[calc(100%-48px)]">
              {error ? (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <AlertCircle
                      className="mx-auto mb-4 h-12 w-12 text-destructive"
                      aria-hidden="true"
                    />
                    <h3 className="mb-2 text-lg font-semibold">렌더링 오류</h3>
                    <p className="text-sm text-muted-foreground" role="alert">
                      {error.message}
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  title="코드 미리보기"
                  className="h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  aria-label="사용자가 작성한 코드의 렌더링 결과를 표시합니다"
                />
              )}
            </TabsContent>

            <TabsContent value="a11y" className="h-[calc(100%-48px)] overflow-auto p-3">
              {analysisError ? (
                <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
                  접근성 분석 중 오류가 발생했습니다: {analysisError}
                </div>
              ) : a11yTree.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  표시할 접근성 정보가 없습니다. (포커스 가능한 요소/aria/role이 있는 요소가 없어요)
                </div>
              ) : (
                <div className="space-y-2">
                  {a11yTree.map((n, idx) => (
                    <div key={`${n.selector}-${idx}`} className="rounded-md border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {n.role ? `role="${n.role}"` : n.tag}{' '}
                            {n.name ? `· name="${n.name}"` : ''}
                          </div>
                          <div className="mt-1 truncate text-xs text-muted-foreground">
                            {n.focusable ? 'focusable' : 'not focusable'} · {n.selector}
                          </div>
                          {n.description && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              desc: {n.description}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => highlightBySelector(n.selector)}
                        >
                          표시
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="issues" className="h-[calc(100%-48px)] overflow-auto p-3">
              {analysisError ? (
                <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
                  axe 분석 중 오류가 발생했습니다: {analysisError}
                </div>
              ) : issues.length === 0 ? (
                <div className="text-sm text-muted-foreground">현재 치명적인 이슈가 감지되지 않았습니다.</div>
              ) : (
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
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => highlightBySelector(selector)}
                                  >
                                    표시
                                  </Button>
                                ) : null}
                              </div>
                              {n.failureSummary ? (
                                <div className="mt-1 text-xs">{n.failureSummary}</div>
                              ) : null}
                            </div>
                          )
                        })}
                        {v.nodes && v.nodes.length > 5 ? (
                          <div className="text-xs text-muted-foreground">
                            +{v.nodes.length - 5}개 더 있음
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </div>
    </div>
  )
}

