/**
 * Writers: read the sources, render every page for one target and write the
 * output. Each writer removes output files it no longer produces, so a page
 * or fixture folder that is deleted or renamed leaves nothing behind.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { join, relative } from 'node:path'

import {
  outputDir as stylesOutputDir,
  readPages,
} from '../../packages/styles/scripts/component-pages.mjs'

import prettier from 'prettier'

import { modulesFor } from '../../fixtures/harness/modules.mjs'
import { cssManifestPath } from './paths.mjs'
import { render, storybookTitle } from './render.mjs'
import { ComponentDocsError } from './segments.mjs'
import {
  readCoverage,
  readExamples,
  readFixtures,
  repoRoot,
} from './sources.mjs'

export const reactOutputDir = join(
  repoRoot,
  'packages/react/agent-guidance/pathable-react/references/components',
)
export const storybookOutputDir = join(repoRoot, 'apps/storybook/generated')
export const REACT_INDEX = 'index.md'

/**
 * Whether a page is for the Storybook only. A settings page documents how the
 * build configures USWDS, which is not consumer API, so the styles package and
 * the React guidance do not ship it.
 */
export const storybookOnly = (page) => page.data?.kind === 'settings'

/** The parsed CSS module manifest; throws a clear error when unbuilt. */
export function readCssManifest(path = cssManifestPath) {
  if (!existsSync(path)) {
    throw new Error(
      `${relative(repoRoot, path)} is missing: run \`node scripts/build-css-modules.mjs\` (or \`pnpm --filter @pathableai/styles build\`) first`,
    )
  }
  return JSON.parse(readFileSync(path, 'utf8'))
}

/**
 * The CSS module files a page's fixtures need together: the union of
 * modulesFor over every fixture, in manifest order. Empty with no fixture.
 */
export function cssFilesFor(fixtures, manifest) {
  const needed = new Set()
  for (const { html } of fixtures.values()) {
    for (const name of modulesFor(html, manifest)) needed.add(name)
  }
  return manifest.modules
    .filter((module) => needed.has(module.name))
    .map((module) => module.file)
}

/** The sources one page renders from, for every target. */
export async function pageSources(page, coverage, manifest) {
  const { component, notOffered = {} } = coverage.get(page.slug) ?? {}
  const fixtures = readFixtures(page.slug)
  return {
    fixtures,
    cssFiles: manifest ? cssFilesFor(fixtures, manifest) : undefined,
    examples: component ? readExamples(component) : undefined,
    component,
    notOffered,
  }
}

/**
 * Renders every page for one target into a Map of file name to contents.
 * Problems from every page are collected, each prefixed with its page, and
 * thrown together.
 */
export async function renderTarget(target, { pages, coverage } = {}) {
  pages ??= await readPages()
  // The styles pages use only the fixtures, so the styles build reads nothing
  // from the React package.
  coverage ??= target === 'styles' ? new Map() : await readCoverage()
  const files = new Map()
  const problems = []
  // Only the styles target reads the manifest; the others run without a build.
  const manifest = target === 'styles' ? readCssManifest() : undefined
  // The Storybook docs route of each page that has a Storybook page, for the
  // links between pages (a Markdown link to `other.md` does not route there).
  const titles =
    target === 'storybook'
      ? new Map(
          pages
            .filter(
              (page) => storybookOnly(page) || readFixtures(page.slug).size > 0,
            )
            .map((page) => [page.slug, storybookTitle(page)]),
        )
      : undefined

  for (const page of pages) {
    if (target !== 'storybook' && storybookOnly(page)) continue
    try {
      const sources = await pageSources(page, coverage, manifest)
      if (target === 'styles') {
        files.set(page.file, render(page, 'styles', sources))
      } else if (target === 'react') {
        if (sources.component) {
          files.set(
            `${sources.component}.md`,
            await formatMarkdown(render(page, 'react', sources)),
          )
        }
      } else if (target === 'storybook') {
        if (sources.fixtures.size > 0 || storybookOnly(page)) {
          const { mdx, stories } = render(page, 'storybook', {
            ...sources,
            titles,
          })
          files.set(`${page.slug}.mdx`, mdx)
          if (stories !== undefined)
            files.set(`${page.slug}.stories.ts`, stories)
        }
      }
    } catch (error) {
      if (!(error instanceof ComponentDocsError)) throw error
      problems.push(
        ...error.problems.map(
          (problem) => `components/${page.file}: ${problem}`,
        ),
      )
    }
  }

  if (target === 'react') {
    const covered = [...coverage]
      .filter(([slug]) => pages.some((page) => page.slug === slug))
      .map(([slug, { component }]) => [slug, component])
    files.set(
      REACT_INDEX,
      await formatMarkdown(renderReactIndex(pages, covered)),
    )
  }
  if (problems.length > 0) throw new ComponentDocsError(problems)
  return files
}

