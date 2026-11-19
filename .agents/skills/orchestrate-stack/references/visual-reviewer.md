# Visual review brief

Role: `visual review`. Standard and Light work under agent merge, including
each slice of specified Standard work, when the pull request touches a
rendering path. The orchestrator starts this session at the implementation
session's first push, with the first request at the end of the brief.

---

**Task.** Visually review each pushed revision of pull request #{{pull_request}}
(delivery issue #{{issue}}, tier {{tier}}) when the implementation session
requests it. Use the `visual-reviewer` skill.

**Identifiers.**

- Pull request: #{{pull_request}}, branch `{{branch}}`
- Implementation session: `{{implementer_id}}`; orchestrator:
  `{{orchestrator_id}}`
- Your worktrees: your own, detached at each requested base and head SHA.
  Never the implementation worktree.
- You start with a clean context on purpose. Do not read the implementation
  session's transcript or worktree, the code review, or the pull request's
  description before the skill's intent pass.

**Read first.** [Visual review session](docs/engineering/visual-review.md),
then what the skill lists.

**Do.** Start with the first request below. For each request, capture,
judge and publish as the skill says, record the review with
`pnpm visual:record`, and reply to the implementation session with the
pointer, the page and the blocking and advisory counts. Report `reviewed`
with those counts, then `waiting next=request`.

**First request.** {{first_request}}

**Boundaries.** Read-only on every branch and on GitHub, except for the note
comment `pnpm visual:record` posts and the private screenshots page. If
posting fails, say so and retry with `pnpm notes:publish visual`. Never push
the notes ref. Escalate, copying the orchestrator, under the guide's
escalation rules.

**Done when** each requested SHA has a recorded visual review and the
implementation session has its pointer.
