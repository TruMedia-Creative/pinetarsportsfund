# Pine Tar Sports Fund

A pnpm monorepo for Pine Tar Sports Fund. The primary application is `apps/site/` — a Nuxt 4 site that serves both the public marketing pages and the investor deck publishing system. Decks are YAML files edited via Nuxt Studio (no-code) or directly in the repo.

`apps/dashboard/` (the original React deck builder) has been archived. See [`apps/dashboard/ARCHIVED.md`](apps/dashboard/ARCHIVED.md).

## What this project is for

The Pine Tar team creates, manages, and publishes branded investor presentation decks as structured web pages. Each deck is a YAML file committed to Git — edited no-code via Nuxt Studio, previewed instantly in the browser, and published by toggling `published: true`.

Use cases:
- Investor pitch decks
- Sponsorship decks
- Lender / financing decks
- Municipality / partnership decks
- Project-specific investment summaries

## Site (`apps/site/` — `@pinetarsf/site`)

The only active application. Nuxt 4 + Vue 3 + TypeScript + SSR.

### Core flow

1. Create a new file in `content/decks/` (or use Nuxt Studio's form editor)
2. Fill in deck metadata and section content
3. Toggle `published: true` to make the deck live at `/decks/[slug]`
4. The public can browse all published decks at `/decks`

### Key features

- **Nuxt Studio** (`nuxt-studio`) — no-code CMS that auto-generates forms from Zod schemas and commits YAML changes to GitHub
- **@nuxt/content v3** — YAML collection backing the deck data; `content.config.ts` defines schemas
- **12 deck section components** — globally registered Vue components in `app/components/deck/`
- **Published/draft toggle** — `published: false` decks return 404 to public visitors; Studio preview bypasses this
- **@nuxt/ui v4** — component library; brand colors are `primary: red`, `warning: amber`

### Deck sections (in fixed narrative order)

| Section | Component |
|---------|-----------|
| Cover | `DeckCover` |
| Executive Summary | `DeckExecutiveSummary` |
| Investment Thesis | `DeckInvestmentThesis` |
| Opportunity | `DeckOpportunity` |
| Market | `DeckMarket` |
| Project Overview | `DeckProjectOverview` |
| Team | `DeckTeam` |
| Use of Funds | `DeckUseOfFunds` |
| Returns | `DeckReturns` |
| Projections | `DeckProjections` |
| Risks / Disclaimer | `DeckRisksDisclaimer` |
| Closing / CTA | `DeckClosingCta` |

Each section (except Cover) has an `enabled` boolean. Set `enabled: false` to skip a section for a given deck.

## Monorepo scripts

All commands run from the **repo root**.

```sh
# Install (only needed once or after lockfile changes)
pnpm setup          # corepack enable && pnpm install --frozen-lockfile

# Development
pnpm dev            # Start the Nuxt site (apps/site) at http://localhost:3000

# Build
pnpm build          # Build all workspaces
pnpm build:site     # Build apps/site only

# Validation (lint + typecheck + build)
pnpm check
pnpm lint
pnpm typecheck
```

Site-specific scripts (run from `apps/site/`):

```sh
pnpm dev            # nuxt dev
pnpm build          # nuxt build
pnpm preview        # nuxt preview
pnpm typecheck      # nuxt typecheck
pnpm lint           # eslint .
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