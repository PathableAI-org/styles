import { HTMLAttributes, ReactNode } from 'react'

interface ProcessItem {
  id: string
  heading: ReactNode
  body: ReactNode
}

interface ProcessListProps extends HTMLAttributes<HTMLOListElement> {
  items: ProcessItem[]
}

export function ProcessList({
  items,
  className = '',
  ...rest
}: ProcessListProps) {
  const classes = ['pathable-process-list', className].filter(Boolean).join(' ')

  return (
    <ol className={classes} {...rest}>
      {items.map((item) => (
        <li key={item.id} className="pathable-process-list__item">
          <h4 className="pathable-process-list__heading">{item.heading}</h4>
          {item.body}
        </li>
      ))}
    </ol>
  )
}

export type { ProcessItem }
