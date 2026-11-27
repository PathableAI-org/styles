/**
 * Checks that loading only the CSS modules a fixture needs renders it the same
 * as loading the full bundle.
 *
 *   node harness/modules-check.mjs [folder …]    default: every component folder
 *
 * Each fixture is rendered at axe.mjs's two viewports on two pages: one that
 * links only /dist/styles.css, and one that links the modules modulesFor
 * picks. After document.fonts.ready, every element under <html> (the <head>
 * and what it holds are skipped: the two pages link different stylesheets
 * there) and its ::before and ::after are read through getComputedStyle, every
 * property, and compared element by element in document order. Any difference
 * fails the run.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import { chromium } from 'playwright'

import {
  ORIGIN,
  VIEWPORTS,
  modulePage,
  serve,
  stylesPackageDir,
} from './axe.mjs'
import { fixtureFiles, fixturesRoot, foldersFromArgs } from './folders.mjs'
import { readManifest, renderPage } from './modules.mjs'

/** Printed differences per fixture and viewport. */
export const MAX_PRINTED = 20

/**
 * Compares two snapshots, `{ props, rows }`, where each row is
 * `{ path, pseudo, values }` and `values` follows `props`. Returns
 * `{ path, pseudo, property, bundle, modules }` for each difference, with a
 * row-level difference (a different element at that position) reported under
 * the property `(element)`.
 */
export function compareSnapshots(bundle, modules) {
  const differences = []
  const count = Math.max(bundle.rows.length, modules.rows.length)
  const modulesProps = new Map(modules.props.map((name, i) => [name, i]))
  for (let i = 0; i < count; i++) {
    const a = bundle.rows[i]
    const b = modules.rows[i]
    if (!a || !b || a.path !== b.path || a.pseudo !== b.pseudo) {
      differences.push({
        path: (a ?? b).path,
        pseudo: (a ?? b).pseudo,
        property: '(element)',
        bundle: a ? `${a.path}${a.pseudo}` : '(none)',
        modules: b ? `${b.path}${b.pseudo}` : '(none)',
      })
      continue
    }
    bundle.props.forEach((property, index) => {
      const other = modulesProps.has(property)
        ? b.values[modulesProps.get(property)]
        : '(missing)'
      if (a.values[index] !== other) {
        differences.push({
          path: a.path,
          pseudo: a.pseudo,
          property,
          bundle: a.values[index],
          modules: other,
        })
      }
    })
  }
  return differences
}

/** One output line for a difference. */
export function formatDifference(
  label,
  { path, pseudo, property, bundle, modules },
) {
  return `${label}: ${path}${pseudo ? ` ${pseudo}` : ''} ${property}: bundle "${bundle}" vs modules "${modules}"`
}

/** Reads every computed property of every element and its pseudo-elements. */
function snapshotPage() {
  const rows = []
  let props = null
  const pathOf = (element) => {
    const parts = []
    for (
      let node = element;
      node && node.nodeType === 1;
      node = node.parentElement
    ) {
      const index =
        node.parentElement === null
          ? ''
          : `:nth-child(${[...node.parentElement.children].indexOf(node) + 1})`
      parts.unshift(`${node.localName}${node.id ? `#${node.id}` : ''}${index}`)
    }
    return parts.join(' > ')
  }
  const read = (element, pseudo) => {
    const style = getComputedStyle(element, pseudo || null)
    props ??= [...Array(style.length).keys()].map((i) => style[i])
    rows.push({
      path: pathOf(element),
      pseudo,
      values: props.map((name) => style.getPropertyValue(name)),
    })
  }
  for (const element of [
    document.documentElement,
    ...document.documentElement.querySelectorAll('*'),
  ]) {
    if (element.localName === 'head' || element.closest('head')) continue
    read(element, '')
    read(element, '::before')
    read(element, '::after')
  }
  return { props, rows }
}

async function render(page, state, html, pageHtml) {
  state.html = pageHtml
  await page.goto(`${ORIGIN}/`)
  await page.locator('#fixture').evaluate((main, markup) => {
    main.innerHTML = markup
  }, html)
  await page.evaluate(() => document.fonts.ready)
  return page.evaluate(snapshotPage)
}

/** Runs the comparison; returns `{ runs, lines, count }`. */
export async function runModulesCheck(folders, root = fixturesRoot) {
  const packageDir = stylesPackageDir()
  const manifest = readManifest()
  const bundlePage = renderPage(['/dist/styles.css'])
  const missing = new Set()
  const lines = []
  let runs = 0
  let count = 0
  const browser = await chromium.launch()
  try {
    for (const viewport of VIEWPORTS) {
      const size = { width: viewport.width, height: viewport.height }
      const bundleContext = await browser.newContext({ viewport: size })
      const modulesContext = await browser.newContext({ viewport: size })
      const bundleState = { html: bundlePage }
      const modulesState = { html: '' }
      await serve(bundleContext, packageDir, missing, bundleState)
      await serve(modulesContext, packageDir, missing, modulesState)
      const bundleTab = await bundleContext.newPage()
      const modulesTab = await modulesContext.newPage()
      for (const folder of folders) {
        for (const file of fixtureFiles(folder, root)) {
          const html = readFileSync(join(root, folder, file), 'utf8')
          const label = `${folder}/${file} (${viewport.name})`
          const bundle = await render(bundleTab, bundleState, html, bundlePage)
          const { page } = modulePage(html, manifest)
          const modules = await render(modulesTab, modulesState, html, page)
          const differences = compareSnapshots(bundle, modules)
          runs += 1
          count += differences.length
          for (const difference of differences.slice(0, MAX_PRINTED)) {
            lines.push(formatDifference(label, difference))
          }
          if (differences.length > MAX_PRINTED) {
            lines.push(
              `${label}: … ${differences.length - MAX_PRINTED} more difference(s)`,
            )
          }
        }
      }
      await bundleContext.close()
      await modulesContext.close()
    }
  } finally {
    await browser.close()
  }
  if (missing.size > 0) {
    throw new Error(
      `the stylesheets requested files that do not exist: ${[...missing].sort().join(', ')}`,
    )
  }
  return { runs, lines, count }
}

async function main(argv) {
  const folders = foldersFromArgs(argv)
  const { runs, lines, count } = await runModulesCheck(folders)
  for (const line of lines) process.stderr.write(`[fixtures:modules] ${line}\n`)
  process.stdout.write(
    `[fixtures:modules] ${runs} run(s) over ${folders.length} folder(s); ${count} difference(s)\n`,
  )
  if (count > 0) process.exitCode = 1
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`[fixtures:modules] ${error.stack ?? error.message}\n`)
    process.exitCode = 1
  })
}
