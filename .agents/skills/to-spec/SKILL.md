---
name: to-spec
description: Turn the current conversation, often a grill-me session, or an existing issue such as a consumer request into one spec issue in this repository's delivery style, with no interview beyond agreeing the verification seams. Use when a person asks to write up, file or publish a spec or delivery issue.
disable-model-invocation: true
---

# To spec

<!-- Adapted from mattpocock/skills skills/engineering/to-spec/SKILL.md @ v1.3.1. MIT License, Copyright (c) 2026 Matt Pocock. -->

Turn the current conversation, or an existing issue the person names, into one
**spec**: a GitHub issue that describes one deliverable outcome. Do not
interview the person; synthesise what was already discussed. The one question
you ask is about verification seams (step 2).

This skill replaces the old delivery issue form. A spec that fits one pull
request has no child issues and is itself the issue `orchestrate` runs. A spec
that needs more than one pull request is broken into child issues by
`/to-tickets`.

## Rules

- **No file paths and no code snippets** in the spec. Describe behaviour and
  public contracts (classes, tokens, props, exports, entry points) by name,
  never by file location. Locations go stale; names are the contract.
  Exception: if a prototype produced a trimmed state, type or schema shape that
  states a decision more precisely than prose can, inline it within the
  relevant decision and mark it as coming from a prototype.
- Ordering between issues is recorded only as native GitHub issue dependencies
  and grouping only as native sub-issues, never as prose.
- Labels are the `risk:*` tier label and `package:*` labels only. Do not apply
  or invent triage or state labels. Do not create labels: if one is missing,
  say so.
- Milestones are a human planning concept. Never set, read or mention one
  unless the person asks.
- Never change the repository, only GitHub issues, and only after the person
  says yes to the draft.

## Process

### 1. Gather

Work from the conversation. If the person names an issue (for example a plain
consumer request), fetch its body and comments with read-only `gh api`.

Look facts up rather than asking. Dispatch a read-only subagent on the `haiku`
model (the `Explore` or `general-purpose` agent type) with a narrow question,
and do not hand it the plan or ask it to judge anything. Read the documents
the routing table in [AGENTS.md](../../../AGENTS.md) names for the area, such
as [target-state.md](../../../docs/engineering/target-state.md),
[intent.md](../../../docs/engineering/intent.md) and the owning package
documentation, and use their vocabulary.

### 2. Agree the verification seams

A **seam** is a place where the outcome can be observed: a fixture, a
Storybook contract, a component-page check or an observation of the packed
package. Each seam is observed through one evidence channel in
[verification-harness.md](../../../docs/engineering/verification-harness.md#evidence-channels).
Sketch the seams that will prove the outcome. Prefer existing seams
to new ones, and as few as possible; the ideal is one. If a new seam is
needed, propose it at the highest point you can.

Ask the person whether these seams match their expectations. This is the only
question you ask.

### 3. Recommend a risk tier

Recommend a tier with every trigger that matched, taken from "Risk tiers" in
[git-workflow.md](../../../docs/engineering/git-workflow.md). When it is
unclear whether a trigger matches, recommend the higher tier. The maintainer
sets the tier and only the maintainer lowers it.

### 4. Draft and publish

Write the spec with the template below and show the full draft in chat. Wait
for the person's yes.

- **New spec**: `gh issue create` with the `risk:*` label and any `package:*`
  labels. For a bug fix, also the `bug` label and exactly one of
  `package:styles` or `package:react`; a bug in both packages is two issues.
- **Existing issue**: `gh issue edit` its body to the spec. Keep the
  requester's original text verbatim in a
  `<details><summary>Original request</summary>` block at the end of the new
  body.

Report the issue URL.

### 5. Say when one pull request is not enough

If the spec clearly needs more than one pull request, say so and suggest
`/to-tickets <issue>` as the next step. Do not break it down here.

## Spec template

Carry every section over, in this order. Keep the guidance as HTML comments in
the published body.

```markdown
## Outcome

<!-- The capability this issue delivers, stated as what a consumer can do once it is released. -->

## Consumer

<!-- Who needs this and why. Link the consumer's issue or pull request with a full URL (for example https://github.com/PathableAI-org/pre-ets/issues/123). Name the released package version where the current behaviour was observed. Write "Internal" for work with no external consumer. -->

## Risk tier

<!-- High, Standard, or Light, with every trigger that matched, or the condition that makes the work Standard or Light. The drafting agent proposes; the maintainer sets it. Only the maintainer may lower it, with the reason recorded here. See "Risk tiers" in docs/engineering/git-workflow.md. -->

## In scope

## Out of scope

<!-- Adjacent work, excluded cases, and undecided policy. -->

## Contract impact

<!-- Which published contracts change, in source-first order:
1. @pathableai/styles compiled CSS: tokens, static .pathable-* classes, assets, component-page guarantees, or "none".
2. @pathableai/styles consumer agent guidance: installed component pages, package-wide selection or bug-reporting guidance, or "none".
3. Retained/deferred surfaces: @pathableai/react API or React consumer guidance, but only when this issue explicitly puts one in scope; otherwise "none". Exception: a change to a runtime custom property that a React theme colour maps to is always listed here, even when React is not in scope.
Say whether each change is additive, a visible change, or a removal or rename. Static styles work must not expand into a retained/deferred surface. If an explicitly scoped React change needs a styles contract that does not exist yet, the styles change lands first.
Name contracts, never file locations. No file paths or code snippets anywhere in this issue. -->

## Dependencies

<!-- Prerequisites and unresolved decisions that are not issues in this repository: external dependencies, other repositories, decisions awaiting a person. Use real URLs; do not invent numbers. Separate what blocks starting from what blocks release. Blocking between issues in this repository is recorded as native GitHub issue dependencies, never here. -->

## Verification

<!-- For every tier: the agreed verification seams, and what each one shows. For High work, additionally number each observable claim V-001, V-002, and so on. State the meaningful violation, the observation that distinguishes it, and the evidence channel that can see it. Standard and Light work need only the seams and concise acceptance bullets. -->

## Implementation approach

<!-- Name the owning sources by what they are, not where they live, and the smallest independently releasable change. Record ordering, migration and rollback concerns. If the work is too large for one reviewable pull request, say so; it is then broken into child issues with /to-tickets rather than an in-repository specification stack. A maintainer accepts this section and the claims before High new behaviour starts. -->

## Completion evidence

<!-- What proves this is done: the stories and checks that demonstrate the behaviour, and the released package version that contains it. A consumer need is done when it is released, not when it is merged. -->
```
