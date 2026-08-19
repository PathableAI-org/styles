export const ALIGN_ITEMS_MAP = {
  center: 'pathable-flex-align-center',
  start: 'pathable-flex-align-start',
  end: 'pathable-flex-align-end',
  stretch: 'pathable-flex-align-stretch',
  baseline: 'pathable-flex-align-baseline',
} as const

export type AlignItems = keyof typeof ALIGN_ITEMS_MAP
export type AlignItemsClass<T extends AlignItems> = (typeof ALIGN_ITEMS_MAP)[T]

export function alignItemsClass<T extends AlignItems>(
  value: T,
): AlignItemsClass<T>
export function alignItemsClass(value: string): string | undefined
export function alignItemsClass(value?: string | null): string | undefined
export function alignItemsClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (ALIGN_ITEMS_MAP as Record<string, string | undefined>)[value]
}

export const JUSTIFY_CONTENT_MAP = {
  center: 'pathable-flex-justify-center',
  start: 'pathable-flex-justify-start',
  end: 'pathable-flex-justify-end',
  between: 'pathable-flex-justify-between',
  around: 'pathable-flex-justify-around',
} as const

export type JustifyContent = keyof typeof JUSTIFY_CONTENT_MAP
export type JustifyContentClass<T extends JustifyContent> =
  (typeof JUSTIFY_CONTENT_MAP)[T]

export function justifyContentClass<T extends JustifyContent>(
  value: T,
): JustifyContentClass<T>
export function justifyContentClass(value: string): string | undefined
export function justifyContentClass(value?: string | null): string | undefined
export function justifyContentClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (JUSTIFY_CONTENT_MAP as Record<string, string | undefined>)[value]
}

export const TEXT_ALIGN_MAP = {
  center: 'pathable-text-center',
  left: 'pathable-text-left',
  right: 'pathable-text-right',
} as const

export type TextAlign = keyof typeof TEXT_ALIGN_MAP
export type TextAlignClass<T extends TextAlign> = (typeof TEXT_ALIGN_MAP)[T]

export function textAlignClass<T extends TextAlign>(value: T): TextAlignClass<T>
export function textAlignClass(value: string): string | undefined
export function textAlignClass(value?: string | null): string | undefined
export function textAlignClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (TEXT_ALIGN_MAP as Record<string, string | undefined>)[value]
}
