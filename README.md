# Pine Tar Sports Fund Deck Builder

A structured deck-building app for Pine Tar Sports Fund and related investment offerings.

This project is designed to help create, manage, preview, and export branded presentation decks without rebuilding each pitch from scratch. Instead of manually editing every slide deck in PowerPoint, the app treats each deck as structured data powered by reusable templates, financial sections, assets, and per-tenant brand settings.

## What this app is for

The app supports deck creation for use cases such as:

- Investor pitch decks
- Sponsorship decks
- Lender / financing decks
- Municipality / partnership decks
- Project-specific investment summaries

## Core workflow

1. Sign in
2. Create a new deck or edit an existing one
3. Fill out structured sections such as summary, opportunity, use of funds, returns, projections, and team
4. Attach assets like logos, renderings, charts, and photos
5. Preview the deck in-browser
6. Export final deliverables such as PPTX and PDF

## Product direction

This is **not** an event platform and it is **not** meant to be a freeform slide editor like Canva or PowerPoint.

The app is built around a controlled system:

- reusable deck templates
- structured, typed content blocks
- separate financial models
- tenant-scoped brand settings (logo, colors, typography)
- export pipelines that stay independent from the editor UI

That makes the system easier to maintain, faster to reuse, and much harder to break with one rogue text box move.

## Feature areas

### Tenants
Multi-tenant aware from the start. Each tenant has its own brand settings (logo, primary color, font). Tenant is resolved from a URL path prefix (`/t/:tenantSlug`) or hostname subdomain, with a fallback to `pinetarsportsfund`.

### Decks
Manage deck records, edit metadata, control section order, and maintain audience-specific versions.

### Templates
Define reusable layouts and section expectations for different deck types. Default templates are registered in `src/features/templates/lib/templateRegistry.ts`.

### Financials
Store and manage raise targets, use-of-funds breakdowns, returns, assumptions, and forecast rows separately from general deck content.

### Assets
Upload and reference logos, charts, renderings, headshots, and supporting visuals.

### Exports
Generate deliverables such as PowerPoint and PDF from structured deck data.

## Tech stack

- Vite + React + TypeScript
- React Router v7
- React Hook Form + Zod
- Tailwind CSS v4
- pptxgenjs — PPTX generation
- sql.js + localforage — in-browser SQLite for the mock API layer
- Express — optional local API server (`server/`)

## Project structure

See [ProjectLayout.md](./ProjectLayout.md) for the current architectural layout and module conventions.

At a high level, the app is organized around:

- `src/features/tenants` for multi-tenancy, brand resolution, and tenant context
- `src/features/decks` for deck creation and editing
- `src/features/templates` for reusable deck structures
- `src/features/financials` for investment assumptions and projections
- `src/features/assets` for uploaded media
- `src/features/exports` for deck generation logic
- `src/lib/api/mock` for in-browser SQLite-backed development data
- `src/lib/api/http.ts` for the HTTP client used when the Express server is running
- `src/lib/pptx` for PPTX export helpers and builders
- `server/` for the optional Express + SQLite API server

## CI / Deployment

### CI

Every push and pull request runs `.github/workflows/ci.yml`, which runs `pnpm check` (lint + typecheck + build) on Node from `.nvmrc`.

### Deployment (GitHub Pages)

The app deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

### One-time repository setup

Before the workflow can deploy, you need to enable GitHub Pages in the repository settings **once**:

1. Go to the repository on GitHub.
2. Click **Settings** → **Pages** (in the left sidebar under *Code and automation*).
3. Under **Build and deployment → Source**, select **GitHub Actions** (not *Deploy from a branch*).
4. Click **Save**.

That's it. The next push to `main`, or a manual trigger (see [Manually triggering a deployment](#manually-triggering-a-deployment) below), will build and publish the site.

### How it works

| Part | Detail |
|---|---|
| CI workflow | `.github/workflows/ci.yml` — runs on all pushes and PRs |
| Deploy workflow | `.github/workflows/deploy.yml` — runs on push to `main` or manual trigger |
| Build command | `pnpm check` (lint + typecheck + build) |
| Output directory | `dist/` |
| Base URL | `/pinetarsportsfund/` (set in `vite.config.ts`) |
| Published URL | `https://<org>.github.io/pinetarsportsfund/` |

The `base` path in `vite.config.ts` must match the repository name for all asset paths to resolve correctly on GitHub Pages.

### Manually triggering a deployment

1. Open the **Actions** tab of the repository.
2. Select **Deploy to GitHub Pages** from the workflow list on the left.
3. Click **Run workflow** → **Run workflow**.

---

## Local development

### Requirements

- Node version from `.nvmrc` (currently `22`)
- pnpm (activated via Corepack — do **not** install globally with npm)

### Setup

```sh
nvm use
pnpm bootstrap   # runs: corepack enable && pnpm install --frozen-lockfile
```

### Run development server (UI only)

```sh
pnpm dev
```

Runs Vite dev server. The app uses the in-browser SQLite mock layer by default.

### Run with local Express API server

```sh
pnpm dev:full   # runs both Express API (port 8787) and Vite dev server
```

When the API server is running, set `VITE_API_BASE_URL=http://localhost:8787/api` to point the frontend at it. This is already configured in the `dev:full` script.

### Validate the project

```sh
pnpm check   # runs: pnpm lint && pnpm typecheck && pnpm build
```

Run individual checks:

```sh
pnpm lint          # ESLint validation
pnpm typecheck     # TypeScript type checking
pnpm build         # Vite production build
```

## Data persistence modes

The app supports two data layers, selectable by environment:

| Mode | How it works | When to use |
|------|-------------|-------------|
| **In-browser SQLite** | `sql.js` + `localforage` backing an in-memory SQLite DB persisted to IndexedDB | Default — no server needed |
| **Express API** | `server/index.mjs` — Express + `better-sqlite3` on port `8787` | When you need shareable/persistent data across browsers |

The `VITE_API_BASE_URL` env var controls which layer `src/lib/api/http.ts` points at.

## Data model

The app is centered around a few main entities:

- **Tenant** — brand, slug, theming
- **Deck** — metadata, audience type, status, section list
- **DeckSection** — typed, ordered, enable/disable-able
- **Template** — defines section structure for a deck type
- **Asset** — uploaded media references
- **FinancialModel** — raise targets, returns, use-of-funds, projections

Models are strongly typed and Zod-validated before export logic runs.

## Export philosophy

Export logic stays separate from React page components.

`app state / stored deck data → normalized section data → export builder → PPTX / PDF output`

## Non-goals for now

- public event landing pages
- ticketing or livestream features
- freeform drag-anything slide editing
- AI-generated investment assumptions by default

## Status

This project is in active setup and architecture definition.

The immediate goal is to establish:

- a clean feature-first structure
- strong domain models
- reusable templates
- reliable preview and export flows
- a foundation that Pine Tar can use repeatedly across multiple deck types