export const PADDING_MAP = {
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
} as const

export type SpacingScale = keyof typeof PADDING_MAP
export type PaddingClass<T extends SpacingScale> = (typeof PADDING_MAP)[T]

export function paddingAllClass<T extends SpacingScale>(
  value: T,
): PaddingClass<T>
export function paddingAllClass(value: string): string | undefined
export function paddingAllClass(value?: string | null): string | undefined
export function paddingAllClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (PADDING_MAP as Record<string, string | undefined>)[value]
}

export const PADDING_X_MAP = {
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
} as const

export type PaddingXClass<T extends SpacingScale> = (typeof PADDING_X_MAP)[T]

export function paddingXClass<T extends SpacingScale>(
  value: T,
): PaddingXClass<T>
export function paddingXClass(value: string): string | undefined
export function paddingXClass(value?: string | null): string | undefined
export function paddingXClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (PADDING_X_MAP as Record<string, string | undefined>)[value]
}

export const PADDING_Y_MAP = {
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
} as const

export type PaddingYClass<T extends SpacingScale> = (typeof PADDING_Y_MAP)[T]

export function paddingYClass<T extends SpacingScale>(
  value: T,
): PaddingYClass<T>
export function paddingYClass(value: string): string | undefined
export function paddingYClass(value?: string | null): string | undefined
export function paddingYClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (PADDING_Y_MAP as Record<string, string | undefined>)[value]
}

export const MARGIN_MAP = {
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
} as const

export type MarginClass<T extends SpacingScale> = (typeof MARGIN_MAP)[T]

export function marginAllClass<T extends SpacingScale>(value: T): MarginClass<T>
export function marginAllClass(value: string): string | undefined
export function marginAllClass(value?: string | null): string | undefined
export function marginAllClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (MARGIN_MAP as Record<string, string | undefined>)[value]
}

export const MARGIN_X_MAP = {
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
} as const

export type MarginXClass<T extends SpacingScale> = (typeof MARGIN_X_MAP)[T]

export function marginXClass<T extends SpacingScale>(value: T): MarginXClass<T>
export function marginXClass(value: string): string | undefined
export function marginXClass(value?: string | null): string | undefined
export function marginXClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (MARGIN_X_MAP as Record<string, string | undefined>)[value]
}

export const MARGIN_Y_MAP = {
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
} as const

export type MarginYClass<T extends SpacingScale> = (typeof MARGIN_Y_MAP)[T]

export function marginYClass<T extends SpacingScale>(value: T): MarginYClass<T>
export function marginYClass(value: string): string | undefined
export function marginYClass(value?: string | null): string | undefined
export function marginYClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (MARGIN_Y_MAP as Record<string, string | undefined>)[value]
}

export const MARGIN_TOP_MAP = {
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
} as const

export type MarginTopClass<T extends SpacingScale> = (typeof MARGIN_TOP_MAP)[T]

export function marginTopClass<T extends SpacingScale>(
  value: T,
): MarginTopClass<T>
export function marginTopClass(value: string): string | undefined
export function marginTopClass(value?: string | null): string | undefined
export function marginTopClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (MARGIN_TOP_MAP as Record<string, string | undefined>)[value]
}

export const MARGIN_BOTTOM_MAP = {
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
} as const

export type MarginBottomClass<T extends SpacingScale> =
  (typeof MARGIN_BOTTOM_MAP)[T]

export function marginBottomClass<T extends SpacingScale>(
  value: T,
): MarginBottomClass<T>
export function marginBottomClass(value: string): string | undefined
export function marginBottomClass(value?: string | null): string | undefined
export function marginBottomClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (MARGIN_BOTTOM_MAP as Record<string, string | undefined>)[value]
}
