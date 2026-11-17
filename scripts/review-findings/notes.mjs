// Ported from pathableai-org/pre-ets scripts/review-findings/notes.ts @ f2ee390 (types stripped only).
/** Code reviews as git notes on the reviewed SHA, in refs/notes/review unless a trial names another ref. */

/** @typedef {import('../note-store.mjs').NoteKind} NoteKind */

import { validateReview } from './schema.mjs'
/** @typedef {import('./schema.mjs').Review} Review */

export const defaultNotesRef = 'refs/notes/review'

export const reviewNotes = {
  entry: 'review',
  id: (review) => review.reviewId,
  idLabel: 'review',
  listKey: 'reviews',
  note: 'review',
  sha: (review) => review.reviewedSha,
  supersedes: {
    field: 'supersedesReviewId',
    of: (review) => review.supersedesReviewId,
  },
  validate: validateReview,
  withSupersedes: (review, supersedesReviewId) => ({
    ...review,
    supersedesReviewId,
  }),
}
