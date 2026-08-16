import test from 'node:test'
import assert from 'node:assert/strict'
import { accordionManifest } from '../dist/accordion/manifest.js'

test('accordion manifest lists exactly the six initial shared capabilities', () => {
  const ids = accordionManifest.shared.map((c) => c.id).sort()

  assert.deepEqual(ids, [
    'accordion.focus-retention',
    'accordion.keyboard-enter',
    'accordion.keyboard-space',
    'accordion.panel-association',
    'accordion.panel-availability',
    'accordion.single-open',
  ])
})

test('shared capabilities are all initial shared scope', () => {
  for (const capability of accordionManifest.shared) {
    assert.equal(capability.scope, 'shared')
    assert.equal(capability.state, 'initial')
  }
})

test('unresolved scope is recorded, not silently claimed', () => {
  const unresolved = accordionManifest.unresolved.map((c) => c.id).sort()

  assert.deepEqual(unresolved, [
    'accordion.disabled',
    'accordion.multiple-open',
  ])
})

test('shared fixture set is bounded to the two known starting states', () => {
  const fixtureNames = accordionManifest.fixtures.map((f) => f.name).sort()

  assert.deepEqual(fixtureNames, [
    'accordion.default',
    'accordion.first-expanded',
  ])
})
