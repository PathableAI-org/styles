export const FLEX_MAP = {
  '1': 'pathable-flex-1',
  fill: 'pathable-flex-fill',
} as const

export type Flex = keyof typeof FLEX_MAP
export type FlexClass<T extends Flex> = (typeof FLEX_MAP)[T]

export function flexClass<T extends Flex>(value: T): FlexClass<T>
export function flexClass(value: string): string | undefined
export function flexClass(value?: string | null): string | undefined
export function flexClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (FLEX_MAP as Record<string, string | undefined>)[value]
}
