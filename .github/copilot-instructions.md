# Repository Instructions for GitHub Copilot

Use [AGENTS.md](AGENTS.md) as the primary operating guide for this repository.

## Global Rules

- Use `pnpm` for all package and script operations unless explicitly instructed otherwise.
- Prefer minimal, coherent diffs over broad rewrites.
- Follow existing Nuxt/Vue/content patterns already used in the codebase.
- Explain why before introducing a new dependency.
- Run an appropriate validation subset before handoff.

## Baseline Commands

- `pnpm install`
- `pnpm dev`
- `pnpm check:fast`
- `pnpm check`

## Documentation Policy

- Link to existing docs instead of duplicating details.
- When behavior changes, update the relevant docs in [../docs](../docs) and/or [../README.md](../README.md).
