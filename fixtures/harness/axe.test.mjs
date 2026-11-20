import assert from 'node:assert/strict'
import { test } from 'node:test'

import { duplicateControlNames } from './axe.mjs'

test('unique button and link names pass', () => {
  assert.deepEqual(
    duplicateControlNames([
      { role: 'list', name: 'Recent activity' },
      { role: 'button', name: 'View Intake assessment' },
      { role: 'button', name: 'View Employment plan review' },
      { role: 'link', name: 'View Intake assessment' },
    ]),
    [],
  )
})

test('two buttons with the same name are reported once', () => {
  assert.deepEqual(
    duplicateControlNames([
      { role: 'button', name: 'View' },
      { role: 'button', name: 'View' },
      { role: 'button', name: 'Edit' },
    ]),
    ['button "View"'],
  )
})

test('names with YAML-special characters are compared as text', () => {
  assert.deepEqual(
    duplicateControlNames([
      { role: 'button', name: 'View Case #1042' },
      { role: 'button', name: 'View Case #1042' },
      { role: 'link', name: 'Open Follow-up: benefits' },
      { role: 'link', name: 'Open Follow-up: benefits' },
    ]),
    ['button "View Case #1042"', 'link "Open Follow-up: benefits"'],
  )
})

test('repeated names of other roles are ignored', () => {
  assert.deepEqual(
    duplicateControlNames([
      { role: 'listitem', name: 'Row' },
      { role: 'listitem', name: 'Row' },
      { role: 'StaticText', name: 'View' },
      { role: 'StaticText', name: 'View' },
    ]),
    [],
  )
})