/**
 * Formats committed Markdown with the repository's Prettier configuration, so
 * the commit hook's Prettier run leaves it unchanged and the drift check
 * (`react --check`) compares like with like.
 */
async function formatMarkdown(markdown) {
  const filepath = join(reactOutputDir, 'page.md')
  const options = (await prettier.resolveConfig(filepath)) ?? {}
  return prettier.format(markdown, { ...options, filepath })
}

/** The index the React guidance's SKILL.md links to. */
export function renderReactIndex(pages, covered) {
  const lines = covered
    .map(([slug, component]) => ({
      component,
      page: pages.find((candidate) => candidate.slug === slug),
    }))
    .sort((a, b) => a.component.localeCompare(b.component))
    .map(
      ({ component, page }) =>
        `- [${component}](${component}.md): ${page.data.summary}`,
    )
  return [
    '# Component pages',
    '',
    'Each page describes one component: what it is for, an example, its',
    'variants, how to compose it, what it guarantees and what you own. The',
    'examples are the JSX a consumer writes, and each renders the same markup',
    'as the matching `@pathableai/styles` example.',
    '',
    'These pages are generated from the design system source; do not edit them',
    'in the installed package. Components not listed here have no React page',
    'yet: use the package README and the installed declarations.',
    '',
    ...(lines.length > 0 ? lines : ['No component has a React page yet.']),
    '',
  ].join('\n')
}

/** Files in `dir` that `files` does not produce, matching `pattern`. */
function stale(dir, files, pattern) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(
    (file) => pattern.test(file) && !files.has(file),
  )
}

/** Writes `files` into `dir` and removes stale files matching `pattern`. */
export function writeFiles(dir, files, pattern) {
  mkdirSync(dir, { recursive: true })
  for (const file of stale(dir, files, pattern)) rmSync(join(dir, file))
  for (const [file, contents] of files) writeFileSync(join(dir, file), contents)
}

/**
 * The differences between `files` and what `dir` holds, as messages: a file
 * that is missing, out of date or no longer produced.
 */
export function compareFiles(dir, files, pattern) {
  const where = (file) => relative(repoRoot, join(dir, file))
  const problems = stale(dir, files, pattern).map(
    (file) => `${where(file)} is no longer generated; delete it`,
  )
  for (const [file, contents] of files) {
    const path = join(dir, file)
    if (!existsSync(path)) problems.push(`${where(file)} is missing`)
    else if (readFileSync(path, 'utf8') !== contents) {
      problems.push(`${where(file)} is out of date`)
    }
  }
  return problems
}

/** Output directory and the files a writer owns in it, per target. */
export const OUTPUTS = {
  styles: { dir: stylesOutputDir, pattern: /^(?!index\.md$).*\.md$/u },
  react: { dir: reactOutputDir, pattern: /\.md$/u },
  storybook: { dir: storybookOutputDir, pattern: /\.(?:mdx|stories\.ts)$/u },
}
