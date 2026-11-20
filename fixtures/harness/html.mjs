/**
 * Validates fixture files with html-validate, using fixtures/.htmlvalidate.json
 * (the recommended and a11y presets).
 *
 *   node harness/html.mjs [folder …]      default: every component folder
 *
 * It is cheap, so CI runs it on every fixture.
 */

import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

import {
  FileSystemConfigLoader,
  HtmlValidate,
  formatterFactory,
} from 'html-validate'

import { fixtureFiles, fixturesRoot, foldersFromArgs } from './folders.mjs'

export async function validateFolders(folders, root = fixturesRoot) {
  const validator = new HtmlValidate(new FileSystemConfigLoader())
  const results = []
  let files = 0
  for (const folder of folders) {
    for (const file of fixtureFiles(folder, root)) {
      files += 1
      const report = await validator.validateFile(join(root, folder, file))
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
    `[fixtures:html] ${files} fixture(s) in ${folders.length} folder(s); ${results.length} file(s) with problems\n`,
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
