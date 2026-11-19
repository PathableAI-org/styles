/**
 * Decisions for the Claude Code hooks that catch shell commands writing to guardrail files
 * (docs/engineering/git-workflow.md#guardrail-changes). The permission rules in `.claude/settings.json` ask a person
 * before the file-editing tools change those files, but a shell command (a redirection, `sed -i`, `cp`, an inline
 * Python or Node script, `git checkout <ref> -- <path>`) would change them without asking.
 *
 * Two checks close that gap. Before a Bash command runs, `preToolUse` reads the command and asks a person when it
 * names a guardrail path together with a write-like operation, or runs inline interpreter code that names one and
 * calls something write-like. That is a tripwire, not a sandbox: an obfuscated command can evade it. So `preToolUse`
 * also records the content of every changed guardrail file, and after the command, whether it succeeded or failed,
 * `postToolUse` compares that record with the working tree and the commits the command made, and tells the agent to
 * stop and ask the person when the command changed a guardrail file it was not asked about. Changes made before the
 * command, by the file-editing tools, a person or a background command, are in the record and are not reported;
 * changes another process makes while the command runs are reported as the command's.
 *
 * The guardrail paths are `guardrailPaths` in scripts/merge-gate.mjs, the one shared list.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
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

/**
 * Whether a repository-relative directory holds guardrail paths: the repository root (`''`), or a parent of a
 * guardrail path written without a leading wildcard, such as `scripts` for `scripts/claude/`.
 */
export const holdsGuardrails = (path) =>
  path === '' ||
  guardrailPaths.some(
    (pattern) => !pattern.startsWith('**/') && pattern.startsWith(`${path}/`),
  )

/** The repository-relative path a word names (`''` for the root), or undefined when it names nothing inside it. */
const repositoryPath = (word, cwd, root) => {
  if (word === '' || word.startsWith('~') || word.startsWith('-'))
    return undefined
  const path = relative(root, isAbsolute(word) ? word : resolve(cwd, word))
  if (path.startsWith('..') || isAbsolute(path)) return undefined
  return path.split(sep).join('/')
}

/**
 * The guardrail path a word names, if any. A word may carry its path after an option's `=` (`of=.husky/pre-commit`)
 * or behind a diff's `a/` or `b/` prefix. With `wide`, for commands that delete or overwrite whole trees, a directory
 * that holds guardrail paths counts too.
 */
