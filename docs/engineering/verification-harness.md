# Verification harness

This document owns independent verification for High-risk pull requests.
[Git workflow](git-workflow.md) owns tiers and merge rules,
[Component testing](../testing/README.md) owns durable tests, and
[Orchestration](orchestration.md) owns the lead session and subagents.

The running system is the styles Storybook, the retained React Storybook when
the change explicitly touches it, and the packed packages. Verification uses
synthetic content only and records what was observed at one pushed SHA.

## Claims live with the delivery

High work numbers its claims `V-001`, `V-002`, and so on in the delivery issue
and repeats them in the pull request's Evidence table. A claim states:

- the meaningful violation;
- the observation that distinguishes the claim from that violation; and
- the evidence channel that can make that observation.

For High new behaviour, the maintainer accepts the issue's claims and
implementation approach before work begins. If a claim changes during
implementation, update the issue and stop for the maintainer instead of
quietly changing the pull request's evidence.

## Evidence channels

| Channel                | What it observes                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `storybook-test`       | Named stories' play functions and rendered axe checks through `pnpm test:storybook-styles` or `pnpm test:storybook-react` |
| `visual`               | Canonical rendering and committed pixel baselines through `pnpm test:visual` and `pnpm test:pixels-styles`                |
| `browser`              | Playwright observation of keyboard order, focus, responsive layouts, text zoom, forced colors and reduced motion          |
| `package`              | Packed-package contents, exports, declarations and consumer installation                                                  |
| `agent-guidance`       | `pnpm check:agent-guidance`                                                                                               |
| `unit-test`            | `pnpm --filter @pathableai/react test:unit`                                                                               |
| `assistive-technology` | A person's manual screen-reader or other assistive-technology check                                                       |

Pick the channel that can observe the fact. A successful build does not prove
keyboard behavior, a DOM snapshot does not prove rendering, and a source diff
does not prove the packed consumer artifact.

Durable regression coverage stays in committed stories and tests. Temporary
browser probes, screenshots and transcripts are evidence for the review and
are not committed.

## Roles

| Role          | Owns                                                                     | Does not                                                 |
| ------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| Lead session  | Issue, code, stories, pull request and responses to findings             | Mark High work ready without a passing report and review |
| Verification  | Building and observing the pushed SHA; the verification note and comment | Edit the branch or fix the implementation                |
| Code review   | Correctness and maintainability review at the same SHA                   | Edit the branch                                          |
| Visual review | Judging captured rendering against the base and stated change            | Edit code or baselines                                   |

## Verification loop

1. The lead pushes a draft pull request whose Evidence table contains every
   numbered claim, its observation, channel and current result.
2. The verifier creates a detached worktree at that SHA, installs with the
   frozen lockfile, builds the affected packages and runs the checks each
   claim needs.
3. It reads the claim table from the pull request at the requested SHA. Missing,
   ambiguous or changed claims are `blocked`; the verifier does not infer them.
4. It records one result per claim: `established`, `violated`,
   `not established` or `blocked`. Every named story is `passing`, `failing`
   or `missing` for the Storybook in which it was observed.
5. `pnpm verify:record <report.json>` validates the report, stores it in
   `refs/notes/verification` on the verified SHA and posts the rendered report
   to the pull request. A retry uses a new run UUID and supersedes the earlier
   report without erasing it.
6. The lead fixes the change and requests another round until the latest report
   and code review pass, or stops at an escalation.

The verifier uses ports 6006 and 6007 for the Storybooks and removes its
worktree and temporary files when finished. It never reuses the lead session's
build output.

## Report

The schema in [`scripts/verification/report.mjs`](../../scripts/verification/report.mjs)
requires the verified SHA, run UUID, time range, environment summary, slice ID
`fix`, claims, story statuses, cleanup status, escalations and any violation
observed outside the requested claims. New reports omit `featureDir`; the
schema may continue to accept that field while old note comments remain in
GitHub history.

For each claim, evidence names its channel plus the story IDs, commands or
procedure that produced the observation. `not established` and `blocked` are
not passing results. Manual assistive-technology work stays unestablished until
a person records the observation.

For visual claims, committed pixel baselines are the primary evidence where
they cover the story. Otherwise the verifier publishes one private screenshot
page for the run and links it from one pull request comment. Screenshots do not
decide the gate on their own.

## Gate and escalation

`pnpm verify:gate` passes High work only when:

- the latest report is for slice `fix` and the pull request's pushed SHA;
- it names at least one claim and establishes every claim;
- every reported story passes;
- it contains no violated unrequested claim or open escalation; and
- the latest code review covers the same head with no open blocking finding
  or escalation.

Any commit after the verified or reviewed SHA requires a new round unless it
changes no path. An update from `main` therefore requires new High-risk
verification even when the pull request's own patch is unchanged.

The lead stops for a person when a claim still fails after three rounds, a
blocking review finding remains in round three, the issue's accepted scope or
claim must change, or a verifier and the lead disagree about the observation.

## Known limits

- The harness observes this repository's Storybooks and packed packages. It
  does not prove behavior inside a consuming application; link that consumer's
  own issue and treat its evidence as a separate release/adoption concern.
- Automated accessibility checks do not replace manual keyboard or
  assistive-technology review where the claim needs it.
- Old Git notes and pull request comments retain historical feature metadata.
  That compatibility is not a current specification workflow.
