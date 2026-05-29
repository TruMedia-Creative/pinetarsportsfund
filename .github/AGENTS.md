# Agent Operating Guide

This is the primary instruction file for coding agents working in this repository.

## Mission

Deliver small, correct, maintainable changes that follow existing Nuxt and content-driven patterns.

## Quick Start

1. Install deps: `pnpm install`
2. Run dev server: `pnpm dev`
3. Validate fast: `pnpm check:fast`
4. Run full gate when needed: `pnpm check`

## Non-Negotiables

- Use `pnpm` only unless the user explicitly asks otherwise.
- Keep diffs minimal and targeted.
- Reuse established patterns before creating new abstractions.
- Do not add dependencies unless clearly justified.
- Update docs when behavior or workflows change.

## Project Map

- App/pages/components/composables: [app](../app)
- Content sources (YAML): [content](../content)
- Studio auth API endpoints: [server/api/__studio](../server/api/__studio)
- End-to-end tests: [e2e](../e2e)
- Architecture and system diagrams: [docs/ARCHITECTURE_OVERVIEW.md](../docs/ARCHITECTURE_OVERVIEW.md)
- Agent sequencing workflow: [docs/workflows/agent-workflow.md](../docs/workflows/agent-workflow.md)

## Conventions Agents Should Respect

- Content-driven pages query `@nuxt/content` collections and use `published: true` gating for public listings.
- Prefer exact content lookups by `stem` when loading a specific deck/project route.
- Motion and scroll behavior should respect reduced-motion preferences.
- Keep route/page structure aligned with file-based routing under `app/pages`.

## Known Pitfalls

- Mixed/stale Nuxt modules can trigger payload reducer runtime errors. If seen, clear `.nuxt`, reinstall deps, and retry.
- `better-sqlite3` may fail in some environments without native build approval via pnpm.
- `pnpm typecheck` can fail from transient Nuxt/Volar/vue-router version mismatches even when runtime is healthy.

## Validation Expectations

Pick the smallest valid set for the change:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:e2e`
- `pnpm build`

## Output Expectations

When reporting back, include:

- What changed and why
- Files changed
- Validation run (or why skipped)
- Remaining risks/assumptions

## Agent Routing

For structured multi-step work, use the sequence and role guidance in [docs/workflows/agent-workflow.md](../docs/workflows/agent-workflow.md).
