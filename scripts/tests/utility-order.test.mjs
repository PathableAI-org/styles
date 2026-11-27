import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const stylesDir = resolve(root, 'packages/styles')

function compile(entry) {
  return execFileSync(
    'pnpm',
    [
      'exec',
      'sass',
      '--quiet',
      '--quiet-deps',
      '--load-path=node_modules/@uswds/uswds/packages',
      entry,
    ],
    { cwd: stylesDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  )
}

// A utility and a component class that set the same property have the same
// specificity, so the utility only wins when it is emitted after the component.
test('styles.css emits utilities after every component rule', () => {
  const css = compile('src/index.scss')
  // The last component rule: the table is one of the final components in the
  // bundle, so check against it as well as the checkbox.
  const lastComponent = Math.max(
    css.lastIndexOf('\n.pathable-table'),
    css.lastIndexOf('\n.pathable-checkbox'),
  )
  const firstUtility = css.indexOf('\n.pathable-bg-primary')
  const display = css.indexOf('\n.pathable-display-none {')
  const responsive = css.indexOf('.tablet\\:pathable-display-flex')
  assert.ok(lastComponent > -1, 'component rules are present')
  assert.ok(firstUtility > -1, 'utility rules are present')
  assert.ok(
    firstUtility > lastComponent,
    'the first utility must come after the last component rule',
  )
  assert.ok(display > lastComponent, 'display utilities come after components')
  assert.ok(
    responsive > lastComponent,
    'responsive variants come after components',
  )
})
