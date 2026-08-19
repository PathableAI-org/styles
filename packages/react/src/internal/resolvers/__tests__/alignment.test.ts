import { describe, it, expect } from 'vitest'
import {
  alignItemsClass,
  justifyContentClass,
  textAlignClass,
} from '../alignment'

describe('alignItemsClass', () => {
  const valid = ['center', 'start', 'end', 'stretch', 'baseline'] as const

  valid.forEach((v) => {
    it(`returns "pathable-flex-align-${v}" for "${v}"`, () => {
      expect(alignItemsClass(v)).toBe(`pathable-flex-align-${v}`)
    })
  })

  it('returns undefined for undefined', () => {
    expect(alignItemsClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(alignItemsClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(
      alignItemsClass(
        'space-between' as unknown as Parameters<typeof alignItemsClass>[0],
      ),
    ).toBeUndefined()
  })
})

describe('justifyContentClass', () => {
  const valid = ['center', 'start', 'end', 'between', 'around'] as const

  valid.forEach((v) => {
    it(`returns "pathable-flex-justify-${v}" for "${v}"`, () => {
      expect(justifyContentClass(v)).toBe(`pathable-flex-justify-${v}`)
    })
  })

  it('returns undefined for undefined', () => {
    expect(justifyContentClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(justifyContentClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(
      justifyContentClass(
        'space-evenly' as unknown as Parameters<typeof justifyContentClass>[0],
      ),
    ).toBeUndefined()
  })
})

describe('textAlignClass', () => {
  it('returns "pathable-text-center" for "center"', () => {
    expect(textAlignClass('center')).toBe('pathable-text-center')
  })

  it('returns "pathable-text-left" for "left"', () => {
    expect(textAlignClass('left')).toBe('pathable-text-left')
  })

  it('returns "pathable-text-right" for "right"', () => {
    expect(textAlignClass('right')).toBe('pathable-text-right')
  })

  it('returns undefined for undefined', () => {
    expect(textAlignClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(textAlignClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(
      textAlignClass(
        'justify' as unknown as Parameters<typeof textAlignClass>[0],
      ),
    ).toBeUndefined()
  })
})
