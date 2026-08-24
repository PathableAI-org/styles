/**
 * Semantic tone vocabulary — shared internal types consumed by `Text` (09),
 * future `Surface` (12), and other primitives. Each tone role maps to a
 * BEM modifier class grounded in a verified `@pathableai/styles` SCSS contract.
 *
 * @see specs/053-semantic-color-tones/contracts/tone-vocabulary.md
 * @see specs/053-semantic-color-tones/research.md
 *
 * ## Text tones — VERIFIED
 *
 * | Value     | SCSS source          | Class                          | Token                          |
 * |-----------|----------------------|--------------------------------|--------------------------------|
 * | default   | pathable-text.scss   | pathable-text--tone-default    | --pathable-color-text          |
 * | muted     | pathable-text.scss   | pathable-text--tone-muted      | --pathable-color-text-muted    |
 * | danger    | pathable-text.scss   | pathable-text--tone-danger     | --pathable-color-danger        |
 * | success   | pathable-text.scss   | pathable-text--tone-success    | --pathable-color-text-success  |
 *
 * ## Surface tones — TRACKED GAP (owner: feature 12 `Surface`)
 *
 * | Value     | SCSS source  | Class    | Token (candidate)                                            |
 * |-----------|--------------|----------|--------------------------------------------------------------|
 * | default   | GAP          | (TBD)    | --pathable-color-surface                                     |
 * | subtle    | GAP          | (TBD)    | --pathable-color-bg                                          |
 * | primary   | GAP          | (TBD)    | --pathable-color-accent or --pathable-color-action-primary-bg|
 *
 * ## Border tones — TRACKED GAP (no owning feature)
 *
 * | Value     | SCSS source  | Class    | Token (candidate)           |
 * |-----------|--------------|----------|-----------------------------|
 * | default   | GAP          | (TBD)    | --pathable-color-border     |
 * | danger    | GAP          | (TBD)    | --pathable-color-danger     |
 */

/** Semantic meaning categories for text content. */
export type TextTone = 'default' | 'muted' | 'danger' | 'success'

/** Semantic meaning categories for surfaces/containers. */
export type SurfaceTone = 'default' | 'subtle' | 'primary'

/** Semantic meaning categories for boundaries/borders. */
export type BorderTone = 'default' | 'danger'

const TEXT_TONE_CLASS: Record<TextTone, string> = {
  default: 'pathable-text--tone-default',
  muted: 'pathable-text--tone-muted',
  danger: 'pathable-text--tone-danger',
  success: 'pathable-text--tone-success',
}

/**
 * Pure resolver mapping a `TextTone` value to its BEM modifier class.
 * Returns undefined for null / undefined / unknown values (runtime fallback).
 * No browser globals; deterministic server/client output.
 */
export function textToneClass(value?: string | null): string | undefined {
  if (value == null) return undefined
  return (TEXT_TONE_CLASS as Record<string, string | undefined>)[value]
}
