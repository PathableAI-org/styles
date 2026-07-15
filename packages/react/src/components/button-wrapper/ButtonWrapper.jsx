import React from 'react'

const VARIANT_CLASS = {
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

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'accent-cool'|'accent-warm'|'outline'|'inverse'|'base'|'unstyled'|'save'|'continue'|'review'|'destructive'|'low-emphasis'} [props.variant='primary']
 * @param {'default'|'big'} [props.size='default']
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {object} [props.rest]
 */
export function ButtonWrapper({
  variant = 'primary',
  size = 'default',
  children,
  className,
  ...rest
}) {
  const classes = [
    'pathable-button',
    VARIANT_CLASS[variant],
    size === 'big' ? 'pathable-button--big' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
