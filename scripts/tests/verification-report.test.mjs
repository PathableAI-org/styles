// Ported from pathableai-org/pre-ets tests/tooling/verification-report.test.ts @ f2ee390 (adapted: evidence channels and stories replace traces, queries, telemetry rows, and forbidden data).
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { validateReport } from '../verification.mjs'
import { sampleReport } from './support.mjs'

const sha = 'b'.repeat(40)

const problems = (edit) => {
  const result = validateReport(JSON.parse(sampleReport(sha, edit)))
  return result.ok ? [] : result.problems
}

const firstClaim = (report) => report.claims[0] ?? {}

void describe('report schema', () => {
  void it('accepts the sample report', () => {
    assert.deepEqual(
      problems(() => undefined),
      [],
    )
  })

  void it('requires a limitation for a result that is not established', () => {
    assert.deepEqual(
      problems((report) => {
        Object.assign(firstClaim(report), { result: 'blocked' })
      }),
      ['$.claims[0].limitationId: required for a blocked result'],
    )
  })

  void it('requires evidence of some kind', () => {
    assert.deepEqual(
      problems((report) => {
        firstClaim(report).evidence = { channel: 'storybook-test', stories: [] }
      }),
      ['$.claims[0].evidence: give stories, commands, or the procedure'],
    )
  })

  void it('requires a known evidence channel', () => {
    assert.deepEqual(
      problems((report) => {
        firstClaim(report).evidence = { procedure: 'Looked at it' }
      }),
      [
        '$.claims[0].evidence.channel: expected one of storybook-test, visual, browser, package, agent-guidance, unit-test, assistive-technology',
      ],
    )
    assert.deepEqual(
      problems((report) => {
        firstClaim(report).evidence = {
          channel: 'assistive-technology',
          procedure: 'NVDA with Firefox read the button name and state',
        }
      }),
      [],
    )
  })

  void it('rejects text that looks like a credential', () => {
    assert.deepEqual(
      problems((report) => {
        report.environment =
          'Chromatic upload with authorization=Basic Zm9vOmJhcg=='
      }),
      ['$.environment: looks like it holds a credential'],
    )
  })

  void it('accepts Storybook story IDs but not story titles, and only known Storybooks and statuses', () => {
    assert.deepEqual(
      problems((report) => {
        report.stories = [
          {
            detail: 'Rendered axe found no violations.',
            id: 'components-modal--narrow-viewport',
            status: 'failing',
            storybook: 'react',
          },
        ]
      }),
      [],
    )
    assert.deepEqual(
      problems((report) => {
        report.stories = [
          { id: 'Components/Button', status: 'present', storybook: 'docs' },
        ]
        firstClaim(report).evidence = {
          channel: 'storybook-test',
          stories: ['Button/Primary'],
        }
      }),
      [
        '$.claims[0].evidence.stories[0]: expected a Storybook story ID such as components-button--primary',
        '$.stories[0].id: expected a Storybook story ID such as components-button--primary',
        '$.stories[0].status: expected one of passing, failing, missing',
        '$.stories[0].storybook: expected one of styles, react',
      ],
    )
  })

  void it('has no telemetry fields', () => {
    assert.deepEqual(
      problems((report) => {
        report.telemetryRows = []
        report.forbiddenData = []
      }),
      ['$.telemetryRows: unknown field', '$.forbiddenData: unknown field'],
    )
  })

  void it('rejects an abbreviated SHA, an unknown result, and unknown fields', () => {
    assert.deepEqual(
      problems((report) => {
        report.verifiedSha = '860f620'
        report.extra = true
        Object.assign(firstClaim(report), { result: 'passed' })
      }),
      [
        '$.extra: unknown field',
        '$.claims[0].result: expected one of established, violated, not established, blocked',
        '$.verifiedSha: expected a full 40-character commit SHA',
      ],
    )
  })
})
