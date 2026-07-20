import { HTMLAttributes, ReactNode, useCallback, useState } from 'react'

interface BannerProps extends HTMLAttributes<HTMLElement> {
  summary: ReactNode
  children?: ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  id?: string
}

let bannerIdCounter = 0

export function Banner({
  summary,
  children,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  id: idProp,
  className = '',
  ...rest
}: BannerProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isControlled = controlledExpanded !== undefined
  const isExpanded = isControlled ? controlledExpanded : internalExpanded
  const [baseId] = useState(
    () => idProp || `pathable-banner-${++bannerIdCounter}`,
  )

  const toggle = useCallback(() => {
    const next = !isExpanded
    if (isControlled) {
      onExpandedChange?.(next)
    } else {
      setInternalExpanded(next)
      onExpandedChange?.(next)
    }
  }, [isExpanded, isControlled, onExpandedChange])

  const classes = ['pathable-banner', className].filter(Boolean).join(' ')

  return (
    <section className={classes} {...rest}>
      <div className="pathable-banner__header">
        <div className="pathable-banner__guidance">
          <svg
            className="pathable-banner__lock-image"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <path
              d="M12 2C8.7 2 6 4.7 6 8v2H5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V11c0-.6-.4-1-1-1h-1V8c0-3.3-2.7-6-6-6zm-2 8V8c0-1.1.9-2 2-2s2 .9 2 2v2h-4z"
              fill="currentColor"
            />
          </svg>
          <button
            className="pathable-banner__button"
            aria-expanded={isExpanded}
            aria-controls={`${baseId}-content`}
            onClick={toggle}
            type="button"
          >
            {summary}
          </button>
        </div>
      </div>
      <div
        id={`${baseId}-content`}
        className="pathable-banner__content"
        hidden={!isExpanded}
      >
        {children}
      </div>
    </section>
  )
}
