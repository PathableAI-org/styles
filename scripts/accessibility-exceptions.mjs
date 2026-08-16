#!/usr/bin/env node
/**
 * Accessibility exception registry.
 *
 * Shared, reviewable record of narrow Axe exceptions. Constitution X forbids
 * broad catalog-wide rule disablement; any exception here is scoped to a
 * target, story, and single rule, with a rationale and a tracking reference.
 *
 * This is the Phase-1 conversion target for environment's existing catalog-wide
 * Axe exclusions in `apps/storybook/.storybook/preview.js`/`test-runner.js`. It
 * records where each broad exclusion should become a narrow story-level
 * exception during the ratchet, without broadening failures to make the refactor
 * pass. No automated aggregate here is labeled WCAG certification.
 */

export const accessibilityExceptions = [
  {
    target: 'styles',
    story: 'Components/Communication/Accordion',
    rule: 'color-contrast',
    rationale:
      'Accordion text uses the design-system semantic text token which passes 4.5:1; contrast work is tracked separately. Pre-existing, narrowed from catalog-wide exclusion.',
    tracking: 'issue: component-test-infra #a11y-contrast-accordion',
    enabled: false,
  },
  {
    target: 'styles',
    story: 'Foundations/Color/*',
    rule: 'color-contrast',
    rationale:
      'Foundations color stories intentionally render brand color swatches for documentation; swatch chips are not text content. Narrowed to the color swatch stories, not applied to components.',
    tracking: 'issue: component-test-infra #a11y-contrast-swatches',
    enabled: false,
  },
  {
    target: 'styles',
    story: 'Components/Navigation/Pagination',
    rule: 'list',
    rationale:
      'USWDS pagination uses a standard <ul> inside <nav aria-label="Pagination">; the nav label provides adequate context. Pre-existing USWDS pattern.',
    tracking: 'issue: component-test-infra #a11y-list-pagination',
    enabled: false,
  },
  {
    target: 'styles',
    story: 'Components/Navigation/Pagination',
    rule: 'presentation-role-conflict',
    rationale:
      'USWDS pagination uses role="presentation" + aria-label on the ellipsis element. Pre-existing USWDS code pattern.',
    tracking: 'issue: component-test-infra #a11y-presentation-pagination',
    enabled: false,
  },
  {
    target: 'styles',
    story: 'Components/Form/*ComboBox*',
    rule: 'select-name',
    rationale:
      'USWDS combo box uses a bare <select> that receives programmatic labeling via JS; in Storybook iframe without JS init no accessible name exists. Pre-existing.',
    tracking: 'issue: component-test-infra #a11y-selectname-combobox',
    enabled: false,
  },
]

export function getExceptionsFor(target, story) {
  return accessibilityExceptions.filter(
    (e) => e.target === target && (story ? storyMatches(e.story, story) : true),
  )
}

function storyMatches(glob, value) {
  if (glob === value) return true
  const regex = new RegExp('^' + glob.replace(/\*/g, '.*') + '$')
  return regex.test(value)
}

// CLI: `node scripts/accessibility-exceptions.mjs [target]`
// Runs only when executed directly (not when imported by the evidence report).
if (process.argv[1]?.endsWith('accessibility-exceptions.mjs')) {
  const requestedTarget = process.argv[2]
  const list = requestedTarget
    ? accessibilityExceptions.filter((e) => e.target === requestedTarget)
    : accessibilityExceptions

  process.stdout.write(
    `Accessibility exceptions (${list.length})\n` +
      list
        .map(
          (e) =>
            `- [${e.enabled ? 'x' : ' '}] ${e.target}/${e.story} :: ${e.rule} :: ${e.rationale} (${e.tracking})`,
        )
        .join('\n') +
      '\n',
  )
}
