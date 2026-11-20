/**
 * Renders each fixture in a browser with the compiled stylesheet and runs axe.
 *
 *   node harness/axe.mjs [folder …]    default: every component folder
 *
 * harness/page.html links /styles.css (served from @pathableai/styles/dist,
 * with the fonts and icons it references) and has one empty <main>. Each
 * fixture is injected into that <main> and checked at a desktop and a phone
 * viewport, because some parts (such as an activity row's trailing actions)
 * are only visible at one of them.
 *
 * Only page-level rules are off, because a fixture is a fragment of a page,
 * not a page; fixtures/README.md gives the reason for each. Any violation
 * fails: there is no exceptions mechanism. A JSON report is written to
 * reports/axe-report.json (or the path in FIXTURES_AXE_REPORT).
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

import { stylesCssPath } from './css.mjs'
import { fixtureFiles, fixturesRoot, foldersFromArgs } from './folders.mjs'

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
 * Finds buttons and links that share an accessible name, from a Playwright
 * ARIA snapshot (lines such as `- button "View Intake assessment"`). axe has
 * no rule for this, so the harness checks it itself (README ARIA rule 4).
 */
export function duplicateControlNames(snapshot) {
  const seen = new Map()
  for (const [, role, name] of snapshot.matchAll(
    /^\s*- (\w+) "((?:[^"\\]|\\.)*)"/gmu,
  )) {
    if (!NAMED_CONTROL_ROLES.has(role)) continue
    const key = `${role} "${name}"`
    seen.set(key, (seen.get(key) ?? 0) + 1)
  }
  return [...seen].filter(([, count]) => count > 1).map(([key]) => key)
}

const ORIGIN = 'http://fixtures.test'
const CONTENT_TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

/** Serves page.html at / and everything else from the styles dist folder. */
async function serve(context, distDir) {
  const pageHtml = readFileSync(join(import.meta.dirname, 'page.html'))
  await context.route(`${ORIGIN}/**`, async (route) => {
    const { pathname } = new URL(route.request().url())
    if (pathname === '/') {
      await route.fulfill({ body: pageHtml, contentType: 'text/html' })
      return
    }
    const file = normalize(join(distDir, decodeURIComponent(pathname)))
    if (!file.startsWith(distDir)) {
      await route.fulfill({ status: 403 })
      return
    }
    try {
      await route.fulfill({
        body: readFileSync(file),
        contentType: CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      })
    } catch {
      await route.fulfill({ status: 404 })
    }
  })
}

export async function runAxe(folders, root = fixturesRoot) {
  const distDir = dirname(stylesCssPath())
  const browser = await chromium.launch()
  const results = []
  let axeVersion
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      })
      await serve(context, distDir)
      const page = await context.newPage()
      await page.goto(`${ORIGIN}/`)
      const rules = await page.evaluate(
        () => document.styleSheets[0]?.cssRules.length ?? 0,
      )
      if (rules === 0) throw new Error('page.html did not load styles.css')
      for (const folder of folders) {
        for (const file of fixtureFiles(folder, root)) {
          const html = readFileSync(join(root, folder, file), 'utf8')
          await page.goto(`${ORIGIN}/`)
          await page.locator('#fixture').evaluate((main, markup) => {
            main.innerHTML = markup
          }, html)
          await page.evaluate(() => document.fonts.ready)
          const axe = await new AxeBuilder({ page })
            .disableRules(DISABLED_RULES)
            .analyze()
          axeVersion = axe.testEngine.version
          const duplicates = duplicateControlNames(
            await page.locator('#fixture').ariaSnapshot(),
          )
          const violations = axe.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            help: violation.help,
            helpUrl: violation.helpUrl,
            nodes: violation.nodes.map((node) => ({
              target: node.target,
              html: node.html,
              failureSummary: node.failureSummary,
            })),
          }))
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
            incomplete: axe.incomplete.map((item) => item.id),
          })
        }
      }
      await context.close()
    }
  } finally {
    await browser.close()
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
      join(fixturesRoot, 'reports/axe-report.json'),
  )
  mkdirSync(dirname(reportPath), { recursive: true })
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  let violations = 0
  for (const result of report.results) {
    for (const violation of result.violations) {
      violations += 1
      process.stderr.write(
        `[fixtures:axe] ${result.fixture} (${result.viewport}): ${violation.id} (${violation.impact}) ${violation.help}\n`,
      )
      for (const node of violation.nodes)
        process.stderr.write(`    ${node.target.join(' ')}: ${node.html}\n`)
    }
  }
  process.stdout.write(
    `[fixtures:axe] ${report.results.length} run(s) over ${folders.length} folder(s); ${violations} violation(s); report: ${reportPath}\n`,
  )
  if (violations > 0) process.exitCode = 1
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
