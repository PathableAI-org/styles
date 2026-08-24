# Quickstart: Audit of Real Application Layouts

**Feature**: 055-audit-app-layouts
**Date**: 2026-08-24

## Purpose

This guide describes how to execute the application layout audit and validate its results. Since this feature produces no code, the "quickstart" is a procedural guide for the maintainer performing the audit.

## Prerequisites

- Read/write access to this repository (to commit the audit document).
- Read access to application repositories that consume `@pathable/react`. The exact repositories are determined during the audit based on what consumes the package.
- The `rg` (ripgrep) tool installed for pattern searching.
- Slices 2–12 of the React Semantic Primitives plan should be substantially complete so the audit captures real usage of the new primitives.

## Audit Procedure

### 1. Identify Application Repositories

Determine which repositories consume `@pathable/react` as a dependency. This can be done by:
- Checking `package.json` files in known application repos for `"@pathable/react"` in dependencies.
- Requesting the list from the project team if documentation exists.

Document the repository list at the top of the audit deliverable.

### 2. Search for className Patterns

For each application repository, run:

```bash
rg "pathable-" --only-matching -o 'className="([^"]*)"' | sort | uniq -c | sort -rn
```

Aggregate across repositories to identify the most frequent unique `className` combinations. Focus on combinations that appear in 3+ files total (across all repos).

### 3. Search for Component Nesting Patterns

Search for repeated JSX structures. For each pattern type:

```bash
# Container patterns
rg "<Container" -A 10 | rg -B2 "<Stack|<Grid|<Inline"

# Box-as-layout patterns
rg '<Box as="(main|section|header|footer|aside|nav)"'

# Stack + form patterns
rg "<Stack" -A 15 | rg "<TextInput|<Select|<TextArea|<Button"
```

### 4. Identify Page-Level Structures

Search for sibling element arrangements:

```bash
rg "<header" -A 5 | rg -B1 "<main"
```

Look for consistent patterns of `<header>` + `<main>` + `<footer>` inside a `<Container>` or similar wrapper.

### 5. Identify Action/Button Groups

Search for repeated button arrangements:

```bash
rg "<Button" -A 2 -B 2 | rg "pathable-flex|pathable-gap|<Button"
```

### 6. Classify and Record Each Pattern

For each distinct pattern found:
1. Count frequency across all repositories.
2. Determine intent (what does the pattern express?).
3. Classify as reusable, domain-specific, or incidental using the criteria in `research.md` (Decision 1).
4. For reusable patterns, draft an API sketch and note SCSS contract status.

### 7. Group and Rank

Group patterns by intent category. Within each category, rank by frequency (primary) and reusability (secondary). Reusable patterns within a category appear first.

### 8. Write the Audit Document

Write the deliverable to `docs/plans/semantic-react/audit-findings.md` using the format defined in `data-model.md`.

## Validation

### Spot-Check Frequency Counts

- Pick 3 patterns from the audit document.
- For each, re-run the search command in the source repositories.
- Confirm the count matches within a reasonable margin (differences of 1–2 may occur due to edge cases in regex matching).

### Peer Review

- Have another maintainer review the audit document.
- Check that at least 5 distinct patterns are present.
- Verify every reusable pattern has an API sketch and SCSS contract note.
- Confirm classifications make sense given the decision tree in `research.md`.

### Link to Slice 14

- Open `docs/plans/semantic-react/14-promote-composition-patterns.md`.
- Confirm its candidate list references patterns from the audit.
- If slice 14's document predates the audit, update it with the new findings.

## Expected Outcome

An audit document containing:

- A catalog of 5+ distinct layout patterns found across consuming applications.
- Each pattern classified as reusable, domain-specific, or incidental.
- API sketches for all reusable candidates.
- SCSS contract status notes.
- Patterns grouped by category and ranked by frequency.