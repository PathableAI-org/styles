import type { AlignItems, JustifyContent, TextAlign } from './types'

const ALIGN_ITEMS_MAP = {
  center: 'pathable-flex-align-center',
  start: 'pathable-flex-align-start',
  end: 'pathable-flex-align-end',
  stretch: 'pathable-flex-align-stretch',
  baseline: 'pathable-flex-align-baseline',
} as const satisfies Record<AlignItems, string>

const JUSTIFY_CONTENT_MAP = {
  center: 'pathable-flex-justify-center',
  start: 'pathable-flex-justify-start',
  end: 'pathable-flex-justify-end',
  between: 'pathable-flex-justify-between',
  around: 'pathable-flex-justify-around',
} as const satisfies Record<JustifyContent, string>

const TEXT_ALIGN_MAP = {
  center: 'pathable-text-center',
  left: 'pathable-text-left',
  right: 'pathable-text-right',
} as const satisfies Record<TextAlign, string>

export function alignItemsClass(value?: AlignItems | null): string | undefined {
  if (value == null) return undefined
  return ALIGN_ITEMS_MAP[value]
}

export function justifyContentClass(
  value?: JustifyContent | null,
): string | undefined {
  if (value == null) return undefined
  return JUSTIFY_CONTENT_MAP[value]
}

export function textAlignClass(value?: TextAlign | null): string | undefined {
  if (value == null) return undefined
  return TEXT_ALIGN_MAP[value]
}
