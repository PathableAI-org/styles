import type { HTMLAttributes, ReactNode } from 'react'

export type IconTileSize = 'compact' | 'default' | 'large'
export type IconTileShape = 'square' | 'circle'
export type IconTileStatus =
  'default' | 'success' | 'error' | 'warning' | 'info'

export type IconTileProps = Readonly<HTMLAttributes<HTMLSpanElement>> & {
  readonly size?: IconTileSize
  readonly shape?: IconTileShape
  readonly status?: IconTileStatus
  readonly children: ReactNode
}

const ROOT_CLASS = 'pathable-icon-tile'

const SIZE_CLASS: Record<IconTileSize, string> = {
  compact: 'pathable-icon-tile--compact',
  default: '',
  large: 'pathable-icon-tile--large',
}

const SHAPE_CLASS: Record<IconTileShape, string> = {
  square: '',
  circle: 'pathable-icon-tile--circle',
}

const STATUS_CLASS: Record<IconTileStatus, string> = {
  default: '',
  success: 'pathable-icon-tile--success',
  error: 'pathable-icon-tile--error',
  warning: 'pathable-icon-tile--warning',
  info: 'pathable-icon-tile--info',
}

function getMappedClass<T extends string>(
  map: Record<T, string>,
  value: T,
): string {
  return Object.prototype.hasOwnProperty.call(map, value) ? map[value] : ''
}

export function IconTile({
  size = 'default',
  shape = 'square',
  status = 'default',
  className,
  children,
  ...rest
}: IconTileProps) {
  const classes = [
    ROOT_CLASS,
    getMappedClass(SIZE_CLASS, size),
    getMappedClass(SHAPE_CLASS, shape),
    getMappedClass(STATUS_CLASS, status),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span {...rest} className={classes}>
      {children}
    </span>
  )
}
