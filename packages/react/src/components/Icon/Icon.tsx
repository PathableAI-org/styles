import type { SVGAttributes } from 'react'

export type IconProps = Readonly<SVGAttributes<SVGSVGElement>>

export function Icon({
  className,
  viewBox = '0 0 24 24',
  'aria-hidden': ariaHidden = true,
  focusable = 'false',
  children,
  ...rest
}: IconProps) {
  const classes = ['pathable-icon', className].filter(Boolean).join(' ')

  return (
    <svg
      {...rest}
      className={classes}
      viewBox={viewBox}
      aria-hidden={ariaHidden}
      focusable={focusable}
    >
      {children}
    </svg>
  )
}
