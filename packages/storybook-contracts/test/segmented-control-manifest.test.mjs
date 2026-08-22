import test from 'node:test'
import assert from 'node:assert/strict'
import { segmentedControlManifest } from '../dist/segmented-control/manifest.js'
import { verifyArrowNavigationWraps } from '../dist/segmented-control/verifyArrowNavigationWraps.js'
import { verifyDisabledOptionSkipped } from '../dist/segmented-control/verifyDisabledOptionSkipped.js'
import { verifySingleSelectionSemantics } from '../dist/segmented-control/verifySingleSelectionSemantics.js'
import { rolloutLedger } from '../dist/rollout/rollout.js'

function option(name, attributes) {
  return {
    name,
    getAttribute(attribute) {
      return attributes[attribute] ?? null
    },
    focus() {},
  }
}

function harnessFor(radios) {
  const root = {}
  const group = {}

  return {
    root,
    within(node) {
      if (node === root) {
        return { getByRole: () => group }
      }
      return {
        getAllByRole: () => radios,
        getByRole: (_role, query) =>
          radios.find((radio) => radio.name === query.name),
      }
    },
    userEvent: {
      keyboard: async () => {},
    },
    expect(element) {
      return {
        async toHaveAttribute(attribute, value) {
          assert.equal(element.getAttribute(attribute), value)
        },
      }
    },
  }
}

test('segmented control manifest lists exactly seven shared capabilities', () => {
  const ids = segmentedControlManifest.shared.map((capability) => capability.id)

  assert.deepEqual(ids.sort(), [
    'segmented-control.arrow-navigation',
    'segmented-control.disabled-option-skip',
    'segmented-control.multi-keyboard-toggle',
    'segmented-control.multi-selection',
    'segmented-control.single-selection',
    'segmented-control.static-single-option',
    'segmented-control.vertical-navigation',
  ])
})

test('segmented control shared capabilities are initial shared scope', () => {
  for (const capability of segmentedControlManifest.shared) {
    assert.equal(capability.scope, 'shared')
    assert.equal(capability.state, 'initial')
  }
})

test('segmented control records package-specific behavior explicitly', () => {
  assert.ok(
    segmentedControlManifest.packageSpecific.some((item) =>
      item.startsWith('styles:'),
    ),
  )
  assert.ok(
    segmentedControlManifest.packageSpecific.some((item) =>
      item.startsWith('react:'),
    ),
  )
})

test('segmented control fixture set is exact and bounded', () => {
  const fixtureNames = segmentedControlManifest.fixtures.map(
    (fixture) => fixture.name,
  )

  assert.deepEqual(fixtureNames.sort(), [
    'segmented-control.disabled-option',
    'segmented-control.multi-select',
    'segmented-control.single-select',
    'segmented-control.static-single-option',
    'segmented-control.vertical',
  ])
})

test('segmented control ledger entry mirrors the manifest without downstream adoption', () => {
  const entry = rolloutLedger.find(
    (candidate) =>
      candidate.component === 'interaction-controls-segmentedcontrol',
  )

  assert.ok(entry)
  assert.equal(entry.category, 'shared')
  assert.equal(entry.wave, 'E')
  assert.deepEqual(
    entry.capabilities.map((capability) => capability.id).sort(),
    segmentedControlManifest.shared.map((capability) => capability.id).sort(),
  )
  assert.deepEqual(
    entry.fixtures.map((fixture) => fixture.name).sort(),
    segmentedControlManifest.fixtures.map((fixture) => fixture.name).sort(),
  )
  assert.deepEqual(entry.downstream, [])
})

test('single-selection rejects an extra tab stop', async () => {
  const radios = [
    option('List', { 'aria-checked': 'true', tabindex: '0' }),
    option('Grid', { 'aria-checked': 'false', tabindex: '0' }),
  ]

  await assert.rejects(
    verifySingleSelectionSemantics(harnessFor(radios), 'View mode', 'List'),
  )
})

test('arrow-wrap rejects navigation that does not use both endpoints', async () => {
  const radios = [
    option('List', { 'aria-checked': 'true' }),
    option('Grid', { 'aria-checked': 'false' }),
    option('Detail', { 'aria-checked': 'false' }),
  ]

  await assert.rejects(
    verifyArrowNavigationWraps(harnessFor(radios), {
      groupName: 'View mode',
      fromName: 'List',
      toName: 'Grid',
      key: 'ArrowLeft',
    }),
    /wrap between the first and last radio/,
  )
})

test('disabled-option skip rejects a disabled radio outside the navigation path', async () => {
  const radios = [
    option('10', { 'aria-checked': 'true' }),
    option('50', { 'aria-checked': 'false' }),
    option('25', { 'aria-checked': 'false' }),
  ]

  await assert.rejects(
    verifyDisabledOptionSkipped(harnessFor(radios), {
      groupName: 'Page size',
      fromName: '10',
      disabledName: '25',
      toName: '50',
      key: 'ArrowRight',
    }),
    /skip adjacent disabled option/,
  )
})
