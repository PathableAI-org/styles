/**
 * Chooses the fixture folders CI checks on a pull request: the union of the
 * folders whose files changed (changed.mjs), the folders the compiled-CSS
 * diff affects (affected.mjs) and the folders whose component page changed,
 * each with the reasons it was selected. Renames count as a delete and an
 * add, so a renamed page selects the folder named after its old path.
 *
 *   node harness/select.mjs <base>     a pull request against <base>
 *   node harness/select.mjs --all      every folder (push to main)
 *
 * Prints the selected folders, one per line. In GitHub Actions it also writes
 * `folders` (space-separated) and `fixtures_changed` (whether any path under
 * fixtures/, or pnpm-lock.yaml, changed, which decides whether html-validate
 * runs) to
 * $GITHUB_OUTPUT, and a summary of why each folder was selected to
 * $GITHUB_STEP_SUMMARY.
 */

import { appendFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import { DEPENDENCY_GLOBS, STYLESHEET_GLOBS, affected } from './affected.mjs'
import { selectFolders } from './changed.mjs'
import { allFolders, fixturesRoot } from './folders.mjs'

/** How many reasons the summary lists per folder before it counts the rest. */
const SUMMARY_REASONS = 15

/**
 * Every path whose change can change the selection. The Fixtures workflow's
 * `pull_request.paths` must list each of these globs; a test checks it.
 */
export const INPUT_GLOBS = [
  'fixtures/**',
  'packages/styles/components/*.md',
  ...STYLESHEET_GLOBS,
  ...DEPENDENCY_GLOBS,
]

/**
 * The folders whose component page (packages/styles/components/<slug>.md)
 * changed: the contract check reads the page's slug and variants.
 */
export function pagesChanged(paths, folders) {
  return folders.filter((folder) =>
    paths.includes(`packages/styles/components/${folder}.md`),
  )
}

/**
 * Whether html-validate must run: a file under fixtures/ changed, or the
 * lockfile did, which can change the html-validate version.
 */
export function needsHtmlValidate(paths) {
  return paths.some(
    (path) => path.startsWith('fixtures/') || path === 'pnpm-lock.yaml',
  )
}

/**
 * Combines the selections. `changed` is the folder list from changed.mjs,
 * `css` the selection from affected.mjs and `pages` the folders whose
 * component page changed. Returns `{ folders: { <folder>: string[] } }`,
 * each string a reason in Markdown.
 */
export function combine(changed, css, pages = []) {
  const folders = {}
  const add = (folder, reason) => {
    folders[folder] ??= []
    folders[folder].push(reason)
  }
  for (const folder of changed)
    add(folder, 'Fixture files changed under `fixtures/`.')
  for (const folder of pages)
    add(
      folder,
      `Component page \`packages/styles/components/${folder}.md\` changed.`,
    )
  for (const [folder, { reasons }] of Object.entries(css.folders)) {
    for (const reason of reasons) add(folder, describe(reason))
  }
  return {
    folders: Object.fromEntries(
      Object.keys(folders)
        .sort()
        .map((folder) => [folder, [...new Set(folders[folder])]]),
    ),
  }
}

/** One line of Markdown for an affected.mjs reason. */
export function describe(reason) {
  const subject = reason.all
    ? 'Every fixture'
    : [
        reason.class && `\`.${reason.class}\``,
        reason.token && `\`${reason.token}\``,
      ]
        .filter(Boolean)
        .join(' via ')
  const parts = [`${subject}: ${reason.via}`]
  if (reason.selector) parts.push(`in \`${reason.selector}\``)
  if (reason.source) parts.push(`(${reason.source})`)
  if (reason.file && !reason.all) parts.push(`used in \`${reason.file}\``)
  return `${parts.join(' ')}.`
}

/** The job summary, in Markdown. */
export function renderSummary(
  { base, folders, fixturesChanged, everything },
  limit = SUMMARY_REASONS,
) {
  const names = Object.keys(folders)
  const lines = ['## Fixture selection', '']
  if (everything) {
    lines.push(`Every fixture folder is checked: ${everything}.`, '')
  } else {
    lines.push(`Compared with \`${base}\`.`, '')
  }
  if (names.length === 0) {
    lines.push(
      `**No fixture folder was selected.** No file in a component folder or component page changed, and the compiled CSS diff touches no class or custom property that a fixture uses. ${
        fixturesChanged
          ? 'axe did not run. The contract check ran on every folder, because files under `fixtures/` changed and it checks `folders.json` against the folders on disk.'
          : 'The contract check and axe did not run.'
      }`,
      '',
    )
  } else {
    lines.push(
      `**${names.length} folder(s) selected:** ${names.map((name) => `\`${name}\``).join(', ')}`,
      '',
    )
    for (const name of names) {
      const reasons = folders[name]
      lines.push(`### \`${name}\``, '')
      for (const reason of reasons.slice(0, limit)) lines.push(`- ${reason}`)
      if (reasons.length > limit) {
        lines.push(
          `- …and ${reasons.length - limit} more reason(s); the step log lists them all.`,
        )
      }
      lines.push('')
    }
  }
  lines.push(
    fixturesChanged
      ? 'html-validate ran on every fixture, because files under `fixtures/` or `pnpm-lock.yaml` changed.'
      : 'html-validate was skipped: no file under `fixtures/` and not `pnpm-lock.yaml` changed.',
    '',
  )
  return lines.join('\n')
}

function main(argv) {
  const folderList = allFolders()
  let result
  if (argv.includes('--all')) {
    result = {
      everything: 'push to `main`, or this workflow changed',
      fixturesChanged: true,
      folders: Object.fromEntries(
        folderList.map((folder) => [folder, ['Every folder is checked.']]),
      ),
    }
  } else {
    const base = argv[0] ?? 'origin/main'
    // One set of changed paths for both selections: affected() diffs the
    // working tree against the merge base, as CI's clean checkout of HEAD.
    const css = affected({ base })
    const paths = css.changedPaths
    const changed = selectFolders(paths, folderList).filter((folder) =>
      existsSync(join(fixturesRoot, folder)),
    )
    result = {
      base: css.base,
      fixturesChanged: needsHtmlValidate(paths),
      ...combine(changed, css, pagesChanged(paths, folderList)),
    }
  }

  const names = Object.keys(result.folders)
  const summary = renderSummary(result)
  // The log gets every reason; the job summary is capped.
  process.stderr.write(renderSummary(result, Infinity))
  if (names.length > 0) process.stdout.write(`${names.join('\n')}\n`)
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `folders=${names.join(' ')}\nfixtures_changed=${result.fixturesChanged}\n`,
    )
  }
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`[fixtures:select] ${error.message}\n`)
    process.exitCode = 1
  }
}
