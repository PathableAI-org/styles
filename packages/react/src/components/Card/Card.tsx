import { HTMLAttributes, ReactNode } from 'react'

type CardPresentation = 'base' | 'media' | 'flag' | 'header-first' | 'workflow'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  footer?: ReactNode
  media?: ReactNode
  presentation?: CardPresentation
  metadata?: ReactNode
  status?: ReactNode
  actions?: ReactNode
}

const PRESENTATION_CLASS: Record<CardPresentation, string> = {
  base: '',
  media: 'pathable-card--media',
  flag: 'pathable-card--flag',
  'header-first': 'pathable-card--header-first',
  workflow: 'pathable-card--workflow',
}

function hasContent(value: unknown): boolean {
  return value !== null && value !== undefined && value !== false
}

function resolvePresentation(
  presentation: string,
  {
    media,
    metadata,
    status,
    actions,
  }: Pick<CardProps, 'media' | 'metadata' | 'status' | 'actions'>,
): CardPresentation {
  if (Object.prototype.hasOwnProperty.call(PRESENTATION_CLASS, presentation)) {
    return presentation as CardPresentation
  }

  if (hasContent(metadata) || hasContent(status) || hasContent(actions)) {
    return 'workflow'
  }

  if (hasContent(media)) {
    return 'media'
  }

  return 'base'
}

function CardTitle({
  children,
  workflow = false,
}: {
  children?: ReactNode
  workflow?: boolean
}) {
  if (!hasContent(children)) {
    return null
  }

  return workflow ? (
    <h3 className="pathable-card__heading">{children}</h3>
  ) : (
    <h3 className="pathable-card__header">{children}</h3>
  )
}

function CardMedia({ children }: { children?: ReactNode }) {
  if (!hasContent(children)) {
    return null
  }

  return <div className="pathable-card__media">{children}</div>
}

function CardBody({
  children,
  title,
}: {
  children?: ReactNode
  title?: ReactNode
}) {
  if (!hasContent(children) && !hasContent(title)) {
    return null
  }

  return (
    <div className="pathable-card__body">
      <CardTitle>{title}</CardTitle>
      {children}
    </div>
  )
}

function CardFooter({ children }: { children?: ReactNode }) {
  if (!hasContent(children)) {
    return null
  }

  return <div className="pathable-card__footer">{children}</div>
}

function WorkflowCardBody({
  children,
  metadata,
  actions,
}: {
  children?: ReactNode
  metadata?: ReactNode
  actions?: ReactNode
}) {
  if (!hasContent(children) && !hasContent(metadata) && !hasContent(actions)) {
    return null
  }

  return (
    <div className="pathable-card__body">
      {children}
      {hasContent(metadata) ? (
        <div className="pathable-card__meta">{metadata}</div>
      ) : null}
      {hasContent(actions) ? (
        <div className="pathable-card__action">{actions}</div>
      ) : null}
    </div>
  )
}

export function Card({
  children,
  className = '',
  title,
  footer,
  media,
  presentation = 'base',
  metadata,
  status,
  actions,
  ...rest
}: CardProps) {
  const resolvedPresentation = resolvePresentation(presentation, {
    media,
    metadata,
    status,
    actions,
  })
  const presentationClass = PRESENTATION_CLASS[resolvedPresentation]
  const classes = ['pathable-card', presentationClass, className]
    .filter(Boolean)
    .join(' ')

  if (resolvedPresentation === 'workflow') {
    return (
      <div className={classes} {...rest}>
        <div className="pathable-card__container">
          {hasContent(title) || hasContent(status) ? (
            <div className="pathable-card__header">
              <CardTitle workflow>{title}</CardTitle>
              {hasContent(status) ? (
                <span className="pathable-card__status">{status}</span>
              ) : null}
            </div>
          ) : null}
          <WorkflowCardBody metadata={metadata} actions={actions}>
            {children}
          </WorkflowCardBody>
          <CardFooter>{footer}</CardFooter>
        </div>
      </div>
    )
  }

  return (
    <div className={classes} {...rest}>
      <CardMedia>{media}</CardMedia>
      <CardBody title={title}>{children}</CardBody>
      <CardFooter>{footer}</CardFooter>
    </div>
  )
}
