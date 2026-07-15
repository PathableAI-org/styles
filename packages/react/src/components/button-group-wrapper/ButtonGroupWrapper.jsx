import React from 'react'

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function ButtonGroupWrapper({ children, className }) {
  const classes = ['pathable-button-group', className].filter(Boolean).join(' ')
  return <ul className={classes}>{children}</ul>
}
