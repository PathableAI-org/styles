## Decisions for the reviewer

<!-- Required first section. 3–5 bullets, each labelled Tradeoff, Contract change, Accepted limitation, Beyond scope, Evidence substitution, or Outstanding manual check. Every limitation, check not run or not passing, workaround, and pending manual check mentioned below must appear here. With nothing to decide, write: None: stays inside the stated contract, with no limitations. -->

-

## Tier

<!-- See "Risk tiers" in docs/engineering/git-workflow.md. -->

- Risk tier: High / Standard / Light <!-- and add the matching risk:high, risk:standard or risk:light label -->
- Triggers that matched, or why none applies:
- Issue: <!-- Closes <url-or-#n> only if this pull request satisfies the issue; otherwise Contributes to <url-or-#n>. -->

## Change

<!-- What changed and why, in source-first order: @pathableai/styles, then @pathableai/react, then consumer agent guidance. Name the tokens, classes, exports and props affected. -->

## Evidence

<!-- One row per claim. For High work, number the claims. For UI changes, link the stories and attach screenshots, and say which test:visual snapshots changed and why. -->

| Claim | Result | Evidence | Limits |
| ----- | ------ | -------- | ------ |
|       |        |          |        |

## Changeset

<!-- Either: the changeset file, the packages it bumps, and the bump type. Or: why none is needed (no code in a published package changed). -->

## Validation

- [ ] Checks from `AGENTS.md` "Before committing" for the files changed, with results above, and what was not run and why
- [ ] Evidence required by this tier in `docs/engineering/git-workflow.md`
- [ ] Docs under `docs/` and the package READMEs updated where current behaviour changed
- [ ] Consumer agent guidance updated, or not affected (`pnpm check:agent-guidance`)
- [ ] No temporary probes or generated output committed
