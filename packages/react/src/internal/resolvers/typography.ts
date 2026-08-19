export const FONT_FAMILY_MAP = {
  heading: 'pathable-font-family-heading',
  body: 'pathable-font-family-body',
  mono: 'pathable-font-family-mono',
  alt: 'pathable-font-family-alt',
} as const

export type FontFamily = keyof typeof FONT_FAMILY_MAP
export type FontFamilyClass<T extends FontFamily> = (typeof FONT_FAMILY_MAP)[T]

export function fontFamilyClass<T extends FontFamily>(
  value: T,
): FontFamilyClass<T>
export function fontFamilyClass(value: string): string | undefined
export function fontFamilyClass(value?: string | null): string | undefined
export function fontFamilyClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (FONT_FAMILY_MAP as Record<string, string | undefined>)[value]
}

export const FONT_WEIGHT_MAP = {
  normal: 'pathable-text-normal',
  semibold: 'pathable-text-semibold',
  bold: 'pathable-text-bold',
} as const

export type FontWeight = keyof typeof FONT_WEIGHT_MAP
export type FontWeightClass<T extends FontWeight> = (typeof FONT_WEIGHT_MAP)[T]

export function fontWeightClass<T extends FontWeight>(
  value: T,
): FontWeightClass<T>
export function fontWeightClass(value: string): string | undefined
export function fontWeightClass(value?: string | null): string | undefined
export function fontWeightClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (FONT_WEIGHT_MAP as Record<string, string | undefined>)[value]
}
