# Feature Specification: Audit of Real Application Layouts

**Feature Branch**: `055-audit-app-layouts`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Create a feature from docs/plans/semantic-react/13-audit-application-layouts.md — audit real application code that consumes `@pathable/react` to identify repeated layout patterns, common utility-class combinations, and candidates for higher-level composition primitives in slice 14."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identify Repeated Layout Patterns (Priority: P1)

A design-system maintainer needs to understand which layout patterns, utility-class combinations, and primitive nestings appear repeatedly across real applications consuming `@pathable/react`. By systematically searching application code, they produce a ranked catalog of patterns with frequencies, intents, and classifications — informing which patterns merit promotion into reusable composition primitives in the next feature slice.

**Why this priority**: This is the core deliverable. Without the pattern inventory there is no evidence basis for slice 14's composition primitives. All other stories support or depend on this output.

**Independent Test**: Inspect the produced audit document and verify it lists at least five distinct patterns, each with a frequency count and a classification (domain-specific or reusable). Confirming a sample of pattern frequencies against source application repositories validates the catalog.

**Acceptance Scenarios**:

1. **Given** access to application repositories that consume `@pathable/react`, **When** a maintainer searches for repeated `className` strings combining utility classes, **Then** the audit document records each distinct combination with its frequency count.
2. **Given** an application codebase using `@pathable/react` layout primitives, **When** a maintainer searches for repeated nesting of `Box`, `Container`, `Stack`, and other primitives with the same prop configurations, **Then** the audit document captures each recurring structure.
3. **Given** multiple patterns identified across applications, **When** the maintainer classifies each pattern, **Then** each pattern is labeled as domain-specific (belongs in an app) or reusable (candidate for `@pathable/react`).

---

### User Story 2 - Categorize and Rank Candidates (Priority: P2)

A design-system maintainer needs to group identified patterns by category (page shell, sidebar layout, form layout, action grouping, etc.) and rank them by frequency and reusability so the most impactful candidates are prioritized for promotion in slice 14.

**Why this priority**: Categorization and ranking directly inform which primitives to implement first and expose disagreements about a pattern's intent. This builds on the raw inventory from P1.

**Independent Test**: Verify the audit document sections are organized by pattern category, and that within each category, patterns are ordered by frequency. Confirm that at least one candidate per category includes a reusability assessment.

**Acceptance Scenarios**:

1. **Given** a list of identified patterns, **When** the maintainer groups them by intent category, **Then** patterns are organized under headings such as "Page Shell," "Sidebar Layout," "Form Layout," and "Action Grouping."
2. **Given** patterns within a category, **When** the maintainer ranks them, **Then** the most frequent reusable pattern appears first, followed by others in descending order.
3. **Given** a pattern classified as reusable, **When** the maintainer assesses it, **Then** the audit explains why it is reusable rather than domain-specific.

---

### User Story 3 - Draft API Sketches for Reusable Candidates (Priority: P3)

A design-system maintainer needs a rough API sketch and SCSS contract assessment for each reusable candidate so that slice 14 can begin implementation with a starting point rather than from scratch.

**Why this priority**: API sketches save time in the next slice but depend on the pattern inventory and classification being complete. They are forward-looking guidance, not final designs.

**Independent Test**: For each reusable pattern, verify the audit document includes a proposed prop signature or component name, and a note on whether the required SCSS contract already exists or needs to be created.

**Acceptance Scenarios**:

1. **Given** a reusable pattern identified in the audit, **When** the maintainer drafts an API sketch, **Then** the sketch includes a proposed component name and brief prop signature.
2. **Given** an API sketch for a pattern, **When** the maintainer assesses SCSS contracts, **Then** the audit notes whether owning `pathable-*` classes already exist or need creation.

---

### Edge Cases

