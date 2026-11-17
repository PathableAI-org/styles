<!-- Ported from pathableai-org/pre-ets tests/tooling/fixtures/plan.md @ f2ee390 (adapted: design-system sample content; Stories column in place of Telemetry rows). -->

# Implementation Plan: Sample

## Phase 7 — Implementation slices

| Slice  | Branch               | Decision a reviewer accepts    | Contracts and modules  | Stories                                                       | Claim IDs advanced                                                       | Est. hand-written files |
| ------ | -------------------- | ------------------------------ | ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| **A1** | `900-sample-impl`    | Buttons show a focus ring      | `pathable-button.scss` | `components-button--primary`                                  | V-001 (focus ring), V-004 (forced colors unknown; 200% text best effort) | ~15                     |
| **A2** | `900-sample-impl-a2` | Disabled buttons stay readable | `Button.tsx`           | None new (existing `components-button--disabled`)             | V-006 (full), V-001 (disabled path)                                      | ~9                      |
| **B**  | `900-sample-impl-b`  | The modal traps focus          | `pathable-modal.scss`  | `components-modal--open`, `components-modal--narrow-viewport` | V-009–V-011, partial V-012                                               | ~13                     |
| **C**  | `900-sample-impl-c`  | Guidance names the props       | None (evidence only)   | Uses every story above                                        | V-019, V-020 (full); full manual procedure for all claims                | ~4                      |
