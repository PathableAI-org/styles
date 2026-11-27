---
name: grilling
description: Interview a person relentlessly about a plan, decision or idea until you share an understanding, asking every open question each round with a recommended answer. Use to stress-test a plan or to plan a delivery before any issue or code exists, or when a person uses a "grill" phrase. Writes nothing itself.
---

# Grilling

<!-- Adapted from mattpocock/skills skills/productivity/grilling/SKILL.md @ v1.3.1. MIT License, Copyright (c) 2026 Matt Pocock. -->

Interview the person relentlessly until you reach a shared understanding. Map
the plan as a **design tree**: every decision branches into the decisions that
hang off it.

This skill writes nothing: no file, issue, branch or comment. Recording what
was settled belongs to the skill that invoked it, and only after the person
agrees.

## Rounds

Work the tree in **rounds**. The **frontier** is every decision whose
prerequisites are already settled: the questions you can ask now without
guessing at answers you have not heard yet. Ask the whole frontier in one
round. Number each question and give your recommended answer. Then wait for the
person's answers before the next round.

Format a round like this:

```text
❓ **Q1** - **<question title>**: <question body, may be several paragraphs,
including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body>

➡️ <your recommended answer>
```

Word each question so that "yes" accepts your recommended answer.

Each round the person answers reshapes the tree: settled decisions push the
frontier outward and unblock questions that depended on them. Recompute the
frontier and ask the next round. A question whose answer depends on another
question still open in this round belongs to a later round.

## Facts and decisions

Finding facts is your job, never the person's. When a frontier question needs a
fact from the repository or its tools, dispatch a read-only subagent on the
`haiku` model (the `Explore` or `general-purpose` agent type) with a narrow
question, such as "which components in `components/` mention a disabled
state?". Do not hand it the plan or ask it to judge anything. Do not ask the
person for anything you could look up.

Do not block on it. A running lookup is an unsettled prerequisite, so only the
questions downstream of it wait for the subagent to report; ask the rest of the
frontier now. The decisions are the person's: put each to them and wait.

## Planning a delivery

When the plan is a delivery, a change to this design system, seed the design
tree from the spec sections defined in
[the `to-spec` skill](../to-spec/SKILL.md), in dependency order. Link the
skill; do not restate its rules. The skill and the documents it names win on
any conflict.

1. **Outcome** and **Consumer** first. Everything else depends on them.
2. **In scope**, **Out of scope** and **Contract impact**. Read
   [target-state.md](../../../docs/engineering/target-state.md) and the owning
   package documents before recommending, and look up facts as above.
3. **Dependencies**: what blocks starting and what blocks release.
4. **Risk tier**. Recommend a tier with every trigger that matched, taken from
   "Risk tiers" in
   [git-workflow.md](../../../docs/engineering/git-workflow.md). The maintainer
   sets it. When it is unclear whether a trigger matches, recommend the higher
   tier.
5. **Verification**: the agreed seams for every tier, and numbered claims for
   High. Then **Implementation approach**, only when the tier is High.

**Completion evidence** follows from the earlier answers; confirm it last.

## Ending

The session is done when the frontier is empty: every branch of the design tree
visited, nothing left silently assumed. Do not act on the plan until the person
confirms that you have reached a shared understanding.