- What happens when a pattern appears only in one application but with high internal repetition? The pattern is recorded with its absolute frequency and noted as single-application; classification as reusable requires multi-app evidence.
- How should patterns that are near-identical but differ by one utility class be handled? Group them under a single canonical form, noting the variation, rather than fragmenting the catalog.
- What about patterns that are technically repeated but clearly the result of copy-paste rather than intentional shared design? They are still recorded but downgraded in the reusability assessment.
- What if no application repositories are accessible, or search tools fail? The audit must document what was attempted and note limitations; the feature is still "done" if the effort was made.
- What about patterns using the raw styles package directly (not via `@pathable/react`)? These are noted separately but only patterns through the React package are primary for slice 14's composition primitives.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The audit MUST search representative application repositories that consume `@pathable/react` for repeated `className` strings combining the same utility classes (e.g., `"pathable-width-full pathable-max-width-desktop pathable-margin-x-auto pathable-padding-x-4"`).
- **FR-002**: The audit MUST search for repeated nesting of `Box` and layout primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Grid`) with the same prop configurations.
- **FR-003**: The audit MUST identify common page-level structures such as `header` + `main` + `footer` inside a `Container`.
- **FR-004**: The audit MUST identify repeated `Stack` + form-control patterns across applications.
- **FR-005**: The audit MUST identify action-bar and button-group arrangements used repeatedly.
- **FR-006**: For each identified pattern, the audit MUST record: frequency count (number of occurrences), intent (what semantic or layout concept the pattern expresses), and classification as either domain-specific (belongs in an application) or reusable (candidate for `@pathable/react`).
- **FR-007**: The audit MUST group patterns by intent category, with categories determined by the patterns actually found rather than a predefined list.
- **FR-008**: The audit MUST rank patterns within each category by a combination of frequency (primary) and reusability (secondary).
- **FR-009**: For each reusable candidate, the audit MUST draft a rough API sketch including a proposed component name and brief prop signature.
- **FR-010**: For each reusable candidate, the audit MUST note whether the required SCSS contract already exists in `@pathable/styles` or would need to be created or verified.
- **FR-011**: The audit MUST distinguish true composition primitives (layout relationships, shared app shell patterns) from incidental combinations (one-off styling, copy-paste artifacts).
- **FR-012**: The audit document MUST be placed in `docs/plans/semantic-react/` or in the feature branch and MUST directly inform the candidate list in slice 14's promotion-of-composition-patterns document.
- **FR-013**: The feature MUST NOT produce new components, modify existing component APIs, or migrate application code. This is exclusively a research and documentation feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The audit document contains at least 5 distinct patterns, each with a frequency count, intent description, and domain/reusable classification.
- **SC-002**: Every pattern classified as reusable has an API sketch and SCSS contract note.
- **SC-003**: Patterns are grouped by intent category and ranked within each category such that the most frequent reusable candidate appears first.
- **SC-004**: The audit's reusable candidates directly populate or update the candidate list in the slice 14 composition-patterns document.
- **SC-005**: A reviewer can verify at least 3 frequency counts by spot-checking the source application repositories and obtaining the same result.
- **SC-006**: The audit distinguishes composition primitives from incidental combinations, with at least one pattern explicitly classified as incidental with rationale.

## Assumptions

- Application repositories consuming `@pathable/react` are accessible for search and manually reviewable. If any repository is unavailable, the audit documents the limitation.
- Slices 2 through 12 (Card sizing, form control sizing, Box, Container, Stack, Inline, Cluster, Grid, Text, Heading, color/tone model, Surface) are substantially complete so the audit evaluates real usage of the new primitives rather than just utility-class patterns.
- "Frequency" is measured as raw occurrence count across all searched repositories. A pattern found 20 times across 3 applications outranks one found 5 times in a single application.
- Intent categories will emerge from the patterns actually discovered; the source document's examples (page shell, sidebar layout, form layout, action grouping) are starting points, not a closed list.
- The audit's API sketches are rough drafts intended to seed slice 14, not final component specifications. They may omit edge cases, error handling, and accessibility details that a full spec would include.
- Search tools such as `grep`/`rg`, or application-aware search across the repositories, are sufficient for identifying patterns. Automated code-query tooling is not required.
- The audit uses the terms "domain-specific" to mean a pattern tied to one application's business logic or page structure and "reusable" to mean a pattern expressing a generalized layout or composition need that benefits multiple applications.
- The feature has no dependency on Figma, design tokens, or visual design deliverables.