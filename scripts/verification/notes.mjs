// Ported from pathableai-org/pre-ets scripts/verification/notes.ts @ f2ee390 (types stripped only).
/** Verification reports as git notes on the verified SHA, in refs/notes/verification. */

/** @typedef {import('../note-store.mjs').NoteKind} NoteKind */

import { validateReport } from './report.mjs'
/** @typedef {import('./report.mjs').VerificationReport} VerificationReport */

export const notesRef = 'refs/notes/verification'

export const reportNotes = {
  entry: 'report',
  id: (report) => report.runId,
  idLabel: 'run',
  listKey: 'reports',
  note: 'verification',
  sha: (report) => report.verifiedSha,
  supersedes: {
    field: 'supersedesRunId',
    of: (report) => report.supersedesRunId,
  },
  validate: validateReport,
  withSupersedes: (report, supersedesRunId) => ({ ...report, supersedesRunId }),
}
