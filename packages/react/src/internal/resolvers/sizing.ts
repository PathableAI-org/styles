import type { Width, MaxWidth } from './types'

const WIDTH_MAP = {
  auto: 'pathable-width-auto',
  full: 'pathable-width-full',
} as const satisfies Record<Width, string>

const MAX_WIDTH_MAP = {
  mobile: 'pathable-maxw-mobile',
  'mobile-lg': 'pathable-maxw-mobile-lg',
  tablet: 'pathable-maxw-tablet',
  desktop: 'pathable-maxw-desktop',
} as const satisfies Record<MaxWidth, string>

export function widthClass(value?: Width | null): string | undefined {
  if (value == null) return undefined
  return WIDTH_MAP[value]
}

export function maxWidthClass(value?: MaxWidth | null): string | undefined {
  if (value == null) return undefined
  return MAX_WIDTH_MAP[value]
}
