/**
 * Visual reviews as git notes on the reviewed SHA, in refs/notes/visual unless a trial names another ref. See
 * docs/engineering/visual-review.md#storage.
 */

/** @typedef {import('../note-store.mjs').NoteKind} NoteKind */

import { validateVisualReview } from './schema.mjs'
/** @typedef {import('./schema.mjs').VisualReview} VisualReview */

export const defaultVisualNotesRef = 'refs/notes/visual'

export const visualNotes = {
  entry: 'visual review',
  id: (review) => review.visualReviewId,
  idLabel: 'visual review',
  listKey: 'visualReviews',
  note: 'visual',
  sha: (review) => review.reviewedSha,
  supersedes: {
    field: 'supersedesVisualReviewId',
    of: (review) => review.supersedesVisualReviewId,
  },
  validate: validateVisualReview,
  withSupersedes: (review, supersedesVisualReviewId) => ({
    ...review,
    supersedesVisualReviewId,
  }),
}
