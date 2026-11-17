# Specification brief

<!-- Adapted from pathableai-org/pre-ets .agents/skills/orchestrate-stack/references/spec.md @ f2ee390. -->

Role: `specification`. Set `{{combined}}` to `yes` for specified Standard work
(one combined specification-and-plan pull request), otherwise `no`.

---

**Task.** Specify delivery issue #{{issue}}. Combined specification and plan:
{{combined}}.

**Identifiers.**

- Delivery issue: #{{issue}}; tier {{tier}}; triggers: {{triggers}}
- Start from: `origin/main`. Spec Kit allocates `{number}-{slug}`, the branch
  and `specs/{number}-{slug}/`.

**Read first.**

- [Git workflow](docs/engineering/git-workflow.md): risk tiers, process by
  tier, feature branches, and Decisions for the reviewer
- [Verification harness](docs/engineering/verification-harness.md): claims,
  evidence channels, and what `verification.md` needs at tier {{tier}}
- [Spec Kit](docs/engineering/spec-kit.md): templates and the steps to skip
- The [constitution](.specify/memory/constitution.md), especially principles
  I, IV, X and XIV to XVI

**Do.**

1. Run `speckit-specify` for exactly this issue, then `speckit-clarify`. Ask
   the person your clarification questions in this session; end your turn
   while you wait.
2. Write `spec.md` with the tier and triggers in its header, and
   `verification.md` with numbered claims (`V-001`, …), each with its
   meaningful violation, its observation and its evidence channel. Spec Kit has
   no template for `verification.md`; follow the harness's
   [Claims follow verification](docs/engineering/verification-harness.md#claims-follow-verification).
3. If combined is `yes`, also run `speckit-plan` on the same branch for
   `plan.md` with its slice table and `quickstart.md`, skipping the "Agent
   context update" step. Check every slice with
   `pnpm verify:request --feature <dir> --slice <ID> --sha HEAD` after you
   commit: it must give no warnings.
4. Push and open a draft pull request with the
   [pull request template](.github/pull_request_template.md), a Conventional
   Commit title, `Contributes to #{{issue}}`, the `risk:` label, and Decisions
   for the reviewer first. Mark it ready when its checks pass.

**Boundaries.** Do not plan classes, props or slices unless combined is `yes`.
Do not edit any other `specs/` directory. A scope conflict with the delivery
issue stops the work: report it to the orchestrator.

**Done when** the pull request is ready for review with passing checks. Report
the pull request number, branch and feature directory, then stop. A person
approves it.
