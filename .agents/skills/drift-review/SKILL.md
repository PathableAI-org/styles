---
name: drift-review
description: Review one area of the PathAble design system (tokens, utilities, component wrappers, styles JS, React primitives, React theming, agent guidance, Storybook infrastructure) for slow drift from its current owning documents, verify and cap the findings, and file or update GitHub issues labelled drift. Read-only on the repository. Use for the scheduled drift review or when a person asks for a drift review of an area.
---

# Drift review

<!-- Adapted from pathableai-org/pre-ets .agents/skills/drift-review/SKILL.md @ f2ee390. -->

Read [Drift review](../../../docs/engineering/drift-review.md) first. It owns
the area list, the scope and categories, the finding fields, the issue format
and how an area is chosen. This skill supplies the procedure. Also read
[AGENTS.md](../../../AGENTS.md).

## Arguments

- `scheduled`: a scheduled run. File and update issues without asking, then
  end with the report.
- Otherwise the run is interactive: show the findings and the exact issue
  changes, and write nothing to GitHub until the person approves.
- `area=<id>`: review that area instead of choosing by churn.
- `dry-run`: choose, review and report, but write nothing to GitHub.

## Boundaries

- Never edit, create or delete a repository file, branch, commit or pull
  request. Never push.
- Do not install dependencies, build, or reach any host other than GitHub.
  Verify by reading, tracing, searching and Git history.
- Write to GitHub only issues and issue comments labelled `drift`, through
  `gh api` REST calls or the GitHub MCP tools. `gh issue` and `gh pr` use
  GraphQL, which cloud sessions cannot reach.
- Never print or file credentials or tokens, and never name a client.
- Do not file lint, stylelint, token-lint, typecheck or test-runner findings.
  Their output is context only.

## Procedure

### 1. Set up

1. From the repository root, derive the repository slug from the `origin`
   URL's last two path segments, without `.git`, and set `R=<owner>/<repo>`.
   Find the default branch with `gh api repos/$R --jq .default_branch`.
2. If `git rev-parse --is-shallow-repository` prints `true`, run
   `git fetch --unshallow origin`. Run `git fetch origin <default>` and set
   `SHA=$(git rev-parse origin/<default>)`. This is the reviewed commit.
3. If `HEAD` is not `SHA`, read files with `git show $SHA:<path>`, or add a
   detached worktree at `SHA` under a temporary directory outside the
   repository and remove it when done. Never switch the current checkout.
4. Check the label with `gh api repos/$R/labels/drift`. If it is missing, do
   not create it: creating labels is the maintainer's decision. End with a
   report that the label is missing, and in an interactive run show the
   findings without filing them.
5. Find the tracking issue: the issue titled `Drift review log` among
   `gh api "repos/$R/issues?labels=drift&state=all&per_page=100" --paginate`
   (skip entries with a `pull_request` field). If none exists, create it only
   with the person's approval in an interactive run, or in a scheduled run the
   maintainer has set up, with label `drift` and a body that links to the
   drift review guide.

### 2. Choose the area

1. Read the tracking issue's comments
   (`gh api repos/$R/issues/<n>/comments --paginate`) and take, for each area,
   the latest comment whose first line is
   `<!-- drift-review area=<area> sha=<sha> -->`. If that commit no longer
   exists, use the comment's `created_at` as the area's last review date.
