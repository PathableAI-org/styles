#!/usr/bin/env node
/**
 * Storybook evidence report.
 *
 * Reports three separate measures for the shared Accordion contract, so story
 * presence is never conflated with capability coverage or accessibility
 * execution:
 *   1. Deterministic state fixtures (story presence).
 *   2. Executable behavior-contract adoption (capabilities proven).
 *   3. Automated accessibility (Axe) execution.
 *
 * It does NOT aggregate these into a single "green" number, does NOT label any
 * result WCAG certification, and treats visual smoke and manual
 * keyboard/focus/assistive-technology review as separate evidence outside this
 * report.
 *
 * Contract adoption is read from `scripts/.storybook-evidence.json`, written by
 * `scripts/test-storybook.mjs` after a green target run. Without it, adoption is
 * reported as "not yet executed" rather than assumed.
 *
 * Usage:
 *   node scripts/storybook-evidence-report.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { accessibilityExceptions } from './accessibility-exceptions.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')

const manifestModule = await import(
  resolve(repoRoot, 'packages/storybook-contracts/dist/accordion/manifest.js')
)
const manifest = manifestModule.accordionManifest

const target = 'styles'
const storyId = 'Components/Communication/Accordion'
const stylesStories = {
  'accordion.default': 'components-communication-accordion--default',
  'accordion.first-expanded':
    'components-communication-accordion--initially-expanded',
}

const evidencePath = resolve(here, '.storybook-evidence.json')
const evidence = existsSync(evidencePath)
  ? JSON.parse(readFileSync(evidencePath, 'utf8'))
  : null

function axeExecution() {
  const runnerPath = resolve(
    repoRoot,
    'apps/storybook/.storybook/test-runner.js',
  )
  const source = readFileSync(runnerPath, 'utf8')
  const wired =
    /injectAxe|checkA11y/.test(source) && /axe-playwright/.test(source)
  return {
    wired,
    bound: wired ? 'postVisit (every rendered story)' : 'not wired',
    note: wired
      ? 'Axe runs in postVisit against every rendered Styles story.'
      : 'Axe is NOT wired for the Styles target.',
  }
}

const targetEvidence = evidence?.targets?.[target] ?? null
const axe = axeExecution()

const fixtures = manifest.fixtures.map((f) => ({
  ...f,
  story: stylesStories[f.name] ?? 'UNREGISTERED',
}))

const capabilities = manifest.shared.map((c) => ({
  id: c.id,
  label: c.label,
  adopted:
    targetEvidence?.passed === true ? 'play (green run)' : 'not yet executed',
}))

const exceptions = accessibilityExceptions.filter((e) => e.target === target)

process.stdout.write(
  [
    `# Storybook evidence report: ${target} / ${storyId}`,
    '',
    'Separate measures; never labeled WCAG certification. Visual smoke and',
    'manual keyboard/focus/assistive-technology review are separate evidence.',
    '',
    `## 1. Deterministic state fixtures (story presence)`,
    ...fixtures.map(
      (f) => `- ${f.name} → \`${f.story}\` (firstExpanded: ${f.firstExpanded})`,
    ),
    '',
    `## 2. Executable behavior-contract adoption (capabilities)`,
    ...capabilities.map((c) => `- ${c.id} — ${c.label}: ${c.adopted}`),
    '',
    `## 3. Automated accessibility (Axe) execution`,
    `- ${axe.note}`,
    `- Scope: ${axe.bound}`,
    '',
    `## Exceptions (${exceptions.length})`,
    ...exceptions.map(
      (e) => `- ${e.story} :: ${e.rule} :: ${e.rationale} (${e.tracking})`,
    ),
  ].join('\n') + '\n',
)

// A green run is required to claim adoption: a story ID alone is not coverage.
process.exitCode = targetEvidence?.passed === true ? 0 : 1
