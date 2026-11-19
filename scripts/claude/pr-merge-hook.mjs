#!/usr/bin/env node
// Claude Code PreToolUse hook for Bash and the GitHub MCP merge tools.
//
// It reads the tool call from stdin and runs the merge gate on every attempt to
// merge a pull request: it approves the MCP merge of a Standard or Light pull
// request that passes, blocks (exit 2) one that fails, asks a person for any
// pull request that is not eligible for agent merge, and always blocks GitHub
// auto-merge. Every other tool call passes through without touching git or
// GitHub. See docs/engineering/git-workflow.md#the-merge-gate.

import { readFileSync } from 'node:fs'

import { runMergeHook } from '../merge-hook.mjs'

runMergeHook(JSON.parse(readFileSync(0, 'utf8')))
