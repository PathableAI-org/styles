/**
 * Renders each fixture in a browser with the compiled stylesheet and runs axe.
 *
 *   node harness/axe.mjs [folder …]    default: every component folder
 *
 * Each fixture gets its own page, built from harness/page.html: its head
 * links /dist/css/<file> for each CSS module the fixture needs (modulesFor in
 * modules.mjs: the modules owning its `pathable-*` classes, what they
 * require, base and utilities), not the full bundle. The @pathableai/styles
 * package root is served at /, so the modules' ../../fonts and ../../img
 * references resolve to the package's own fonts and images; a missing asset
 * fails the run, and so does a linked stylesheet that did not load. The page
 * has one empty <main>. Each
 * fixture is injected into that <main> and checked at a desktop and a phone
 * viewport, because some parts (such as an activity row's trailing actions)
 * are only visible at one of them.
 *
 * Only page-level rules are off, because a fixture is a fragment of a page,
 * not a page; fixtures/README.md gives the reason for each. Any violation
 * fails, and so does any "incomplete" result (a rule axe could not decide,
 * which needs a person to look): there is no exceptions mechanism. Both are
 * listed in the output and, in GitHub Actions, in the job summary. A JSON report is written to
 * .cache/axe-report.json (or the path in FIXTURES_AXE_REPORT).
 */

import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

import { stylesCssPath } from './css.mjs'
import { fixtureFiles, fixturesRoot, foldersFromArgs } from './folders.mjs'
import { moduleHref, modulesFor, readManifest, renderPage } from './modules.mjs'

/** Page-level rules that cannot apply to a fragment; see README.md. */
export const DISABLED_RULES = [
  'region',
  'landmark-one-main',
  'page-has-heading-one',
]

export const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'phone', width: 375, height: 800 },
]

/** Roles whose repeated instances must have unique accessible names. */
const NAMED_CONTROL_ROLES = new Set(['button', 'link'])

/**
 * Finds buttons and links that share an accessible name. `controls` is a list
 * of `{ role, name }`, as read from the browser's accessibility tree. axe has
 * no rule for this, so the harness checks it itself (README ARIA rule 4).
 */
export function duplicateControlNames(controls) {
  const seen = new Map()
  for (const { role, name } of controls) {
    if (!NAMED_CONTROL_ROLES.has(role)) continue
    const key = `${role} "${name}"`
    seen.set(key, (seen.get(key) ?? 0) + 1)
  }
  return [...seen].filter(([, count]) => count > 1).map(([key]) => key)
}

/** The role and computed accessible name of every exposed node on the page. */
async function accessibleNodes(cdp) {
  const { nodes } = await cdp.send('Accessibility.getFullAXTree')
  return nodes
    .filter((node) => !node.ignored)
    .map((node) => ({
      role: node.role?.value ?? '',
      name: node.name?.value ?? '',
    }))
}

/** The parts of an axe rule result the report and the output keep. */
function summarizeRule(rule) {
  return {
    id: rule.id,
    impact: rule.impact,
    help: rule.help,
    helpUrl: rule.helpUrl,
    nodes: rule.nodes.map((node) => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary,
    })),
  }
}

/**
 * Every failing rule result in a report, violations and incomplete results
 * alike, as `{ fixture, viewport, kind, rule }`.
 */
export function problemsOf(report) {
  return report.results.flatMap((result) => [
    ...result.violations.map((rule) => ({
      ...result,
      kind: 'violation',
      rule,
    })),
    ...result.incomplete.map((rule) => ({
      ...result,
      kind: 'incomplete',
      rule,
    })),
  ])
}

/**
 * One Markdown table cell of plain text: whitespace collapsed, and the
 * characters Markdown or HTML would interpret (`&`, `<`, `>`, `|`, backtick)
 * escaped, so axe messages such as "does not have a <ul> parent" stay
 * readable.
 */
