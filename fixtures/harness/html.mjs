/**
 * Validates fixture files with html-validate, using fixtures/.htmlvalidate.json
 * (the recommended and a11y presets).
 *
 *   node harness/html.mjs [folder …]      default: every component folder
 *
 * The configuration is loaded explicitly, so it applies wherever the files
 * are and a missing configuration fails instead of validating with no rules.
 * Inline `html-validate-*` directive comments, which would turn rules off
 * inside a fixture, are rejected (fixture rule `fixtures-no-directives`).
 *
 * It is cheap, so CI runs it on every fixture.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import {
  HtmlValidate,
  StaticConfigLoader,
  formatterFactory,
} from 'html-validate'

import { fixtureFiles, fixturesRoot, foldersFromArgs } from './folders.mjs'

/** The fixtures' html-validate configuration. */
export const configPath = join(fixturesRoot, '.htmlvalidate.json')

const DIRECTIVE = /<!--\s*\[\s*html-validate-/gu

/** A result, in html-validate's shape, for each inline directive comment. */
export function directiveResult(filePath, source) {
  const messages = [...source.matchAll(DIRECTIVE)].map((match) => {
    const before = source.slice(0, match.index).split('\n')
    return {
      ruleId: 'fixtures-no-directives',
      severity: 2,
      message:
        'Inline html-validate directives are not allowed in fixtures; fix the markup or ask a person',
      line: before.length,
      column: before.at(-1).length + 1,
      offset: match.index,
      size: match[0].length,
      selector: null,
    }
  })
  if (messages.length === 0) return undefined
  return {
    filePath,
    messages,
    errorCount: messages.length,
    warningCount: 0,
    source,
  }
}

export async function validateFolders(folders, root = fixturesRoot) {
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const validator = new HtmlValidate(new StaticConfigLoader(config))
  const results = []
  let files = 0
  for (const folder of folders) {
    for (const file of fixtureFiles(folder, root)) {
      files += 1
      const filePath = join(root, folder, file)
      const source = readFileSync(filePath, 'utf8')
      const directives = directiveResult(filePath, source)
      if (directives) results.push(directives)
      const report = await validator.validateString(source, filePath)
      if (!report.valid) results.push(...report.results)
    }
  }
  return { files, results }
}

async function main(argv) {
  const folders = foldersFromArgs(argv)
  const { files, results } = await validateFolders(folders)
  if (results.length > 0) {
    process.stderr.write(formatterFactory('stylish')(results))
    process.exitCode = 1
  }
  process.stdout.write(
    `[fixtures:html] ${files} fixture(s) in ${folders.length} folder(s); ${results.length} result(s) with problems\n`,
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`[fixtures:html] ${error.message}\n`)
    process.exitCode = 1
  })
}
