'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'

export interface PreviewPanelProps {
  code: string
  className?: string
}

interface ErrorInfo {
  message: string
  stack?: string
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
 * 코드를 안전하게 렌더링하는 미리보기 패널
 * - iframe을 사용하여 사용자 코드를 격리된 환경에서 실행
 * - Error Boundary로 런타임 에러 처리
 */
export function PreviewPanel({ code, className }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    setIsLoading(true)
    setError(null)

    try {
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

      iframeWindow.addEventListener('error', errorHandler)
      iframeWindow.addEventListener('unhandledrejection', (event) => {
        setError({
          message: event.reason?.message || 'Promise가 거부되었습니다.',
        })
        setIsLoading(false)
      })

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
            </style>
          </head>
          <body>
            ${code}
          </body>
        </html>
      `)
      iframeDoc.close()

      // iframe 로드 완료 후 로딩 상태 해제
      iframe.onload = () => {
        setIsLoading(false)
      }

      // cleanup
      return () => {
        iframeWindow.removeEventListener('error', errorHandler)
      }
    } catch (err) {
      const errorInfo: ErrorInfo = {
        message: err instanceof Error ? err.message : '코드를 렌더링하는 중 오류가 발생했습니다.',
      }
      setError(errorInfo)
      setIsLoading(false)
    }
  }, [code])

  return (
    <div className={className}>
      <div className="relative h-full min-h-[300px] rounded-md border bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-sm text-muted-foreground">렌더링 중...</div>
          </div>
        )}

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
      </div>
    </div>
  )
}

