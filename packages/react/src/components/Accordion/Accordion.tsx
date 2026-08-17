import { HTMLAttributes, ReactNode, useCallback, useState, useId } from 'react'

/**
 * Isolation contract: this component owns its own disclosure state and renders
 * only `pathable-accordion` classes (never the USWDS `usa-accordion__button`
 * enhancement selectors). The Styles `/js` DOM enhancement runtime therefore
 * cannot bind to it; native React must remain the sole owner of every Accordion
 * interaction. Do not add `usa-accordion__*` classes here, or a dual-owner
 * ambiguity will break the shared behavior-contract guard.
 */

interface AccordionItem {
  id: string
  heading: ReactNode
  content: ReactNode
  disabled?: boolean
}

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[]
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  allowMultiple?: boolean
  onExpandedChange?: (ids: string[]) => void
}

export function Accordion({
  items,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds = [],
  allowMultiple = false,
  onExpandedChange,
  className = '',
  ...rest
}: AccordionProps) {
  const [internalExpandedIds, setInternalExpandedIds] =
    useState<string[]>(defaultExpandedIds)
  const isControlled = controlledExpandedIds !== undefined
  const expandedIds = isControlled ? controlledExpandedIds : internalExpandedIds
  const instanceId = useId()

  const toggleId = useCallback(
    (id: string) => {
      if (isControlled) {
        const next = allowMultiple
          ? controlledExpandedIds!.includes(id)
            ? controlledExpandedIds!.filter((eid) => eid !== id)
            : [...controlledExpandedIds!, id]
          : controlledExpandedIds!.includes(id)
            ? []
            : [id]
        onExpandedChange?.(next)
      } else {
        setInternalExpandedIds((prev) => {
          const next = allowMultiple
            ? prev.includes(id)
              ? prev.filter((eid) => eid !== id)
              : [...prev, id]
            : prev.includes(id)
              ? []
              : [id]
          onExpandedChange?.(next)
          return next
        })
      }
    },
    [isControlled, controlledExpandedIds, allowMultiple, onExpandedChange],
  )

  const classes = ['pathable-accordion', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id)
        const contentId = `accordion-content-${instanceId}-${item.id}`
        const buttonId = `accordion-button-${instanceId}-${item.id}`

        return (
          <div key={item.id}>
            <h3 className="pathable-accordion__heading">
              <button
                id={buttonId}
                className="pathable-accordion__button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) toggleId(item.id)
                }}
                type="button"
              >
                {item.heading}
              </button>
            </h3>
            <div
              id={contentId}
              className="pathable-accordion__content"
              role="region"
              aria-labelledby={buttonId}
              hidden={!isExpanded}
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export type { AccordionItem }