const guardrailIn = (word, cwd, root, wide = false) => {
  const candidates = [word]
  const equals = word.indexOf('=')
  if (equals !== -1) candidates.push(word.slice(equals + 1))
  if (/^[ab]\//.test(word)) candidates.push(word.slice(2))
  for (const candidate of candidates) {
    const path = repositoryPath(candidate, cwd, root)
    if (path === undefined) continue
    if (isGuardrailPath(path) || (wide && holdsGuardrails(path)))
      return path === '' ? '.' : path
  }
  return undefined
}

/** The first guardrail path among `words`, as `guardrailIn` reads each one. */
const firstGuardrail = (words, cwd, root, wide = false) => {
  for (const word of words) {
    const path = guardrailIn(word, cwd, root, wide)
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
    const next = list[index + 1]
    // `>&2` duplicates a file descriptor, but `>& file` writes to a file.
    const duplicates =
      /^<&|^>&./.test(token.text) ||
      (token.text === '>&' && /^(?:\d+-?|-)?$/.test(next?.text ?? ''))
    if (duplicates) continue
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

/** Shell keywords that can come before a command in the same simple command, such as `then rm x` or `{ chmod …`. */
const keywords = new Set([
  '!',
  'do',
  'elif',
  'else',
  'if',
  'then',
  'until',
  'while',
  '{',
  '}',
])

/**
 * The command's basename and arguments, past shell keywords, variable assignments and wrappers such as `sudo` or
 * `xargs`.
 */
const commandOf = (words) => {
  let index = 0
  while (index < words.length) {
    const word = words[index] ?? ''
    if (keywords.has(word) || /^[A-Za-z_]\w*=/.test(word)) {
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

/** Commands that create, overwrite, move, delete or change the mode of the files their arguments name. */
const writeCommands = new Set([
  'chmod',
  'chown',
  'cp',
  'curl',
  'dd',
  'install',
  'ln',
  'mv',
  'patch',
  'rm',
  'rmdir',
  'rsync',
  'tee',
  'touch',
  'truncate',
  'unlink',
  'wget',
])

/** Write commands that delete or overwrite whole trees, so every argument counts as a destination. */
const treeCommands = new Set(['mv', 'rm', 'rmdir'])

/** Write commands that copy into their last argument, so only it counts as a destination for a whole tree. */
const copyCommands = new Set(['cp', 'install', 'ln', 'rsync'])

/** Whether a `find` command deletes or runs commands on what it finds. */
const findWrites = (name, args) =>
  name === 'find' &&
  args.some((arg) => /^-(?:delete|exec|execdir|ok|okdir|fprint)/.test(arg))

/** Git subcommands that rewrite working-tree files named by their arguments. */
const gitWriteSubcommands = new Set([
  'am',
  'apply',
  'checkout',
  'clean',
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

/**
 * Calls in inline code that may write a file, in the interpreters `isInterpreter` names: write and file-system calls
 * (`writeFileSync`, `createWriteStream`, `write_text`, `os.rename`, `shutil.copyfile`, `file_put_contents`), `open`
 * with a writing mode, and shell commands run from the code.
 */
const writeLikeCode =
  /write|appendFile|unlink|rename|copyfile|copy2|copytree|copyFile|cpSync|shutil\.move|os\.remove|rmtree|rmdir|rmSync|truncate|symlink|chmod|put_contents|fopen|\bopen\s*\([^)]*['"][wax+>]|\b(?:rm|cp|mv|sed|tee)\b/i

/** Whether the arguments switch on in-place editing, for `sed`, `perl` or `ruby`. */
const editsInPlace = (args) =>
  args.some((arg) => /^-[a-zA-Z]*i|^--in-place/.test(arg))

/**
 * The guardrail paths a Bash command may write to, as the PreToolUse tripwire reads it, each with how the command
 * reaches it, in command order. `cwd` is the directory the command starts in and `root` the repository's top level.
 * @returns {{ path: string, how: string }[]}
 */
export const guardrailWrites = (command, cwd, root, depth = 0) => {
  /** @type {{ path: string, how: string }[]} */
  const found = []
  const add = (path, how) => {
    if (!found.some((match) => match.path === path)) found.push({ how, path })
  }
  let directory = cwd
  let movedInto = undefined
  for (const segment of segments(command)) {
    const { args, name } = commandOf(segment.words)
    const redirects = segment.redirects.filter(
      (target) => target !== '/dev/null',
    )
    const redirected = firstGuardrail(redirects, directory, root)
    if (redirected !== undefined) add(redirected, 'output redirection')

    const inPlace = /^(?:g?sed|perl|ruby)$/.test(name) && editsInPlace(args)
    const git = name === 'git' ? gitSubcommand(args) : undefined
    const inline = isInterpreter(name) && runsInlineCode(name, args)
    const writes =
      redirects.length > 0 ||
      writeCommands.has(name) ||
      findWrites(name, args) ||
      inPlace ||
      (git !== undefined && gitWriteSubcommands.has(git.name)) ||
      inline
    if (writes && movedInto !== undefined)
      add(movedInto, 'cd into it, then a write')

    if (name === 'cd' || name === 'pushd') {
      const target = args.find((arg) => !arg.startsWith('-'))
      if (target !== undefined && !target.startsWith('~')) {
        movedInto ??= guardrailIn(target, directory, root)
        directory = resolve(directory, target)
      }
      continue
    }

    if (writeCommands.has(name) || findWrites(name, args)) {
      const operands = args.filter((arg) => !arg.startsWith('-'))
      const path =
        firstGuardrail(args, directory, root) ??
        (treeCommands.has(name)
          ? firstGuardrail(operands, directory, root, true)
          : undefined) ??
        (copyCommands.has(name)
          ? firstGuardrail(operands.slice(-1), directory, root, true)
          : undefined)
      if (path !== undefined) add(path, name)
    }
    if (inPlace) {
      const path = firstGuardrail(args, directory, root)
      if (path !== undefined) add(path, `${name} -i`)
    }
    if (git !== undefined && gitWriteSubcommands.has(git.name)) {
      const patch = git.name === 'apply' || git.name === 'am'
      // A checkout's first operand is a ref unless `--` says where the paths start; `git checkout .` is a path.
      const separator = git.args.indexOf('--')
      const operands = git.args.filter((arg) => !arg.startsWith('-'))
      const paths =
        separator !== -1
          ? git.args.slice(separator + 1)
          : git.name === 'checkout' && operands[0] !== '.'
            ? operands.slice(1)
            : operands
      const path =
        firstGuardrail(git.args, directory, root) ??
        (patch
          ? guardrailInText(
              [...segment.heredocs, ...segment.herestrings].join('\n'),
              directory,
              root,
            )
          : firstGuardrail(paths, directory, root, true))
      if (path !== undefined) add(path, `git ${git.name}`)
    }
    if (inline && isShell(name)) {
      if (depth < 3)
        for (const code of inlineShellCode(args, segment))
          for (const match of guardrailWrites(code, directory, root, depth + 1))
            add(match.path, match.how)
    } else if (inline) {
      const code = [...args, ...segment.heredocs, ...segment.herestrings].join(
        '\n',
      )
      const path = guardrailInText(code, directory, root)
      const writesFile =
        writeLikeCode.test(code) || (/awk$/.test(name) && code.includes('>'))
      if (path !== undefined && writesFile) add(path, `inline ${name} code`)
    }
  }
  return found
}

/**
 * Whether a Bash command may write to a guardrail file, as the PreToolUse tripwire reads it: the reason to ask a
 * person, naming every guardrail path it found, or undefined.
 */
export const guardrailWrite = (command, cwd, root) => {
  const found = guardrailWrites(command, cwd, root)
  if (found.length === 0) return undefined
  const list = found.map(({ how, path }) => `${path} (${how})`).join(', ')
  return (
    `This shell command may write to guardrail paths: ${list}. Guardrail files change the rules agents work ` +
    'under, so a person approves every change to them (docs/engineering/git-workflow.md#guardrail-changes). ' +
    'Approve it only if you intend these changes.'
  )
}

// Working-tree record

// `--no-optional-locks` keeps `git status` from taking the index lock, so the hook never makes another git command
// in the same checkout fail on `index.lock`.
const git = (cwd, args, encoding = 'utf8') =>
  execFileSync('git', ['--no-optional-locks', ...args], {
    cwd,
    encoding,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
    timeout: 5000,
  })

const gitOrUndefined = (cwd, args, encoding = 'utf8') => {
  try {
    return git(cwd, args, encoding)
  } catch {
    return undefined
  }
}

/** The repository's top level for `cwd`, or undefined outside a Git working tree. */
export const repositoryRoot = (cwd) =>
  gitOrUndefined(cwd, ['rev-parse', '--show-toplevel'])?.trim()

const hash = (content) => createHash('sha256').update(content).digest('hex')

const contentHash = (file) => {
  if (!existsSync(file)) return 'missing'
  const stat = lstatSync(file)
  if (stat.isSymbolicLink()) return `link:${file}`
  if (!stat.isFile()) return 'not-a-file'
  return hash(readFileSync(file))
}

/**
 * The content hash of every guardrail file Git reports as changed, added, deleted, untracked or ignored in the
 * working tree, by repository-relative path. Ignored files count because some guardrail files are ignored, such as
 * `.claude/settings.local.json` and the Husky shims in `.husky/_/`. Files that match `HEAD` and the index are left
 * out, so the record stays small.
 * @returns {Record<string, string>}
 */
export const changedGuardrailFiles = (root) => {
  const status = git(root, [
    'status',
    '--porcelain=v1',
    '-z',
    '--untracked-files=all',
    '--ignored=matching',
    '--no-renames',
  ])
  /** @type {Record<string, string>} */
  const files = {}
  for (const entry of String(status).split('\0')) {
    const path = entry.slice(3)
    if (entry.length < 4 || !isGuardrailPath(path)) continue
    // Git lists an ignored directory as one entry; hash the files in it, so a change inside it shows. A nested
    // checkout, such as a worktree under `.claude/worktrees/`, is another repository: record it as one entry.
    const nested = path.endsWith('/') && existsSync(join(root, path, '.git'))
    if (nested) {
      files[path] = 'nested-repository'
      continue
    }
    const inside = path.endsWith('/')
      ? readdirSync(join(root, path), { recursive: true, withFileTypes: true })
          .filter((item) => !item.isDirectory())
          .map((item) =>
            relative(root, join(item.parentPath, item.name))
              .split(sep)
              .join('/'),
          )
          .filter((file) => !/(?:^|\/)(?:node_modules|\.git)\//.test(file))
      : [path]
    for (const file of inside) files[file] = contentHash(join(root, file))
  }
  return files
}

/** The content hash of `path` in commit `revision`, `missing` when the commit lacks it, or undefined without a commit. */
const committedHash = (root, revision, path) => {
  if (revision === null || revision === undefined) return undefined
  const blob = gitOrUndefined(
    root,
    ['cat-file', 'blob', `${revision}:${path}`],
    'buffer',
  )
  return blob === undefined ? 'missing' : hash(blob)
}

/**
 * The commits whose side of a merge, cherry-pick or revert Git has left staged after stopping on a conflict, or
 * after `--no-commit`. Content from them was brought in from elsewhere, not written by the command.
 */
const pendingSides = (root) =>
  ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD'].flatMap((ref) => {
    const sha = revision(root, ref)
    return sha === null ? [] : [{ ref, sha }]
  })

/**
 * The guardrail paths whose content in `after` differs from `before` and from every content `known` holds for them,
 * plus paths in `before` that no longer exist and left `git status` with it: an untracked or ignored file a command
 * deleted (`exists` says whether a path is on disk). A file that became clean is not a change here;
 * `committedChanges` covers files a command committed.
 */
export const changedSince = (
  before,
  after,
  known = {},
  exists = () => true,
) => {
  const isKnown = (path, content) => (known[path] ?? []).includes(content)
  const changed = Object.keys(after).filter(
    (path) => before[path] !== after[path] && !isKnown(path, after[path]),
  )
  // A deleted file was on disk when the record was taken, so each deletion is new: the next record no longer has it.
  const deleted = Object.keys(before).filter(
    (path) => !(path in after) && before[path] !== 'missing' && !exists(path),
  )
  return [...new Set([...changed, ...deleted])].sort()
}

const revision = (root, name) =>
  gitOrUndefined(root, ['rev-parse', '--verify', '--quiet', name])?.trim() ||
  null

/** HEAD's commit, so the after-check can find the commits a command made. */
const headState = (root) => ({ head: revision(root, 'HEAD') })

/** A hash of text with all whitespace removed, so a formatter's reflow of a Markdown file keeps it. */
const looseHash = (content) => hash(String(content).replace(/\s+/g, ''))

/** The loose hash of every Markdown file in a record, read from the working tree. */
const looseHashes = (root, files) =>
  Object.fromEntries(
    Object.keys(files)
      .filter((path) => path.endsWith('.md') && files[path] !== 'missing')
      .flatMap((path) => {
        const file = join(root, path)
        return lstatSync(file, { throwIfNoEntry: false })?.isFile()
          ? [[path, looseHash(readFileSync(file))]]
          : []
      }),
  )

/**
 * Whether a merge, cherry-pick or revert that this command started, and that stopped on a conflict or with
 * `--no-commit`, explains a guardrail file: its side changed the file, and the file still holds what Git wrote,
 * either its merge result (the working tree matches the index) or a conflict waiting to be resolved.
 */
const explainedByMerge = (root, record, path) =>
  pendingSides(root)
    .filter(({ sha }) => !(record.sides ?? []).includes(sha))
    .some(({ ref, sha }) => {
      const base =
        ref === 'MERGE_HEAD'
          ? gitOrUndefined(root, ['merge-base', record.head ?? '', sha])?.trim()
          : `${sha}^`
      if (
        base === undefined ||
        committedHash(root, base, path) === committedHash(root, sha, path)
      )
        return false
      const conflicted =
        String(gitOrUndefined(root, ['ls-files', '-u', '--', path]) ?? '') !==
        ''
      const staged = revision(root, `:${path}`)
      const written = gitOrUndefined(root, ['hash-object', '--', path])?.trim()
      return conflicted || (staged !== null && staged === written)
    })

/**
 * Whether a reported path has an explanation that does not need a person: a path at or under one the PreToolUse ask
 * named, a Husky shim created from nothing (without shims Git runs no hooks, so creating them weakens nothing), a
 * Markdown file whose change is only whitespace (a formatter, or lint-staged inside `git commit`), an untracked file
 * `git stash` moved into a new stash (ignored files are in force, so stashing them away is reported), or a file a
 * merge the command started brought in (`explainedByMerge`).
 */
const explained = (root, record, path) => {
  const asked = record.askedPaths ?? []
  if (
    asked.some(
      (prefix) =>
        prefix === '.' || path === prefix || path.startsWith(`${prefix}/`),
    )
  )
    return true
  if (path.startsWith('.husky/_/') && !(path in record.before)) return true
  const file = join(root, path)
  const onDisk = lstatSync(file, { throwIfNoEntry: false })?.isFile() === true
  if (path.endsWith('.md') && onDisk) {
    const now = looseHash(readFileSync(file))
    const atHead =
      record.head === null
        ? undefined
        : gitOrUndefined(root, ['cat-file', 'blob', `${record.head}:${path}`])
    if (
      now === record.loose?.[path] ||
      (atHead !== undefined && now === looseHash(atHead))
    )
      return true
  }
  const stash = revision(root, 'refs/stash')
  const ignored =
    gitOrUndefined(root, ['check-ignore', '--quiet', '--no-index', path]) !==
    undefined
  if (!onDisk && !ignored && stash !== null && stash !== record.stash) {
    const stashed = [stash, `${stash}^3`].map((commit) =>
      committedHash(root, commit, path),
    )
    if (stashed.includes(record.before[path])) return true
  }
  return explainedByMerge(root, record, path)
}

/**
 * The guardrail paths a command changed and committed in the same call, on any branch, including one it switched
 * away from again. It reads every commit reachable from a ref or the reflog whose committer time is after the record,
 * and leaves out merge commits and commits fetched from elsewhere, whose committer time is earlier. A committed
 * guardrail file passes when its content in that commit is unchanged from the record's HEAD (an amend that kept it),
 * is the record's working-tree content, or is one `known` holds for it.
 */
export const committedChanges = (root, record, known = {}) => {
  if (record.head === null) return []
  const made = gitOrUndefined(root, [
    'rev-list',
    '--all',
    '--reflog',
    '--no-merges',
    `--since=@${record.time - 5}`,
  ])
  if (made === undefined) return []
  const paths = new Set()
  for (const sha of String(made).split('\n').filter(Boolean)) {
    const files = gitOrUndefined(root, [
      'diff-tree',
      '--root',
      '--no-commit-id',
      '--name-only',
      '--no-renames',
      '-r',
      '-z',
      sha,
    ])
    for (const path of String(files ?? '').split('\0')) {
      if (path === '' || !isGuardrailPath(path)) continue
      const content = committedHash(root, sha, path)
      if (
        content !== committedHash(root, record.head, path) &&
        content !== record.before[path] &&
        !(known[path] ?? []).includes(content)
      )
        paths.add(path)
    }
  }
  return [...paths].sort()
}

const recordDirectory = () => join(tmpdir(), 'pathable-guardrail-writes')

const recordName = (...parts) =>
  `${hash(parts.map((part) => String(part ?? '')).join('\0')).slice(0, 32)}.json`

/** Where the record for one tool call lives, outside the repository so it never shows in `git status`. */
export const recordFile = (root, input) =>
  join(
    recordDirectory(),
    recordName(root, field(input, 'session_id'), field(input, 'tool_use_id')),
  )

/**
 * Where the session's known contents live: every guardrail file content a before-record has seen in this session
 * and working tree. A command that moves known content back, such as `git stash pop` after `git stash`, is then not
 * reported.
 */
const knownFile = (root, input) =>
  join(
    recordDirectory(),
    'sessions',
    recordName(root, field(input, 'session_id')),
  )

const readJson = (file, fallback) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

/** Adds each path's content in `files` to `known`. */
const remember = (known, files) => {
  const result = { ...known }
  for (const [path, content] of Object.entries(files))
    if (!(result[path] ?? []).includes(content))
      result[path] = [...(result[path] ?? []), content]
  return result
}

/** Removes records older than a day, left by commands a person refused, and session files older than a week. */
const prune = () => {
  const now = Date.now()
  for (const [directory, age] of [
    [recordDirectory(), 24 * 60 * 60 * 1000],
    [join(recordDirectory(), 'sessions'), 7 * 24 * 60 * 60 * 1000],
  ]) {
    if (!existsSync(directory)) continue
    for (const name of readdirSync(directory)) {
      const file = join(directory, name)
      const stat = statSync(file, { throwIfNoEntry: false })
      if (stat?.isFile() && now - stat.mtimeMs > age)
        rmSync(file, { force: true })
    }
  }
}

const localSettings = '.claude/settings.local.json'

const blockReason = (paths) =>
  `Stop: this shell command changed guardrail files that the hook did not ask a person about: ${paths.join(', ')}. ` +
  'Guardrail files change the rules agents work under, so a person approves every change to them ' +
  '(docs/engineering/git-workflow.md#guardrail-changes). Do not build on, commit or push this change, and do not ' +
  'try to undo it with another shell command. Tell the person which guardrail files changed and why, and ask them ' +
  'to review the change before you go on.' +
  (paths.includes(localSettings)
    ? ` Claude Code also writes ${localSettings} when a person chooses not to be asked again for a command; if ` +
      'that is what happened, say so and let the person confirm it.'
    : '')

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
  /** @type {Decision} */
  const decision =
    reason === undefined ? { kind: 'allow' } : { kind: 'ask', reason }
  try {
    const before = changedGuardrailFiles(root)
    mkdirSync(join(recordDirectory(), 'sessions'), { recursive: true })
    prune()
    const known = knownFile(root, input)
    writeFileSync(known, JSON.stringify(remember(readJson(known, {}), before)))
    writeFileSync(
      recordFile(root, input),
      JSON.stringify({
        askedPaths: guardrailWrites(command, cwd, root).map(
          (match) => match.path,
        ),
        before,
        ...headState(root),
        loose: looseHashes(root, before),
        sides: pendingSides(root).map(({ sha }) => sha),
        stash: revision(root, 'refs/stash'),
        time: Math.floor(Date.now() / 1000),
      }),
    )
  } catch (error) {
    // The ask must not depend on the record: without one the after-check allows, and the person sees why here.
    process.stderr.write(
      `guardrail-write hook: could not record guardrail files (${String(error)}); the after-check is skipped.\n`,
    )
  }
  return decision
}

/**
 * The PostToolUse and PostToolUseFailure decision for a tool call: block, which feeds the reason back to the agent,
 * when a Bash command changed or committed a guardrail file that the PreToolUse check did not ask a person about
 * and that `explained` does not account for, and otherwise allow it.
 * @returns {Decision}
 */
export const postToolUse = (input) => {
  if (bashCommand(input) === undefined) return { kind: 'allow' }
  const root = repositoryRoot(inputCwd(input))
  if (root === undefined) return { kind: 'allow' }
  const file = recordFile(root, input)
  const record = readJson(file, undefined)
  rmSync(file, { force: true })
  if (record === undefined) return { kind: 'allow' }
  const knownPath = knownFile(root, input)
  const known = readJson(knownPath, {})
  const after = changedGuardrailFiles(root)
  const changed = [
    ...new Set([
      ...changedSince(record.before, after, known, (path) =>
        existsSync(join(root, path)),
      ),
      ...committedChanges(root, record, known),
    ]),
  ]
    .filter((path) => !explained(root, record, path))
    .sort()
  if (changed.length === 0) return { kind: 'allow' }
  // Report each change once: the agent is told to stop, and the next command is not blamed for it.
  writeFileSync(knownPath, JSON.stringify(remember(known, after)))
  return { kind: 'block', reason: blockReason(changed) }
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
 * The hook's entry point, for the thin script Claude Code runs: it takes the parsed PreToolUse, PostToolUse or
 * PostToolUseFailure input (a command that exits non-zero ends in PostToolUseFailure), writes the decision's stdout
 * and stderr, sets the exit code, and returns the output.
 */
export const runGuardrailWriteHook = (input) => {
  const event = field(input, 'hook_event_name')
  const decision =
    event === 'PostToolUse' || event === 'PostToolUseFailure'
      ? postToolUse(input)
      : preToolUse(input)
  const output = hookOutput(decision)
  process.stdout.write(output.stdout)
  process.stderr.write(output.stderr)
  process.exitCode = output.exitCode
  return output
}
