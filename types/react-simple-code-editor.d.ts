declare module 'react-simple-code-editor' {
  import * as React from 'react'

  export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    onValueChange: (value: string) => void
    highlight: (value: string) => React.ReactNode
    padding?: number
    tabSize?: number
    insertSpaces?: boolean
    ignoreTabKey?: boolean
    style?: React.CSSProperties
    className?: string
    preClassName?: string
    textareaId?: string
    readOnly?: boolean
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
    /**
     * 라이브러리 런타임은 지원하지만 타입 정의가 빠진 경우가 있어 보완합니다.
     */
    textareaRef?: (textarea: HTMLTextAreaElement) => void
  }

  const Editor: React.FC<EditorProps>
  export default Editor
}


