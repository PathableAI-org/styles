<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/055-audit-app-layouts/plan.md

## Audit of Real Application Layouts

This feature (slice 13 of the React Semantic Primitives plan) performs a
research and documentation audit of real application code consuming
`@pathable/react`. The audit identifies repeated layout patterns, common
utility-class combinations, and candidates for higher-level composition
primitives in slice 14. No new components, code changes, or API modifications
ship here — it is exclusively a research and documentation feature.

### Deliverable

- An audit document in `docs/plans/semantic-react/` listing identified
  patterns grouped by intent category, ranked by frequency and reusability,
  with API sketches and SCSS contract notes for reusable candidates.

### Key constraints

- No code changes, no new components, no API modifications (FR-013).
- The audit must cover: className combinations, component nesting patterns,
  page-level structures, form patterns, and action/button groups.
- Patterns are classified as reusable, domain-specific, or incidental.
- The findings directly inform the candidate list in slice 14.

### Running the audit

```bash
# Search for className patterns in an application repo
rg "pathable-" --only-matching

# Search for component nesting patterns
rg "<Container" -A 10

# The audit is manual — no automated scripts are produced
```

<!-- SPECKIT END -->
