import type { TextareaHTMLAttributes } from 'react'

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'children'
>

const BASE_CLASS = 'pathable-textarea'

export function Textarea({
  className,
  children: _children,
  ...rest
}: TextareaProps & { children?: never }) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return <textarea className={combinedClassName} {...rest} />
}
