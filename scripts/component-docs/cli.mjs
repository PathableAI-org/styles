#!/usr/bin/env node
/**
 * Builds component pages from the source pages in components/.
 *
 *   node scripts/component-docs/cli.mjs styles           packages/styles/components/<slug>.md
 *   node scripts/component-docs/cli.mjs react            packages/react/agent-guidance/pathable-react/references/components/
 *   node scripts/component-docs/cli.mjs storybook        apps/storybook/generated/
 *   node scripts/component-docs/cli.mjs react --check    fail if the committed React pages are out of date
 *
 * How to write a source page and its placeholders: components/README.md.
 */

import { pathToFileURL } from 'node:url'
import { relative } from 'node:path'

import { compareFiles, OUTPUTS, renderTarget, writeFiles } from './write.mjs'
import { repoRoot } from './sources.mjs'
import { TARGETS } from './render.mjs'

export async function main(argv) {
  const [target, ...flags] = argv
  if (!TARGETS.includes(target)) {
    throw new Error(
      `usage: cli.mjs <${TARGETS.join('|')}> [--check]; received "${target ?? ''}"`,
    )
  }
  const { dir, pattern } = OUTPUTS[target]
  const files = await renderTarget(target)
  const where = relative(repoRoot, dir)

  if (flags.includes('--check')) {
    const problems = compareFiles(dir, files, pattern)
    if (problems.length > 0) {
      throw new Error(
        `${problems.join('\n')}\nRun node scripts/component-docs/cli.mjs ${target} and commit the result.`,
      )
    }
    console.log(`[component-docs] ${where}: ${files.size} file(s) up to date`)
    return
  }
  writeFiles(dir, files, pattern)
  console.log(`[component-docs] Wrote ${files.size} file(s) to ${where}`)
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(
      error.problems
        ? error.problems
            .map((problem) => `[component-docs] ${problem}`)
            .join('\n')
        : `[component-docs] ${error.message}`,
    )
    process.exitCode = 1
  })
}
