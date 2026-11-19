/**
 * Decisions for the Claude Code hooks that catch shell commands writing to guardrail files
 * (docs/engineering/git-workflow.md#guardrail-changes). The permission rules in `.claude/settings.json` ask a person
 * before the file-editing tools change those files, but a shell command (a redirection, `sed -i`, `cp`, an inline
 * Python or Node script, `git checkout <ref> -- <path>`) would change them without asking.
 *
 * Two checks close that gap. Before a Bash command runs, `preToolUse` reads the command and asks a person when it
 * names a guardrail path together with a write-like operation, or runs inline interpreter code that names one and
 * calls something write-like. That is a tripwire, not a sandbox: an obfuscated command can evade it. So `preToolUse`
 * also records the content of every changed guardrail file, and after the command `postToolUse` compares that record
 * with the working tree and tells the agent to stop and ask the person when the command changed a guardrail file
 * without approval. Changes made before the command, by the file-editing tools, by a person or by a background
 * command, are in the record and are not reported.
 *
 * The guardrail paths are `guardrailPaths` in scripts/merge-gate.mjs, the one shared list.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

import { guardrailPaths, matchesPattern } from './merge-gate.mjs'

/**
 * @typedef {{ readonly kind: "allow" } | { readonly kind: "ask"; readonly reason: string } | { readonly kind: "block"; readonly reason: string }} Decision
 */

/**
 * @typedef {object} Token
 * @property {"word" | "op"} kind
 * @property {string} text a word with its quotes removed, or an operator
 * @property {string} [body] a heredoc operator's body
 */

/**
 * @typedef {object} Segment
 * @property {string[]} words the command word and its arguments, without redirections
 * @property {string[]} redirects the targets of output redirections
 * @property {string[]} heredocs the bodies of heredocs the command reads
 * @property {string[]} herestrings the here-strings the command reads
 */

const field = (value, key) =>
  typeof value === 'object' && value !== null
    ? Reflect.get(value, key)
    : undefined

// Paths

/** Whether a repository-relative path is a guardrail file, or a directory that guardrail patterns cover whole. */
export const isGuardrailPath = (path) =>
  guardrailPaths.some(
    (pattern) =>
      matchesPattern(path, pattern) || matchesPattern(`${path}/`, pattern),
  )

/** The repository-relative path a word names, or undefined when it names nothing inside the repository. */
const repositoryPath = (word, cwd, root) => {
  if (word === '' || word.startsWith('~') || word.startsWith('-'))
    return undefined
  const path = relative(root, isAbsolute(word) ? word : resolve(cwd, word))
  if (path === '' || path.startsWith('..') || isAbsolute(path)) return undefined
  return path.split(sep).join('/')
}

/**
 * The guardrail path a word names, if any. A word may carry its path after an option's `=` (`of=.husky/pre-commit`)
 * or behind a diff's `a/` or `b/` prefix.
 */
