---
name: Delivery or consumer need
about: Describe one deliverable outcome, such as a need from a consuming application
title: ''
---

## Outcome

<!-- The capability this issue delivers, stated as what a consumer can do once it is released. -->

## Consumer

<!-- Who needs this and why. Link the consumer's issue or pull request with a full URL (for example https://github.com/PathableAI-org/pre-ets/issues/123). Name the released package version where the current behaviour was observed. Write "Internal" for work with no external consumer. -->

## Risk tier

<!-- High, Standard, or Light, with every trigger that matched, or the condition that makes the work Standard or Light. The drafting agent proposes; the maintainer sets it. Only the maintainer may lower it, with the reason recorded here. Add the matching risk:high, risk:standard or risk:light label. For a bug fix, also add the bug label and exactly one of package:styles or package:react; a bug in both packages is two issues, one per package. See "Risk tiers" in docs/engineering/git-workflow.md. -->

## In scope

## Out of scope

<!-- Adjacent work, excluded cases, and undecided policy. -->

## Contract impact

<!-- Which published contracts change, in source-first order:
1. @pathableai/styles compiled CSS: tokens, CSS custom properties, static .pathable-* classes, assets, or "none".
2. @pathableai/styles consumer agent guidance: installed component pages, package-wide selection or bug-reporting guidance, or "none".
3. Retained/deferred surfaces: @pathableai/react API or React consumer guidance, but only when this issue explicitly puts one in scope; otherwise "none".
Say whether each change is additive, a visible change, or a removal or rename. Static styles work must not expand into a retained/deferred surface. If an explicitly scoped React change needs a styles contract that does not exist yet, the styles change lands first. -->

## Dependencies

<!-- Prerequisites and unresolved decisions. Use real issue URLs; do not invent numbers. Separate what blocks starting from what blocks release. -->

## Verification claims

<!-- For High work, number each observable claim V-001, V-002, and so on. State the meaningful violation, the observation that distinguishes it, and the evidence channel that can see it. Standard and Light work may use concise acceptance bullets instead. -->

## Implementation approach

<!-- Name the owning sources and the smallest independently releasable change. Record ordering, migration and rollback concerns. If the work is too large for one reviewable pull request, split it into linked delivery issues rather than an in-repository specification stack. A maintainer accepts this section and the claims before High new behaviour starts. -->

## Completion evidence

<!-- What proves this is done: the stories and checks that demonstrate the behaviour, and the released package version that contains it. A consumer need is done when it is released, not when it is merged. -->
