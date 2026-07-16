import React from 'react'

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {*} [props.rest] - Any other props (aria-*, data-*, etc.) to spread onto the container.
 */
export function ButtonGroup({ children, className, ...rest }) {
  const classes = ['pathable-button-group', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
