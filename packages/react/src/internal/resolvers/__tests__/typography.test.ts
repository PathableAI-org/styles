import { describe, it, expect } from 'vitest'
import { fontFamilyClass, fontWeightClass } from '../typography'

describe('fontFamilyClass', () => {
  it('returns "pathable-font-family-heading" for "heading"', () => {
    expect(fontFamilyClass('heading')).toBe('pathable-font-family-heading')
  })

  it('returns "pathable-font-family-body" for "body"', () => {
    expect(fontFamilyClass('body')).toBe('pathable-font-family-body')
  })

  it('returns "pathable-font-family-mono" for "mono"', () => {
    expect(fontFamilyClass('mono')).toBe('pathable-font-family-mono')
  })

  it('returns "pathable-font-family-alt" for "alt"', () => {
    expect(fontFamilyClass('alt')).toBe('pathable-font-family-alt')
  })

  it('returns undefined for undefined', () => {
    expect(fontFamilyClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(fontFamilyClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(fontFamilyClass('serif')).toBeUndefined()
  })
})

describe('fontWeightClass', () => {
  it('returns "pathable-text-normal" for "normal"', () => {
    expect(fontWeightClass('normal')).toBe('pathable-text-normal')
  })

  it('returns "pathable-text-semibold" for "semibold"', () => {
    expect(fontWeightClass('semibold')).toBe('pathable-text-semibold')
  })

  it('returns "pathable-text-bold" for "bold"', () => {
    expect(fontWeightClass('bold')).toBe('pathable-text-bold')
  })

  it('returns undefined for undefined', () => {
    expect(fontWeightClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(fontWeightClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(fontWeightClass('thin')).toBeUndefined()
  })
})
