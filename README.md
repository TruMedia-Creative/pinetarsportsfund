# Pine Tar Sports Fund

A pnpm monorepo containing two applications for Pine Tar Sports Fund:

| App | Path | Stack | Purpose |
|-----|------|-------|---------|
| **Dashboard** | `apps/dashboard/` | React + Vite + TypeScript | Deck builder, editor, and export tool |
| **Site** | `apps/site/` | Nuxt 4 + Vue 3 | Public marketing site and investment gallery |

## What this project is for

The system lets the Pine Tar team create, manage, preview, and export branded investor presentation decks — without rebuilding every pitch from scratch. Decks are structured data driven by reusable templates, typed content blocks, financial models, and per-tenant brand settings.

Use cases:
- Investor pitch decks
- Sponsorship decks
- Lender / financing decks
- Municipality / partnership decks
- Project-specific investment summaries

## Apps

### Dashboard (`apps/dashboard/` — `@pinetarsf/dashboard`)

The deck builder. React + Vite + TypeScript with a feature-first module structure.

Core flow:
1. Sign in
2. Create or edit a deck via structured forms
3. Fill in sections (summary, opportunity, use of funds, returns, projections, team, etc.)
4. Attach assets (logos, renderings, charts, headshots)
5. Preview the deck in-browser
6. Export PPTX and PDF deliverables

Key features:
- Multi-tenant branding (logo, primary color, font) via `TenantContext`
- Tenant resolution from URL prefix (`/t/:tenantSlug`) or hostname subdomain
- In-browser SQLite mock data layer (`sql.js` + `localforage`)
- Optional Express API server on port 8787
- PPTX export via `pptxgenjs`
- React Router v7, React Hook Form, Zod

### Site (`apps/site/` — `@pinetarsf/site`)

The public-facing marketing site and investment gallery. Nuxt 4 + Vue 3 + TypeScript with SSR.

Pages:
- Home, About, Contact (marketing)
- Investment Gallery — browse published decks
- Investment Detail — view individual deck at `/investments/[slug]`
- Admin area — deck management, asset library, settings
- Login

Nuxt server routes handle data access. An in-memory mock store (`server/utils/mockStore.ts`) powers the site without an external database.

## Monorepo scripts

All commands run from the **repo root**.

```sh
# Install (only needed once or after lockfile changes)
pnpm setup          # corepack enable && pnpm install --frozen-lockfile

# Development
pnpm dev            # Start the Nuxt site (apps/site)
pnpm dev:site       # Same as above
pnpm dev:dashboard  # Start the React dashboard (apps/dashboard)

# Build all apps
pnpm build

# Per-app builds
pnpm build:site
pnpm build:dashboard

# Validation (lint + typecheck + build across all workspaces)
pnpm check
pnpm lint
pnpm typecheck
```

### Dashboard-specific scripts (run from `apps/dashboard/`)

```sh
pnpm dev            # Vite dev server with in-browser SQLite mock
pnpm dev:full       # Vite + Express API server (port 8787)
pnpm api            # Express API server only
pnpm test           # Vitest
```

## Requirements

- Node version from `.nvmrc` (currently `22`) — use `nvm use`
- pnpm managed via Corepack — do **not** install globally with npm

## CI / Deployment

### CI

`.github/workflows/ci.yml` runs on every push and PR:
- Sets up Node from `.nvmrc`
- Activates pnpm via Corepack
- Runs `pnpm check` (lint + typecheck + build) across all workspaces

### Deployment (GitHub Pages)

`.github/workflows/deploy.yml` deploys automatically on push to `main`.

One-time setup required in repository Settings → Pages → Build and deployment → Source: select **GitHub Actions**.

| Part | Detail |
|------|--------|
| CI workflow | `.github/workflows/ci.yml` — all pushes and PRs |
| Deploy workflow | `.github/workflows/deploy.yml` — push to `main` or manual trigger |
| Build command | `pnpm check` |

## Data layers

### Dashboard

| Mode | How it works | When to use |
|------|-------------|-------------|
| **In-browser SQLite** | `sql.js` + `localforage` — in-memory SQLite persisted to IndexedDB | Default — no server needed |
| **Express API** | `apps/dashboard/server/index.mjs` on port 8787 | When persistent/shared data is needed |

Set `VITE_API_BASE_URL=http://localhost:8787/api` to point the dashboard at the Express server. The `dev:full` script handles this automatically.

### Site

The Nuxt site uses an in-memory mock store at `apps/site/server/utils/mockStore.ts`. All data mutations go through Nuxt server routes under `apps/site/server/routes/api/`.

## Data model

Core entities shared across both apps:

- **Tenant** — brand, slug, theming
- **Deck** — metadata, audience type, status (`draft | ready | exported | archived`), ordered section list
- **DeckSection** — typed, ordered, enable/disable-able content blocks
- **Template** — reusable section structure definitions
- **Asset** — logos, renderings, charts, headshots
- **FinancialModel** — raise targets, returns, use-of-funds, projections, assumptions

Types for the site live in `apps/site/lib/types/models.ts`. Dashboard types live in `apps/dashboard/src/features/*/model/types.ts`.

## Export philosophy

Export logic is isolated from React components.

```
stored deck data
  → normalized section list (ordered, filtered by isEnabled)
    → export builder (apps/dashboard/src/lib/pptx/builders.ts)
      → PPTX / PDF output
```

See `apps/dashboard/src/features/exports/utils/buildDeck.ts`.

## Non-goals

- Public event landing pages
- Ticketing or livestream features
- Freeform drag-anything slide editing (not a Canva clone)
- AI-generated investment assumptions by default

## Further reading

- [ProjectLayout.md](./ProjectLayout.md) — full directory structure reference
- [docs/architecture.md](./docs/architecture.md) — architecture decisions and patterns
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) — admin dashboard quick-start guide