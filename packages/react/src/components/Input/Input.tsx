import type { InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const BASE_CLASS = 'pathable-input'

export function Input({ className, ...rest }: InputProps) {
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()

  return <input className={combinedClassName} {...rest} />
}
