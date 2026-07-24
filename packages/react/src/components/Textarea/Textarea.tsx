import type { TextareaHTMLAttributes } from 'react'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const BASE_CLASS = 'pathable-textarea'

export function Textarea({ className, ...rest }: TextareaProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return <textarea className={combinedClassName} {...rest} />
}
