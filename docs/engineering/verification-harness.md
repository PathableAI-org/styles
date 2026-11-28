# Verification harness

This document owns independent verification for High-risk pull requests.
[Git workflow](git-workflow.md) owns tiers and merge rules,
[Component testing](../testing/README.md) owns durable tests, and
[Orchestration](orchestration.md) owns the lead session and subagents.

The running system is the styles Storybook, the retained React Storybook when
the change explicitly touches it, and the packed packages. Verification uses
synthetic content only and reports what was observed at one local head SHA,
before anything is pushed. The verifier replies to the lead session and posts
nothing on GitHub.

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
| `visual`               | Rendering captured by `scripts/visual-capture.mjs` and screenshots                                                        |
| `browser`              | Playwright observation of keyboard order, focus, responsive layouts, text zoom, forced colors and reduced motion          |
| `package`              | Packed-package contents, exports, declarations and consumer installation                                                  |
| `agent-guidance`       | `pnpm check:agent-guidance`                                                                                               |
| `unit-test`            | `pnpm --filter @pathableai/react test:unit`                                                                               |
| `assistive-technology` | A person's manual screen-reader or other assistive-technology check                                                       |
| `fixture`              | Fixture markup, CSS-contract and axe checks through `pnpm --filter @pathableai/fixtures check`                            |
| `component-page`       | Component pages through `pnpm --filter @pathableai/styles test:component-pages` and `check:component-pages`               |

A delivery's verification seams are the specific places its outcome is
observed, such as one fixture or one story. Each seam is observed through
exactly one channel.

Pick the channel that can observe the fact. A successful build does not prove
keyboard behavior, a DOM snapshot does not prove rendering, and a source diff
does not prove the packed consumer artifact.

Durable regression coverage stays in committed stories and tests. Temporary
browser probes, screenshots and transcripts are evidence for the review and
are not committed.

## Roles

| Role          | Owns                                                              | Does not                                                               |
| ------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Lead session  | Issue, code, stories, pull request and responses to findings      | Push High work before every claim is established and reviews are clean |
| Verification  | Building and observing the local head SHA; its reply              | Edit the branch, fix the implementation or post on GitHub              |
| Code review   | Correctness and maintainability review at the same SHA            | Edit the branch                                                        |
| Scope review  | Whether the diff delivers the accepted scope, no more and no less | Edit the branch                                                        |
| Visual review | Judging captured rendering against the base and stated change     | Edit code                                                              |

## Verification loop

1. The lead commits the change locally. Each numbered claim from the accepted
   issue goes to the verifier with its observation and channel. Nothing is
   pushed.
2. The verifier creates a detached worktree at the local head SHA, installs
   with the frozen lockfile, builds the affected packages and runs the checks
   each claim needs.
3. It takes the claims from the request only. Missing, ambiguous or changed
   claims are `blocked`; the verifier does not infer them.
4. It reports one result per claim: `established`, `violated`,
   `not established` or `blocked`. Every named story is `passing`, `failing`
   or `missing` for the Storybook in which it was observed.
5. It replies to the lead with the results, and with nothing else: no note, no
   pull request comment. A retry is a new run and supersedes the earlier
   reply.
6. The lead fixes the change and requests another round until the latest reply
   and the other reviews are clean, or stops at an escalation. Only then does
   it push and open the pull request, and its Evidence table carries each
   claim's final result.

The verifier uses ports 6006 and 6007 for the Storybooks and removes its
worktree and temporary files when finished. It never reuses the lead session's
build output.

## Reply

The verifier's reply names the verified SHA, the run time range, an
environment summary, the claims, story statuses, cleanup status, escalations
and any violation observed outside the requested claims.

For each claim, evidence names its channel plus the story IDs, commands or
procedure that produced the observation. `not established` and `blocked` are
not passing results. Manual assistive-technology work stays unestablished until
a person records the observation.

## Screenshots for visual claims

For visual claims, the verifier publishes one private screenshot page for the
run and names its URL in its reply. A private page is allowed;
nothing is posted on the pull request. Screenshots do not decide the result on
their own.

## Result and escalation

The lead treats High work as verified only when:

- the latest reply is for the local head SHA about to be pushed;
- it names at least one claim and establishes every claim;
- every reported story passes;
- it contains no violated unrequested claim or open escalation; and
- the latest code review and scope review cover the same head with no code
  finding open as blocking, every scope finding answered and no open
  escalation.

There is no gate that enforces this: the lead applies it before it pushes. Any
commit after the verified or reviewed SHA requires a new round unless it
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
