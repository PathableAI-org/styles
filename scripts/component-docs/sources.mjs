/**
 * Reads the three sources a component page is built from: the source page in
 * components/, the HTML fixtures in fixtures/<slug>/ and, for components the
 * React package covers, the example modules in
 * packages/react/src/components/<Name>/examples/.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { consumerSource } from './imports.mjs'
import {
  fixtureManifestPath,
  fixturesDir,
  reactComponentsDir,
} from './paths.mjs'
import { ComponentDocsError } from './segments.mjs'

const DESCRIPTION = /^\s*<!--\s*description:([\s\S]*?)-->[ \t]*\n?/u

/**
 * Splits a fixture into its optional leading description comment and its
 * markup. The markup is the rest of the file, verbatim.
 */
export function parseFixture(source) {
  const match = source.match(DESCRIPTION)
  if (!match) return { description: undefined, html: source }
  return {
    description: match[1].replace(/\s+/gu, ' ').trim(),
    html: source.slice(match[0].length),
  }
}

/** The fixtures of one component folder: state name to parsed fixture. */
export function readFixtures(slug, root = fixturesDir) {
  const dir = join(root, slug)
  if (!existsSync(dir)) return new Map()
  return new Map(
    readdirSync(dir)
      .filter((file) => file.endsWith('.html'))
      .sort()
      .map((file) => [
        basename(file, '.html'),
        parseFixture(readFileSync(join(dir, file), 'utf8')),
      ]),
  )
}

/**
 * The example modules of one React component: state name to module source as
 * a consumer writes it (verbatim, but for relative component imports, which
 * become imports from @pathableai/react; see imports.mjs). Each module is
 * named exactly like the fixture it renders. Throws ComponentDocsError when
 * an import cannot be mapped.
 */
export function readExamples(component, root = reactComponentsDir) {
  const dir = join(root, component, 'examples')
  if (!existsSync(dir)) return new Map()
  const examples = new Map()
  const problems = []
  for (const file of readdirSync(dir)
    .filter((name) => name.endsWith('.tsx'))
    .sort()) {
    const path = join(dir, file)
    try {
      examples.set(
        basename(file, '.tsx'),
        consumerSource(path, readFileSync(path, 'utf8')),
      )
    } catch (error) {
      problems.push(...error.message.split('\n'))
    }
  }
  if (problems.length > 0) throw new ComponentDocsError(problems)
  return examples
}

/**
 * The React package's fixture coverage, from its fixture manifest
 * (packages/react/src/test/fixture-manifest.ts, which the React fixture
 * coverage test also reads): fixture folder (page slug) to
 * { component, notOffered }, where `notOffered` maps the states React does not
 * offer to the reason.
 */
export async function readCoverage(manifest = fixtureManifestPath) {
  const { fixtureManifest } = await import(pathToFileURL(manifest).href)
  return new Map(
    Object.entries(fixtureManifest).map(([slug, mapping]) => [
      slug,
      { component: mapping.component, notOffered: mapping.notOffered ?? {} },
    ]),
  )
}

export { fixturesDir, reactComponentsDir, repoRoot } from './paths.mjs'
