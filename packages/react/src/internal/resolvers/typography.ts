import type { FontFamily, FontWeight } from './types'

const FONT_FAMILY_MAP = {
  heading: 'pathable-font-family-heading',
  body: 'pathable-font-family-body',
  mono: 'pathable-font-family-mono',
  alt: 'pathable-font-family-alt',
} as const satisfies Record<FontFamily, string>

const FONT_WEIGHT_MAP = {
  normal: 'pathable-text-normal',
  semibold: 'pathable-text-semibold',
  bold: 'pathable-text-bold',
} as const satisfies Record<FontWeight, string>

export function fontFamilyClass(value?: FontFamily | null): string | undefined {
  if (value == null) return undefined
  return FONT_FAMILY_MAP[value]
}

export function fontWeightClass(value?: FontWeight | null): string | undefined {
  if (value == null) return undefined
  return FONT_WEIGHT_MAP[value]
}
