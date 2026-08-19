import { describe, it, expect } from 'vitest'
import { backgroundColorClass, textColorClass } from '../colorTone'

describe('backgroundColorClass', () => {
  const validBg = [
    ['primary', 'pathable-bg-primary'],
    ['base', 'pathable-bg-base'],
    ['surface', 'pathable-bg-surface'],
    ['accent', 'pathable-bg-accent'],
    ['link', 'pathable-bg-link'],
    ['focus-ring', 'pathable-bg-focus-ring'],
    ['danger', 'pathable-bg-danger'],
    ['success', 'pathable-bg-success'],
    ['transparent', 'pathable-bg-transparent'],
  ] as const

  validBg.forEach(([input, expected]) => {
    it(`returns "${expected}" for "${input}"`, () => {
      expect(backgroundColorClass(input)).toBe(expected)
    })
  })

  it('returns undefined for undefined', () => {
    expect(backgroundColorClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(backgroundColorClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(
      backgroundColorClass(
        'unknown' as unknown as Parameters<typeof backgroundColorClass>[0],
      ),
    ).toBeUndefined()
  })
})

describe('textColorClass', () => {
  const validText = [
    ['base', 'pathable-text-base'],
    ['primary', 'pathable-text-primary'],
    ['muted', 'pathable-text-muted'],
    ['accent', 'pathable-text-accent'],
    ['link', 'pathable-text-link'],
    ['white', 'pathable-text-white'],
  ] as const

  validText.forEach(([input, expected]) => {
    it(`returns "${expected}" for "${input}"`, () => {
      expect(textColorClass(input)).toBe(expected)
    })
  })

  it('returns undefined for undefined', () => {
    expect(textColorClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(textColorClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(
      textColorClass('pink' as unknown as Parameters<typeof textColorClass>[0]),
    ).toBeUndefined()
  })
})
