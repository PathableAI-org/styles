import React from 'react'
import PropTypes from 'prop-types'

const BASE_CLASS = 'pathable-table'

// Map of non-default presentation values to their modifier CSS class names
const presentationModifierMap = {
  borderless: 'pathable-table--borderless',
  compact: 'pathable-table--compact',
  striped: 'pathable-table--striped',
}

export function Table({
  children,
  className,
  presentation = 'default',
  ...rest
}) {
  const modifier = Object.prototype.hasOwnProperty.call(
    presentationModifierMap,
    presentation,
  )
    ? presentationModifierMap[presentation]
    : undefined
  const presentationClass = modifier ? `${BASE_CLASS} ${modifier}` : BASE_CLASS

  // Combine the presentation class with any additional provided classes
  // The rest operator includes standard HTML attributes like 'id', 'aria-*', 'data-*', etc.
  const combinedClassName = `${presentationClass} ${className || ''}`.trim()

  return (
    <table className={combinedClassName} {...rest}>
      {children}
    </table>
  )
}

Table.propTypes = {
  /**
   * The content of the table, typically including thead, tbody, etc.
   * This component is designed to wrap native table elements and preserve their structure.
   */
  children: PropTypes.node,
  /**
   * Additional CSS class names to apply to the table element.
   */
  className: PropTypes.string,
  /**
   * The visual presentation of the table. Supported values are 'default', 'borderless', 'compact', and 'striped'.
   * Unsupported values will gracefully fall back to the 'default' presentation.
   */
  presentation: PropTypes.oneOf([
    'default',
    'borderless',
    'compact',
    'striped',
  ]),
}
