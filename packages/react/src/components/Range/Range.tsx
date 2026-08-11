import type { InputHTMLAttributes } from 'react'

export type RangeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'defaultValue' | 'type' | 'value'
> & {
  readonly defaultValue?: number | string
  readonly value?: number | string
}

const BASE_CLASS = 'pathable-range'

export function Range({
  className,
  children: _children,
  ...rest
}: RangeProps & { readonly children?: never }) {
  const combinedClassName = [BASE_CLASS, className].filter(Boolean).join(' ')

  return (
    <input
      {...rest}
      type="range"
      className={combinedClassName}
      data-react-owned="true"
    />
  )
}