export const cell = (text) =>
  String(text ?? '')
    .replace(/\s+/gu, ' ')
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/\|/gu, '\\|')
    .replace(/`/gu, "'")

/** A Markdown job summary of the run: counts, then one row per node. */
export function renderSummary(report) {
  const problems = problemsOf(report)
  const lines = [
    '## Fixture axe results',
    '',
    `${report.results.length} run(s) over ${report.folders.length} folder(s): ${problems.filter((p) => p.kind === 'violation').length} violation(s), ${problems.filter((p) => p.kind === 'incomplete').length} incomplete result(s).`,
  ]
  if (problems.length === 0) return `${lines.join('\n')}\n`
  lines.push(
    '',
    'Incomplete results fail the run too: axe could not decide the rule, so a person has to.',
    '',
    '| Fixture | Viewport | Kind | Rule | Node | Detail |',
    '| ------- | -------- | ---- | ---- | ---- | ------ |',
  )
  for (const { fixture, viewport, kind, rule } of problems) {
    for (const node of rule.nodes) {
      lines.push(
        `| ${cell(fixture)} | ${viewport} | ${kind} | ${cell(rule.id)} (${cell(rule.impact)}) | ${cell(node.target.join(' '))} | ${cell(node.failureSummary || rule.help)} |`,
      )
    }
  }
  return `${lines.join('\n')}\n`
}

export const ORIGIN = 'http://fixtures.test'
const CONTENT_TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

/** The @pathableai/styles package root, which the harness serves at /. */
export const stylesPackageDir = () => dirname(dirname(stylesCssPath()))

/**
 * Serves `state.html` at / and everything else from the styles package root,
 * and /assets/ is also served from the package root, where img/ is. Set
 * `state.html` before each navigation. Paths that are not found are added to
 * `missing`.
 */
export async function serve(context, packageDir, missing, state) {
  await context.route(`${ORIGIN}/**`, async (route) => {
    const { pathname } = new URL(route.request().url())
    if (pathname === '/') {
      await route.fulfill({ body: state.html, contentType: 'text/html' })
      return
    }
    // Fixtures reference the sprite at /assets/img/sprite.svg, where an
    // application serves the package root, which holds img/.
    const served = decodeURIComponent(pathname).replace(/^\/assets\//u, '/')
    const file = normalize(join(packageDir, served))
    if (!file.startsWith(packageDir)) {
      await route.fulfill({ status: 403 })
      return
    }
    try {
      await route.fulfill({
        body: readFileSync(file),
        contentType: CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      })
    } catch {
      missing.add(pathname)
      await route.fulfill({ status: 404 })
    }
  })
}

/** The page for a fixture that links the modules it needs, and that list. */
export function modulePage(html, manifest) {
  const names = modulesFor(html, manifest)
  const hrefs = names.map((name) => moduleHref(manifest, name))
  return { names, page: renderPage(hrefs) }
}

/** Throws unless every stylesheet the page links loaded with rules. */
export async function assertStylesheetsLoaded(page, expected, label) {
  const loaded = await page.evaluate(() =>
    [...document.styleSheets].map((sheet) => {
      try {
        return sheet.cssRules.length
      } catch {
        return 0
      }
    }),
  )
  if (loaded.length !== expected || loaded.some((rules) => rules === 0)) {
    throw new Error(`${label}: a linked stylesheet did not load`)
  }
}

export async function runAxe(folders, root = fixturesRoot) {
  const packageDir = stylesPackageDir()
  const manifest = readManifest()
  const missing = new Set()
  const browser = await chromium.launch()
  const results = []
  let axeVersion
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      })
      const state = { html: '' }
      await serve(context, packageDir, missing, state)
      const page = await context.newPage()
      const cdp = await context.newCDPSession(page)
      for (const folder of folders) {
        for (const file of fixtureFiles(folder, root)) {
          const html = readFileSync(join(root, folder, file), 'utf8')
          const { names, page: pageHtml } = modulePage(html, manifest)
          state.html = pageHtml
          await page.goto(`${ORIGIN}/`)
          await assertStylesheetsLoaded(
            page,
            names.length,
            `${folder}/${file} (${viewport.name})`,
          )
          await page.locator('#fixture').evaluate((main, markup) => {
            main.innerHTML = markup
          }, html)
          await page.evaluate(() => document.fonts.ready)
          const axe = await new AxeBuilder({ page })
            .disableRules(DISABLED_RULES)
            .analyze()
          axeVersion = axe.testEngine.version
          const duplicates = duplicateControlNames(await accessibleNodes(cdp))
          const violations = axe.violations.map(summarizeRule)
          if (duplicates.length > 0) {
            violations.push({
              id: 'fixtures-unique-control-name',
              impact: 'serious',
              help: 'Repeated buttons and links must have unique accessible names (fixtures/README.md, ARIA rule 4)',
              helpUrl: null,
              nodes: duplicates.map((key) => ({
                target: [key],
                html: key,
                failureSummary: `More than one ${key} in the fixture`,
              })),
            })
          }
          results.push({
            fixture: `${folder}/${file}`,
            viewport: viewport.name,
            violations,
            passes: axe.passes.length,
            incomplete: axe.incomplete.map(summarizeRule),
          })
        }
      }
      await context.close()
    }
  } finally {
    await browser.close()
  }
  if (missing.size > 0) {
    throw new Error(
      `the stylesheet requested files that do not exist: ${[...missing].sort().join(', ')}`,
    )
  }
  return {
    axeVersion,
    disabledRules: DISABLED_RULES,
    folders,
    results,
  }
}

async function main(argv) {
  const folders = foldersFromArgs(argv)
  const report = await runAxe(folders)
  const reportPath = resolve(
    process.env.FIXTURES_AXE_REPORT ??
      join(fixturesRoot, '.cache/axe-report.json'),
  )
  mkdirSync(dirname(reportPath), { recursive: true })
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  const problems = problemsOf(report)
  for (const { fixture, viewport, kind, rule } of problems) {
    process.stderr.write(
      `[fixtures:axe] ${fixture} (${viewport}): ${kind} ${rule.id} (${rule.impact}) ${rule.help}\n`,
    )
    for (const node of rule.nodes) {
      process.stderr.write(`    ${node.target.join(' ')}: ${node.html}\n`)
      if (node.failureSummary)
        process.stderr.write(
          `      ${node.failureSummary.replace(/\n/gu, '\n      ')}\n`,
        )
    }
  }
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, renderSummary(report))
  const count = (kind) => problems.filter((p) => p.kind === kind).length
  process.stdout.write(
    `[fixtures:axe] ${report.results.length} run(s) over ${folders.length} folder(s); ${count('violation')} violation(s), ${count('incomplete')} incomplete result(s); report: ${reportPath}\n`,
  )
  if (problems.length > 0) process.exitCode = 1
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`[fixtures:axe] ${error.stack ?? error.message}\n`)
    process.exitCode = 1
  })
}
