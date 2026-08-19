import { describe, it, expect } from 'vitest'
import {
  paddingAllClass,
  paddingXClass,
  paddingYClass,
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
} from '../spacing'

const validSpacingValues = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '15',
] as const

describe('paddingAllClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-padding-${v}" for "${v}"`, () => {
      expect(paddingAllClass(v)).toBe(`pathable-padding-${v}`)
    })
  })

  it('returns undefined for undefined', () => {
    expect(paddingAllClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(paddingAllClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(paddingAllClass('bad')).toBeUndefined()
  })
})

describe('paddingXClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-padding-x-${v}" for "${v}"`, () => {
      expect(paddingXClass(v)).toBe(`pathable-padding-x-${v}`)
    })
  })

  it('returns undefined for undefined', () => {
    expect(paddingXClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(paddingXClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(paddingXClass('bad')).toBeUndefined()
  })
})

describe('paddingYClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-padding-y-${v}" for "${v}"`, () => {
      expect(paddingYClass(v)).toBe(`pathable-padding-y-${v}`)
    })
  })

  it('returns undefined for undefined', () => {
    expect(paddingYClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(paddingYClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(paddingYClass('bad')).toBeUndefined()
  })
})

describe('marginAllClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-margin-${v}" for "${v}"`, () => {
      expect(marginAllClass(v)).toBe(`pathable-margin-${v}`)
    })
  })

  it('returns "pathable-margin-auto" for "auto"', () => {
    expect(marginAllClass('auto')).toBe('pathable-margin-auto')
  })

  it('returns undefined for undefined', () => {
    expect(marginAllClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(marginAllClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(marginAllClass('bad')).toBeUndefined()
  })
})

describe('marginXClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-margin-x-${v}" for "${v}"`, () => {
      expect(marginXClass(v)).toBe(`pathable-margin-x-${v}`)
    })
  })

  it('returns "pathable-margin-x-auto" for "auto"', () => {
    expect(marginXClass('auto')).toBe('pathable-margin-x-auto')
  })

  it('returns undefined for undefined', () => {
    expect(marginXClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(marginXClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(marginXClass('bad')).toBeUndefined()
  })
})

describe('marginYClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-margin-y-${v}" for "${v}"`, () => {
      expect(marginYClass(v)).toBe(`pathable-margin-y-${v}`)
    })
  })

  it('returns undefined for "auto"', () => {
    expect(marginYClass('auto')).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(marginYClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(marginYClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(marginYClass('bad')).toBeUndefined()
  })
})

describe('marginTopClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-margin-top-${v}" for "${v}"`, () => {
      expect(marginTopClass(v)).toBe(`pathable-margin-top-${v}`)
    })
  })

  it('returns undefined for "auto"', () => {
    expect(marginTopClass('auto')).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(marginTopClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(marginTopClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(marginTopClass('bad')).toBeUndefined()
  })
})

describe('marginBottomClass', () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-margin-bottom-${v}" for "${v}"`, () => {
      expect(marginBottomClass(v)).toBe(`pathable-margin-bottom-${v}`)
    })
  })

  it('returns undefined for "auto"', () => {
    expect(marginBottomClass('auto')).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(marginBottomClass(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(marginBottomClass(null)).toBeUndefined()
  })

  it('returns undefined for invalid value', () => {
    expect(marginBottomClass('bad')).toBeUndefined()
  })
})
