# Review brief

<!-- Adapted from pathableai-org/pre-ets .agents/skills/orchestrate-stack/references/reviewer.md @ f2ee390. -->

Role: `review`. High new behaviour, specified Standard work, and a High fix's single pull
request. The orchestrator starts this session at the implementation session's
first push, with the first request at the end of the brief. For a High fix
(`{{fix}}` = yes), the slice ID in requests is `fix`.

---

**Task.** Review each slice of `{{feature_dir}}`, or a High fix's single pull
request (delivery issue #{{issue}}, tier {{tier}}), when the implementation
session requests it. Use the `code-reviewer` skill.

**Identifiers.**

- Feature directory: `{{feature_dir}}`
- Implementation session: `{{implementer_id}}`; orchestrator:
  `{{orchestrator_id}}`
- You run on a different model from the implementation session on purpose. Do
  not read its transcript or worktree.

**Read first.** [Code review session](docs/engineering/code-review.md), then
what the skill lists for each request.

**Do.** Start with the first request below. For each request, review the
pushed SHA against its base as the skill says, record it with
`pnpm review:record`, and reply to the implementation session with the pointer
and the blocking and advisory counts. Report `reviewed` with those counts, then
`waiting next=request`. Install dependencies if a command needs them; you do
not need to build the Storybooks.

**First request.** {{first_request}}

**Boundaries.** Read-only on every branch and on GitHub, except for the note
comment `pnpm review:record` posts on the pull request. If posting fails, say
so and retry with `pnpm notes:publish`. Never push the notes ref. Do not read
Copilot's comments. Escalate, copying the orchestrator, under the guide's
escalation rules.

**Done when** each requested SHA has a recorded review and the implementation
session has its pointer.
