# Verification harness

This document describes how a feature's verification plan decides what
evidence each claim needs, and how a verification session gathers that
evidence for each implementation slice before review.
[Git workflow](git-workflow.md) owns tiers, branches and review gates.
[Component testing](../testing/README.md) owns how component tests and
behaviour contracts are written. [Orchestration](orchestration.md) owns the
sessions' lifecycle, stop points and models.

A harness here means the stories, scripts and procedures that let an agent see
what the design system actually does as a consumer receives it. There is no
telemetry: the running system is the two Storybooks (`apps/storybook` for
`@pathableai/styles`, `apps/storybook-react` for `@pathableai/react`) and the
packed packages.

## Claims follow verification

Each phase adds one layer:

| Phase          | Artifact                       | Adds                                                                                                |
| -------------- | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| Specification  | `verification.md`              | For each claim, the observation that distinguishes it from its violation, and the evidence channel  |
| Plan           | `plan.md` slice table          | Which slice implements which claims, and which named stories each slice adds or changes             |
| Plan           | `quickstart.md`                | The procedure the verifier runs, in sections that name their slice: `(slice A1)` or `(every slice)` |
| Implementation | Code, stories, `quickstart.md` | The stories and code themselves, and the generated verification results                             |

The specification names facts, not stories. "Escape closes a dismissible
Modal and returns focus to the trigger" is an observation. The story that
shows it, `components-modal--dismissible`, is a plan row.

### Evidence channels

