#!/usr/bin/env node
/**
 * Storybook evidence report.
 *
 * Reports three separate measures per component in the rollout ledger, so story
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
 * `scripts/test-storybook.mjs` after a green target run. The rollout ledger
 * (from `@pathable/storybook-contracts`) is validated before it is trusted; a
 * ledger entry claiming `styles-proven`/`adopted` with no green run, or a
 * `styles-only` surface shown as shared adoption, is a failure. Without it,
 * adoption is reported as "not yet executed" rather than assumed.
 *
 * Usage:
 *   node scripts/storybook-evidence-report.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getExceptionsFor } from './accessibility-exceptions.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')

const ledgerPath = resolve(
  repoRoot,
  'packages/storybook-contracts/dist/rollout/rollout.js',
)

if (!existsSync(ledgerPath)) {
  process.stderr.write(
    'Rollout ledger is not built. Run `pnpm --filter @pathable/storybook-contracts build` (or the styles Storybook command) before generating the evidence report.\n',
  )
  process.exit(1)
}

const { rolloutLedger, validateRolloutLedger } = await import(ledgerPath)

const target = 'styles'
const evidencePath = resolve(here, '.storybook-evidence.json')
const evidence = existsSync(evidencePath)
  ? JSON.parse(readFileSync(evidencePath, 'utf8'))
  : null

const targetEvidence = evidence?.targets?.[target] ?? null
const targetGreen = targetEvidence?.passed === true

// ---- Ledger invariants ----
const ledgerProblems = validateRolloutLedger(rolloutLedger)
if (ledgerProblems.length > 0) {
  process.stderr.write(
    `Rollout ledger invariants violated:\n${ledgerProblems
      .map((p) => `  - ${p}`)
      .join('\n')}\n`,
  )
  process.exitCode = 1
  // A ledger with invariant violations cannot be trusted; stop.
  if (!process.env.EVIDENCE_ALLOW_BROKEN) {
    process.exit(1)
  }
}

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

const axe = axeExecution()

/** A ledger entry claims proof only if a green target run exists. */
function adoptionStatus(entry) {
  if (entry.category === 'styles-only') {
    return {
      measure: 'styles-only (fixtures, semantics, viewport pressure, Axe)',
      adopted: 'styles-only surface',
    }
  }
  if (entry.status === 'adopted' || entry.status === 'styles-proven') {
    return {
      measure: targetGreen
        ? 'play (green run)'
        : 'styles-proven recorded; no green run yet',
      adopted: targetGreen
        ? `styles-proven (${entry.status})`
        : 'recorded but not yet executed',
    }
  }
  return {
    measure: 'not-started',
    adopted: 'not yet executed',
  }
}

const lines = [
  `# Storybook evidence report: ${target} — component rollout`,
  '',
  'Separate measures; never labeled WCAG certification. Visual smoke and',
  'manual keyboard/focus/assistive-technology review are separate evidence.',
  '',
]

for (const entry of rolloutLedger) {
  const status = adoptionStatus(entry)
  const exceptions = getExceptionsFor(target, entry.storyId)
  lines.push(
    `## ${entry.name} (${entry.wave}) — ${entry.category} / ${entry.status}`,
    '',
    `### 1. Deterministic state fixtures (story presence)`,
    ...(entry.fixtures.length
      ? entry.fixtures.map((f) => `- ${f.name} → \`${f.storyId}\``)
      : entry.category === 'styles-only'
        ? [
            '- styles-only surface: deterministic states, semantics, viewport/content pressure, Axe',
          ]
        : ['- (none registered)']),
    '',
    `### 2. Executable behavior-contract adoption`,
    ...(entry.capabilities.length
      ? entry.capabilities.map(
          (c) => `- ${c.id} — ${c.label}: ${status.adopted}`,
        )
      : ['- styles-only surface (no shared capabilities)']),
    '',
    `### 3. Automated accessibility (Axe) execution`,
    `- ${axe.note}`,
    `- Scope: ${axe.bound}`,
    '',
    `### Exceptions (${exceptions.length})`,
    ...(exceptions.length
      ? exceptions.map(
          (e) => `- ${e.story} :: ${e.rule} :: ${e.rationale} (${e.tracking})`,
        )
      : ['- None']),
    '',
  )
}

process.stdout.write(lines.join('\n') + '\n')

// A green run is required to claim adoption: a story ID alone is not coverage.
const anySharedProven = rolloutLedger.some(
  (e) =>
    e.category === 'shared' &&
    (e.status === 'styles-proven' || e.status === 'adopted') &&
    targetGreen,
)
process.exitCode =
  ledgerProblems.length === 0 && (anySharedProven || targetGreen) ? 0 : 1
