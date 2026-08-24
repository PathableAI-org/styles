import React, { Children, ReactNode, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type SidebarRatio = '1-1' | '2-1' | '3-1' | '4-1'

const RATIO_CLASS: Record<SidebarRatio, string> = {
  '1-1': 'pathable-sidebar-layout--ratio-1-1',
  '2-1': 'pathable-sidebar-layout--ratio-2-1',
  '3-1': 'pathable-sidebar-layout--ratio-3-1',
  '4-1': 'pathable-sidebar-layout--ratio-4-1',
}

export interface SidebarLayoutProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color'
> {
  ratio?: SidebarRatio
  sidebarFirst?: boolean
  sidebarSticky?: boolean
  className?: string
  children: ReactNode
}

function SidebarLayoutInner(
  {
    ratio = '3-1',
    sidebarFirst = false,
    sidebarSticky = false,
    children,
    className = '',
    ...rest
  }: SidebarLayoutProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const childArray = Children.toArray(children)
  const mainContent = childArray[0]
  const sidebarContent = childArray[1]

  const classes = mergeClasses(
    'pathable-sidebar-layout',
    RATIO_CLASS[ratio],
    sidebarFirst ? 'pathable-sidebar-layout--sidebar-first' : undefined,
    className,
  )

  const sidebarElement = (
    <aside>
      {sidebarSticky ? (
        <div className="pathable-sticky-panel">{sidebarContent}</div>
      ) : (
        sidebarContent
      )}
    </aside>
  )
  const mainElement = <main>{mainContent}</main>

  const firstChild = sidebarFirst ? sidebarElement : mainElement
  const secondChild = sidebarFirst ? mainElement : sidebarElement

  return (
    <div className={classes} ref={ref} {...rest}>
      {firstChild}
      {secondChild}
    </div>
  )
}

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  SidebarLayoutInner,
)
