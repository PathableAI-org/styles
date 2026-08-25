import type { ThemeConfig } from './tokens.js'

/**
 * The canonical default theme — the complete 25-token semantic color set,
 * copied byte-for-byte from the `$semantic-colors` map in
 * `packages/styles/src/_semantic.scss`.
 *
 * @see specs/059-default-theme-create-theme/contracts/default-theme.md
 */
export const defaultTheme: ThemeConfig = {
  colors: {
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
  },
}
