import type { Display } from './types'

const DISPLAY_MAP = {
  flex: 'pathable-display-flex',
  block: 'pathable-display-block',
  inline: 'pathable-display-inline',
  'inline-block': 'pathable-display-inline-block',
  none: 'pathable-display-none',
} as const satisfies Record<Display, string>

export function displayClass(value?: Display | null): string | undefined {
  if (value == null) return undefined
  return DISPLAY_MAP[value]
}