| Channel                | What it observes                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storybook-test`       | The Storybook test-runner on named stories: play-function interactions and the rendered axe check, through `pnpm test:storybook-styles` or `pnpm test:storybook-react`                            |
| `visual`               | `pnpm test:visual`: the canonical styles stories render, at 375, 768 and 1280 px, without blank output or horizontal overflow                                                                     |
| `browser`              | Playwright observation of specific stories in a built Storybook: keyboard order and focus placement, narrow and wide viewports, increased text size, `forced-colors` and `prefers-reduced-motion` |
| `package`              | The packed packages as a consumer receives them: `check:package`, `check:types`, `pnpm test:next-consumer`                                                                                        |
| `agent-guidance`       | `pnpm check:agent-guidance`: the consumer agent guidance matches the public API                                                                                                                   |
| `unit-test`            | `pnpm --filter @pathableai/react test:unit`                                                                                                                                                       |
| `assistive-technology` | A person's manual check with a screen reader or other assistive technology                                                                                                                        |

Pick the channel that can actually observe the fact. Constitution XIV to XVI
decide what usually needs which: interactive behaviour needs `storybook-test`
interactions with accessible queries; responsive and inclusive states
(principle XV) usually need `browser`; anything about installability or the
`@pathableai/styles` assets a React consumer receives needs `package`. A
behaviour shared between the styles and React Storybooks follows the
Styles-first rule in [Behavioural parity](../testing/behavior-parity.md):
establish it in the styles Storybook first.

Durable tests stay in the stories and unit tests the slice commits. The
verifier's own Playwright observations are not committed; a claim that should
never regress needs a committed story or test as well, which the plan names.

## Verification by risk tier

The [risk tier](git-workflow.md#risk-tiers) sets the minimum. A
`verification.md` may plan more.

| Tier                    | `verification.md`                                                                                                                                                                                               | Verifier                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| High, new behaviour     | Claims, meaningful violations, observations and channels. Each keyboard, focus or ARIA claim names its `browser` or `storybook-test` observation; each entry-point or dependency claim names `package` evidence | One report per slice through [the verification loop](#the-verification-loop)                                                                                 |
| High, fix               | None. The pull request's Evidence table numbers the claims the fix establishes `V-001`, `V-002`, and so on, each with its observation and channel. An ID keeps its claim once a report uses it                  | One report on the pull request for those claims at the verified SHA. Slice ID `fix`; the feature directory may be omitted. Every claim must be `established` |
| Standard, new behaviour | Claims, observations and channels, plus the planned manual procedure                                                                                                                                            | One report per slice through the verification loop                                                                                                           |
| Standard fix, and Light | None                                                                                                                                                                                                            | None. Normal CI and the checks the pull request names                                                                                                        |

## Sessions and roles

| Session        | Owns                                                                                                   | Does not                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Orchestrator   | Starting and briefing the other sessions, relaying human decisions and escalations, reporting state    | Edit, merge or mark ready any branch, approve a phase, or read code                        |
| Specification  | `spec.md`, `verification.md`, the specification pull request                                           | Plan components, classes, props or slices                                                  |
| Plan           | `plan.md` and its slice table, `quickstart.md`, `research.md`, `contracts/`                            | Change acceptance criteria or claims                                                       |
| Implementation | `tasks.md`, the code and stories for each slice, slice pull requests, changesets                       | Mark a slice ready without a passing verification report, or with an open blocking finding |
| Verification   | Building pushed revisions, observing the Storybooks and packed packages, reports                       | Edit any branch or fix the implementation                                                  |
| Review         | Reviewing pushed revisions for correctness reasoning, constitution lenses and maintainability, reviews | Edit any branch or fix the implementation                                                  |

The orchestrator starts one verification session and one review session per
feature when the implementation session first pushes. [Code review
session](code-review.md) owns the reviewer's scope, findings and loop. Only a
person approves and merges a phase.

## The verification loop

### Request

When a slice is committed and pushed as a draft pull request, the
implementation session generates the request instead of choosing claims by
hand:

```sh
pnpm verify:request --slice <ID> --sha <pushed SHA>
```

The command reads the feature's `plan.md`, `verification.md`, `quickstart.md`
and `research.md` at that SHA through Git, not from the working tree. It prints
the slice ID, the pushed SHA, each claim the slice asserts in full or in part,
the named stories the plan assigns to the slice, its `quickstart.md` sections,
and the limitations already approved in `verification.md` and the plan. On a
[feature branch](git-workflow.md#feature-branches) it finds the feature
directory from the branch name; elsewhere, pass
`--feature specs/{number}-{slug}`.

The plan's slice table has ID-only `Full claims`, `Partial claims`,
`Quickstart sections` and `Stories` columns. Stories are Storybook story IDs,
such as `components-modal--dismissible`. Unnumbered `verification.md`
limitations get positional IDs `VL-1`, `VL-2`, and so on at that SHA, and plan
limitations keep their `L-n` IDs. Anything the parser cannot read is listed
under `warnings`. A request with warnings cannot pass the gate, so correct the
plan through the [corrections](git-workflow.md#corrections) path rather than
working around it.

The implementation session then sends the verification session the branch,
the pushed SHA, the slice ID, and any change to the run instructions since the
last request. The verifier regenerates the request from the SHA itself. It
checks only pushed commits and never reads the implementation session's
uncommitted work.

### Environment

The verification session owns its environment:

- Its own worktree, detached at the requested SHA, with
  `pnpm install --frozen-lockfile`. It is read-only with respect to the
  implementation branch.
- Its own builds from that worktree: `pnpm build`, then the Storybook builds
  the request needs. Nothing is reused from another session's output.
- Its own ports. `scripts/test-storybook.mjs` uses 6006 and 6007 and fails on
  an occupied port; a cloud session has its own container, but on a shared
  machine, run one verifier at a time.
- The pre-installed Playwright Chromium. Do not install another browser.
- Synthetic content only, as in the stories (constitution X).

### Observation

The verifier runs the requested `quickstart.md` steps and the commands for
each claim's channel. For `storybook-test`, it reads the result for each named
story, including its axe result, not only the run's exit status. For
`browser`, it opens the named stories' iframe URLs in the built Storybook and
records what it saw: the focused element's role and name after each key, the
layout at the requested widths, wrapping at 200 % text size, and the result
under emulated `forced-colors: active` and `prefers-reduced-motion: reduce`
where the claim needs them. An empty or skipped run is inconclusive until the
verifier confirms the story exists at that SHA and the runner actually
executed it.

### Report

The verification session records one result per requested claim ID:

| Result            | Meaning                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| `established`     | The required observation was made at the requested revision                      |
| `violated`        | A meaningful violation was observed                                              |
| `not established` | The procedure ran but did not produce a conclusive observation                   |
| `blocked`         | A prerequisite outside the slice prevented the procedure, such as a failed build |

The report is a JSON document checked by the schema in
[`scripts/verification/report.mjs`](../../scripts/verification/report.mjs). It
holds the verified SHA, slice ID, feature directory, run UUID, time range, and
an environment summary (builds, Storybooks and ports, without credentials).
Per claim, it holds the scope (`full` or `partial`), the result, the evidence
(its channel, plus the story IDs, commands or procedure), the observed values,
the conditions, and, for `not established` or `blocked`, the ID of the
approved limitation it falls under. It gives a status for each named story the
plan assigns to the slice (`passing`, `failing` or `missing`, per Storybook),
escalations, cleanup, and any unrequested claim the run showed violated. The
schema rejects text that looks like a credential.

`verify:record` adds the report's `inputs` itself, computed from the verified
SHA: the code tree (the Git tree of the root without `specs/`) and, when the
report names a feature directory, a digest of that directory with
`quickstart.md` read without its execution results. Sync refuses an imported
report whose inputs are not those of its verified SHA.

The verifier records the report with `pnpm verify:record <report.json>`. The
command validates it and adds it to the Git note on the verified SHA under
`refs/notes/verification`. A retry on the same SHA is appended and supersedes
the earlier report, which stays in the note. The command then posts the report
as a comment on the verified SHA's pull request, so the implementation
session's clone can import it. [Code review storage](code-review.md#storage)
owns how entries are published and synced, the author rule and the trust
model. Do not push or configure pushing for the notes ref itself.

The note is the record. The verification session then sends the
implementation session only a pointer, such as
`refs/notes/verification @ <SHA> (run <uuid>)`. `pnpm verify:show <SHA>` syncs
the branch's pull request and prints the report. Raw command output,
screenshots and transcripts are not committed.

### Gate and escalation

The implementation session fixes the slice and requests verification again. A
slice may be marked ready for review only when its latest report shows all of
the following:

- Every named story that `plan.md` assigns to the slice is `passing`.
- Every claim the slice asserts in full is `established`.
- Every `not established` or `blocked` result is on a claim the slice asserts
  in part, and matches a limitation already approved in `verification.md` or
  `plan.md`.
- No `violated` result and no open escalation.

The report covers the verified SHA, which may be older than the pushed tip
only through evidence-only commits. An evidence-only commit changes nothing but
the feature's `quickstart.md` execution results, as described under
[Recording](#recording). Any code, story, test or run-instruction change after
the verified SHA, including a change to `quickstart.md` steps, needs a new
verification request.

`pnpm verify:gate` applies these rules to the checked-out
`{number}-{slug}-impl*` branch. It first syncs the branch's pull request
comments into the local notes. It takes the slice's latest report, on whatever
commit: that report's SHA must be HEAD, or the diff from it to HEAD must change
only the feature's `quickstart.md` execution-results section. It never falls
back to an earlier report. It regenerates the request at the report's SHA,
checks the report's slice against the branch, and exits non-zero with every
failing reason. It also applies the
[code review gate](code-review.md#gate-and-escalation) to the slice's latest
review, found the same way.

A High fix is a branch whose open pull request is labelled `risk:high` and
that is neither an implementation slice nor a specification or plan branch.
For a High fix, the gate requires a report on HEAD (or an evidence-only
ancestor, which for a fix changes no path at all) with slice ID `fix`, at least
one claim, every claim `established`, every listed story `passing`, no
unrequested violation and no open escalation, plus a fix review that passes the
code review gate. The gate does not read the pull request body, so the person
reviewing checks that the report's claims are the body's numbered claims. The
gate reads the label from the pull request, so it cannot judge a fix branch
offline. Specification and plan branches are not gated.

A Claude Code `PreToolUse` hook in `.claude/settings.json` runs the gate
whenever a session tries to mark a pull request ready, and blocks the attempt
when the gate fails. It covers `gh pr ready`, a `gh api` call that sets
`draft` false on a pull request, a `gh api` or `curl` call to a pull request's
`ccr/ready_for_review` route, and the GitHub MCP tool `update_pull_request`
with `draft: false`. It refuses paths it cannot judge, such as a GraphQL
`markPullRequestReadyForReview` mutation or creating an implementation-slice
pull request without `draft: true`, and names the gated way. Once the gate
passes or does not apply, marking ready needs no person's confirmation.

Known limits: the hook cannot see `gh pr create` without `--draft`, any other
HTTP client, another GitHub MCP server name, or a person in the web interface.
A fix pull request created ready is not gated, because its `risk:high` label is
not yet set. Other agents (Codex, OpenCode, Cursor) are not covered. The hook
takes effect in sessions started after it is installed.

A slice pull request cannot create its own exception. A new limitation goes
back through the [corrections](git-workflow.md#corrections) path to the phase
that owns it.

Escalate to the orchestrator, and through it to a person, instead of patching
the implementation when:

- a finding belongs to the specification or plan under the
  [corrections table](git-workflow.md#corrections), for example a missing
  story or a wrong claim
- the same claim is still `violated` or `not established` after three
  verification rounds
- the verifier and implementation disagree about what a claim means

One escalation covers the whole claim. Before escalating, the escalating
session analyses every observation the claim makes, and every other claim in
the request that uses the same channel and stories, and puts every decision
those analyses need into the one escalation.

### Recording

The implementation session does not summarize the report by hand. It runs
`pnpm verify:render --write`, which appends the latest report on HEAD (or on a
named commit: `pnpm verify:render <SHA> --write`) to the feature's
`quickstart.md` execution results. The generated section names the slice's
earlier results it supersedes, so they stay in place, marked stale. Do not
edit the generated text; correct the report through a new verification run.
The pull request body names the verified SHA and run UUID and links that
section. Committing that summary creates an evidence-only commit, which needs
no new verification request.

## Known limits

- Assistive-technology claims remain a person's manual check. The verifier can
  report what the accessibility tree exposes, which does not establish what a
  screen reader announces.
- `forced-colors` and `prefers-reduced-motion` are emulated in Chromium only.
  They do not establish behaviour in Windows High Contrast or other browsers.
- `test:visual` measures render health and overflow; it does not compare
  pixels. A claim about exact visual appearance needs a person's review of the
  screenshots or story links the pull request names.
- A claim that a downstream application, such as Pre-ETS, works with a change
  cannot be established here. `test:next-consumer` is the in-repository
  consumer proxy; cross-repository evidence is an open decision in
  [Orchestration](orchestration.md#open-decisions).
