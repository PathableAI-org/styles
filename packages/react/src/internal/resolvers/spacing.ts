import type { SpacingScale } from './types'

const PADDING_MAP = {
  '0': 'pathable-padding-0',
  '1': 'pathable-padding-1',
  '2': 'pathable-padding-2',
  '3': 'pathable-padding-3',
  '4': 'pathable-padding-4',
  '5': 'pathable-padding-5',
  '6': 'pathable-padding-6',
  '7': 'pathable-padding-7',
  '8': 'pathable-padding-8',
  '9': 'pathable-padding-9',
  '10': 'pathable-padding-10',
  '15': 'pathable-padding-15',
} as const satisfies Record<SpacingScale, string>

const PADDING_X_MAP = {
  '0': 'pathable-padding-x-0',
  '1': 'pathable-padding-x-1',
  '2': 'pathable-padding-x-2',
  '3': 'pathable-padding-x-3',
  '4': 'pathable-padding-x-4',
  '5': 'pathable-padding-x-5',
  '6': 'pathable-padding-x-6',
  '7': 'pathable-padding-x-7',
  '8': 'pathable-padding-x-8',
  '9': 'pathable-padding-x-9',
  '10': 'pathable-padding-x-10',
  '15': 'pathable-padding-x-15',
} as const satisfies Record<SpacingScale, string>

const PADDING_Y_MAP = {
  '0': 'pathable-padding-y-0',
  '1': 'pathable-padding-y-1',
  '2': 'pathable-padding-y-2',
  '3': 'pathable-padding-y-3',
  '4': 'pathable-padding-y-4',
  '5': 'pathable-padding-y-5',
  '6': 'pathable-padding-y-6',
  '7': 'pathable-padding-y-7',
  '8': 'pathable-padding-y-8',
  '9': 'pathable-padding-y-9',
  '10': 'pathable-padding-y-10',
  '15': 'pathable-padding-y-15',
} as const satisfies Record<SpacingScale, string>

const MARGIN_MAP = {
  '0': 'pathable-margin-0',
  '1': 'pathable-margin-1',
  '2': 'pathable-margin-2',
  '3': 'pathable-margin-3',
  '4': 'pathable-margin-4',
  '5': 'pathable-margin-5',
  '6': 'pathable-margin-6',
  '7': 'pathable-margin-7',
  '8': 'pathable-margin-8',
  '9': 'pathable-margin-9',
  '10': 'pathable-margin-10',
  '15': 'pathable-margin-15',
} as const satisfies Record<SpacingScale, string>

const MARGIN_X_MAP = {
  '0': 'pathable-margin-x-0',
  '1': 'pathable-margin-x-1',
  '2': 'pathable-margin-x-2',
  '3': 'pathable-margin-x-3',
  '4': 'pathable-margin-x-4',
  '5': 'pathable-margin-x-5',
  '6': 'pathable-margin-x-6',
  '7': 'pathable-margin-x-7',
  '8': 'pathable-margin-x-8',
  '9': 'pathable-margin-x-9',
  '10': 'pathable-margin-x-10',
  '15': 'pathable-margin-x-15',
} as const satisfies Record<SpacingScale, string>

const MARGIN_Y_MAP = {
  '0': 'pathable-margin-y-0',
  '1': 'pathable-margin-y-1',
  '2': 'pathable-margin-y-2',
  '3': 'pathable-margin-y-3',
  '4': 'pathable-margin-y-4',
  '5': 'pathable-margin-y-5',
  '6': 'pathable-margin-y-6',
  '7': 'pathable-margin-y-7',
  '8': 'pathable-margin-y-8',
  '9': 'pathable-margin-y-9',
  '10': 'pathable-margin-y-10',
  '15': 'pathable-margin-y-15',
} as const satisfies Record<SpacingScale, string>

const MARGIN_TOP_MAP = {
  '0': 'pathable-margin-top-0',
  '1': 'pathable-margin-top-1',
  '2': 'pathable-margin-top-2',
  '3': 'pathable-margin-top-3',
  '4': 'pathable-margin-top-4',
  '5': 'pathable-margin-top-5',
  '6': 'pathable-margin-top-6',
  '7': 'pathable-margin-top-7',
  '8': 'pathable-margin-top-8',
  '9': 'pathable-margin-top-9',
  '10': 'pathable-margin-top-10',
  '15': 'pathable-margin-top-15',
} as const satisfies Record<SpacingScale, string>

const MARGIN_BOTTOM_MAP = {
  '0': 'pathable-margin-bottom-0',
  '1': 'pathable-margin-bottom-1',
  '2': 'pathable-margin-bottom-2',
  '3': 'pathable-margin-bottom-3',
  '4': 'pathable-margin-bottom-4',
  '5': 'pathable-margin-bottom-5',
  '6': 'pathable-margin-bottom-6',
  '7': 'pathable-margin-bottom-7',
  '8': 'pathable-margin-bottom-8',
  '9': 'pathable-margin-bottom-9',
  '10': 'pathable-margin-bottom-10',
  '15': 'pathable-margin-bottom-15',
} as const satisfies Record<SpacingScale, string>

export function paddingAllClass(
  value?: SpacingScale | null,
): string | undefined {
  if (value == null) return undefined
  return PADDING_MAP[value]
}

export function paddingXClass(value?: SpacingScale | null): string | undefined {
  if (value == null) return undefined
  return PADDING_X_MAP[value]
}

export function paddingYClass(value?: SpacingScale | null): string | undefined {
  if (value == null) return undefined
  return PADDING_Y_MAP[value]
}

export function marginAllClass(
  value?: SpacingScale | null,
): string | undefined {
  if (value == null) return undefined
  return MARGIN_MAP[value]
}

export function marginXClass(value?: SpacingScale | null): string | undefined {
  if (value == null) return undefined
  return MARGIN_X_MAP[value]
}

export function marginYClass(value?: SpacingScale | null): string | undefined {
  if (value == null) return undefined
  return MARGIN_Y_MAP[value]
}

export function marginTopClass(
  value?: SpacingScale | null,
): string | undefined {
  if (value == null) return undefined
  return MARGIN_TOP_MAP[value]
}

export function marginBottomClass(
  value?: SpacingScale | null,
): string | undefined {
  if (value == null) return undefined
  return MARGIN_BOTTOM_MAP[value]
}
