# Context Digest — Cleanup Capability (Draft)

## Scope
Final verification, dry-run pack, and commit.

## Prerequisites
All integration (S01-S05) and documentation (S06) shards complete.

## Tasks
- T042: Build and verify final dist/styles.css
- T043: pnpm pack --dry-run
- T044: Commit all changes

## Key Requirements
- All --pathable-* CSS custom properties present in output
- All $theme-color-* tokens configured
- No .usa- component styles leaked
- Published package includes: dist/, src/, README, BRAND_RULES, AGENTS