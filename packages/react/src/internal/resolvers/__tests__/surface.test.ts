import { describe, it, expect, expectTypeOf } from 'vitest'
import { surfaceToneClass, surfaceBorderToneClass } from '../tone'
import { surfaceElevationClass, type SurfaceElevation } from '../surface'
import type { SurfaceTone, BorderTone } from '../tone'

describe('surfaceToneClass', () => {
  const validTones = [
    ['default', 'pathable-surface--tone-default'],
    ['subtle', 'pathable-surface--tone-subtle'],
    ['primary', 'pathable-surface--tone-primary'],
  ] as const

  validTones.forEach(([input, expected]) => {
    it(`returns "${expected}" for "${input}"`, () => {
      expect(surfaceToneClass(input)).toBe(expected)
    })
  })

  it('returns undefined for undefined', () => {
    expect(surfaceToneClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(surfaceToneClass(null)).toBeUndefined()
  })

  it('returns undefined for an unknown string', () => {
    expect(surfaceToneClass('raised')).toBeUndefined()
  })
})

describe('surfaceBorderToneClass', () => {
  const validTones = [
    ['default', 'pathable-surface--border-default'],
    ['danger', 'pathable-surface--border-danger'],
  ] as const

  validTones.forEach(([input, expected]) => {
    it(`returns "${expected}" for "${input}"`, () => {
      expect(surfaceBorderToneClass(input)).toBe(expected)
    })
  })

  it('returns undefined for undefined', () => {
    expect(surfaceBorderToneClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(surfaceBorderToneClass(null)).toBeUndefined()
  })

  it('returns undefined for an unknown string', () => {
    expect(surfaceBorderToneClass('warning')).toBeUndefined()
  })
})

describe('surfaceElevationClass', () => {
  const validSteps = [
    ['sm', 'pathable-surface--elevation-sm'],
    ['md', 'pathable-surface--elevation-md'],
    ['lg', 'pathable-surface--elevation-lg'],
    ['xl', 'pathable-surface--elevation-xl'],
  ] as const

  validSteps.forEach(([input, expected]) => {
    it(`returns "${expected}" for "${input}"`, () => {
      expect(surfaceElevationClass(input)).toBe(expected)
    })
  })

  it('returns undefined for undefined', () => {
    expect(surfaceElevationClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(surfaceElevationClass(null)).toBeUndefined()
  })

  it('returns undefined for an arbitrary shadow value', () => {
    expect(surfaceElevationClass('0px 0px 10px #000')).toBeUndefined()
  })
})

describe('surface type unions', () => {
  it('SurfaceTone matches the shared surface tone values', () => {
    expectTypeOf<
      'default' | 'subtle' | 'primary'
    >().toEqualTypeOf<SurfaceTone>()
  })

  it('BorderTone matches the shared border tone values', () => {
    expectTypeOf<'default' | 'danger'>().toEqualTypeOf<BorderTone>()
  })

  it('SurfaceElevation matches the verified elevation steps', () => {
    expectTypeOf<'sm' | 'md' | 'lg' | 'xl'>().toEqualTypeOf<SurfaceElevation>()
  })
})
