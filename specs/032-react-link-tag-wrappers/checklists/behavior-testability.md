# Behavior Testability Checklist: React Link and Tag Wrappers

**Purpose**: Confirm the specification describes observable behavior before planning
**Created**: 2026-07-18
**Feature**: [spec.md](../spec.md)

## Observable Behavior

- [x] Each user story has an independent test.
- [x] Acceptance scenarios identify observable inputs and outcomes.
- [x] Native Link behavior, content, and attribute preservation are testable.
- [x] Tag content, size, and attribute preservation are testable.
- [x] Every exposed presentation maps to an implemented source class.
- [x] Empty content, rich content, custom classes, and unsupported values are bounded.
- [x] Consumer installation and transitive styling outcomes are verifiable.

## Scope Controls

- [x] The owning `pathable-link` and `pathable-tag` contracts are identified.
- [x] The React names `Link` and `Tag` follow repository naming governance.
- [x] Wrapper-only visual or interaction behavior is prohibited.
- [x] Navigation policy and interactive or dismissible Tag behavior remain out of scope.
- [x] The unimplemented `pathable-link--nav` modifier is not exposed.

**Gate Status**: PASS

**Blocking Items**: none
