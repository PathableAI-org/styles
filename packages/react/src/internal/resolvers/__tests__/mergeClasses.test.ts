import { describe, it, expect } from 'vitest'
import { mergeClasses } from '../mergeClasses'

describe('mergeClasses', () => {
  it('joins multiple class strings in caller order', () => {
    expect(
      mergeClasses('pathable-card', 'pathable-width-full', 'my-custom'),
    ).toBe('pathable-card pathable-width-full my-custom')
  })

  it('preserves merge order: component → semantic → consumer', () => {
    const result = mergeClasses(
      'pathable-card',
      'pathable-margin-2',
      'consumer-override',
    )
    expect(result).toBe('pathable-card pathable-margin-2 consumer-override')
  })

  it('returns undefined when all sources are empty/undefined/null', () => {
    expect(mergeClasses(undefined, null, undefined)).toBeUndefined()
  })

  it('filters out undefined and null sources', () => {
    expect(mergeClasses('base', undefined, 'semantic', null, 'consumer')).toBe(
      'base semantic consumer',
    )
  })

  it('filters out empty strings', () => {
    expect(mergeClasses('', 'base', '')).toBe('base')
  })

  it('returns a single source as-is', () => {
    expect(mergeClasses('only')).toBe('only')
  })

  it('handles all undefined gracefully', () => {
    expect(mergeClasses()).toBeUndefined()
  })

  it('handles duplicate classes (no dedup — harmless)', () => {
    expect(mergeClasses('a', 'b', 'a')).toBe('a b a')
  })
})
