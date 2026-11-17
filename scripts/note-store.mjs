// Ported from pathableai-org/pre-ets scripts/note-store.ts @ f2ee390 (types stripped only).

/** @typedef {import('./schema-checks.mjs').Validated} Validated */

/**
 * JSON documents in git notes, one per annotated commit. A document keeps every entry recorded on that SHA in order,
 * so a retry supersedes the earlier entry without erasing it; the latest entry is the last one. Verification reports
 * and code reviews are the two kinds.
 */
import {
  annotatedByRecency,
  readNote,
  resolveSha,
  writeNote,
} from './git-access.mjs'

/**
 * @template T
 * @typedef {object} NoteKind
 * @property {string} entry What one entry is called in messages: "report" or "review".
 * @property {(entry: T) => string} id
 * @property {string} idLabel What an entry's ID names in messages: "run" or "review".
 * @property {string} listKey The document field holding the entries: "reports" or "reviews".
 * @property {string} note What the note is called in messages: "verification" or "review".
 * @property {(entry: T) => string} sha The commit the entry belongs on.
 * @property {{ readonly field: string; readonly of: (entry: T) => string | undefined }} supersedes The entry's field naming the entry it supersedes, and its value.
 * @property {(value: unknown) => Validated<T>} validate
 * @property {(entry: T, supersedes: string | undefined) => T} withSupersedes
 */

const fail = (...problems) => ({
  ok: false,
  problems,
})

const parseEntries = (kind, content) => {
  if (content === undefined || content.trim().length === 0)
    return { ok: true, value: [] }
  let parsed
  try {
    parsed = JSON.parse(content)
  } catch {
    return fail(`the ${kind.note} note is not JSON`)
  }
  const entries =
    typeof parsed === 'object' && parsed !== null
      ? Reflect.get(parsed, kind.listKey)
      : undefined
  if (!Array.isArray(entries))
    return fail(`the ${kind.note} note has no ${kind.listKey} list`)
  const checked = entries.map((entry) => kind.validate(entry))
  const problems = checked.flatMap((entry, index) =>
    entry.ok
      ? []
      : entry.problems.map(
          (problem) => `${kind.listKey}[${String(index)}] ${problem}`,
        ),
  )
  return problems.length > 0
    ? fail(...problems)
    : { ok: true, value: checked.flatMap((e) => (e.ok ? [e.value] : [])) }
}

/**
 * Adds an entry after the existing ones. An entry may name the entry it supersedes; when it does not, the previous
 * latest entry on that SHA is the one superseded.
 */
const appendEntry = (kind, entries, entry) => {
  const id = kind.id(entry)
  if (entries.some((existing) => kind.id(existing) === id)) {
    return fail(
      `${kind.idLabel} ${id} is already recorded on this SHA; each ${kind.idLabel} needs a new UUID`,
    )
  }
  const previous = entries.at(-1)
  const supersedes =
    kind.supersedes.of(entry) ??
    (previous === undefined ? undefined : kind.id(previous))
  if (
    supersedes !== undefined &&
    !entries.some((existing) => kind.id(existing) === supersedes)
  ) {
    return fail(
      `${kind.supersedes.field} ${supersedes} is not a ${kind.entry} on this SHA`,
    )
  }
  return {
    ok: true,
    value: [...entries, kind.withSupersedes(entry, supersedes)],
  }
}

/**
 * @template T
 * @typedef {object} NoteTarget
 * @property {string} cwd
 * @property {NoteKind<T>} kind
 * @property {string} ref
 */

/**
 * @template T
 * @typedef {object} AppendOptions
 * @property {(entry: T) => readonly string[]} check
 * @property {((entry: T) => T) | undefined} [complete] Fills in what the tool records itself, such as the entry's inputs, once the entry is valid.
 * @property {"refuse" | "skip"} duplicate
 */

/** Parses and validates `json` as one entry, applies `complete`, and runs `check` on the result. */
const checkedEntry = (kind, json, options) => {
  let parsed
  try {
    parsed = JSON.parse(json)
  } catch {
    return fail(`the ${kind.entry} is not JSON`)
  }
  const validated = kind.validate(parsed)
  if (!validated.ok) return validated
  const entry = options.complete?.(validated.value) ?? validated.value
  const problems = options.check(entry)
  return problems.length > 0 ? fail(...problems) : { ok: true, value: entry }
}

/**
 * Validates `json` as one entry, runs `check` on it, and appends it to the note on its SHA in `ref`. With `skip`, an
 * entry whose ID is already on that SHA is left as it is instead of refused.
 */
const appendJson = (target, json, options) => {
  const { cwd, kind, ref } = target
  const checked = checkedEntry(kind, json, options)
  if (!checked.ok) return checked
  const entry = checked.value
  const sha = kind.sha(entry)
  const existing = parseEntries(kind, readNote(cwd, ref, sha))
  if (!existing.ok) return existing
  const present = existing.value.find(
    (recorded) => kind.id(recorded) === kind.id(entry),
  )
  if (present !== undefined && options.duplicate === 'skip') {
    return { ok: true, value: { entry: present, written: false } }
  }
  const next = appendEntry(kind, existing.value, entry)
  if (!next.ok) return next
  writeNote(
    cwd,
    ref,
    sha,
    `${JSON.stringify({ [kind.listKey]: next.value, schemaVersion: 1 }, null, 2)}\n`,
  )
  return {
    ok: true,
    value: { entry: next.value.at(-1) ?? entry, written: true },
  }
}

/**
 * Appends an entry and returns it as recorded, with the entry it supersedes filled in, and `complete` applied to
 * the valid entry first. A repeated ID is refused.
 */
export const recordEntry = (target, json, check = () => [], complete) => {
  const recorded = appendJson(target, json, {
    check,
    complete,
    duplicate: 'refuse',
  })
  return recorded.ok ? { ok: true, value: recorded.value.entry } : recorded
}

/**
 * Appends an entry recorded in another clone, unless its ID is already on that SHA. `written` says whether the note
 * changed, so importing the same entries again changes nothing.
 */
export const importEntry = (target, json, check = () => []) =>
  appendJson(target, json, { check, duplicate: 'skip' })

/** The latest entry on `revision` in `ref`, or undefined when the commit has no note. */
export const latestEntry = (target, revision) => {
  const entries = parseEntries(
    target.kind,
    readNote(target.cwd, target.ref, resolveSha(target.cwd, revision)),
  )
  return entries.ok ? { ok: true, value: entries.value.at(-1) } : entries
}

/**
 * The latest entry that `matches` accepts, from the commit whose note was written most recently, or undefined when
 * no note holds one. Only each commit's latest entry is considered, as `latestEntry` reads it.
 */
export const latestMatching = (target, matches) => {
  for (const sha of annotatedByRecency(target.cwd, target.ref)) {
    const latest = latestEntry(target, sha)
    if (!latest.ok) return latest
    if (latest.value !== undefined && matches(latest.value)) return latest
  }
  return { ok: true, value: undefined }
}
