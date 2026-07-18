import React from 'react'
import PropTypes from 'prop-types'

const PRESENTATION_CLASS = {
  default: '',
  external: 'pathable-link--external',
}

/**
 * @param {object} props
 * @param {'default'|'external'} [props.presentation='default'] - Selects an implemented Link treatment.
 * @param {React.ReactNode} [props.children] - Consumer-supplied link content.
 * @param {string} [props.className=''] - Additional root class names.
 * @param {*} [props.rest] - Valid anchor attributes forwarded to the root element.
 * @returns {React.ReactElement} The Link component.
 */
export function Link({
  presentation = 'default',
  children,
  className = '',
  ...rest
}) {
  const modifier = Object.prototype.hasOwnProperty.call(
    PRESENTATION_CLASS,
    presentation,
  )
    ? PRESENTATION_CLASS[presentation]
    : undefined

  const classes = ['pathable-link', modifier, className]
    .filter(Boolean)
    .join(' ')

  return (
    <a className={classes} {...rest}>
      {children}
    </a>
  )
}

Link.propTypes = {
  presentation: PropTypes.oneOf(['default', 'external']),
  children: PropTypes.node,
  className: PropTypes.string,
}
