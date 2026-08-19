export const WIDTH_MAP = {
  auto: 'pathable-width-auto',
  full: 'pathable-width-full',
} as const

export type Width = keyof typeof WIDTH_MAP
export type WidthClass<T extends Width> = (typeof WIDTH_MAP)[T]

export function widthClass<T extends Width>(value: T): WidthClass<T>
export function widthClass(value: string): string | undefined
export function widthClass(value?: string | null): string | undefined
export function widthClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (WIDTH_MAP as Record<string, string | undefined>)[value]
}

export const MAX_WIDTH_MAP = {
  mobile: 'pathable-maxw-mobile',
  'mobile-lg': 'pathable-maxw-mobile-lg',
  tablet: 'pathable-maxw-tablet',
  desktop: 'pathable-maxw-desktop',
} as const

export type MaxWidth = keyof typeof MAX_WIDTH_MAP
export type MaxWidthClass<T extends MaxWidth> = (typeof MAX_WIDTH_MAP)[T]

export function maxWidthClass<T extends MaxWidth>(value: T): MaxWidthClass<T>
export function maxWidthClass(value: string): string | undefined
export function maxWidthClass(value?: string | null): string | undefined
export function maxWidthClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (MAX_WIDTH_MAP as Record<string, string | undefined>)[value]
}
