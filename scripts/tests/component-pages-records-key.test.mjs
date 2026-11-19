import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

import { isRecordInput, recordsKey } from '../component-pages-records-key.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean)

const entry = (blob, path) => `100644 ${blob} 0\t${path}`

/**
 * The literal directory or file prefixes of the patterns the Storybook
 * Quality workflow uses to decide that the HTML Storybook must run: its
 * `shared`, `styles_source`, `contracts` and `html_storybook` filters.
 */
function htmlStorybookPrefixes() {
  const workflow = readFileSync(
    resolve(repositoryRoot, '.github/workflows/storybook-quality.yml'),
    'utf8',
  )
  const prefixes = []
  let inHtmlFilter = false
  for (const line of workflow.split('\n')) {
    const filter = line.match(/^ {12}(\w+):/)
    if (filter) {
      inHtmlFilter = [
        'shared',
        'styles_source',
        'contracts',
        'html_storybook',
      ].includes(filter[1])
      continue
    }
    const pattern = line.match(/^ {14}- '([^']+)'/)
    if (inHtmlFilter && pattern) {
      prefixes.push(pattern[1].split(/[*!?[{(]/)[0])
    }
  }
  return prefixes.filter(Boolean)
}

describe('component page records cache key', () => {
  it('leaves component pages and other Markdown out of the key', () => {
    assert.equal(isRecordInput('packages/styles/components/wizard.md'), false)
    assert.equal(isRecordInput('packages/styles/README.md'), false)
    assert.equal(isRecordInput('docs/testing/README.md'), false)
  })

  it('keeps Markdown a story could import', () => {
    assert.equal(isRecordInput('packages/styles/src/stories/notes.md'), true)
    assert.equal(isRecordInput('apps/storybook/notes.md'), true)
  })

  it('keeps what the HTML Storybook is built and tested from', () => {
    for (const path of [
      'package.json',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      '.github/actions/setup/action.yml',
      '.github/workflows/docs-deploy.yml',
      '.github/workflows/storybook-quality.yml',
      'apps/storybook/.storybook/test-runner.js',
      'packages/styles/src/_colors.scss',
      'packages/styles/src/stories/components/Layout/Icon.stories.ts',
      'packages/styles/scripts/check-component-pages.mjs',
      'packages/storybook-contracts/src/accordion/manifest.ts',
    ]) {
      assert.equal(isRecordInput(path), true, path)
    }
  })

  it('keeps every tracked file the html_storybook path filter names', () => {
    const prefixes = htmlStorybookPrefixes()
    assert.ok(prefixes.includes('packages/styles/'), prefixes.join(', '))
    // Pixel baselines and the modal gate script start the HTML lane for
    // other jobs; the records do not depend on them.
    const notRecordInputs = ['visual-baselines/', 'scripts/']
    const missing = trackedFiles.filter(
      (path) =>
        !path.toLowerCase().endsWith('.md') &&
        prefixes.some((prefix) => path.startsWith(prefix)) &&
        !notRecordInputs.some((prefix) => path.startsWith(prefix)) &&
        !isRecordInput(path),
    )
    assert.deepEqual(missing, [])
  })

  it('does not depend on the order of the entries', () => {
    const a = entry('1'.repeat(40), 'packages/styles/src/a.scss')
    const b = entry('2'.repeat(40), 'apps/storybook/b.js')
    assert.equal(recordsKey([a, b]), recordsKey([b, a]))
  })

  it('changes when an input changes and not when a page changes', () => {
    const scss = 'packages/styles/src/a.scss'
    const page = 'packages/styles/components/a.md'
    const base = recordsKey([
      entry('1'.repeat(40), scss),
      entry('3'.repeat(40), page),
    ])
    assert.notEqual(
      recordsKey([entry('2'.repeat(40), scss), entry('3'.repeat(40), page)]),
      base,
    )
    assert.equal(
      recordsKey([entry('1'.repeat(40), scss), entry('4'.repeat(40), page)]),
      base,
    )
  })

  it('names its version in the key', () => {
    assert.match(recordsKey([]), /^component-pages-records-v1-[0-9a-f]{64}$/)
  })
})
