---
name: domain-modeling
description: Sharpen the design system's vocabulary in GLOSSARY.md and record its decisions in their owning documents. Use when discussing terminology or naming, when a term conflicts with how a document or the code uses it, or when a decision should be recorded.
---

# Domain modeling

<!-- Adapted from mattpocock/skills skills/engineering/domain-modeling/SKILL.md, ADR-FORMAT.md and GLOSSARY-FORMAT.md @ v1.3.1. MIT License, Copyright (c) 2026 Matt Pocock. -->

Actively sharpen this project's language and record its decisions as you
design: challenge terms, invent edge cases and write down what settles.
Merely reading a document for vocabulary is not this skill.

`GLOSSARY.md` at the repository root owns the design system's domain
vocabulary. This repository is a single context. Create the file lazily, when
the first term is settled. Never create `docs/adr/` or `GLOSSARY-MAP.md`:
decisions go to the documents that own their topic, as the "Decisions" section
below says ("Where current behaviour is documented" in
[AGENTS.md](../../../AGENTS.md)).

## Terms

### Challenge against the glossary and the current owners

When the person uses a term that conflicts with its owner, say so at once.
Check first against `GLOSSARY.md`, if it exists, then against:

- "Documentation terms" in
  [intent.md](../../../docs/engineering/intent.md): for example, consumer agent
  guidance and contributor agent guidance are different things, and the
  unqualified "agent-facing docs" is never used.
- The naming conventions in
  [packages/styles/AGENTS.md](../../../packages/styles/AGENTS.md) and
  [BRAND_RULES.md](../../../packages/styles/BRAND_RULES.md), including the
  component wrapper naming convention.
- Component names and their pages in `components/`.
- Token names and meanings in `packages/styles/src`.

Naming conventions (class-name patterns, wrapper naming rules) stay owned by
the package documents; `GLOSSARY.md` defines what terms mean. When a glossary
term would contradict one of those documents, surface it rather than silently
diverging.

Example: "intent.md defines consumer agent guidance as Markdown shipped in the
package, but you seem to mean the skills in `.agents/`. That is contributor
agent guidance. Which do you mean?"

### Sharpen fuzzy language

When a term is vague or overloaded, propose one canonical term and say which
others to avoid.

### Stress-test with scenarios

Invent concrete edge cases that probe the boundary between two concepts and
force the person to be precise: a component with and without a given modifier,
a token used in two contexts, a consumer on an older package version.

### Cross-check the code

When the person says how something works, check the CSS, fixtures and pages
agree. Surface any contradiction: "The page says the alert has no icon
variant, but the fixture uses one. Which is right?" A difference between a
component page or fixture and an in-scope component's CSS is a defect in the
CSS ([AGENTS.md](../../../AGENTS.md)).

### Update GLOSSARY.md inline

When a term is resolved, update `GLOSSARY.md` right there. Do not batch terms
up: capture each as it settles, creating the file on the first one. The
session is interactive, so the person sees each entry as you write it; tell
them what you added or changed. If the person disagrees, edit or remove the
entry at once.

`GLOSSARY.md` is a glossary and nothing else: not a spec, a scratch pad or a
place for decisions.

#### Format

```md
# PathAble design system

The PathAble design system: a CSS package, its documentation and the guidance
that ships with it.

## Documentation

**Consumer agent guidance**:
Auditable Markdown, shipped in the installed package, that agents use when
building with that package version.
_Avoid_: Agent-facing docs, agent docs

**Contributor agent guidance**:
Repository-local instructions, skills and role files that agents use to change
this repository.
_Avoid_: Agent-facing docs, agent docs
```

Rules:

- **Structure.** A title, a one or two sentence description of the context and
  why it exists, then terms, grouped under subheadings when clusters emerge. A
  flat list is fine if all terms belong to one area.
- **Entry.** `**Term**:` then a one or two sentence definition of what it IS,
  not what it does, then an `_Avoid_:` line with the rejected synonyms, when
  there are any.
- **Be opinionated.** When several words name one concept, pick the best and
  list the others under `_Avoid_`.
- **Only terms specific to this design system.** No general programming
  concepts (timeouts, error types, utility patterns), even if the repository
  uses them heavily. Ask: is this unique to this context?
- **No implementation details.** No file paths, and no class names, tokens or
  selectors as the definition. A term may name the public class or token it
  corresponds to only when that helps a reader find it, as a trailing mention
  and never as the definition; if the definition would change when the
  implementation changes, leave it out.

`intent.md` currently defines consumer and contributor agent guidance. Do not
move existing definitions out of `intent.md` on your own; you may propose it to
the person.

If a settled term needs an edit to an owning document (a naming convention, a
page), propose that edit separately: show the diff and apply it when the person
says yes. If no owner fits, ask where it belongs; do not invent a home.

## Decisions

Offer to record a decision only when all three hold:

1. **Hard to reverse**: changing your mind later costs something real.
2. **Surprising without context**: a future reader will wonder why it was done
   this way.
3. **The result of a real trade-off**: there were genuine alternatives and one
   was picked for specific reasons.

If any is missing, skip it. An easy decision will simply be reversed, an
unsurprising one needs no explanation and an obvious one has no alternative to
record.

Record it in the document that owns the topic:

- **Product direction or package contract**:
  [target-state.md](../../../docs/engineering/target-state.md). When it
  settles an item under "Open decisions", move the item out of that list into
  a decided entry. That document has no section for decided items yet:
  propose adding one; do not invent it silently.
- **Process, roles, models or tooling**: the Decisions table in
  [orchestration.md](../../../docs/engineering/orchestration.md), with the
  date.
- **One delivery's choice**: that delivery issue, including the alternatives
  considered and rejected.

Keep each entry short: the decision, one to three sentences on why, and the
rejected options when their rejection is not obvious. Show the proposed edit
and apply it only when the person says yes.
