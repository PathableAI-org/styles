# Spec Kit

This document owns how [Spec Kit](https://github.com/github/spec-kit) is set up
here: which files the weekly upgrade owns, where project customisations live,
and the steps agents must skip. When to write a specification at all is decided
by the [risk tier](git-workflow.md#process-by-tier).

## What is installed

- The `speckit-*` skills live in `.agents/skills/`. The installed integrations
  are `codex` and `opencode` (`.specify/integration.json`).
- Claude Code reaches the same skills through `.claude/skills/speckit-*`, which
  are symlinks to `.agents/skills/speckit-*` (see
  [The `.claude/skills` symlinks](#the-claudeskills-symlinks)).
- The `workflow-preset` preset and the `agent-context`, `critique` and `git`
  extensions are installed under `.specify/`.
- The `toc-navigation` preset is still installed but is being removed: generated
  documents no longer carry a table of contents, and the overrides shadow its
  templates. A maintainer runs `specify preset remove toc-navigation`, then
  deletes this bullet and the `toc-navigation` path under
  [Keeping overrides current](#keeping-overrides-current).

## What the upgrade workflow owns

[`.github/workflows/speckit-upgrade.yml`](../../.github/workflows/speckit-upgrade.yml)
runs weekly (and on demand) through a shared reusable workflow and opens a pull
request that upgrades Spec Kit. Its `add_paths` are `.specify/` and
`.agents/skills/`.

Treat these as generated. Do not hand-edit them; change them only through an
upgrade or a `specify` command:

- `.agents/skills/`
- `.specify/scripts/`
- the core templates `.specify/templates/*.md`, which are hash-tracked in
  `.specify/integrations/speckit.manifest.json`
- `.specify/integrations/`, `.specify/presets/` (including `.registry`),
  `.specify/extensions/` and `.specify/workflows/`

These files under `.specify/` are the project's own:

- `.specify/memory/constitution.md`, changed through the `speckit-constitution`
  skill
- `.specify/templates/overrides/`, the project's template customisations
  (below)
- the project's choices in `.specify/extensions.yml`, such as the disabled
  `agent-context` hooks

## Where project customisations live

Project-specific template content lives in
`.specify/templates/overrides/`: `spec-template.md`, `plan-template.md` and
`tasks-template.md`. They carry the design-system, Storybook, accessibility,
responsive, visual-regression and validation sections, the Constitution Check
subsections and the conditional task categories.

### How Spec Kit picks a template

Both the bash scripts (`resolve_template` in `.specify/scripts/bash/common.sh`)
and the `specify` CLI (`PresetResolver`) search, in order:

1. `.specify/templates/overrides/<name>.md`
2. each enabled preset in `.specify/presets/.registry`, by priority
3. extension templates
4. the core `.specify/templates/<name>.md`

An override always replaces everything below it.

The upgrade leaves `overrides/` alone. The shared reusable workflow (in
`PathableAI-org/github-workflows`, pinned by commit in `speckit-upgrade.yml`)
installs the latest Spec Kit release and runs, for each installed integration,
`specify integration upgrade <key> --force`, then `specify extension update`
and `specify integration use`. It never deletes `.specify/`. In the CLI, the
shared-template refresh writes only top-level files in `.specify/templates/`,
and stale-file cleanup removes only paths recorded in an integration's
manifest, so nothing under `overrides/` is touched. Because of `--force`, every
upgrade rewrites the core templates with upstream content.

### Why overrides and not a local preset

A preset is only consulted when it is registered in
`.specify/presets/.registry`; the CLI treats the registry as authoritative and
does not fall back to unregistered preset directories. Registering one means
running `specify preset add --dev <path>`, which writes CLI-owned state.
Overrides need no registration, outrank every preset, and are left alone by
upgrades, so they are the smaller and safer mechanism.

### What the overrides contain

Because an override replaces lower layers, an override must carry anything a
lower layer contributed that the project still wants:

- the project customisations previously written into the core templates, with
  package names corrected to `@pathableai/styles` and the dropped Astro docs
  site removed;
- for `plan-template.md`, the Design Artifacts and visual fidelity navigation
  from the `workflow-preset` preset.

### Keeping overrides current

Upstream changes to the core templates, or to `workflow-preset`'s plan
template, no longer reach generated documents on their own. When an upgrade
pull request changes `.specify/templates/{spec,plan,tasks}-template.md` or
`.specify/presets/workflow-preset/templates/plan-template.md`, port the
relevant changes into the overrides in a separate pull request. Until
`toc-navigation` is removed, ignore changes under
`.specify/presets/toc-navigation/`.

### Background: why the customisations moved

The customisations used to be written straight into the core templates. Two
things were wrong with that:

- They never reached generated documents. Both presets outrank core templates,
  so `spec.md` and `tasks.md` started from the `toc-navigation` templates, and
  `plan.md` from `workflow-preset`'s plan template.
- `setup-plan.sh` resolves a path, not composed content, so it copied
  `workflow-preset`'s `wrap` template as-is: new plans started with a literal
  `{CORE_TEMPLATE}` line. The override avoids this.

When the overrides were added, the core templates were restored to the exact
files Spec Kit generated (from the `setup specify` commit), so they match their
hashes in `.specify/integrations/speckit.manifest.json` again. That lets every
upgrade refresh them, and an upgrade pull request's diff to them is a real
upstream change to consider porting. Keep them unmodified.

## The `.claude/skills` symlinks

- `.claude/skills/speckit-*` are symlinks to `.agents/skills/speckit-*`, so
  Claude Code picks up whatever the upgrade refreshes there. The `claude`
  integration is not installed, and `.claude/skills/` is not in the workflow's
  `add_paths`.
- If someone later installs the `claude` integration with the `specify` CLI,
  delete the `.claude/skills/speckit-*` symlinks first. Otherwise the CLI
  writes through them into the codex-managed files in `.agents/skills/`.
  After installing it, add `.claude/skills/` to the workflow's `add_paths`.

## Steps to skip

- `AGENTS.md` intentionally has no `SPECKIT START`/`SPECKIT END` plan pointer,
  and the `agent-context` hooks are disabled in `.specify/extensions.yml`.
- When the `speckit-plan` skill reaches its "Agent context update" step, skip
  it. Do not add the markers or a plan pointer back.

## Reviewing an upgrade pull request

- No files under `.specify/templates/overrides/` or
  `.specify/memory/constitution.md` are deleted or rewritten.
- `.specify/extensions.yml` keeps the `agent-context` hooks disabled.
- If upstream templates changed, open a follow-up to port them into the
  overrides (see [Keeping overrides current](#keeping-overrides-current)).
