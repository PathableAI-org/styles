# Research: Audit of Real Application Layouts

**Feature**: 055-audit-app-layouts  
**Date**: 2026-08-24  

## Decision 0: Audit is Manual Search, Not Automated Tooling

**Decision**: The audit will be conducted through manual search commands (`rg`/`grep`) across known application repositories, followed by human classification of results, rather than building automated code-query tooling.

**Rationale**:  
- FR-013 prohibits producing new code. An automated scraper or static-analysis tool would be a code artifact.  
- The audit is a one-time research activity, not an ongoing monitoring system.  
- Manual search allows contextual judgment (intent classification, domain vs. reusable distinction) that automated pattern-matching would miss.  
- Search scripts (shell one-liners, `rg` queries) are ephemeral discovery tools, not deliverables.

**Alternatives considered**:  
- Custom static-analysis tooling: Violates FR-013; overhead not justified for one-time audit.  
- AST-based query tool: Over-engineered for the goal of identifying className strings and JSX nesting patterns.

## Decision 1: Pattern Classification Criteria

**Decision**: Patterns are classified using the following rubric:

| Dimension | Criterion |
|-----------|----------|
| **Domain-specific** | The pattern is tied to a specific application's business logic, page structure, or feature domain. It would not make sense in a different application. |
| **Reusable (composition)** | The pattern expresses a generalized layout or relationship need that could benefit multiple applications. It describes how elements relate, not what domain content they carry. |
| **Incidental** | The pattern is repeated but is clearly a one-off styling choice or copy-paste artifact rather than a semantically meaningful composition. |

**Classification decision tree**:

```
Does the pattern appear in ≥ 2 applications?
├── No → Single-application pattern. Record frequency but classify
│        as domain-specific unless it expresses a clearly general
│        layout concept not yet adopted elsewhere.
└── Yes → Does the pattern express a layout or semantic relationship?
    ├── No → Incidental (copy-paste styling).
    └── Yes → Reusable composition candidate.
```

**Rationale**: Multi-app presence is the strongest signal of general need. Intent distinguishes composition primitives from styling accidents.

## Decision 2: Search Strategy — What to Query

**Decision**: Search in the following order, across each application repository:

1. **className strings** — `rg "pathable-" --only-matching` to find utility class usage, then cluster identical `className` values.
2. **Component nesting** — Search for `<Container>`, `<Stack>`, `<Box as="main">`, `<Box as="section">`, etc. and examine their children to identify recurring nest structures.
3. **Page-level structure** — Search for patterns like `header`/`main`/`footer` siblings inside a single parent.
4. **Form patterns** — Search for `<Stack>` containing form controls (`<TextInput>`, `<Select>`, `<Button>`).
5. **Action/button groups** — Search for repeated horizontal groupings of buttons or action elements.

**Rationale**: This order captures utility-class patterns first (most mechanical to detect), then structural patterns requiring more judgment. The source feature description explicitly calls for all five search dimensions.

## Decision 3: Frequency Counting Methodology

**Decision**: "Frequency" is the raw occurrence count of a pattern across all searched repositories. A pattern found 20 times across 3 repositories outranks one found 5 times in a single repository.

**Counting rules**:
- For `className` combinations: count exact string matches of the full `className` value (e.g., `"pathable-width-full pathable-max-width-desktop"`).
- For component nesting: count occurrences of the same component hierarchy with matching prop values.
- For page-level structures: count occurrences of the same element arrangement regardless of their internal content.
- Near-identical patterns differing by one class or prop are grouped under a canonical form with the variation noted, not counted separately.

**Rationale**: Exact matching avoids subjectivity in counting. Grouping near-identical patterns prevents catalog fragmentation while preserving the variation record.

## Decision 4: Deliverable Format

**Decision**: The audit deliverable is a single Markdown document in `docs/plans/semantic-react/`, structured as:

```markdown
# Application Layout Audit

## Category: [Intent Category Name]

### Pattern: [Pattern Name]
- **Frequency**: N occurrences across M applications
- **Intent**: [What the pattern expresses]
- **Classification**: reusable | domain-specific | incidental
- **Representative example**: [Code snippet]
- **API sketch** (reusable only): [Proposed component name + prop signature]
- **SCSS contract**: [existing class names or "needs creation"]
```

**Rationale**: One document simplifies consumption by slice 14. The structured per-pattern format ensures all FR-006/FR-009/FR-010 data is present and comparable.

## Decision 5: No NEEDS CLARIFICATION — All Decisions Made

**Decision**: All unknowns from Technical Context are resolved. No NEEDS CLARIFICATION markers remain.

**Status of each context item**:
- Language/Version: N/A (documentation-only)
- Primary Dependencies: Application repos (read-only) + `rg`/`grep` + Markdown
- Storage: Markdown deliverable in `docs/plans/semantic-react/`
- Testing: Manual spot-check + peer review
- Target Platform: Documentation artifact
- Project Type: Research/documentation
- Performance Goals: N/A
- Constraints: FR-013 fully satisfied (no code produced)
- Scale/Scope: Multi-repo search, categories emerge from data