import type { HTMLAttributes } from 'react'

export type SkeletonVariant =
  'text-heading' | 'text-body' | 'avatar' | 'card' | 'table-row' | 'row'

export interface SkeletonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-hidden' | 'contentEditable' | 'tabIndex'
> {
  readonly variant?: SkeletonVariant
}

const VARIANT_CLASS = {
  'text-heading': 'pathable-skeleton--text-heading',
  'text-body': 'pathable-skeleton--text-body',
  avatar: 'pathable-skeleton--avatar',
  card: 'pathable-skeleton--card',
  'table-row': 'pathable-skeleton--table-row',
  row: 'pathable-skeleton--row',
} as const satisfies Record<SkeletonVariant, string>

function isSkeletonVariant(value: string): value is SkeletonVariant {
  return Object.prototype.hasOwnProperty.call(VARIANT_CLASS, value)
}

export function Skeleton({
  variant,
  children,
  className,
  ...rest
}: SkeletonProps) {
  const variantClass =
    variant && isSkeletonVariant(variant) ? VARIANT_CLASS[variant] : undefined
  const classes = ['pathable-skeleton', variantClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      {...rest}
      className={classes}
      aria-hidden="true"
      contentEditable={false}
      tabIndex={undefined}
    >
      {children}
    </div>
  )
}
