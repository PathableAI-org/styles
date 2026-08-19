import type { Flex } from "./types";

const FLEX_MAP = {
  "1": "pathable-flex-1",
  "fill": "pathable-flex-fill",
} as const satisfies Record<Flex, string>;

export function flexClass(value?: Flex | null): string | undefined {
  if (value == null) return undefined;
  return FLEX_MAP[value];
}