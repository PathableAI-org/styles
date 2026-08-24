/**
 * Surface elevation vocabulary — the depth axis of the `Surface` primitive.
 * Each value maps to a verified `--elevation-*` token via a `pathable-surface--elevation-*`
 * modifier class. Arbitrary box-shadow values are not part of this contract.
 *
 * @see specs/054-surface-primitive/data-model.md
 */

export const SURFACE_ELEVATION_MAP = {
  sm: 'pathable-surface--elevation-sm',
  md: 'pathable-surface--elevation-md',
  lg: 'pathable-surface--elevation-lg',
  xl: 'pathable-surface--elevation-xl',
} as const

export type SurfaceElevation = keyof typeof SURFACE_ELEVATION_MAP
export type SurfaceElevationClass<T extends SurfaceElevation> =
  (typeof SURFACE_ELEVATION_MAP)[T]

/**
 * Pure resolver mapping a `SurfaceElevation` value to its elevation modifier.
 * Returns undefined for null / undefined / unknown values (runtime fallback).
 * No browser globals; deterministic server/client output.
 */
export function surfaceElevationClass<T extends SurfaceElevation>(
  value: T,
): SurfaceElevationClass<T>
export function surfaceElevationClass(value: string): string | undefined
export function surfaceElevationClass(value?: string | null): string | undefined
export function surfaceElevationClass(
  value?: string | null,
): string | undefined {
  if (value == null) return undefined
  return (SURFACE_ELEVATION_MAP as Record<string, string | undefined>)[value]
}
