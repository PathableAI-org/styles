---
name: verification-harness
description: Act as the verification session for a PathAble design-system feature. Build a pushed slice revision, observe named stories in the styles and React Storybooks and the packed packages, record a schema-checked report per run in git notes on the verified SHA, and send the implementation session a pointer. Never edits branches.
---

# Verification harness

<!-- Adapted from pathableai-org/pre-ets .agents/skills/verification-harness/SKILL.md @ f2ee390. -->

Read [the verification harness](../../../docs/engineering/verification-harness.md)
before the first request. It owns the roles, the evidence channels, the
request and report shapes, the gate and escalation. This skill supplies the
procedure. Also read [Component testing](../../../docs/testing/README.md).

## Boundaries

- Verify only pushed commits named in a request. Never read or change the
  implementation session's worktree.
- Do not edit any branch, pull request, issue or `specs/` file. Report
  instead. The one write this session makes is the report note under
  `refs/notes/verification`, through `pnpm verify:record`, which also posts
  the report as a comment on the pull request so other clones can import it.
  The only other output is the screenshots page for visual claims and the one
  comment linking it. Post nothing else to GitHub. Never push the notes ref.
- Do not fix the implementation or suggest code beyond naming the observed
  defect and where it appeared.
- Do not commit or retain probes, Playwright scripts, command output,
  screenshots or transcripts in the repository.

## Inputs

From the implementation session's message: branch, pushed SHA, slice ID and
changed run instructions. Generate the request from the SHA yourself:

```sh
pnpm verify:request --feature specs/<number>-<slug> --slice <ID> --sha <SHA>
```

It lists the claims (full or partial), the named stories, the `quickstart.md`
sections and the approved limitation IDs. Also read the feature's
`verification.md` and `quickstart.md` at the SHA. If the request has warnings,
an input is missing, or the documents disagree about a claim, report `blocked`
with the reason (or escalate) rather than guessing.

## Procedure

1. Create or reuse a worktree owned by this session and check out the SHA
   detached. Run `pnpm install --frozen-lockfile` and `pnpm build`. Generate a
   run UUID for each verification run, including retries
   (`node -e 'console.log(crypto.randomUUID())'`).
2. Run the requested `quickstart.md` steps.
3. For each claim, gather evidence through its channel:
   - `storybook-test`: `pnpm test:storybook-styles` or
     `pnpm test:storybook-react` (add `--filter <prefix>` where the runner
     supports it). Read the result for each named story, including its axe
     result, not just the exit status.
   - `visual`: `pnpm test:visual` after building the styles Storybook.
   - `browser`: serve the built Storybook (`apps/storybook/storybook-static`
     or `apps/storybook-react/storybook-static`) on a port you own and drive
     `iframe.html?id=<story-id>` with Playwright from a scratch script outside
     the repository. Record the focused element's role and accessible name
     after each key, the layout at the widths the claim names, wrapping at
     200 % text size, and behaviour under emulated `forced-colors: active` and
     `prefers-reduced-motion: reduce` where the claim needs them.
   - `package`: `pnpm --filter @pathableai/react check:package`,
     `pnpm --filter @pathableai/react check:types`, `pnpm test:next-consumer`.
   - `agent-guidance`: `pnpm check:agent-guidance`.
   - `unit-test`: `pnpm --filter @pathableai/react test:unit`.
   - `assistive-technology`: not yours to establish. Report `not established`
     under the approved limitation, or `blocked` if none is approved.
4. Record the status of every named story the request lists: `passing`,
   `failing` or `missing`, per Storybook.
5. For each claim about visual appearance, capture Playwright screenshots of
   its named stories under the claim's conditions, as
   [Screenshots for visual claims](../../../docs/engineering/verification-harness.md#screenshots-for-visual-claims)
   describes. Publish them together as one private review page for the run,
   name the page in that claim's `procedure`, and after `pnpm verify:record`
   post one pull request comment linking it with the verified SHA and run
   UUID. Skip this step when no claim is visual.
6. Clean up: stop servers you started and remove temporary files outside the
   repository.

An empty or skipped run is not a pass or a violation. Confirm the story exists
at the SHA and the runner executed it, then report `not established` if the
observation is still missing.

## Report

Write the report as JSON that matches the schema in
[`scripts/verification/report.mjs`](../../../scripts/verification/report.mjs),
one file per run in a scratch directory outside the repository:

```json
{
  "schemaVersion": 1,
  "verifiedSha": "<full SHA>",
  "featureDir": "specs/<number>-<slug>",
  "sliceId": "<ID>",
  "runId": "<run UUID>",
  "timeRange": { "start": "<ISO time>", "end": "<ISO time>" },
  "environment": "<builds, Storybooks and ports, without credentials>",
  "claims": [
    {
      "id": "V-001",
      "scope": "full | partial, as the request says",
      "result": "established | violated | not established | blocked",
      "evidence": {
        "channel": "storybook-test | visual | browser | package | agent-guidance | unit-test | assistive-technology",
        "stories": ["components-modal--dismissible"],
        "commands": ["pnpm test:storybook-styles"],
        "procedure": "quickstart step or Playwright observation"
      },
      "observed": "what was seen",
      "conditions": "viewport, text size, media emulation, Storybook",
      "limitationId": "approved ID from the request, required unless established"
    }
  ],
  "stories": [
    {
      "id": "components-modal--dismissible",
      "storybook": "styles | react",
      "status": "passing | failing | missing"
    }
  ],
  "escalations": [
    {
      "kind": "specification | plan | disagreement | third round",
      "detail": "..."
    }
  ],
  "cleanup": { "complete": true },
  "unrequestedViolations": []
}
```

Give one claim entry per requested claim and a status for every requested
story. Put a claim the request did not name but the run showed violated under
`unrequestedViolations`. Then record it:

```sh
pnpm verify:record <report.json>
```

The command validates the report, appends it to the note on the verified SHA,
then posts it on the pull request whose head branch has that SHA at its tip.
Pass `--pr <n>` when the branch has moved on. A retry on the same SHA is a new
run UUID; it supersedes the earlier report. If the command says the report was
recorded but not published, fix the cause and run
`pnpm notes:publish verification <SHA> [--pr <n>]`.

For a High fix, use slice ID `fix`, the claim IDs the pull request's Evidence
table numbers, and omit `featureDir` unless the request names one.

Send the implementation session only the pointer the command prints,
`refs/notes/verification @ <SHA> (run <uuid>)`, plus one line naming any claim
that is not `established`, any story that is not `passing`, and any
escalation. Copy the orchestrator when a result needs a person. Do not paste
the report into the message.

Report what was observed, not what the code is expected to do.
