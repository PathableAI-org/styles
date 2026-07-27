import type { InputHTMLAttributes } from 'react'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'children'>

const BASE_CLASS = 'pathable-input'

export function Input({
  className,
  children: _children,
  ...rest
}: InputProps & { children?: never }) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return <input className={combinedClassName} {...rest} />
}
