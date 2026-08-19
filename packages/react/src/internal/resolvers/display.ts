export const DISPLAY_MAP = {
  flex: 'pathable-display-flex',
  block: 'pathable-display-block',
  inline: 'pathable-display-inline',
  'inline-block': 'pathable-display-inline-block',
  none: 'pathable-display-none',
} as const

export type Display = keyof typeof DISPLAY_MAP
export type DisplayClass<T extends Display> = (typeof DISPLAY_MAP)[T]

export function displayClass<T extends Display>(value: T): DisplayClass<T>
export function displayClass(value: string): string | undefined
export function displayClass(value?: string | null): string | undefined
export function displayClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (DISPLAY_MAP as Record<string, string | undefined>)[value]
}
