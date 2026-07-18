import { TableHTMLAttributes, ReactNode } from 'react'

type TablePresentation = 'default' | 'borderless' | 'compact' | 'striped'

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  presentation?: TablePresentation
  children?: ReactNode
}

const BASE_CLASS = 'pathable-table'

const presentationModifierMap: Record<
  Exclude<TablePresentation, 'default'>,
  string
> = {
  borderless: 'pathable-table--borderless',
  compact: 'pathable-table--compact',
  striped: 'pathable-table--striped',
}

export function Table({
  children,
  className,
  presentation = 'default',
  ...rest
}: TableProps) {
  const modifier = Object.prototype.hasOwnProperty.call(
    presentationModifierMap,
    presentation,
  )
    ? presentationModifierMap[
        presentation as Exclude<TablePresentation, 'default'>
      ]
    : undefined
  const presentationClass = modifier ? `${BASE_CLASS} ${modifier}` : BASE_CLASS

  const combinedClassName = `${presentationClass} ${className || ''}`.trim()

  return (
    <table className={combinedClassName} {...rest}>
      {children}
    </table>
  )
}
