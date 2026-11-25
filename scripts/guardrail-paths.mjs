/**
 * The guardrail paths and the matcher for them: files whose change waits for a person, whatever the tier
 * (docs/engineering/git-workflow.md#guardrail-changes). scripts/guardrail-write.mjs and .github/CODEOWNERS use this
 * one list; keep CODEOWNERS in step with it.
 */

/**
 * A pattern ending in `/` is a directory prefix; otherwise `**\/` matches any leading directories and `*` any run of
 * characters within one path segment.
 */
export const guardrailPaths = [
  '.claude/',
  'scripts/claude/',
  '.agents/skills/',
  '**/eslint.config.*',
  '**/.eslintrc*',
  '**/stylelint.config.*',
  '**/.stylelintrc*',
  '**/.markdownlint*',
  '**/prettier.config.*',
  '**/.prettierrc*',
  '**/.prettierignore',
  '**/lint-staged.config.*',
  '**/.lintstagedrc*',
  '.husky/',
  '**/commitlint.config.*',
  '**/.commitlintrc*',
  'scripts/accessibility-exceptions.mjs',
  '**/tsconfig*.json',
  '.github/',
  'renovate.json5',
  '.changeset/config.json',
  'scripts/guardrail-write.mjs',
  'scripts/guardrail-paths.mjs',
  'package.json',
  '**/AGENTS.md',
  'CLAUDE.md',
  'docs/engineering/',
]

const globSource = (pattern) =>
  pattern
    .split(/(\*\*\/|\*)/)
    .map((part) => {
      if (part === '**/') return '(?:.*/)?'
      if (part === '*') return '[^/]*'
      return part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('')

/** Whether a repository-relative path matches one pattern from `guardrailPaths`. */
export const matchesPattern = (path, pattern) =>
  pattern.endsWith('/')
    ? path.startsWith(pattern)
    : new RegExp(`^${globSource(pattern)}$`).test(path)
