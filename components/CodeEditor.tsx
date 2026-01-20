'use client'

import { useEffect, useId, useMemo, useRef } from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'

// Prism 언어 로드 (필요한 최소만)
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'

export type CodeEditorLanguage = 'tsx' | 'jsx' | 'html' | 'typescript' | 'javascript'

export interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  readOnly?: boolean
  /**
   * 스크린 리더용 레이블 (기본값 제공)
   */
  ariaLabel?: string
  /**
   * 구문 강조용 언어 (기본값: tsx)
   */
  language?: CodeEditorLanguage
  /**
   * ESC로 포커스 탈출(blur) 기능 사용 여부 (기본값: true)
   */
  enableEscapeToBlur?: boolean
  /**
   * 강조할 라인 번호 배열
   * 예: [3, 5]는 3번째 줄부터 5번째 줄까지 강조
   * 예: [7]은 7번째 줄만 강조
   */
  highlightLines?: number[]
  className?: string
}

function getPrismLanguage(language: CodeEditorLanguage) {
  switch (language) {
    case 'html':
      return Prism.languages.markup
    case 'jsx':
      return Prism.languages.jsx
    case 'tsx':
      return Prism.languages.tsx
    case 'typescript':
      return Prism.languages.typescript
    case 'javascript':
      return Prism.languages.javascript
    default:
      return Prism.languages.tsx
  }
}

export function CodeEditor({
  code,
  onChange,
  readOnly = false,
  ariaLabel = '코드 편집기',
  language = 'tsx',
  enableEscapeToBlur = true,
  highlightLines,
  className,
}: CodeEditorProps) {
  const id = useId()
  const helpId = `${id}-help`
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const highlight = useMemo(() => {
    const prismLang = getPrismLanguage(language)
    return (value: string) => {
      const highlighted = Prism.highlight(value, prismLang, language)
      
      // highlightLines가 있으면 해당 라인에 강조 스타일 적용
      if (highlightLines && highlightLines.length > 0) {
        const lines = highlighted.split('\n')
        const startLine = highlightLines[0] - 1 // 0-based index
        const endLine = highlightLines.length > 1 ? highlightLines[1] - 1 : startLine
        
        return lines
          .map((line, index) => {
            if (index >= startLine && index <= endLine) {
              // 라인 번호만 지정된 경우 해당 라인만 강조
              // 배경색은 CSS로 적용하되, span으로 감싸지 않고 data 속성 사용
              return `<span data-highlight-line="true">${line}</span>`
            }
            return line
          })
          .join('\n')
      }
      
      return highlighted
    }
  }, [language, highlightLines])

  // react-simple-code-editor는 textareaProps/textareaRef를 공식적으로 지원하지 않고,
  // unknown props는 wrapper div로 전달되어 React 경고를 유발할 수 있습니다.
  // 따라서 textareaId로 실제 textarea를 찾아 필요한 접근성 속성을 부여합니다.
  useEffect(() => {
    const el = document.getElementById(id) as HTMLTextAreaElement | null
    if (!el) return

    textareaRef.current = el

    el.setAttribute('aria-label', ariaLabel)
    el.setAttribute('aria-describedby', helpId)
    el.setAttribute('aria-multiline', 'true')
    el.setAttribute('aria-roledescription', 'code editor')
    el.setAttribute('role', 'textbox')
    el.spellcheck = false
    el.autocapitalize = 'off'
    // DOM typings에서 autocorrect는 표준 속성이 아니라 boolean처럼 잡히는 환경이 있어
    // attribute로 설정합니다.
    el.setAttribute('autocorrect', 'off')

    const onKeyDown = (e: KeyboardEvent) => {
      if (!enableEscapeToBlur) return
      if (e.key === 'Escape') {
        e.preventDefault()
        el.blur()
      }
    }

    el.addEventListener('keydown', onKeyDown)
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [ariaLabel, enableEscapeToBlur, helpId, id])

  return (
    <div className={className}>
      {/* 스크린 리더용 도움말 (필요 시 UI에서 숨기고 읽히게) */}
      <p id={helpId} className="sr-only">
        코드 입력 영역입니다. 종료하려면 ESC 키를 누르세요.
      </p>

      <div className="rounded-md border bg-background">
        <Editor
          value={code}
          onValueChange={onChange}
          highlight={highlight}
          padding={16}
          textareaId={id}
          readOnly={readOnly}
          className={[
            // Editor root
            'min-h-[220px] max-h-[600px] overflow-auto font-mono text-sm leading-6',
            // focus ring
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          ].join(' ')}
          // code element 스타일
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 14,
          }}
        />
      </div>
    </div>
  )
}


