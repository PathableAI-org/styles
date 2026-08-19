import type { BackgroundColor, TextColor } from './types'

const BACKGROUND_COLOR_MAP = {
  primary: 'pathable-bg-primary',
  base: 'pathable-bg-base',
  surface: 'pathable-bg-surface',
  accent: 'pathable-bg-accent',
  link: 'pathable-bg-link',
  'focus-ring': 'pathable-bg-focus-ring',
  danger: 'pathable-bg-danger',
  success: 'pathable-bg-success',
  transparent: 'pathable-bg-transparent',
} as const satisfies Record<BackgroundColor, string>

const TEXT_COLOR_MAP = {
  base: 'pathable-text-base',
  primary: 'pathable-text-primary',
  muted: 'pathable-text-muted',
  accent: 'pathable-text-accent',
  link: 'pathable-text-link',
  white: 'pathable-text-white',
} as const satisfies Record<TextColor, string>

export function backgroundColorClass(
  value?: BackgroundColor | null,
): string | undefined {
  if (value == null) return undefined
  return BACKGROUND_COLOR_MAP[value]
}

export function textColorClass(value?: TextColor | null): string | undefined {
  if (value == null) return undefined
  return TEXT_COLOR_MAP[value]
}
