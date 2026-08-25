import { describe, it, expect } from 'vitest'
import { defaultTheme } from '../defaultTheme'
import { THEME_COLOR_KEYS } from '../tokens'
import type { ThemeColorKey } from '../tokens'

describe('defaultTheme', () => {
  const expected: Record<ThemeColorKey, string> = {
    bg: '#dde2e8',
    surface: '#ffffff',
    text: '#00365c',
    textMuted: '#015a76',
    border: '#dde2e8',
    link: '#4899e8',
    accent: '#1cae96',
    focusRing: '#4497f5',
    danger: '#dc3545',
    success: '#1cae96',
    textSuccess: '#0d7a63',
    actionPrimaryBg: '#00365c',
    actionPrimaryText: '#ffffff',
    actionSecondaryBg: '#1cae96',
    actionSecondaryText: '#001a33',
    statusSuccessBg: '#1cae96',
    statusSuccessText: '#001a33',
    statusWarningBg: '#f5a623',
    statusWarningText: '#001a33',
    statusDangerBg: '#dc3545',
    statusDangerText: '#ffffff',
    workflowActive: '#4899e8',
    workflowComplete: '#1cae96',
    workflowBlocked: '#dc3545',
    onAccent: '#001a33',
  }

  it('has exactly 25 color tokens', () => {
    expect(Object.keys(defaultTheme.colors)).toHaveLength(25)
    expect(THEME_COLOR_KEYS).toHaveLength(25)
    expect(Object.keys(expected)).toHaveLength(25)
  })

  it('matches the authoritative semantic color table for every token', () => {
    expect(defaultTheme.colors).toEqual(expected)
  })

  it('spot-checks representative values', () => {
    expect(defaultTheme.colors.accent).toBe('#1cae96')
    expect(defaultTheme.colors.bg).toBe('#dde2e8')
    expect(defaultTheme.colors.text).toBe('#00365c')
  })
})
