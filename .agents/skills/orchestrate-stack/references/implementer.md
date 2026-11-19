# Implementation brief

<!-- Adapted from pathableai-org/pre-ets .agents/skills/orchestrate-stack/references/implementer.md @ f2ee390. -->

Role: `implementation`. Set `{{fix}}` to `yes` for a one-pull-request fix
(High fix, other Standard work, Light), which has no slices; drop the slice lines
then. Set `{{agent_merge}}` to `yes` for Standard and Light work, which merges
under agent merge, and `no` for High work.

---

**Task.** Implement {{scope}} for delivery issue #{{issue}}.
One-pull-request fix: {{fix}}. Agent merge: {{agent_merge}}.

**Identifiers.**

- Feature directory: `{{feature_dir}}`. Run
  `export SPECIFY_FEATURE_DIRECTORY={{feature_dir}}`.
- Slices in order: {{slice_ids}}. Start with `{{slice}}` on branch
  `{{slice_branch}}`, based on `{{base_branch}}` ({{base_state}}).
  {{branch_rule}}
- Peer sessions: the orchestrator starts them when you first report
  `pushed`, gives them that first request, and then sends you their session
  IDs. A review session for every pull request; a verification session for
  slices and a High fix; a visual review session for agent-merge work that
  touches a [rendering path](docs/engineering/visual-review.md#when-a-visual-review-runs).

**Read first.**

- The owning documents AGENTS.md routes your files to: for styles,
  [`packages/styles/AGENTS.md`](packages/styles/AGENTS.md),
  [`BRAND_RULES.md`](packages/styles/BRAND_RULES.md) and
  [`STORY_AUTHORING.md`](packages/styles/STORY_AUTHORING.md); for React,
  [`packages/react/README.md`](packages/react/README.md) and
  [`STORYBOOK_STANDARD.md`](packages/react/STORYBOOK_STANDARD.md)
- [Git workflow](docs/engineering/git-workflow.md): implementation slices,
  commits, Decisions for the reviewer, and corrections
- [Verification harness](docs/engineering/verification-harness.md#the-verification-loop):
  request, gate, recording
- [Code review session](docs/engineering/code-review.md#the-review-loop) and
  [Visual review session](docs/engineering/visual-review.md#the-visual-review-loop):
  requests and responses
- [Agent merge](docs/engineering/git-workflow.md#agent-merge), when agent
  merge is yes
- [Component testing](docs/testing/README.md) and
  [`.changeset/README.md`](.changeset/README.md)
- `{{feature_dir}}/plan.md`, `quickstart.md` and any `contracts/`

**Do, per slice.**

1. On the first implementation branch, run `speckit-tasks`, then implement
   only the current slice's planned scope, source first. Commit coherent
   Conventional Commits, add the changeset, and run AGENTS.md's Before
   committing checks for what you changed.
2. Before each push that starts or answers a round, once you believe the
   slice or fix is complete, run the
   [pre-push self-review](docs/engineering/code-review.md#pre-push-self-review):
   start the `pre-push-reviewer` subagent with the Agent tool (never a fork)
   after `git fetch origin {{base_branch}}`, and pass only the base branch,
   never a description of the change or of what to check. Fix the findings you
   accept and re-run the checks; note a reason for each you reject. List every
   finding in your `pushed` report to the orchestrator. Never send them to the
   verification or review session, and never put them in the pull request
   body.
3. Push and open or update the draft pull request (`draft: true`). On the
   first push, report `pushed` to the orchestrator and end your turn; the
   orchestrator sends the first request. After that, send every peer session
   the same request: branch, pushed SHA, base SHA, slice ID (`fix` for a
   one-pull-request fix), feature directory, pull request number, round, and
   any run-instruction change. Report `pushed`, saying which requests you
   sent, with the self-review findings, and end your turn.
4. Answer every verification result, review finding and visual review
   finding: fix, run step 2, and push a new SHA with a new request to every
   peer, or write a justification. A `tier` finding from the visual review
   means the work is Standard: raise the label and the Tier section first.
   Classify Copilot findings as accepted, rejected with a reason, or waiting
   on a person; they do not gate.
5. For agent-merge work, write the pull request body, with Decisions for the
   reviewer first and every intended visible change in **Change**, before the
   push that requests a visual review, and keep it current every round: the
   visual reviewer judges the screenshots against it. Other Standard and
   Light work has no verification session and stops here. For a slice or a
   High fix, when
   `pnpm verify:gate` passes on the branch, run
   `pnpm verify:render --write`, commit the evidence-only result, push, and
   write the pull request body with Decisions for the reviewer first, the
   verified SHA and run, and story links or screenshots for any visible
   change. A fix renders no quickstart results and needs no evidence-only
   commit. Report `verified`.
6. Start the next slice when the orchestrator says the current one is green,
   cutting its branch from the current slice's branch and targeting that
   branch as its base. Fix later review findings on the earlier slice and
   merge it upward; never rebase a pushed branch.
7. Mark the pull request ready once step 5 holds and, for agent merge, the
   review and visual review have no open blocking finding, with the GitHub
   MCP tool `update_pull_request` and `draft: false` (or `gh pr ready` where
   GraphQL works). The hook runs the gate and blocks a failing attempt.
   Report `pr-ready`.
8. **Agent merge only.** Keep the pull request
   [up to date](docs/engineering/git-workflow.md#keeping-up-to-date) with
   `main`: when it falls behind, merge `origin/main` in (or use
   `update_pull_request_branch`) and push, and send new review rounds when
   the merge changed the pull request's own diff. Start CI-length waits in
   the background and end your turn rather than polling. When
   `pnpm merge:gate <pr>` passes, merge with the GitHub MCP tool
   `merge_pull_request` and `merge_method: squash`; the hook reruns the gate.
   Report `merged` with the merged SHA and whether a changeset shipped. If
   the gate says the pull request is not eligible, report
   `waiting-on-person` with its reason instead.

**Boundaries.** Never mark a slice ready without a passing gate and no open
blocking finding. Escalate instead of patching for any corrections-table
discovery, a claim still failing after three rounds, or a disagreement with
the verifier, reviewer or visual reviewer, with every decision the claim
needs in one escalation. Merge only under agent merge, only through
`merge_pull_request` after `pnpm merge:gate` passes, and never enable GitHub
auto-merge. Never touch the `ci: version packages` pull request.

**Done when** every agent-merge pull request has merged, every High slice is
ready for review with its gates passing, or you are waiting on the person.
Report each pull request's number and its verified, reviewed or merged SHA.
