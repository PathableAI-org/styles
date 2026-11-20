import assert from 'node:assert/strict'
import { test } from 'node:test'

import { duplicateControlNames } from './axe.mjs'

test('unique button and link names pass', () => {
  const snapshot = [
    '- list "Recent activity":',
    '  - listitem:',
    '    - button "View Intake assessment"',
    '  - listitem:',
    '    - button "View Employment plan review"',
    '    - link "Open Employment plan review"',
  ].join('\n')
  assert.deepEqual(duplicateControlNames(snapshot), [])
})

test('two buttons with the same name are reported once', () => {
  const snapshot = [
    '- button "View"',
    '- button "View"',
    '- button "Edit"',
  ].join('\n')
  assert.deepEqual(duplicateControlNames(snapshot), ['button "View"'])
})

test('repeated names of other roles are ignored', () => {
  const snapshot = [
    '- listitem "Row"',
    '- listitem "Row"',
    '- text: View',
  ].join('\n')
  assert.deepEqual(duplicateControlNames(snapshot), [])
})

test('escaped quotes stay inside the name', () => {
  const snapshot = ['- button "Say \\"hi\\""', '- button "Say \\"bye\\""'].join(
    '\n',
  )
  assert.deepEqual(duplicateControlNames(snapshot), [])
})
