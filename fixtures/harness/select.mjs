/**
 * Chooses the fixture folders CI checks on a pull request: the union of the
 * folders whose files changed (changed.mjs) and the folders the compiled-CSS
 * diff affects (affected.mjs), each with the reasons it was selected.
 *
 *   node harness/select.mjs <base>     a pull request against <base>
 *   node harness/select.mjs --all      every folder (push to main)
 *
 * Prints the selected folders, one per line. In GitHub Actions it also writes
 * `folders` (space-separated) and `fixtures_changed` (whether any path under
 * fixtures/ changed, which decides whether html-validate runs) to
 * $GITHUB_OUTPUT, and a summary of why each folder was selected to
 * $GITHUB_STEP_SUMMARY.
 */

import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import { affected, repoRoot } from './affected.mjs'
import { selectFolders } from './changed.mjs'
import { allFolders, fixturesRoot } from './folders.mjs'

/** How many reasons the summary lists per folder before it counts the rest. */
const SUMMARY_REASONS = 15

/**
 * Combines the two selections. `changed` is the folder list from
 * changed.mjs, `css` the selection from affected.mjs. Returns
 * `{ folders: { <folder>: string[] } }`, each string a reason in Markdown.
 */
export function combine(changed, css) {
  const folders = {}
  const add = (folder, reason) => {
    folders[folder] ??= []
    folders[folder].push(reason)
  }
  for (const folder of changed)
    add(folder, 'Fixture files changed under `fixtures/`.')
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
export function renderSummary({ base, folders, fixturesChanged, everything }) {
  const names = Object.keys(folders)
  const lines = ['## Fixture selection', '']
  if (everything) {
    lines.push(`Every fixture folder is checked: ${everything}.`, '')
  } else {
    lines.push(`Compared with \`${base}\`.`, '')
  }
  if (names.length === 0) {
    lines.push(
      '**No fixture folder was selected.** No file under `fixtures/` changed, and the compiled CSS diff touches no class or custom property that a fixture uses. The contract check and axe did not run.',
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
      for (const reason of reasons.slice(0, SUMMARY_REASONS))
        lines.push(`- ${reason}`)
      if (reasons.length > SUMMARY_REASONS) {
        lines.push(
          `- …and ${reasons.length - SUMMARY_REASONS} more reason(s); see the step log.`,
        )
      }
      lines.push('')
    }
  }
  lines.push(
    fixturesChanged
      ? 'html-validate ran on every fixture, because files under `fixtures/` changed.'
      : 'html-validate was skipped: no file under `fixtures/` changed.',
    '',
  )
  return lines.join('\n')
}

function changedPaths(base) {
  return execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
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
    const paths = changedPaths(base)
    const changed = selectFolders(paths, folderList).filter((folder) =>
      existsSync(join(fixturesRoot, folder)),
    )
    const css = affected({ base })
    result = {
      base: css.base,
      fixturesChanged: paths.some((path) => path.startsWith('fixtures/')),
      ...combine(changed, css),
    }
  }

  const names = Object.keys(result.folders)
  const summary = renderSummary(result)
  process.stderr.write(summary)
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
