// Ported from pathableai-org/pre-ets tests/tooling/fix-gate.test.ts @ f2ee390 (adapted: a High fix report lists stories; fixtures name a design-system fix branch).
import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

import {
  defaultNotesRef,
  recordReview,
  validateReview,
} from '../review-findings.mjs'
import {
  checkedOut,
  gateApplies,
  recordReport,
  runGate,
  validateReport,
} from '../verification.mjs'
import { sampleRepo, sampleReport, sampleReview } from './support.mjs'
/** @typedef {import('./support.mjs').SampleRepo} SampleRepo */

/**
 * @typedef {Record<string, unknown>} Json
 */

let repo
let verified

beforeEach(() => {
  repo = sampleRepo('fix-button-focus')
  verified = repo.commit('fix: button focus', {
    'src/app.ts': 'export const app = 2\n',
  })
})

afterEach(() => {
  repo.remove()
})

/** The sample report as a High fix: slice `fix`, no feature directory, one established claim. */
const asFix = (report) => {
  Reflect.deleteProperty(report, 'featureDir')
  const [first] = report.claims
  Object.assign(report, { claims: [first], sliceId: 'fix' })
}

const fixReport = (edit = () => undefined) =>
  sampleReport(verified, (report) => {
    asFix(report)
    edit(report)
  })

const fixReview = (edit = () => undefined) =>
  sampleReview(repo.git('rev-parse', 'main'), verified, (review) => {
    Reflect.deleteProperty(review, 'featureDir')
    review.sliceId = 'fix'
    edit(review)
  })

const record = (report = () => undefined, review = () => undefined) => {
  const reported = recordReport(repo.dir, fixReport(report))
  assert.ok(reported.ok, reported.ok ? '' : reported.problems.join('\n'))
  const reviewed = recordReview(repo.dir, defaultNotesRef, fixReview(review))
  assert.ok(reviewed.ok, reviewed.ok ? '' : reviewed.problems.join('\n'))
}

const fixGate = (labels = ['risk:high']) => {
  const gate = runGate(repo.dir, checkedOut(repo.dir, labels))
  return gate.ok ? [] : gate.problems
}

void describe("a High fix's report and review schema", () => {
  void it('accepts slice fix without a feature directory, and still requires one for a slice', () => {
    assert.equal(validateReport(JSON.parse(fixReport())).ok, true)
    assert.equal(validateReview(JSON.parse(fixReview())).ok, true)
    const slice = validateReport(
      JSON.parse(
        fixReport((report) => {
          report.sliceId = 'A1'
        }),
      ),
    )
    assert.deepEqual(slice.ok ? [] : slice.problems, [
      '$.featureDir: required unless sliceId is fix',
    ])
    const review = validateReview(
      JSON.parse(
        fixReview((entry) => {
          entry.sliceId = 'A1'
        }),
      ),
    )
    assert.deepEqual(review.ok ? [] : review.problems, [
      '$.featureDir: required unless sliceId is fix',
    ])
  })
})

void describe('the High fix gate', () => {
  void it('passes a fix branch labelled risk:high with an established report and a clean review on HEAD', () => {
    record()
    const gate = runGate(repo.dir, checkedOut(repo.dir, ['risk:high']))
    assert.equal(gate.ok && gate.value.branch, 'fix-button-focus')
  })

  void it("needs the pull request's risk:high label", () => {
    record()
    const unlabelled = runGate(repo.dir)
    assert.deepEqual(unlabelled.ok ? [] : unlabelled.problems, [
      'no pull request was found to show whether fix-button-focus is labelled risk:high',
    ])
    assert.deepEqual(fixGate(['risk:standard']), [
      'fix-button-focus is not labelled risk:high',
    ])
  })

  void it('fails with no report, and with no review', () => {
    assert.deepEqual(fixGate(), [
      'no verification report on HEAD or its last 200 ancestors',
    ])
    assert.ok(recordReport(repo.dir, fixReport()).ok)
    assert.deepEqual(fixGate(), [
      'code review: no review on HEAD or its last 200 ancestors',
    ])
  })

  void it('fails any claim that is not established, a story not passing, and escalations', () => {
    record((report) => {
      const [first] = report.claims
      report.claims = [
        { ...first, result: 'violated' },
        { ...first, id: 'V-002', limitationId: 'L-1', result: 'blocked' },
      ]
      report.stories = [
        {
          id: 'components-button--primary',
          status: 'missing',
          storybook: 'react',
        },
      ]
      report.escalations = [{ detail: 'The claim needs a plan.', kind: 'plan' }]
    })
    assert.deepEqual(fixGate(), [
      'V-001 is violated; a High-risk pull request must establish every claim',
      'V-002 is blocked; a High-risk pull request must establish every claim',
      'story components-button--primary in the react Storybook is missing',
      'open escalation (plan): The claim needs a plan.',
    ])
  })

  void it('fails a report that names no claim, and a report or review for a slice', () => {
    record(
      (report) => {
        report.claims = []
      },
      (review) => {
        Object.assign(review, {
          featureDir: 'specs/900-sample',
          sliceId: 'A1',
        })
      },
    )
    assert.deepEqual(fixGate(), [
      'the report names no claim',
      'code review: the review is for slice A1, not this pull request (slice fix)',
    ])
  })

  void it('fails an open blocking finding', () => {
    record(undefined, (review) => {
      review.findings = [
        {
          category: 'correctness',
          confidence: 'high',
          failureScenario: 'Focus is invisible in forced colors.',
          file: 'src/app.ts',
          id: 'R-001',
          line: 1,
          severity: 'blocking',
          summary: 'The focus ring is a box shadow.',
          verification: 'Read the focus rules.',
        },
      ]
    })
    assert.deepEqual(fixGate(), [
      'code review: R-001 is blocking at src/app.ts:1',
    ])
  })

  void it('counts only a commit that changes nothing as evidence-only', () => {
    record()
    repo.git(
      'commit',
      '--quiet',
      '--allow-empty',
      '--message',
      'chore: retrigger',
    )
    assert.deepEqual(fixGate(), [])
    repo.commit('docs: results', { 'docs/results.md': '# Results\n' })
    assert.deepEqual(fixGate(), [
      'commits after the verified SHA change docs/results.md',
      'code review: commits after the reviewed SHA change docs/results.md',
    ])
  })

  void it('applies only when the pull request is labelled risk:high', () => {
    const applies = (branch, labels = ['risk:high']) =>
      gateApplies(repo.dir, { branch, head: verified, labels })
    assert.equal(applies('900-sample'), true)
    assert.equal(applies('900-sample-plan'), true)
    assert.equal(applies('fix-button-focus'), true)
    assert.equal(applies('901-button-focus'), true)
    assert.equal(applies('900-sample-impl', []), false)
    assert.equal(applies('900-sample-impl-b2', []), false)
    assert.equal(applies('fix-button-focus', ['risk:standard']), false)
  })
})
