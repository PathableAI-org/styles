---
name: to-tickets
description: Break a spec issue, or the current conversation, into tracer-bullet child issues, each exactly one pull request, linked as sub-issues of the spec with native blocking dependencies. Use when a person asks to split a spec into issues or tickets.
disable-model-invocation: true
---

# To tickets

<!-- Adapted from mattpocock/skills skills/engineering/to-tickets/SKILL.md @ v1.3.1. MIT License, Copyright (c) 2026 Matt Pocock. -->

Break a spec into **child issues**: tracer-bullet vertical slices, each
declaring the issues that **block** it. One child issue is one pull request.

## Rules

- **No file paths and no code snippets** in any issue. Describe behaviour and
  public contracts (classes, tokens, props, exports, entry points) by name.
  Exception: a trimmed state, type or schema shape from a prototype, marked as
  coming from a prototype.
- Ordering is recorded only as native GitHub issue dependencies (blocked by),
  never as prose. Grouping is native sub-issues.
- Labels are the `risk:*` tier label and `package:*` labels only. No triage or
  state labels. Do not create labels: if one is missing, say so.
- Milestones are a human planning concept. Never set, read or mention one
  unless the person asks.
- Never edit or close the parent spec.

## Process

### 1. Gather context

Work from the conversation. If the person passes a spec issue number or URL,
fetch its body and comments with read-only `gh api`.

### 2. Explore

Dispatch a read-only subagent on the `haiku` model (the `Explore` or
`general-purpose` agent type) with narrow questions about the current state;
do not hand it the plan. Read the documents the routing table in
[AGENTS.md](../../../AGENTS.md) names for the area. Use their vocabulary and
respect their rules.

Look for prefactoring that makes the change easy, and put it first: "make the
change easy, then make the easy change."

### 3. Draft vertical slices

Each slice cuts a narrow but complete path through every layer it touches (CSS,
fixture, component page and guidance, checks): vertical, not a horizontal slice
of one layer.

- A completed slice is verifiable on its own through the spec's agreed seams.
- Each slice fits in one fresh context window and is exactly one pull request.
- Any prefactoring comes first.

Give each slice its **blocking edges**: the other slices that must complete
before it can start. A slice with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A wide refactor is
one mechanical change (rename a token, retype a shared class) whose blast
radius fans across the whole codebase, so a single edit breaks many call sites
at once and no vertical slice can land green. Sequence it as expand, migrate,
contract. First expand: add the new form beside the old so nothing breaks.
Then migrate the call sites in batches sized by blast radius, each batch its
own issue blocked by the expand, keeping checks green batch to batch because
the old form still exists. Finally contract: remove the old form once no
caller remains, in an issue blocked by every migrate batch.

If the spec fits one pull request, say so and create nothing: the spec is
itself the issue `orchestrate` runs.

### 4. Quiz the person

Present the breakdown as a numbered list. For each issue show:

- **Title**: short descriptive name.
- **Blocked by**: which other issues, if any, must complete first.
- **What it delivers**: the end-to-end behaviour it makes work.
- **Contract impact**: which part of the parent's contract impact it delivers.
- **Proposed risk tier**: the tier with every trigger that matched, from "Risk
  tiers" in [git-workflow.md](../../../docs/engineering/git-workflow.md); the
  higher tier when unclear. The maintainer sets it and only the maintainer
  lowers it.

Ask whether the granularity is right (too coarse or too fine), whether each
issue depends only on issues that genuinely gate it, whether any should be
merged or split, and whether the tiers are right. Iterate until the person
approves.

### 5. Publish

On approval, publish in dependency order, blockers first, so every edge can
reference a real issue.

1. Create each child with `gh issue create` and the `risk:*` and any
   `package:*` labels.
2. Attach it as a sub-issue of the spec:
   `gh api -X POST repos/PathableAI-org/styles/issues/<parent>/sub_issues -F sub_issue_id=<child id>`.
   The id is the child's numeric `id` from the API, not its issue number.
3. Add each blocking edge:
   `gh api -X POST repos/PathableAI-org/styles/issues/<n>/dependencies/blocked_by -F issue_id=<blocker id>`,
   again the blocker's numeric `id`.

Report the issue URLs and the edges. The frontier is every issue whose blockers
are all done.

## Child issue template

Out of scope, consumer and outcome are inherited from the parent; do not
repeat them.

```markdown
## Parent

<!-- Link to the spec issue. -->

## What to build

<!-- The end-to-end behaviour this issue makes work, not a layer-by-layer list. No file paths or code snippets. -->

## Contract impact

<!-- The subset of the parent's contract impact that this issue delivers, in the same order and with the same additive, visible change, or removal or rename tags, or "none". -->

## Acceptance criteria

- [ ] <!-- Each criterion observable through the parent's agreed verification seams. -->

## Risk tier

<!-- High, Standard, or Light, with every trigger that matched. The drafting agent proposes; the maintainer sets it and only the maintainer lowers it, with the reason recorded here. -->
```
