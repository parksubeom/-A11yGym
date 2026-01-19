'use client'

import { useId, useMemo, useRef } from 'react'
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
  className,
}: CodeEditorProps) {
  const id = useId()
  const helpId = `${id}-help`
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const highlight = useMemo(() => {
    const prismLang = getPrismLanguage(language)
    return (value: string) => Prism.highlight(value, prismLang, language)
  }, [language])

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
          textareaRef={(el) => {
            textareaRef.current = el
          }}
          readOnly={readOnly}
          // 접근성: textarea 기반이므로 role을 명시하고, 설명 연결
          textareaProps={{
            'aria-label': ariaLabel,
            'aria-describedby': helpId,
            role: 'textbox',
            'aria-multiline': true,
            'aria-roledescription': 'code editor',
            spellCheck: false,
            autoCapitalize: 'off',
            autoCorrect: 'off',
            onKeyDown: (e) => {
              // 키보드 트랩 방지: ESC로 포커스 탈출
              if (enableEscapeToBlur && e.key === 'Escape') {
                e.preventDefault()
                textareaRef.current?.blur()
              }
            },
          }}
          className={[
            // Editor root
            'min-h-[220px] font-mono text-sm leading-6',
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