2. Read each area's paths from the guide's `## Areas` section: the backticked
   list items under `Paths`. Count churn as the guide defines it:

   ```bash
   doc=docs/engineering/drift-review.md
   paths_of() { awk -v a="### \`$1\`" '$0==a{f=1;next} /^### /{f=0} f && /^  - `/{gsub(/^  - `|`$/,"");print}' "$doc"; }
   mapfile -t p < <(paths_of "$area")
   git rev-list --count "$last..$SHA" -- "${p[@]}"          # reviewed before, by commit
   git rev-list --count --since="$date" "$SHA" -- "${p[@]}" # reviewed before, commit gone
   git rev-list --count --since=90.days "$SHA" -- "${p[@]}" # never reviewed
   ```

3. Choose the area with the most churn, then the oldest review, then guide
   order, unless `area=<id>` was given. If every area has zero churn, go to
   step 6 and record that no area changed.
4. List the commits since the last review that touch the area. They show
   where drift is likely, but review the area as it stands at `SHA`.

### 3. Review

Read the area's owning documents in full, every source file, story and test
under its paths, and the package `AGENTS.md` or README for each package it
touches. Then look for each category in the guide's scope table. Useful
checks:

- **contract-drift**: take each concrete promise in the owning document or
  README (a class, modifier, token, prop, export, entry point, keyboard
  behaviour or import rule) and find the code that keeps it. Check that names
  and paths the document mentions still exist. Two documents that disagree
  about the same code are drift.
- **source-first** and **naming-parity**: for each React component, find the
  `pathable-*` styles component it wraps and check the name and the mapping of
  each visual prop to a styles class or token.
- **wrapper-styling**: search `packages/react/src` for inline styles, CSS
  imports and class strings outside the `.pathable-*` contract.
- **token-usage**: search the area for raw colour, size and shadow values, and
  compare the tokens [Token vocabulary](../../../docs/theming/token-vocabulary.md)
  lists with the tokens the build defines.
- **story-contract** and **accessibility**: for each documented state and
  keyboard promise, find the named story and interaction test that covers it.
  Re-read each entry in `scripts/accessibility-exceptions.mjs` that touches
  the area and check its rationale still holds.
- **guidance-drift**: compare the consumer agent guidance with the current
  exports and props.
- **duplication**: search both packages for helpers, tokens, mixins or
  constants that mean the same thing.
- **complexity**: modules that now hold several unrelated responsibilities,
  and options or abstractions with a single caller.
- **test-meaningfulness**: for each documented promise, find the story or
  test that would fail if it broke.

Do not report style preferences, anything the owning document already lists
as a known gap or linked open issue, tool findings, or a change that would
merely be nicer. One finding can cover several locations of the same drift.

### 4. Verify and cap

For each candidate, before keeping it:

1. Re-read the cited code at `SHA` and the document passage it depends on, and
   trace the path end to end.
2. Try to refute it: look for an approved exception in the owning document or
   `AGENTS.md`, a story or test you missed, or an open issue that already
   covers it.
3. Write the `failureScenario` with concrete inputs or state and the wrong
   outcome, or the concrete change a maintainer would get wrong. If you
   cannot, drop the candidate.
4. Record in `verification` what you read, traced, searched or ran.

Keep only `high` and `medium` confidence findings. Sort by severity, then
confidence, and keep at most five.

### 5. Deduplicate

List the open `drift` issues and those closed as not planned. The
`drift-finding` marker's area, category and file narrow the candidates; read
each candidate's summary to decide.

- Matches an open issue: plan a comment instead of a new issue.
- Matches an issue closed as not planned: drop it, unless the code changed so
  the closing decision no longer applies; then file a new issue that links the
  closed one and says what changed.
- No match: plan a new issue.

### 6. File and record

In an interactive run, show the person the planned issues, comments and
tracking comment in full, and wait for approval. In a `dry-run`, show them and
stop.

New issue, titled `drift(<area>): <summary>`, with label `drift`:

```markdown
**Area:** `<area>` ([drift review](https://github.com/<R>/blob/<default>/docs/engineering/drift-review.md))
**Reviewed commit:** <SHA>
**Severity:** <severity> · **Category:** <category> · **Confidence:** <confidence>
**Location:** [`<file>:<line>`](https://github.com/<R>/blob/<SHA>/<file>#L<line>)
**Owning document:** <absolute link to the document section at `<SHA>`>

<summary>

**Failure scenario.** <failureScenario>

**Verification.** <verification>

<!-- drift-finding area=<area> category=<category> file=<file> -->
```

Update to an open issue: `Still present at <SHA>`, the current location, and
only evidence the issue does not already have. Every link in issue text is an
absolute GitHub URL.

Then comment on the tracking issue, every run, including runs with no
findings:

```markdown
<!-- drift-review area=<area> sha=<SHA> -->

**<area>** reviewed at <SHA> · <n> commits since <last sha or date, or "first review">
Filed: #a, #b · Updated: #c · Dropped after verification: <count>
```

When no finding survives, say `No verified findings.` in place of the issue
lists. When no area changed, use `area=none` in the marker.

### 7. Report

End with: the area and why it was chosen (the churn table), the reviewed
commit, links to issues filed and updated, the tracking comment's link, and
how many candidates were dropped and why. Remove any temporary worktree.
