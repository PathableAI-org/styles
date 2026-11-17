# Plan brief

<!-- Adapted from pathableai-org/pre-ets .agents/skills/orchestrate-stack/references/plan.md @ f2ee390. -->

Role: `plan`. High new behaviour only; Standard work plans in the
specification session.

---

**Task.** Write the plan for `{{feature_dir}}` (delivery issue #{{issue}}).

**Identifiers.**

- Feature directory: `{{feature_dir}}`. Run
  `export SPECIFY_FEATURE_DIRECTORY={{feature_dir}}` before any Spec Kit
  command.
- Specification pull request: #{{spec_pr}}, branch `{{spec_branch}}`,
  {{spec_state}}.
- Your branch: `{{plan_branch}}`. {{branch_rule}}

**Read first.**

- `{{feature_dir}}/spec.md` and `verification.md` at the approved
  specification
- [Git workflow](docs/engineering/git-workflow.md): implementation slices and
  feature branches
- [Verification harness](docs/engineering/verification-harness.md): the
  request generator's slice-table columns (`Full claims`, `Partial claims`,
  `Quickstart sections`, `Stories`, ID-only)
- The owning documents AGENTS.md routes the touched packages to, including
  [`packages/styles/AGENTS.md`](packages/styles/AGENTS.md) and
  [`packages/react/README.md`](packages/react/README.md)

**Do.**

1. Run `speckit-plan` on `{{plan_branch}}` only, skipping the "Agent context
   update" step: `plan.md` with the slice table, `quickstart.md`, `research.md`
   and any `contracts/`. Order slices source first: the `@pathableai/styles`
   contract and its stories before the React API that maps to it.
2. Check that
   `pnpm verify:request --feature {{feature_dir}} --slice <ID> --sha HEAD`
   gives no warnings for every slice after you commit.
3. Push and open a draft plan pull request with Decisions for the reviewer
   first, and mark it ready when checks pass.

**Boundaries.** Do not change acceptance criteria, claims, observations or
channels: a needed change is a specification correction, so escalate. Do not
create `tasks.md` or code.

**Done when** the plan pull request is ready for review and every slice's
request is warning-free. Report the pull request number and the slice IDs,
then stop.
