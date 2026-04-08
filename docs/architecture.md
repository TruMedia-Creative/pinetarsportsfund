# Architecture

## Tenant Resolution

Tenant is resolved in the following priority order:

1. **URL path prefix**: `/t/:tenantSlug/*` — used for explicit tenant scoping in shared links
2. **Hostname subdomain**: `{tenant}.example.com` — used in production multi-tenant deployments
3. **Fallback**: hardcoded to `pinetarsportsfund` for `localhost`, `127.0.0.1`, and `*.github.io`

Resolved tenant is stored in `TenantContext` (`src/features/tenants/`) and used for:
- Per-tenant branding (logo, primary color, font)
- API scoping (future: tenant-scoped data isolation)
- Route guards (`TenantGate` shows error UI if tenant fails to resolve)

## App Areas

- **Decks**: core feature — create, edit, preview, export pitch decks
- **Templates**: reusable section layouts registered in `templateRegistry.ts`
- **Financials**: raise targets, use-of-funds, returns, forecast, assumptions
- **Assets**: uploaded logos, renderings, charts, headshots
- **Exports**: structured deck data → PPTX / PDF via `pptxgenjs`
- **Admin**: manage decks, templates, and tenant settings
- **Settings**: user theme / accent color preferences
- **Public view**: `/view/:slug` — unauthenticated shareable deck preview

## Data Access

The app supports two data modes:

### In-browser SQLite (default)
`src/lib/api/mock/sqlite.ts` — `sql.js` initializes an in-memory SQLite DB, persisted to IndexedDB via `localforage`. No server required.

Tables: `decks`, `assets`, `financial_models`

Each feature's mock module (`decks.ts`, `assets.ts`, `financials.ts`, `tenants.ts`) wraps this layer behind a stable interface so the implementation can be swapped for real API calls later.

### Express API server (optional)
`server/index.mjs` — Express + file-based SQLite at `data/app.sqlite.bin`.

Start: `pnpm api` or `pnpm dev:full` (API + Vite together).

`src/lib/api/http.ts` is the shared fetch wrapper (`apiRequest<T>`) that reads `VITE_API_BASE_URL` to point at the server.

## Export Pipeline

```
stored deck data
  → normalized section list (ordered, filtered by isEnabled)
    → export builder (src/lib/pptx/builders.ts)
      → PPTX / PDF output
```

Export logic is intentionally kept out of React components. See `src/features/exports/utils/buildDeck.ts`.
