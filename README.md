# pinetarsportsfund
# Pine Tar Sports Fund Deck Builder

A structured deck-building app for Pine Tar Sports Fund and related investment offerings.

This project is designed to help create, manage, preview, and export branded presentation decks without rebuilding each pitch from scratch. Instead of manually editing every slide deck in PowerPoint, the app treats each deck as structured data powered by reusable templates, financial sections, assets, and brand settings.

## What this app is for

The app is intended to support deck creation for use cases such as:

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

The app is being built around a more controlled system:

- reusable deck templates
- structured, typed content blocks
- separate financial models
- brand-aware presentation rules
- export pipelines that stay independent from the editor UI

That makes the system easier to maintain, faster to reuse, and much harder to break with one rogue text box move.

## Planned feature areas

### Decks
Manage deck records, edit metadata, control section order, and maintain audience-specific versions.

### Templates
Define reusable layouts and section expectations for different deck types.

### Financials
Store and manage raise targets, use-of-funds breakdowns, returns, assumptions, and forecast rows separately from general deck content.

### Assets
Upload and reference logos, charts, renderings, headshots, and supporting visuals.

### Brand
Control Pine Tar Sports Fund branding such as logo, colors, disclaimer text, and presentation defaults.

### Exports
Generate deliverables such as PowerPoint and PDF from structured deck data.

## Tech stack

- Vite
- React
- TypeScript
- React Router
- Zod
- Tailwind CSS
- localStorage-backed mock API layer for early development

## Project structure

See [ProjectLayout.md](./ProjectLayout.md) for the current architectural layout and module conventions.

At a high level, the app is organized around:

- `src/features/decks` for deck creation and editing
- `src/features/templates` for reusable deck structures
- `src/features/financials` for investment assumptions and projections
- `src/features/assets` for uploaded media
- `src/features/brand` for brand settings
- `src/features/exports` for deck generation logic
- `src/lib/api/mock` for local-first development data
- `src/lib/pptx` for export helpers and builders

## Deployment (GitHub Pages)

The app is configured to deploy automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

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
| Workflow file | `.github/workflows/deploy.yml` |
| Trigger | Push to `main` or manual `workflow_dispatch` |
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

- Node version from `.nvmrc`
- pnpm

### Setup

```sh
nvm use
corepack enable
pnpm install
```

### Run development server

```sh
pnpm dev
```

### Validate the project

```sh
pnpm lint
pnpm typecheck
pnpm build
```

Or, if available in `package.json`:

```sh
pnpm check
```

## Current development approach

The app is currently intended to be built in a **local-first** way before wiring up a full backend.

That means:

- mock CRUD lives under `src/lib/api/mock/*`
- sample Pine Tar Sports Fund data can be seeded locally
- UI and data modeling come first
- real persistence can be added later behind stable interfaces

## Data model direction

The app is centered around a few main entities:

- **BrandProfile**
- **Deck**
- **DeckSection**
- **Template**
- **Asset**
- **FinancialModel**

These models should remain explicit, typed, and validated before export logic is layered on top.

## Export philosophy

Export logic should remain separate from React page components.

The goal is to keep a clean flow like this:

`app state / stored deck data -> normalized section data -> export builder -> PPTX / PDF output`

This keeps the deck engine inspectable and easier to maintain when layouts or export requirements change.

## Non-goals for now

- public event landing pages
- ticketing or livestream features
- freeform drag-anything slide editing
- highly opinionated backend architecture before core workflows are proven
- AI-generated investment assumptions by default

## Status

This project is in active setup and architecture definition.

The immediate goal is to establish:

- a clean feature-first structure
- strong domain models
- reusable templates
- reliable preview and export flows
- a foundation that Pine Tar can use repeatedly across multiple deck types