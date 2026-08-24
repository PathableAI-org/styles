import { describe, it, expect } from 'vitest'
import { themeColorToken, THEME_COLOR_KEYS } from '../tokens'
import type { ThemeColorKey } from '../tokens'

describe('themeColorToken', () => {
  const expected: Record<ThemeColorKey, string> = {
    bg: '--pathable-color-bg',
    surface: '--pathable-color-surface',
    text: '--pathable-color-text',
    textMuted: '--pathable-color-text-muted',
    border: '--pathable-color-border',
    link: '--pathable-color-link',
    accent: '--pathable-color-accent',
    focusRing: '--pathable-color-focus-ring',
    danger: '--pathable-color-danger',
    success: '--pathable-color-success',
    textSuccess: '--pathable-color-text-success',
    actionPrimaryBg: '--pathable-color-action-primary-bg',
    actionPrimaryText: '--pathable-color-action-primary-text',
    actionSecondaryBg: '--pathable-color-action-secondary-bg',
    actionSecondaryText: '--pathable-color-action-secondary-text',
    statusSuccessBg: '--pathable-color-status-success-bg',
    statusSuccessText: '--pathable-color-status-success-text',
    statusWarningBg: '--pathable-color-status-warning-bg',
    statusWarningText: '--pathable-color-status-warning-text',
    statusDangerBg: '--pathable-color-status-danger-bg',
    statusDangerText: '--pathable-color-status-danger-text',
    workflowActive: '--pathable-color-workflow-active',
    workflowComplete: '--pathable-color-workflow-complete',
    workflowBlocked: '--pathable-color-workflow-blocked',
    onAccent: '--pathable-color-on-accent',
  }

  it('maps all 25 THEME_COLOR_KEYS', () => {
    expect(THEME_COLOR_KEYS).toHaveLength(25)
    expect(Object.keys(expected)).toHaveLength(25)
  })

  THEME_COLOR_KEYS.forEach((key) => {
    it(`returns "${expected[key]}" for "${key}"`, () => {
      expect(themeColorToken(key)).toBe(expected[key])
    })
  })

  it('returns undefined for null', () => {
    expect(themeColorToken(null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(themeColorToken(undefined)).toBeUndefined()
  })

  it('returns undefined for an unrecognized string', () => {
    expect(themeColorToken('accentColour')).toBeUndefined()
  })
})
