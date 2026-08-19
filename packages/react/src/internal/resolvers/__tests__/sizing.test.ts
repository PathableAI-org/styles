import { describe, it, expect } from 'vitest'
import { widthClass, maxWidthClass } from '../sizing'

describe('widthClass', () => {
  it('returns "pathable-width-auto" for "auto"', () => {
    expect(widthClass('auto')).toBe('pathable-width-auto')
  })

  it('returns "pathable-width-full" for "full"', () => {
    expect(widthClass('full')).toBe('pathable-width-full')
  })

  it('returns undefined for undefined input', () => {
    expect(widthClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null input', () => {
    expect(widthClass(null)).toBeUndefined()
  })

  it('returns undefined for unrecognized value', () => {
    expect(widthClass('nope')).toBeUndefined()
  })
})

describe('maxWidthClass', () => {
  it('returns "pathable-maxw-mobile" for "mobile"', () => {
    expect(maxWidthClass('mobile')).toBe('pathable-maxw-mobile')
  })

  it('returns "pathable-maxw-mobile-lg" for "mobile-lg"', () => {
    expect(maxWidthClass('mobile-lg')).toBe('pathable-maxw-mobile-lg')
  })

  it('returns "pathable-maxw-tablet" for "tablet"', () => {
    expect(maxWidthClass('tablet')).toBe('pathable-maxw-tablet')
  })

  it('returns "pathable-maxw-desktop" for "desktop"', () => {
    expect(maxWidthClass('desktop')).toBe('pathable-maxw-desktop')
  })

  it('returns undefined for undefined input', () => {
    expect(maxWidthClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null input', () => {
    expect(maxWidthClass(null)).toBeUndefined()
  })

  it('returns undefined for unrecognized value', () => {
    expect(maxWidthClass('nope')).toBeUndefined()
  })
})
