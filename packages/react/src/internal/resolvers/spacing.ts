import type { SpacingScale } from "./types";

const ALL_SPACING_VALUES: ReadonlySet<string> = new Set<SpacingScale>([
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15",
]);

function spacingClass(prefix: string, value?: SpacingScale | null): string | undefined {
  if (value == null) return undefined;
  if (!ALL_SPACING_VALUES.has(value)) return undefined;
  return `${prefix}-${value}`;
}

export function paddingAllClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-padding", value);
}

export function paddingXClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-padding-x", value);
}

export function paddingYClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-padding-y", value);
}

export function marginAllClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-margin", value);
}

export function marginXClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-margin-x", value);
}

export function marginYClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-margin-y", value);
}

export function marginTopClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-margin-top", value);
}

export function marginBottomClass(value?: SpacingScale | null): string | undefined {
  return spacingClass("pathable-margin-bottom", value);
}