#!/usr/bin/env node
// Ported from pathableai-org/pre-ets scripts/pr-ready-hook.ts @ f2ee390 (adapted: entry only; logic in scripts/ready-hook.mjs).
//
// Claude Code PreToolUse hook for Bash and the GitHub MCP pull request tools.
// It reads the tool call from stdin and blocks (exit 2) an attempt to mark a
// pull request ready when the verification and code review gate fails, and
// approves an MCP ready attempt the gate lets through. Every other tool call
// passes through without touching git or GitHub. See
// docs/engineering/verification-harness.md#gate-and-escalation.

import { readFileSync } from 'node:fs'

import { runReadyHook } from '../ready-hook.mjs'

runReadyHook(JSON.parse(readFileSync(0, 'utf8')))
