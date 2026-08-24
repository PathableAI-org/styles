import { describe, it, expect, expectTypeOf } from 'vitest'
import { textToneClass } from '../tone'
import type { TextTone, SurfaceTone, BorderTone } from '../tone'

describe('textToneClass', () => {
  const validTones = [
    ['default', 'pathable-text--tone-default'],
    ['muted', 'pathable-text--tone-muted'],
    ['danger', 'pathable-text--tone-danger'],
    ['success', 'pathable-text--tone-success'],
  ] as const

  validTones.forEach(([input, expected]) => {
    it(`returns "${expected}" for "${input}"`, () => {
      expect(textToneClass(input)).toBe(expected)
    })
  })

  it('returns undefined for undefined', () => {
    expect(textToneClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(textToneClass(null)).toBeUndefined()
  })

  it('returns undefined for an invalid palette value', () => {
    expect(textToneClass('red-600')).toBeUndefined()
  })

  it('returns undefined for an unknown string', () => {
    expect(textToneClass('unknown')).toBeUndefined()
  })
})

describe('tone type unions', () => {
  it('TextTone matches the shared text tone values', () => {
    expectTypeOf<
      'default' | 'muted' | 'danger' | 'success'
    >().toEqualTypeOf<TextTone>()
  })

  it('SurfaceTone matches the shared surface tone values', () => {
    expectTypeOf<
      'default' | 'subtle' | 'primary'
    >().toEqualTypeOf<SurfaceTone>()
  })

  it('BorderTone matches the shared border tone values', () => {
    expectTypeOf<'default' | 'danger'>().toEqualTypeOf<BorderTone>()
  })
})
