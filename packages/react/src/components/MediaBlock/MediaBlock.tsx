import { Children } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

export type MediaBlockProps = Readonly<
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>
> & {
  readonly media: ReactNode
  readonly title?: ReactNode
  readonly description?: ReactNode
  readonly children?: ReactNode
}

function hasContent(content: ReactNode): boolean {
  return Children.toArray(content).some(
    (child) => typeof child !== 'string' || child.trim().length > 0,
  )
}

export function MediaBlock({
  media,
  title,
  description,
  children,
  className,
  ...rest
}: MediaBlockProps) {
  const classes = ['pathable-media-block', className].filter(Boolean).join(' ')
  const hasBody =
    hasContent(title) || hasContent(description) || hasContent(children)

  return (
    <div className={classes} {...rest}>
      <div className="pathable-media-block__media">{media}</div>
      {hasBody ? (
        <div className="pathable-media-block__body">
          {hasContent(title) ? (
            <div className="pathable-media-block__title">{title}</div>
          ) : null}
          {hasContent(description) ? (
            <div className="pathable-media-block__description">
              {description}
            </div>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  )
}
