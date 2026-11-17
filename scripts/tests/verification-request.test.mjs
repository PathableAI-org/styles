// Ported from pathableai-org/pre-ets tests/tooling/verification-request.test.ts @ f2ee390 (adapted: fixtures and assertions use the Stories column and Storybook story IDs).
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { buildRequest } from '../verification.mjs'
/** @typedef {import('../verification.mjs').VerificationRequest} VerificationRequest */
import { featureDir, fixture } from './support.mjs'

const artifacts = {
  plan: fixture('plan.md'),
  quickstart: fixture('quickstart.md'),
  research: fixture('research.md'),
  verification: fixture('verification.md'),
}

const request = (sliceId, plan = artifacts.plan) =>
  buildRequest(
    { ...artifacts, plan },
    { featureDir, sha: 'a'.repeat(40), sliceId },
  )

const claims = (built) =>
  built.claims.map(
    (claim) =>
      `${claim.id} ${claim.scope}${claim.scopeNote === undefined ? '' : ` (${claim.scopeNote})`}`,
  )

void describe('request generation from the legacy slice table', () => {
  void it('reads a qualified claim as partial, keeping a semicolon inside its qualifier', () => {
    const built = request('A1')
    assert.deepEqual(claims(built), [
      'V-001 partial (focus ring)',
      'V-004 partial (forced colors unknown; 200% text best effort)',
    ])
    assert.deepEqual(built.stories, ['components-button--primary'])
    assert.deepEqual(built.warnings, [])
    assert.equal(built.source, 'legacy-table')
  })

  void it('reads (full) and bare IDs as full claims, and None new as no stories', () => {
    const built = request('A2')
    assert.deepEqual(claims(built), [
      'V-006 full',
      'V-001 partial (disabled path)',
    ])
    assert.deepEqual(built.stories, [])
  })

  void it('expands ranges with their padding and reads a `partial` prefix', () => {
    const built = request('b')
    assert.deepEqual(claims(built), [
      'V-009 full',
      'V-010 full',
      'V-011 full',
      'V-012 partial',
    ])
    assert.deepEqual(built.stories, [
      'components-modal--open',
      'components-modal--narrow-viewport',
    ])
  })

  void it("selects the slice's quickstart sections and the shared contract evidence", () => {
    assert.deepEqual(request('A1').quickstartSections, [
      {
        anchor: 'contract-evidence-every-slice',
        heading: 'Contract evidence (every slice)',
      },
      {
        anchor: 'a1--button-focus-ring-slice-a1',
        heading: '§A1 — Button focus ring (slice A1)',
      },
    ])
  })

  void it('warns rather than guesses on prose it cannot read, and when a slice has no quickstart section', () => {
    assert.deepEqual(request('C').warnings, [
      'Slice C claims: cannot read "full manual procedure for all claims" as a claim ID',
      'Slice C stories: cannot read "Uses every story above" as a story ID',
      'Slice C: no quickstart heading names "(slice C)"',
    ])
  })

  void it('reports an unknown slice as a warning', () => {
    assert.deepEqual(request('Z9').warnings, ['plan.md has no slice "Z9"'])
  })

  void it('lists approved limitations: unnumbered verification.md bullets by position, plan limitations by ID', () => {
    const limitations = request('A1').approvedLimitations
    assert.deepEqual(
      limitations.map((limitation) => `${limitation.id} ${limitation.source}`),
      [
        'VL-1 verification.md (unnumbered bullet 1)',
        'VL-2 verification.md (unnumbered bullet 2)',
        'L-1 research.md',
        'L-2 research.md',
      ],
    )
    assert.match(
      limitations[1]?.text ?? '',
      /browser pair actually used\. Other pairs are not established\.$/,
    )
  })
})

void describe('request generation from the structured slice table', () => {
  const structured = [
    '| Slice | Decision    | Stories                                     | Full claims | Partial claims     | Quickstart sections    |',
    '| ----- | ----------- | ------------------------------------------- | ----------- | ------------------ | ---------------------- |',
    '| A1    | Focus ring  | `components-button--primary`                | V-002       | V-001 (focus ring) | Contract evidence, §A1 |',
    '| A2    | Disabled    | —                                           | V-006       | —                  | §A9                    |',
    '| A3    | Story names | components-button--primary, Button/Primary  | V-007       | —                  | §A1                    |',
  ].join('\n')

  void it('reads full and partial columns and the named sections', () => {
    const built = request('A1', structured)
    assert.equal(built.source, 'structured')
    assert.deepEqual(claims(built), [
      'V-002 full',
      'V-001 partial (focus ring)',
    ])
    assert.deepEqual(built.stories, ['components-button--primary'])
    assert.deepEqual(
      built.quickstartSections.map((section) => section.heading),
      ['Contract evidence (every slice)', '§A1 — Button focus ring (slice A1)'],
    )
    assert.deepEqual(built.warnings, [])
  })

  void it('warns when a named section does not exist', () => {
    assert.deepEqual(request('A2', structured).warnings, [
      'Slice A2 quickstart sections: no quickstart heading starts with "§A9"',
    ])
  })

  void it('reads story IDs and warns on a story title that is not an ID', () => {
    const built = request('A3', structured)
    assert.deepEqual(built.stories, ['components-button--primary'])
    assert.deepEqual(built.warnings, [
      'Slice A3 stories: cannot read "Button/Primary" as a story ID',
    ])
  })
})
