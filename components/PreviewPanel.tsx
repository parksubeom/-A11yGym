`use client`

import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import axe from 'axe-core'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ChallengeAsset } from '@/types/challenge'

export interface PreviewPanelProps {
  code: string
  assets?: ChallengeAsset[]
  className?: string
}

interface ErrorInfo {
  message: string
  stack?: string
}

type PreviewTab = 'render' | 'issues'

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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: ErrorInfo) => void },
  { hasError: boolean; error: ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode; onError: (error: ErrorInfo) => void }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: ErrorInfo } {
    return { hasError: true, error: { message: error.message || '알 수 없는 오류가 발생했습니다.', stack: error.stack } }
  }

  componentDidCatch(error: Error) {
    this.props.onError({ message: error.message || '알 수 없는 오류가 발생했습니다.', stack: error.stack })
  }

  componentDidUpdate(prevProps: { children: React.ReactNode }) {
    if (prevProps.children !== this.props.children) this.setState({ hasError: false, error: null })
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
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function convertReactJSXToHTML(code: string): string {
  let html = code
  html = html.replace(/\bclassName\s*=\s*["']([^"']+)["']/g, 'class="$1"')
  html = html.replace(/\bclassName\s*=\s*\{["']([^"']+)["']\}/g, 'class="$1"')
  html = html.replace(/\bhtmlFor\s*=\s*["']([^"']+)["']/g, 'for="$1"')
  html = html.replace(/\bhtmlFor\s*=\s*\{["']([^"']+)["']\}/g, 'for="$1"')
  html = html.replace(/\btabIndex\s*=\s*\{0\}/g, 'tabindex="0"')
  html = html.replace(/\btabIndex\s*=\s*["']0["']/g, 'tabindex="0"')
  html = html.replace(/\btabIndex\s*=\s*\{-1\}/g, 'tabindex="-1"')
  html = html.replace(/\btabIndex\s*=\s*["']-1["']/g, 'tabindex="-1"')
  html = html.replace(
    /\bonClick\s*=\s*\{\(\)\s*=>\s*alert\(["']([^"']+)["']\)\}/g,
    'onclick="alert(\'$1\')"'
  )
  html = html.replace(/\bonClick\s*=\s*\{[^}]+\}/g, '<!-- onClick handler removed (not supported in HTML) -->')
  html = html.replace(/\bonKeyDown\s*=\s*\{[^}]+\}/g, '<!-- onKeyDown handler removed (not supported in HTML) -->')
  html = html.replace(/<(\w+)([^>]*)\s*\/>/g, '<$1$2>')
  html = html.replace(/\{(\d+)\}/g, '"$1"')
  html = html.replace(/\{["']([^"']+)["']\}/g, '"$1"')
  return html
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

async function waitForStable(doc: Document) {
  await new Promise<void>((r) => requestAnimationFrame(() => r()))
  await new Promise<void>((r) => requestAnimationFrame(() => r()))
  const imgs = Array.from(doc.images || [])
  const pending = imgs.filter((img) => !img.complete)
  if (pending.length === 0) return
  await Promise.race([
    Promise.all(
      pending.map(
        (img) =>
          new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true })
            img.addEventListener('error', () => resolve(), { once: true })
          })
      )
    ),
    new Promise<void>((resolve) => setTimeout(resolve, 1500)),
  ])
}

