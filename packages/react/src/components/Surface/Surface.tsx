import React, { ElementType, ReactNode, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'
import {
  surfaceToneClass,
  surfaceBorderToneClass,
} from '../../internal/resolvers/tone.js'
import {
  surfaceElevationClass,
  type SurfaceElevation,
} from '../../internal/resolvers/surface.js'
import { widthClass, maxWidthClass } from '../../internal/resolvers/sizing.js'
import {
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
} from '../../internal/resolvers/spacing.js'
import type {
  SizingProps,
  SpacingProps,
  SurfaceTone,
  BorderTone,
} from '../../internal/resolvers/types.js'

export interface SurfaceProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    SizingProps,
    Omit<SpacingProps, 'padding' | 'paddingX' | 'paddingY'> {
  /** Semantic surface treatment. Selects a coordinated foreground, background,
   *  and border. Value type is the shared SurfaceTone union. */
  variant?: SurfaceTone
  /** Semantic boundary meaning. Refines the border color. */
  borderTone?: BorderTone
  /** Verified elevation step, mapped to --elevation-*. */
  elevation?: SurfaceElevation
  /** Polymorphic element override. Defaults to 'div'. */
  as?: ElementType
  /** Consumer class name. Appended after design-system classes. */
  className?: string
  /** Surface content. */
  children?: ReactNode
}

function SurfaceInner(
  {
    as,
    variant,
    borderTone,
    elevation,
    children,
    className = '',
    width,
    maxWidth,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    ...rest
  }: SurfaceProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const Component = as ?? 'div'
  const tone = variant ?? 'default'

  const classes = mergeClasses(
    'pathable-surface',
    surfaceToneClass(tone),
    surfaceElevationClass(elevation),
    surfaceBorderToneClass(borderTone),
    widthClass(width),
    maxWidthClass(maxWidth),
    marginAllClass(margin),
    marginXClass(marginX),
    marginYClass(marginY),
    marginTopClass(marginTop),
    marginBottomClass(marginBottom),
    className,
  )

  return (
    <Component className={classes} ref={ref} {...rest}>
      {children}
    </Component>
  )
}

export const Surface = forwardRef<HTMLElement, SurfaceProps>(SurfaceInner)
