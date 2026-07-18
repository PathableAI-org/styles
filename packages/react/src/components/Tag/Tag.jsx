import React from 'react'
import PropTypes from 'prop-types'

const SIZE_CLASS = {
  default: '',
  big: 'pathable-tag--big',
}

/**
 * @param {object} props
 * @param {'default'|'big'} [props.size='default'] - Selects an implemented Tag size.
 * @param {React.ReactNode} [props.children] - Consumer-supplied inline content.
 * @param {string} [props.className=''] - Additional root class names.
 * @param {*} [props.rest] - Valid span attributes forwarded to the root element.
 * @returns {React.ReactElement} The Tag component.
 */
export function Tag({ size = 'default', children, className = '', ...rest }) {
  const modifier = Object.prototype.hasOwnProperty.call(SIZE_CLASS, size)
    ? SIZE_CLASS[size]
    : undefined

  const classes = ['pathable-tag', modifier, className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}

Tag.propTypes = {
  size: PropTypes.oneOf(['default', 'big']),
  children: PropTypes.node,
  className: PropTypes.string,
}
