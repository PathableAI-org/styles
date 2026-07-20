import { HTMLAttributes, ReactNode } from 'react'

interface SummaryBoxProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode
  children?: ReactNode
}

export function SummaryBox({
  heading,
  children,
  className = '',
  ...rest
}: SummaryBoxProps) {
  const classes = ['pathable-summary-box', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {heading && <h2 className="pathable-summary-box__heading">{heading}</h2>}
      <div className="pathable-summary-box__text">{children}</div>
    </div>
  )
}
