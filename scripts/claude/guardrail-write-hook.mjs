#!/usr/bin/env node
// Claude Code PreToolUse and PostToolUse hook for Bash.
//
// Before a command runs, it asks a person when the command may write to a
// guardrail file (a redirection, tee, sed -i, cp, mv, rm, git checkout -- or
// git apply naming one, or inline interpreter code that names one and writes),
// and records which guardrail files are already changed. After the command, it
// tells the agent to stop and ask the person (exit 2) when the command changed
// a guardrail file it was not asked about. Every other command passes through.
// See scripts/guardrail-write.mjs and
// docs/engineering/git-workflow.md#guardrail-changes.

import { readFileSync } from 'node:fs'

import { runGuardrailWriteHook } from '../guardrail-write.mjs'

runGuardrailWriteHook(JSON.parse(readFileSync(0, 'utf8')))
