import React from 'react'
import PropTypes from 'prop-types'

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {'primary' | 'secondary' | 'accent-cool' | 'accent-warm' | 'outline' | 'inverse' | 'base' | 'unstyled' | 'save' | 'continue' | 'review' | 'destructive' | 'low-emphasis'} [props.variant='primary'] - The visual variant of the button.
 * @param {'default' | 'big'} [props.size='default'] - The size variant of the button.
 * @param {string} [props.className=''] - Additional CSS class names.
 * @param {*} [props.rest={}] - Any other props to spread onto the button element.
 * @returns {React.ReactElement} The Button component.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  ...rest
}) {
  const variants = {
    primary: 'pathable-button--primary',
    secondary: 'pathable-button--secondary',
    'accent-cool': 'pathable-button--accent-cool',
    'accent-warm': 'pathable-button--accent-warm',
    outline: 'pathable-button--outline',
    inverse: 'pathable-button--inverse',
    base: 'pathable-button--base',
    unstyled: 'pathable-button--unstyled',
    save: 'pathable-button--save',
    continue: 'pathable-button--continue',
    review: 'pathable-button--review',
    destructive: 'pathable-button--destructive',
    'low-emphasis': 'pathable-button--low-emphasis',
  }

  const sizes = {
    default: 'pathable-button--size-default',
    big: 'pathable-button--size-big',
  }

  const variantClass = variants[variant] || variants.primary
  const sizeClass = sizes[size] || sizes.default

  return (
    <button
      type="button"
      className={`pathable-button ${variantClass} ${sizeClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent-cool',
    'accent-warm',
    'outline',
    'inverse',
    'base',
    'unstyled',
    'save',
    'continue',
    'review',
    'destructive',
    'low-emphasis',
  ]),
  size: PropTypes.oneOf(['default', 'big']),
  className: PropTypes.string,
}
