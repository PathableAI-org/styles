#!/usr/bin/env node

/**
 * Storybook Coverage Reporter
 *
 * Reads apps/storybook/storybook-static/index.json and asserts expected
 * story IDs exist per category. Outputs a Markdown table and JSON report
 * to apps/storybook/test-results/. Exits non-zero on missing stories.
 *
 * Usage:
 *   node packages/styles/scripts/storybook-coverage.mjs
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const STATIC_DIR = resolve('apps/storybook/storybook-static')
const RESULTS_DIR = resolve('apps/storybook/test-results')

// ---------------------------------------------------------------------------
// Expected stories per category
// ---------------------------------------------------------------------------

const EXPECTED_COVERAGE = {
  Brand: ['brand-color-usage--default', 'brand-typography--default'],
  'Basic components': [
    'components-button--primary',
    'components-button-group--default',
    'components-card--default',
    'components-link--default',
    'components-list--default',
    'components-table--default',
    'components-tag--default',
  ],
  'Form controls': [
    'components-form-controls-checkbox--default',
    'components-form-controls-combo-box--default',
    'components-form-controls-input--default',
    'components-form-controls-radio--default',
    'components-form-controls-select--default',
    'components-form-controls-textarea--default',
  ],
  Navigation: [
    'components-navigation-breadcrumb--default',
    'components-navigation-header--default',
    'components-navigation-pagination--default',
    'components-navigation-search--default',
    'components-navigation-sidenav--default',
  ],
  Feedback: [
    'components-feedback-emptystate--no-data',
    'components-feedback-loading--default',
    'components-feedback-pageerror--full-page',
    'components-feedback-skeleton--card',
    'components-feedback-toast--stacked',
  ],
  'Discovery / Resource Finder': [
    'discovery-filter-bar--default',
    'discovery-filter-pill--default',
    'discovery-resource-card--grid',
    'discovery-wayfinder--default',
  ],
  'Structured Workflow / Wizard': [
    'structured-workflow-wizard--wizard-long-form',
    'structured-workflow-wizard--mobile',
    'structured-workflow-workflow-panel--default',
  ],
  Dashboard: [
    'dashboard-dashboard-overview--populated',
    'dashboard-dashboard-header--with-many-actions',
    'dashboard-kpi-grid--default',
    'dashboard-table-modifiers--with-actions',
  ],
  'App Shell': [
    'application-shell-desktop-shell--default',
    'application-shell-mobile-shell--default',
  ],
  'Founder Recipes': [
    'recipes-tool-landing-page--desktop',
    'recipes-tool-landing-page--mobile',
    'recipes-questionnaire-results-flow--mobile',
    'recipes-questionnaire-results-flow--questionnaire',
    'recipes-questionnaire-results-flow--results',
    'recipes-resource-finder--empty',
    'recipes-resource-finder--mobile',
    'recipes-resource-finder--populated',
    'recipes-accommodations-intake-wizard--completed',
    'recipes-accommodations-intake-wizard--in-progress',
    'recipes-accommodations-intake-wizard--mobile',
    'recipes-operational-dashboard--empty',
    'recipes-operational-dashboard--loading',
    'recipes-operational-dashboard--mobile',
    'recipes-operational-dashboard--populated',
  ],
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const indexPath = resolve(STATIC_DIR, 'index.json')

  let index
  try {
    index = JSON.parse(await readFile(indexPath, 'utf-8'))
  } catch {
    console.error(`Error: Storybook index.json not found at ${indexPath}.`)
    console.error(
      'Build the Storybook first: pnpm --filter @pathable/storybook build-storybook',
    )
    process.exit(1)
  }

  const entries = index.entries || {}
  const storyIds = Object.keys(entries)

  // Per-category check
  const results = []
  let totalExpected = 0
  let totalMissing = 0
  const allMissing = []

  for (const [category, expectedIds] of Object.entries(EXPECTED_COVERAGE)) {
    const missing = expectedIds.filter((id) => !storyIds.includes(id))
    const found = expectedIds.length - missing.length
    totalExpected += expectedIds.length
    totalMissing += missing.length
    results.push({
      category,
      expected: expectedIds.length,
      found,
      missing: missing.length,
      missingIds: missing,
    })
    allMissing.push(...missing)
  }

  // Console report
  console.log('=== Storybook Coverage Report ===\n')
  for (const r of results) {
    const status = r.missing === 0 ? '✓' : '✗'
    console.log(
      `   ${status} ${r.category}: ${r.found}/${r.expected} stories found`,
    )
    if (r.missing > 0) {
      for (const mid of r.missingIds) {
        console.log(`      Missing: ${mid}`)
      }
    }
  }

  console.log(
    `\n   Total: ${totalExpected - totalMissing}/${totalExpected} stories found`,
  )

  // Write Markdown report
  await mkdir(RESULTS_DIR, { recursive: true })

  const mdPath = resolve(RESULTS_DIR, 'storybook-coverage.md')
  let md = '# Storybook Coverage Report\n\n'
  md += '| Category | Expected | Found | Missing | Status |\n'
  md += '| --- | --- | --- | --- | --- |\n'
  for (const r of results) {
    const statusIcon = r.missing === 0 ? '✅' : '❌'
    md += `| ${r.category} | ${r.expected} | ${r.found} | ${r.missing} | ${statusIcon} |\n`
  }
  md += `\n**Total:** ${totalExpected - totalMissing}/${totalExpected} stories found\n`
  if (allMissing.length > 0) {
    md += '\n## Missing Stories\n\n'
    for (const r of results.filter((x) => x.missing > 0)) {
      md += `### ${r.category}\n\n`
      for (const mid of r.missingIds) {
        md += `- \`${mid}\`\n`
      }
      md += '\n'
    }
  }
  await writeFile(mdPath, md)
  console.log(`\n   Markdown report: ${mdPath}`)

  // Write JSON report
  const jsonPath = resolve(RESULTS_DIR, 'storybook-coverage.json')
  const jsonReport = {
    timestamp: new Date().toISOString(),
    totalStories: storyIds.length,
    coverageExpected: totalExpected,
    coverageFound: totalExpected - totalMissing,
    coverageMissing: totalMissing,
    categories: results,
  }
  await writeFile(jsonPath, JSON.stringify(jsonReport, null, 2) + '\n')
  console.log(`   JSON report: ${jsonPath}`)

  if (allMissing.length > 0) {
    console.log(
      `\n✗ ${allMissing.length} expected story IDs are missing from the Storybook index.`,
    )
    process.exit(1)
  }

  console.log('\n✓ All expected stories are present in the Storybook index.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
