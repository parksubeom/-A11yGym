declare module 'react-simple-code-editor' {
  import * as React from 'react'

  /**
   * react-simple-code-editor는 기본적으로 textarea 기반이며,
   * 알 수 없는 props는 wrapper div로 전달됩니다(React warning 유발 가능).
   * 실제 라이브러리(lib/index.js)에서 구조분해로 지원하는 props만 타입에 반영합니다.
   */
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
    textareaClassName?: string
    readOnly?: boolean

    // 아래는 textarea에 직접 전달되는 것으로 라이브러리가 지원하는 범위(구조분해 후 textarea에 전달)
    autoFocus?: boolean
    disabled?: boolean
    form?: string
    maxLength?: number
    minLength?: number
    name?: string
    placeholder?: string
    required?: boolean
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
    onClick?: React.MouseEventHandler<HTMLTextAreaElement>
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
    onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>
  }

  const Editor: React.ForwardRefExoticComponent<
    EditorProps & React.RefAttributes<{ session: unknown }>
  >
  export default Editor
}