const guardrailIn = (word, cwd, root) => {
  const candidates = [word]
  const equals = word.indexOf('=')
  if (equals !== -1) candidates.push(word.slice(equals + 1))
  if (/^[ab]\//.test(word)) candidates.push(word.slice(2))
  for (const candidate of candidates) {
    const path = repositoryPath(candidate, cwd, root)
    if (path !== undefined && isGuardrailPath(path)) return path
  }
  return undefined
}

/** The first guardrail path among `words`. */
const firstGuardrail = (words, cwd, root) => {
  for (const word of words) {
    const path = guardrailIn(word, cwd, root)
    if (path !== undefined) return path
  }
  return undefined
}

/**
 * The first guardrail path named anywhere in free text, such as inline code or a patch: the text is cut at characters
 * that do not appear in the repository's paths (whitespace, quotes, brackets, operators).
 */
const guardrailInText = (text, cwd, root) =>
  firstGuardrail(text.split(/[\s'"`()[\]{},;=<>|&$+:\\]+/), cwd, root)

// Shell commands

/** Operators that end a simple command. */
const separators = new Set([
  ';',
  '&&',
  '||',
  '|',
  '|&',
  '&',
  '(',
  ')',
  '`',
  '<(',
])

/** The operator starting at `index`, or undefined when a word character starts there. */
const operatorAt = (command, index) =>
  /^(?:&&|&>>|&>|&|\|\||\|&|\||;|\(|\)|`|\$\(|<\(|>>|>\||>&\d*-?|>|<<<|<<-?|<&\d*-?|<)/.exec(
    command.slice(index),
  )?.[0]

/**
 * Shell tokens of a command: words with quotes and escapes removed, and operators, with each heredoc's body attached
 * to its operator. It reads enough of the shell grammar to find command words, arguments, redirections and inline
 * code; it does not expand variables, globs or command substitutions inside double quotes.
 * @returns {Token[]}
 */
export const tokens = (command) => {
  /** @type {Token[]} */
  const result = []
  let word = null
  let lineStart = 0
  let index = 0
  const endWord = () => {
    if (word !== null) result.push({ kind: 'word', text: word })
    word = null
  }
  const readHeredocs = () => {
    for (let at = lineStart; at < result.length; at += 1) {
      const token = result[at]
      const delimiter = result[at + 1]
      if (
        token?.kind !== 'op' ||
        !token.text.startsWith('<<') ||
        token.text === '<<<' ||
        delimiter?.kind !== 'word'
      )
        continue
      const lines = []
      while (index < command.length) {
        const end = command.indexOf('\n', index)
        const stop = end === -1 ? command.length : end
        const line = command.slice(index, stop)
        index = stop + 1
        const bare = token.text === '<<-' ? line.replace(/^\t+/, '') : line
        if (bare === delimiter.text) break
        lines.push(line)
      }
      token.body = lines.join('\n')
    }
  }
  while (index < command.length) {
    const char = command[index] ?? ''
    if (char === "'") {
      const end = command.indexOf("'", index + 1)
      const stop = end === -1 ? command.length : end
      word = (word ?? '') + command.slice(index + 1, stop)
      index = stop + 1
    } else if (char === '"') {
      let text = ''
      let next = index + 1
      while (next < command.length && command[next] !== '"') {
        if (command[next] === '\\' && next + 1 < command.length) {
          text += command[next + 1]
          next += 2
        } else {
          text += command[next]
          next += 1
        }
      }
      word = (word ?? '') + text
      index = next + 1
    } else if (char === '\\') {
      if (command[index + 1] !== '\n')
        word = (word ?? '') + (command[index + 1] ?? '')
      index += 2
    } else if (char === '\n') {
      endWord()
      index += 1
      readHeredocs()
      result.push({ kind: 'op', text: ';' })
      lineStart = result.length
    } else if (/\s/.test(char)) {
      endWord()
      index += 1
    } else if (char === '#' && word === null) {
      const end = command.indexOf('\n', index)
      index = end === -1 ? command.length : end
    } else {
      const operator = operatorAt(command, index)
      if (operator === undefined) {
        word = (word ?? '') + char
        index += 1
      } else {
        // A number written straight before a redirection is its file descriptor, not a word.
        if (/^[<>]/.test(operator) && word !== null && /^\d+$/.test(word))
          word = null
        endWord()
        result.push({ kind: 'op', text: operator === '$(' ? '(' : operator })
        index += operator.length
      }
    }
  }
  endWord()
  return result
}

/**
 * The simple commands of a command line, split at separators, with redirections, heredocs and here-strings taken
 * out of their words.
 * @returns {Segment[]}
 */
export const segments = (command) => {
  const empty = () => ({
    heredocs: [],
    herestrings: [],
    redirects: [],
    words: [],
  })
  /** @type {Segment[]} */
  const result = []
  /** @type {Segment} */
  let current = empty()
  const list = tokens(command)
  for (let index = 0; index < list.length; index += 1) {
    const token = list[index]
    if (token === undefined) continue
    if (token.kind === 'word') {
      current.words.push(token.text)
      continue
    }
    if (separators.has(token.text)) {
      result.push(current)
      current = empty()
      continue
    }
    if (/^(?:<&|>&)/.test(token.text)) continue
    const next = list[index + 1]
    if (next?.kind !== 'word') continue
    index += 1
    if (token.text === '<<<') current.herestrings.push(next.text)
    else if (token.text.startsWith('<<'))
      current.heredocs.push(token.body ?? '')
    else if (token.text !== '<') current.redirects.push(next.text)
  }
  result.push(current)
  return result.filter(
    (segment) => segment.words.length > 0 || segment.redirects.length > 0,
  )
}

/** Commands that run another command named by their arguments. */
const wrappers = new Set([
  'builtin',
  'command',
  'env',
  'exec',
  'nice',
  'nohup',
  'stdbuf',
  'sudo',
  'time',
  'timeout',
  'xargs',
])

/** Wrapper options that take a separate value, such as `xargs -I {}` or `sudo -u <user>`. */
const wrapperValueOptions = new Set([
  '-E',
  '-I',
  '-L',
  '-P',
  '-a',
  '-d',
  '-g',
  '-k',
  '-n',
  '-s',
  '-u',
])

/** The command's basename and arguments, past variable assignments and wrappers such as `sudo` or `xargs`. */
const commandOf = (words) => {
  let index = 0
  while (index < words.length) {
    const word = words[index] ?? ''
    if (/^[A-Za-z_]\w*=/.test(word)) {
      index += 1
      continue
    }
    if (!wrappers.has(word.split('/').pop() ?? '')) break
    index += 1
    while (index < words.length) {
      const option = words[index] ?? ''
      if (wrapperValueOptions.has(option)) index += 2
      else if (/^-|^\d+[smhd]?$|^[A-Za-z_]\w*=/.test(option)) index += 1
      else break
    }
  }
  return {
    args: words.slice(index + 1),
    name: (words[index] ?? '').split('/').pop() ?? '',
  }
}

/** Commands that create, overwrite, move or delete the files their arguments name. */
const writeCommands = new Set([
  'cp',
  'dd',
  'install',
  'ln',
  'mv',
  'patch',
  'rm',
  'rsync',
  'tee',
  'touch',
  'truncate',
  'unlink',
])

/** Git subcommands that rewrite working-tree files named by their arguments. */
const gitWriteSubcommands = new Set([
  'am',
  'apply',
  'checkout',
  'mv',
  'restore',
  'rm',
])

/** Git global options that take a separate value. */
const gitValueOptions = new Set([
  '-C',
  '-c',
  '--git-dir',
  '--work-tree',
  '--namespace',
])

/** The git subcommand and its arguments, past git's global options. */
const gitSubcommand = (args) => {
  let index = 0
  while (index < args.length && (args[index] ?? '').startsWith('-'))
    index += gitValueOptions.has(args[index] ?? '') ? 2 : 1
  return { args: args.slice(index + 1), name: args[index] ?? '' }
}

const isShell = (name) => /^(?:bash|sh|zsh|dash|ksh|fish)$/.test(name)

const isInterpreter = (name) =>
  isShell(name) ||
  /^(?:python[\d.]*|pypy[\d.]*|node|nodejs|deno|bun|perl|ruby|php|awk|gawk|mawk|nawk)$/.test(
    name,
  )

/** The option that makes an interpreter run code given on its command line. */
const inlineOption = (name) => {
  if (/^(?:python|pypy)/.test(name)) return /^-\w*c$/
  if (/^(?:node|nodejs|bun)$/.test(name))
    return /^(?:-e|-p|-pe|--eval|--print|--input-type)(?:=.*)?$/
  if (name === 'deno') return /^eval$/
  if (/^(?:perl|ruby)$/.test(name)) return /^-\w*[eE]\w*$/
  if (name === 'php') return /^-r$/
  return /^-\w*c\w*$/
}

/**
 * Whether an interpreter runs code from its command line or stdin (a heredoc, a here-string or a pipe) rather than
 * from a script file. An awk program is inline unless it comes from `-f`.
 */
const runsInlineCode = (name, args) => {
  if (/awk$/.test(name)) return !args.includes('-f')
  const option = inlineOption(name)
  return (
    args.some((arg) => option.test(arg) || arg === '-') ||
    args.every((arg) => arg.startsWith('-'))
  )
}

/** The shell code a shell segment runs inline: its `-c` string, or the heredocs and here-strings it reads. */
const inlineShellCode = (args, segment) => {
  const option = args.findIndex((arg) => /^-\w*c\w*$/.test(arg))
  if (option !== -1) return [args[option + 1] ?? '']
  return [...segment.heredocs, ...segment.herestrings]
}

/** Calls in inline code that may write a file, in the interpreters `isInterpreter` names. */
const writeLikeCode =
  /\b(?:write|append|unlink|rename|replace|copy|move|remove|rmtree|rmdir|rm|cp|mv|truncate|symlink|dump|save|output|chmod|open|sed|tee)\w*/i

/** Whether the arguments switch on in-place editing, for `sed`, `perl` or `ruby`. */
const editsInPlace = (args) =>
  args.some((arg) => /^-[a-zA-Z]*i|^--in-place/.test(arg))

const askReason = (path, how) =>
  `This shell command ${how} the guardrail path ${path}. Guardrail files change the rules agents work under, so a ` +
  'person approves every change to them (docs/engineering/git-workflow.md#guardrail-changes). Approve it only if ' +
  'the change is intended; an agent should change these files with the Edit tool.'

/**
 * Whether a Bash command may write to a guardrail file, as the PreToolUse tripwire reads it: the reason to ask a
 * person, or undefined. `cwd` is the directory the command starts in and `root` the repository's top level.
 */
export const guardrailWrite = (command, cwd, root, depth = 0) => {
  let directory = cwd
  let movedInto = undefined
  for (const segment of segments(command)) {
    const { args, name } = commandOf(segment.words)
    const redirects = segment.redirects.filter(
      (target) => target !== '/dev/null',
    )
    const redirected = firstGuardrail(redirects, directory, root)
    if (redirected !== undefined)
      return askReason(redirected, 'redirects output into')

    const inPlace = /^(?:g?sed|perl|ruby)$/.test(name) && editsInPlace(args)
    const git = name === 'git' ? gitSubcommand(args) : undefined
    const inline = isInterpreter(name) && runsInlineCode(name, args)
    const writes =
      redirects.length > 0 ||
      writeCommands.has(name) ||
      inPlace ||
      (git !== undefined && gitWriteSubcommands.has(git.name)) ||
      inline
    if (writes && movedInto !== undefined)
      return askReason(movedInto, 'changes into, and then may write inside,')

    if (name === 'cd' || name === 'pushd') {
      const target = args.find((arg) => !arg.startsWith('-'))
      if (target !== undefined && !target.startsWith('~')) {
        movedInto ??= guardrailIn(target, directory, root)
        directory = resolve(directory, target)
      }
      continue
    }

    if (writeCommands.has(name)) {
      const path = firstGuardrail(args, directory, root)
      if (path !== undefined) return askReason(path, `runs ${name} on`)
    }
    if (inPlace) {
      const path = firstGuardrail(args, directory, root)
      if (path !== undefined)
        return askReason(path, `edits in place, with ${name} -i,`)
    }
    if (git !== undefined && gitWriteSubcommands.has(git.name)) {
      const patch = git.name === 'apply' || git.name === 'am'
      const path =
        firstGuardrail(git.args, directory, root) ??
        (patch ? guardrailInText(command, directory, root) : undefined)
      if (path !== undefined)
        return askReason(path, `may rewrite, with git ${git.name},`)
    }
    if (inline && isShell(name)) {
      if (depth < 3)
        for (const code of inlineShellCode(args, segment)) {
          const reason = guardrailWrite(code, directory, root, depth + 1)
          if (reason !== undefined) return reason
        }
    } else if (inline) {
      const path = guardrailInText(command, directory, root)
      const writesFile =
        writeLikeCode.test(command) ||
        (/awk$/.test(name) && command.includes('>'))
      if (path !== undefined && writesFile)
        return askReason(path, `runs inline ${name} code that may write to`)
    }
  }
  return undefined
}

// Working-tree record

const git = (cwd, args) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  })

/** The repository's top level for `cwd`, or undefined outside a Git working tree. */
export const repositoryRoot = (cwd) => {
  try {
    return git(cwd, ['rev-parse', '--show-toplevel']).trim()
  } catch {
    return undefined
  }
}

const contentHash = (file) => {
  if (!existsSync(file)) return 'missing'
  const stat = lstatSync(file)
  if (stat.isSymbolicLink()) return `link:${file}`
  if (!stat.isFile()) return 'not-a-file'
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

/**
 * The content hash of every guardrail file Git reports as changed, added, deleted or untracked in the working tree,
 * by repository-relative path. Files that match `HEAD` and the index are left out, so the record stays small.
 * @returns {Record<string, string>}
 */
export const changedGuardrailFiles = (root) => {
  const status = git(root, [
    'status',
    '--porcelain=v1',
    '-z',
    '--untracked-files=all',
    '--no-renames',
  ])
  /** @type {Record<string, string>} */
  const files = {}
  for (const entry of status.split('\0')) {
    const path = entry.slice(3)
    if (entry.length < 4 || !isGuardrailPath(path)) continue
    files[path] = contentHash(join(root, path))
  }
  return files
}

/** The guardrail paths whose content in `after` differs from `before`. A file that became clean is not a change. */
export const changedSince = (before, after) =>
  Object.keys(after)
    .filter((path) => before[path] !== after[path])
    .sort()

const recordDirectory = () => join(tmpdir(), 'pathable-guardrail-writes')

/** Where the record for one tool call lives, outside the repository so it never shows in `git status`. */
export const recordFile = (root, input) => {
  const key = [
    root,
    field(input, 'session_id') ?? '',
    field(input, 'tool_use_id') ?? '',
  ].join('\0')
  const name = createHash('sha256').update(key).digest('hex').slice(0, 32)
  return join(recordDirectory(), `${name}.json`)
}

const blockReason = (paths) =>
  `Stop: this shell command changed guardrail files without a person's approval: ${paths.join(', ')}. Guardrail ` +
  'files change the rules agents work under, so a person approves every change to them ' +
  '(docs/engineering/git-workflow.md#guardrail-changes). Do not build on, commit or push this change, and do not ' +
  'try to undo it with another shell command. Tell the person which files changed and why, and ask them to review ' +
  'the change before you go on. Change guardrail files with the Edit tool, which asks the person first.'

// Hooks

/** The Bash command a tool call carries, or undefined for any other tool call. */
const bashCommand = (input) => {
  if (field(input, 'tool_name') !== 'Bash') return undefined
  const command = field(field(input, 'tool_input'), 'command')
  return typeof command === 'string' ? command : undefined
}

const inputCwd = (input) => {
  const cwd = field(input, 'cwd')
  return typeof cwd === 'string' ? cwd : process.cwd()
}

/**
 * The PreToolUse decision for a tool call: ask a person when a Bash command may write to a guardrail file, and
 * otherwise allow it. For every Bash command it records the changed guardrail files for the PostToolUse check.
 * @returns {Decision}
 */
export const preToolUse = (input) => {
  const command = bashCommand(input)
  if (command === undefined) return { kind: 'allow' }
  const cwd = inputCwd(input)
  const root = repositoryRoot(cwd)
  if (root === undefined) return { kind: 'allow' }
  const reason = guardrailWrite(command, cwd, root)
  mkdirSync(recordDirectory(), { recursive: true })
  writeFileSync(
    recordFile(root, input),
    JSON.stringify({
      asked: reason !== undefined,
      before: changedGuardrailFiles(root),
    }),
  )
  return reason === undefined ? { kind: 'allow' } : { kind: 'ask', reason }
}

/**
 * The PostToolUse decision for a tool call: block, which feeds the reason back to the agent, when a Bash command
 * changed a guardrail file that the PreToolUse check did not ask a person about, and otherwise allow it.
 * @returns {Decision}
 */
export const postToolUse = (input) => {
  if (bashCommand(input) === undefined) return { kind: 'allow' }
  const root = repositoryRoot(inputCwd(input))
  if (root === undefined) return { kind: 'allow' }
  const file = recordFile(root, input)
  if (!existsSync(file)) return { kind: 'allow' }
  const record = JSON.parse(readFileSync(file, 'utf8'))
  rmSync(file, { force: true })
  if (field(record, 'asked') === true) return { kind: 'allow' }
  const before = field(record, 'before') ?? {}
  const changed = changedSince(before, changedGuardrailFiles(root))
  return changed.length === 0
    ? { kind: 'allow' }
    : { kind: 'block', reason: blockReason(changed) }
}

/** The hook's exit code, stdout, and stderr for a decision, as Claude Code reads them. */
export const hookOutput = (decision) => {
  if (decision.kind === 'block')
    return { exitCode: 2, stderr: decision.reason, stdout: '' }
  if (decision.kind === 'allow') return { exitCode: 0, stderr: '', stdout: '' }
  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: decision.reason,
    },
  }
  return { exitCode: 0, stderr: '', stdout: `${JSON.stringify(output)}\n` }
}

/**
 * The hook's entry point, for the thin script Claude Code runs: it takes the parsed PreToolUse or PostToolUse input,
 * writes the decision's stdout and stderr, sets the exit code, and returns the output.
 */
export const runGuardrailWriteHook = (input) => {
  const decision =
    field(input, 'hook_event_name') === 'PostToolUse'
      ? postToolUse(input)
      : preToolUse(input)
  const output = hookOutput(decision)
  process.stdout.write(output.stdout)
  process.stderr.write(output.stderr)
  process.exitCode = output.exitCode
  return output
}
