import { describe, it, expect } from 'vitest'
import { createTheme } from '../createTheme'
import { isValidCssColor } from '../color'
import { defaultTheme } from '../defaultTheme'
import { THEME_COLOR_KEYS } from '../tokens'
import type { DeepPartial } from '../createTheme'
import type { ThemeConfig } from '../tokens'

function invalidInput(value: unknown): DeepPartial<ThemeConfig> {
  return value as DeepPartial<ThemeConfig>
}

describe('isValidCssColor (internal)', () => {
  const valid = [
    '#1cae96',
    '#fff',
    '#001a33ff',
    'rgb(0, 54, 92)',
    'rgba(0,54,92,0.5)',
    'hsl(210, 100%, 29%)',
    'rebeccapurple',
    'transparent',
  ]
  valid.forEach((value) => {
    it(`accepts ${value}`, () => {
      expect(isValidCssColor(value)).toBe(true)
    })
  })

  const invalid: unknown[] = [
    '#12',
    '#gggggg',
    'not-a-color',
    '',
    'lab(50% 0 0)',
    42,
    null,
    undefined,
  ]
  invalid.forEach((value) => {
    it(`rejects ${String(value)}`, () => {
      expect(isValidCssColor(value)).toBe(false)
    })
  })
})

describe('createTheme (partial overrides)', () => {
  it('applies a single-token override and keeps the other 24 defaults', () => {
    const theme = createTheme({ colors: { accent: '#7c3aed' } })
    expect(theme.colors.accent).toBe('#7c3aed')
    for (const key of THEME_COLOR_KEYS) {
      if (key === 'accent') continue
      expect(theme.colors[key]).toBe(defaultTheme.colors[key])
    }
  })

  it('deep-merges multiple overrides without whole-object replacement', () => {
    const theme = createTheme({
      colors: { accent: '#7c3aed', bg: '#000000' },
    })
    expect(theme.colors.accent).toBe('#7c3aed')
    expect(theme.colors.bg).toBe('#000000')
    expect(theme.colors.text).toBe(defaultTheme.colors.text)
    expect(Object.keys(theme.colors)).toHaveLength(25)
  })

  it('passes a full configuration through unchanged', () => {
    const full = { colors: { ...defaultTheme.colors, accent: '#111111' } }
    const theme = createTheme(full)
    expect(theme.colors).toEqual(full.colors)
  })

  it('returns a theme deep-equal to defaultTheme for an empty partial', () => {
    expect(createTheme({}).colors).toEqual(defaultTheme.colors)
  })
})

describe('createTheme (validation)', () => {
  const nonObjectCases: Array<[unknown, string]> = [
    [null, 'null'],
    ['text', 'string'],
    [42, 'number'],
    [true, 'boolean'],
    [[], 'array'],
    [() => {}, 'function'],
  ]
  nonObjectCases.forEach(([input, type]) => {
    it(`throws for a non-object input of type ${type}`, () => {
      expect(() => createTheme(invalidInput(input))).toThrow(
        `createTheme: expected a plain object, received ${type}`,
      )
    })
  })

  it('throws a missing-token error when a required value is nullish', () => {
    expect(() => createTheme({ colors: { accent: undefined } })).toThrow(
      'createTheme: missing required color token "accent"',
    )
  })

  const invalidValues: Array<[unknown, string]> = [
    [42, '42'],
    ['#12', '#12'],
    ['not-a-color', 'not-a-color'],
  ]
  invalidValues.forEach(([value, rendered]) => {
    it(`throws an invalid-color error for "${rendered}"`, () => {
      expect(() =>
        createTheme(invalidInput({ colors: { accent: value } })),
      ).toThrow(`createTheme: invalid color value for "accent": ${rendered}`)
    })
  })
})

describe('createTheme (purity, determinism, serializability)', () => {
  it('does not mutate defaultTheme or the input', () => {
    const input = { colors: { accent: '#7c3aed' } }
    const defaultBefore = JSON.parse(JSON.stringify(defaultTheme))
    const inputBefore = JSON.parse(JSON.stringify(input))

    createTheme(input)

    expect(JSON.parse(JSON.stringify(defaultTheme))).toEqual(defaultBefore)
    expect(JSON.parse(JSON.stringify(input))).toEqual(inputBefore)
    expect(defaultTheme.colors.accent).toBe('#1cae96')
  })

  it('is deterministic for the same input', () => {
    const a = createTheme({ colors: { accent: '#7c3aed' } })
    const b = createTheme({ colors: { accent: '#7c3aed' } })
    expect(a).toEqual(b)
    expect(a).not.toBe(b)
  })

  it('returns a JSON-serializable result', () => {
    const theme = createTheme({ colors: { accent: '#7c3aed' } })
    expect(JSON.parse(JSON.stringify(theme))).toEqual(theme)
  })

  it('returns a fresh colors object not aliased to defaultTheme', () => {
    const theme = createTheme({})
    expect(theme.colors).toEqual(defaultTheme.colors)
    expect(theme.colors).not.toBe(defaultTheme.colors)
  })
})
