export const BACKGROUND_COLOR_MAP = {
  primary: 'pathable-bg-primary',
  base: 'pathable-bg-base',
  surface: 'pathable-bg-surface',
  accent: 'pathable-bg-accent',
  link: 'pathable-bg-link',
  'focus-ring': 'pathable-bg-focus-ring',
  danger: 'pathable-bg-danger',
  success: 'pathable-bg-success',
  transparent: 'pathable-bg-transparent',
} as const

export type BackgroundColor = keyof typeof BACKGROUND_COLOR_MAP
export type BackgroundColorClass<T extends BackgroundColor> =
  (typeof BACKGROUND_COLOR_MAP)[T]

export function backgroundColorClass<T extends BackgroundColor>(
  value: T,
): BackgroundColorClass<T>
export function backgroundColorClass(value: string): string | undefined
export function backgroundColorClass(value?: string | null): string | undefined
export function backgroundColorClass(
  value?: string | null,
): string | undefined {
  if (value == null) return undefined
  return (BACKGROUND_COLOR_MAP as Record<string, string | undefined>)[value]
}

export const TEXT_COLOR_MAP = {
  base: 'pathable-text-base',
  primary: 'pathable-text-primary',
  muted: 'pathable-text-muted',
  accent: 'pathable-text-accent',
  link: 'pathable-text-link',
  white: 'pathable-text-white',
} as const

export type TextColor = keyof typeof TEXT_COLOR_MAP
export type TextColorClass<T extends TextColor> = (typeof TEXT_COLOR_MAP)[T]

export function textColorClass<T extends TextColor>(value: T): TextColorClass<T>
export function textColorClass(value: string): string | undefined
export function textColorClass(value?: string | null): string | undefined
export function textColorClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (TEXT_COLOR_MAP as Record<string, string | undefined>)[value]
}
