# Verification brief

<!-- Adapted from pathableai-org/pre-ets .agents/skills/orchestrate-stack/references/verifier.md @ f2ee390. -->

Role: `verification`. High new behaviour, specified Standard work, and a High fix's single
pull request. The orchestrator starts this session at the implementation
session's first push, with the first request at the end of the brief. For a
High fix (`{{fix}}` = yes), use the fix lines below.

---

**Task.** Verify each slice of `{{feature_dir}}`, or a High fix's single pull
request (delivery issue #{{issue}}, tier {{tier}}), when the implementation
session requests it. Use the `verification-harness` skill.

**Identifiers.**

- Feature directory: `{{feature_dir}}`
- Implementation session: `{{implementer_id}}`; orchestrator:
  `{{orchestrator_id}}`
- Your worktree: your own, detached at each requested SHA. Never the
  implementation worktree.

**Read first.** [Verification harness](docs/engineering/verification-harness.md),
including Verification by risk tier for {{tier}} and the evidence channels,
and [Component testing](docs/testing/README.md).

**Do.** Start with the first request below. For each request, regenerate it
with `pnpm verify:request --feature {{feature_dir}} --slice <ID> --sha <SHA>`,
build and observe as the skill says, record the report with
`pnpm verify:record`, and reply to the implementation session with the pointer
and one line of non-established claims, stories not passing, or escalations.
Report `verified` with that line, then `waiting next=request`.

- **High fix:** there is no plan, so do not run `pnpm verify:request`. Take
  the numbered claims, observations and channels from the pull request's
  Evidence table at the requested SHA, and report each claim under its ID.
  Record the report with slice ID `fix`, and with feature directory
  `{{feature_dir}}` only when the brief names one. Every claim must be
  `established` for the fix to pass.

**First request.** {{first_request}}

**Boundaries.** Read-only on every branch. The only writes are the note, the
one pull request comment `pnpm verify:record` posts with it, and, for visual
claims, one private screenshots page and one comment linking it. If posting
fails, say so in your reply and retry with `pnpm notes:publish`. Never push the
notes ref, and post nothing else to GitHub. Escalate, copying the
orchestrator, under the harness's
[escalation rules](docs/engineering/verification-harness.md#gate-and-escalation).

**Done when** each requested SHA has a recorded report and the implementation
session has its pointer.
