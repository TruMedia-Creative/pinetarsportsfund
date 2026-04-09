# Architecture

This document covers architectural decisions and patterns for the Pine Tar Sports Fund monorepo.

The repo contains two apps:
- **`apps/dashboard/`** (`@pinetarsf/dashboard`) — React + Vite deck builder and editor
- **`apps/site/`** (`@pinetarsf/site`) — Nuxt 4 + Vue 3 public marketing site and investment gallery

---

## Dashboard Architecture (`apps/dashboard/`)

### Tenant Resolution

Tenant is resolved in the following priority order:

1. **URL path prefix**: `/t/:tenantSlug/*` — explicit tenant scoping in shared links
2. **Hostname subdomain**: `{tenant}.example.com` — production multi-tenant deployments
3. **Fallback**: hardcoded to `pinetarsportsfund` for `localhost`, `127.0.0.1`, and `*.github.io`

Resolved tenant is stored in `TenantContext` (`apps/dashboard/src/features/tenants/`) and used for:
- Per-tenant branding (logo, primary color, font)
- API scoping (future: tenant-scoped data isolation)
- Route guards (`TenantGate` shows error UI if tenant fails to resolve)

### App Areas

- **Decks**: core feature — create, edit, preview, export pitch decks
- **Templates**: reusable section layouts registered in `templateRegistry.ts`
- **Financials**: raise targets, use-of-funds, returns, forecast, assumptions
- **Assets**: uploaded logos, renderings, charts, headshots
- **Exports**: structured deck data → PPTX / PDF via `pptxgenjs`
- **Admin**: manage decks, templates, and tenant settings
- **Settings**: user theme / accent color preferences
- **Public view**: `/view/:slug` — unauthenticated shareable deck preview

### Data Access

The dashboard supports two data modes:

#### In-browser SQLite (default)
`apps/dashboard/src/lib/api/mock/sqlite.ts` — `sql.js` initializes an in-memory SQLite DB, persisted to IndexedDB via `localforage`. No server required.

Tables: `decks`, `assets`, `financial_models`

Each feature's mock module (`decks.ts`, `assets.ts`, `financials.ts`, `tenants.ts`) wraps this layer behind a stable interface so the implementation can be swapped for real API calls later.

#### Express API server (optional)
`apps/dashboard/server/index.mjs` — Express + file-based SQLite at `data/app.sqlite.bin`.

Start: `pnpm api` (from `apps/dashboard/`) or `pnpm dev:full`.

`apps/dashboard/src/lib/api/http.ts` is the shared fetch wrapper (`apiRequest<T>`) that reads `VITE_API_BASE_URL` to point at the server.

### Export Pipeline

```
stored deck data
  → normalized section list (ordered, filtered by isEnabled)
    → export builder (apps/dashboard/src/lib/pptx/builders.ts)
      → PPTX / PDF output
```

Export logic is intentionally kept out of React components. See `apps/dashboard/src/features/exports/utils/buildDeck.ts`.

---

## Site Architecture (`apps/site/`)

### Overview

The Nuxt 4 site is server-side rendered. It serves as:
- The public investment gallery (published decks visible to anyone)
- The admin area for deck and asset management
- Marketing pages (home, about, contact)

### Data Access

The site uses an in-memory mock store at `apps/site/server/utils/mockStore.ts`. All data operations go through Nuxt server route handlers under `apps/site/server/routes/api/`.

There is no external database requirement in the current setup. The mock store is initialized at server start and holds state in memory for the duration of the process.

### Auth

Admin routes are protected by the server middleware at `apps/site/server/middleware/auth.ts`. The login endpoint is at `POST /api/admin/auth`.

### Pages and Routing

Nuxt uses file-based routing. Pages live in `apps/site/pages/`. Admin pages live under `apps/site/pages/admin/`.

### Key Composables

| Composable | Purpose |
|-----------|---------|
| `useAuth` | Authentication state (login, logout, current user) |
| `useDeck` | Deck CRUD operations against the server API |
| `usePublishedDecks` | Published deck gallery data for the investments section |
| `usePageSeo` | Per-page SEO metadata (`useHead`) |
