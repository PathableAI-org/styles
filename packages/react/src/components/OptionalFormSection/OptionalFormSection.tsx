'use client'

import { useId, useState, type HTMLAttributes, type ReactNode } from 'react'

export type OptionalFormSectionHeadingLevel = 2 | 3 | 4 | 5 | 6

export interface OptionalFormSectionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children: ReactNode
  heading: string
  headingLevel: OptionalFormSectionHeadingLevel
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

const HEADING_ELEMENTS = {
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const

export function OptionalFormSection({
  children,
  heading,
  headingLevel,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  className,
  ...rest
}: OptionalFormSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const generatedId = useId()

  if (typeof heading !== 'string' || heading.trim().length === 0) {
    throw new TypeError(
      'OptionalFormSection heading must be a non-empty string.',
    )
  }
  if (!Number.isInteger(headingLevel) || headingLevel < 2 || headingLevel > 6) {
    throw new TypeError(
      'OptionalFormSection headingLevel must be an integer from 2 through 6.',
    )
  }

  const isControlled = controlledExpanded !== undefined
  const isExpanded = isControlled ? controlledExpanded : internalExpanded
  const buttonId = `${generatedId}-button`
  const panelId = `${generatedId}-panel`
  const Heading = HEADING_ELEMENTS[headingLevel]
  const classes = ['pathable-optional-form-section', className]
    .filter(Boolean)
    .join(' ')

  function toggleExpanded() {
    const nextExpanded = !isExpanded
    if (!isControlled) setInternalExpanded(nextExpanded)
    onExpandedChange?.(nextExpanded)
  }

  return (
    <div className={classes} {...rest}>
      <Heading className="pathable-optional-form-section__heading">
        <button
          id={buttonId}
          className="pathable-optional-form-section__button"
          type="button"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={toggleExpanded}
        >
          <span>{heading}</span>
          <span
            className="pathable-optional-form-section__indicator"
            aria-hidden="true"
          />
        </button>
      </Heading>
      <div
        id={panelId}
        className="pathable-optional-form-section__content"
        role="region"
        aria-labelledby={buttonId}
        hidden={!isExpanded}
      >
        {children}
      </div>
    </div>
  )
}