export function PreviewPanel({ code, assets, className }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState<PreviewTab>('render')
  const [issues, setIssues] = useState<AxeIssue[]>([])
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const axeRunQueueRef = useRef<Promise<unknown>>(Promise.resolve())

  // Assets 이미지 프리로드(선택): 렌더 안정화 도움
  useEffect(() => {
    if (!assets || assets.length === 0) return
    const imageAssets = assets.filter((a) => a.type === 'image')
    void Promise.all(
      imageAssets.map(
        (a) =>
          new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = () => resolve()
            img.src = a.url
          })
      )
    )
  }, [assets])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    setIsLoading(true)
    setError(null)
    setAnalysisError(null)
    setIssues([])

    const htmlCode = convertReactJSXToHTML(code)

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    const iframeWindow = iframe.contentWindow
    if (!iframeDoc || !iframeWindow) {
      setError({ message: 'iframe에 접근할 수 없습니다.' })
      setIsLoading(false)
      return
    }

    const errorHandler = (event: ErrorEvent) => {
      setError({ message: event.message || '런타임 오류가 발생했습니다.', stack: event.error?.stack })
      setIsLoading(false)
    }
    iframeWindow.addEventListener('error', errorHandler)

    // 렌더 주입
    iframeDoc.open()
    iframeDoc.write(`<!DOCTYPE html>
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
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>${htmlCode}</body>
</html>`)
    iframeDoc.close()

    const runAxe = async () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        const win = iframe.contentWindow
        if (!doc || !win) throw new Error('iframe에 접근할 수 없습니다.')

        injectHighlightStyles(doc)
        clearHighlights(doc)
        await waitForStable(doc)

        // axe를 iframe에 주입 (CommonJS shim + eval)
        if (!(win as any).axe?.run) {
          const compatibilityScript = `
            var module = { exports: {} };
            var exports = module.exports;
            var process = { env: { NODE_ENV: 'production' } };
          `
          try {
            ;(win as any).eval(compatibilityScript + axe.source)
          } catch {
            // CDN fallback
            await new Promise<void>((resolve, reject) => {
              const s = doc.createElement('script')
              s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js'
              s.onload = () => resolve()
              s.onerror = () => reject(new Error('CDN 스크립트 로드 실패'))
              doc.head.appendChild(s)
            })
          }
          if (!(win as any).axe?.run && (win as any).module?.exports?.run) {
            ;(win as any).axe = (win as any).module.exports
          }
        }

        const axeApi = (win as any).axe
        if (!axeApi?.run) throw new Error('axe API 초기화 실패')

        const results = await axeApi.run(doc, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        })

        const v = (results.violations || []) as unknown as AxeIssue[]
        setIssues(v)

        // 표시용 마킹(최대 40개)
        let marked = 0
        for (const violation of v) {
          for (const node of violation.nodes || []) {
            const selector = node.target?.[0]
            if (!selector) continue
            const el = doc.querySelector(selector)
            if (el) {
              ;(el as HTMLElement).setAttribute('data-a11ygym-axe', 'true')
              marked++
              if (marked >= 40) break
            }
          }
          if (marked >= 40) break
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setAnalysisError(msg || 'axe 분석 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    // axe.run 동시 실행 방지(큐)
    axeRunQueueRef.current = axeRunQueueRef.current.then(() => runAxe())

    return () => {
      iframeWindow.removeEventListener('error', errorHandler)
    }
  }, [code])

  const highlightBySelector = (selector: string) => {
    const iframe = iframeRef.current
    const doc = iframe?.contentDocument || iframe?.contentWindow?.document
    if (!doc) return
    injectHighlightStyles(doc)
    doc.querySelectorAll('[data-a11ygym-highlight="true"]').forEach((el) => {
      ;(el as HTMLElement).removeAttribute('data-a11ygym-highlight')
    })
    const el = doc.querySelector(selector)
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
              <TabsList className="grid w-full max-w-[280px] grid-cols-2">
                <TabsTrigger value="render">화면</TabsTrigger>
                <TabsTrigger value="issues">이슈</TabsTrigger>
              </TabsList>
              <div className="text-xs text-muted-foreground">
                {analysisError ? '분석 오류' : `${issues.length}개 이슈`}
              </div>
            </div>

            <TabsContent value="render" forceMount className="h-[calc(100%-48px)]">
              {error ? (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
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

            <TabsContent value="issues" forceMount className="h-[calc(100%-48px)] overflow-auto p-3">
              {analysisError ? (
                <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
                  <div className="font-semibold text-destructive">axe 분석 오류</div>
                  <div className="mt-1">{analysisError}</div>
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
              )}
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </div>
    </div>
  )
}

