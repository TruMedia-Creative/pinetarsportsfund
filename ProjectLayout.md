# Project Layout

This document describes the full directory structure of the Pine Tar Sports Fund monorepo — where everything lives and how the pieces fit together.

## Monorepo Root

| File / Dir | Purpose |
|-----------|---------|
| `package.json` | Root scripts — `dev`, `dev:dashboard`, `dev:site`, `build`, `check`, etc. |
| `pnpm-workspace.yaml` | Declares `apps/*` as workspace members |
| `pnpm-lock.yaml` | Authoritative lockfile |
| `tsconfig.json` | Root TypeScript config |
| `.nvmrc` | Node version pin (currently `22`) |
| `.env.example` | Environment variable template |
| `docs/` | Architecture notes |
| `apps/` | Application workspaces |

## Apps Overview

```text
apps/
├── dashboard/    # @pinetarsf/dashboard — React + Vite deck builder
└── site/         # @pinetarsf/site — Nuxt 4 marketing site + investment gallery
```

## `apps/dashboard/` — React Dashboard (`@pinetarsf/dashboard`)

The deck builder and editor. Vite + React + TypeScript.

### Top-Level Files

| File | Purpose |
|------|---------|
| `index.html` | Vite entry HTML |
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | Root TS config (references app + node configs) |
| `tsconfig.app.json` | TypeScript config for `src/` |
| `tsconfig.node.json` | TypeScript config for Node-side files (Vite config, server) |
| `package.json` | Dashboard-scoped scripts and dependencies |

### `apps/dashboard/server/`

Optional Express API server backed by a SQLite file.

```text
server/
├── index.mjs    # Express server — deck, asset, financial-model endpoints
└── sqlite.mjs   # SQLite helpers (initDb, listRows, getRowById, upsertRow, deleteRowById)
```

Start with `pnpm api` or `pnpm dev:full` (server + Vite together).

### `apps/dashboard/src/`

```text
src/
├── main.tsx                  # React entry point (createRoot)
├── App.tsx                   # Router setup, auth gates, tenant routing (React Router v7)
├── index.css                 # Global styles (Tailwind CSS v4)
│
├── components/               # Shared, reusable UI
│   ├── layout/
│   │   ├── AppShell.tsx      # Authenticated app chrome (header, nav, dark mode toggle)
│   │   ├── PublicLayout.tsx  # Layout for unauthenticated public deck views
│   │   └── index.ts
│   └── ui/
│       ├── BannerUpload.tsx  # Drag-and-drop image upload
│       ├── Button.tsx        # Shared button component
│       ├── SurfacePanel.tsx  # Reusable card/panel
│       ├── LoadingSpinner.tsx
│       └── index.ts
│
├── features/                 # Feature-first modules
│   ├── auth/                 # Authentication              # Multi-tenancy — brand resolution and context
│   │   ├── context/
│   │   │   ├── TenantContext.tsx     # TenantProvider — resolves slug from URL or hostname
│   │   │   ├── tenantContextValue.ts
│   │   │   ├── useTenant.ts
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── types.ts             # Tenant type (id, slug, name, domain, branding)
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── decks/                # Deck creation, editing, and preview (core feature)
│   │   ├── model/
│   │   │   ├── types.ts             # Deck, DeckSection, DeckStatus, AudienceType
│   │   │   ├── schemas.ts           # Zod validation schemas
│   │   │   ├── contentTypes.ts      # Typed content block definitions per section type
│   │   │   ├── themeDefaults.ts     # Default theme values per audience type
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── slideBlueprints.ts   # Section templates and blueprints
│   │   │   └── viewerAnalytics.ts   # Analytics helpers for deck viewing
│   │   ├── routes/
│   │   │   ├── DeckListPage.tsx          # List all decks
│   │   │   ├── DeckFormPage.tsx          # Create / edit deck form
│   │   │   ├── DeckPreviewPage.tsx       # Browser preview (authenticated + public isPublic param)
│   │   │   ├── DeckSectionEditor.tsx     # Section-level inline editor
│   │   │   ├── DeckSectionEditor.test.tsx
│   │   │   ├── DeckPreviewPage.test.tsx
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── createDeckSectionsFromTemplate.ts
│   │   │   └── createDeckSectionsFromTemplate.test.ts
│   │   └── index.ts
│   │
│   ├── templates/            # Reusable slide/section templates
│   │   ├── model/
│   │   │   ├── types.ts             # Template, SectionDefinition types
│   │   │   └── index.ts
│   │   ├── components/              # Template UI components
│   │   ├── lib/
│   │   │   └── templateRegistry.ts  # Runtime registry of available templates
│   │   └── index.ts
│   │
│   ├── financials/           # Investment assumptions and projections
│   │   ├── model/
│   │   │   ├── types.ts             # Returns, use-of-funds, forecast, assumptions types
│   │   │   ├── schemas.ts           # Financial input validation schemas
│   │   │   ├── schemas.test.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── ReturnsForm.tsx
│   │   │   ├── ForecastTable.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── assets/               # Uploaded images, logos, renderings, charts
│   │   ├── model/
│   │   │   ├── types.ts             # Asset types (id, name, type, url, alt, tags)
│   │   │   ├── schemas.ts
│   │   │   ├── schemas.test.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── AssetLibrary.tsx
│   │   │   ├── AssetPicker.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── exports/              # Deck export pipeline
│   │   ├── routes/
│   │   │   ├── ExportPage.tsx       # Generate PPTX / PDF outputs
│   │   │   ├── ExportPage.test.tsx
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── buildDeck.ts         # Maps structured content to PPTX/PDF output
│   │   └── index.ts
│   │
│   ├── dashboard/            # Main dashboard home
│   │   └── routes/
│   │       ├── DashboardPage.tsx
│   │       └── index.ts
│   │
│   ├── admin/                # Admin panel
│   │   └── routes/
│   │       ├── AdminDashboardPage.tsx
│   │       └── index.ts
│   │
│   ├── settings/             # User and app settings
│   │
│   └── exports/              # Deck export pipeline
│
├── lib/                      # Shared utilities and services
│   ├── api/
│   │   ├── http.ts            # apiRequest<T>() — fetch wrapper, reads VITE_API_BASE_URL
│   │   └── mock/
│   │       ├── sqlite.ts      # In-browser SQLite via sql.js + localforage (IndexedDB)
│   │       ├── db.ts          # Low-level SQLite table helpers
│   │       ├── data.ts        # Seed data (decks, templates, financial defaults)
│   │       ├── decks.ts       # Mock deck CRUD
│   │       ├── assets.ts      # Mock asset CRUD
│   │       ├── financials.ts  # Mock financial model CRUD
│   │       ├── tenants.ts     # Mock tenant lookup
│   │       └── index.ts
│   ├── pptx/
│   │   ├── builders.ts        # PPTX export builders (pptxgenjs)
│   │   └── index.ts
│   └── colorContrast.ts       # WCAG contrast ratio helper
│
└── test/
    └── setup.ts              # Vitest setup
```

### Dashboard Route Table

All authenticated routes are protected by `RequireAuth` and wrapped in `TenantGate`.

| Path | Component | Auth | Notes |
|------|-----------|------|-------|
| `/login` | `LoginPage` | No | Sign in form |
| `/` | `DashboardPage` | Yes | Home / overview |
| `/decks` | `DeckListPage` | Yes | All decks |
| `/decks/new` | `DeckFormPage` | Yes | Create deck |
| `/decks/:deckId/edit` | `DeckFormPage` | Yes | Edit deck |
| `/decks/:deckId/preview` | `DeckPreviewPage` | Yes | Browser preview |
| `/exports/:deckId` | `ExportPage` | Yes | Generate PPTX / PDF |
| `/admin` | `AdminDashboardPage` | Yes | Admin panel |
| `/settings` | `SettingsPage` | Yes | User settings |
| `/view/:slug` | `DeckPreviewPage` (`isPublic=true`) | No | Public shareable view |

All authenticated routes can optionally be prefixed with `/t/:tenantSlug/`.

### Tenant Resolution (Dashboard)

| Method | Pattern | Example |
|--------|---------|---------|
| Path prefix | `/t/:tenantSlug/*` | `/t/pinetarsportsfund/decks` |
| Hostname subdomain | `{slug}.example.com` | `pinetarsportsfund.example.com` |
| Fallback | `pinetarsportsfund` | `localhost`, `*.github.io` |

---

## `apps/site/` — Nuxt 4 Site (`@pinetarsf/site`)

The public-facing marketing site, investment gallery, and admin area. Nuxt 4 + Vue 3 + TypeScript with SSR.

### Top-Level Files

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt configuration (modules, Tailwind, SSR, image) |
| `app.vue` | Root Vue component |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `eslint.config.js` | ESLint config |
| `tsconfig.json` | TypeScript config |

### Directory Structure

```text
apps/site/
│
├── app.vue                   # Root component
│
├── assets/
│   └── css/
│       └── main.css          # Global styles (Tailwind v4 + custom)
│
├── components/               # Vue components
│   ├── layout/
│   │   ├── Header.vue        # Site header with navigation
│   │   └── Footer.vue        # Site footer
│   └── ui/                   # Shared UI primitives
│
├── composables/              # Vue composables (replaces React hooks)
│   ├── useAuth.ts            # Authentication state
│   ├── useDeck.ts            # Deck CRUD operations
│   ├── usePageSeo.ts         # Per-page SEO metadata
│   └── usePublishedDecks.ts  # Published deck gallery data
│
├── layouts/
│   ├── default.vue           # Public site layout
│   ├── admin.vue             # Admin area layout
│   └── blank.vue             # Bare layout (login, etc.)
│
├── lib/
│   ├── schemas/
│   │   └── index.ts          # Shared Zod schemas
│   └── types/
│       └── models.ts         # Shared TypeScript types (Deck, Asset, etc.)
│
├── pages/                    # Auto-routed pages (Nuxt file-based routing)
│   ├── index.vue             # Home — marketing / hero
│   ├── about.vue             # About page
│   ├── contact.vue           # Contact form
│   ├── login.vue             # Admin login
│   ├── investments/
│   │   ├── index.vue         # Investment gallery — published decks
│   │   └── [slug].vue        # Individual investment deck detail
│   └── admin/
│       ├── index.vue         # Admin dashboard — stats overview
│       ├── assets.vue        # Asset library management
│       ├── settings.vue      # Site and account settings
│       └── decks/
│           ├── index.vue     # Deck list
│           ├── new.vue       # Create new deck
│           └── [id]/         # Edit deck
│
├── public/
│   └── 404.html              # SPA fallback for static hosting
│
└── server/
    ├── middleware/
    │   └── auth.ts           # Auth middleware (protects /admin routes)
    ├── utils/
    │   └── mockStore.ts      # In-memory mock data store
    └── routes/
        ├── sitemap.xml.ts
        └── api/
            ├── decks.get.ts               # GET /api/decks — published decks
            ├── decks/
            │   └── [id].get.ts            # GET /api/decks/:id
            ├── contact.post.ts            # POST /api/contact
            └── admin/
                ├── stats.get.ts           # GET /api/admin/stats
                ├── decks.get.ts           # GET /api/admin/decks
                ├── decks.post.ts          # POST /api/admin/decks
                ├── decks/
                │   ├── [id].get.ts
                │   ├── [id].put.ts
                │   └── [id].delete.ts
                ├── assets.get.ts          # GET /api/admin/assets
                ├── assets.post.ts         # POST /api/admin/assets
                ├── assets/               # DELETE /api/admin/assets/:id
                └── auth/
                    └── auth.post.ts       # POST /api/admin/auth (login)
```

### Site API Routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/decks` | Published decks for investment gallery |
| GET | `/api/decks/:id` | Single published deck |
| POST | `/api/contact` | Contact form submission |
| GET | `/api/admin/stats` | Dashboard stats (deck/asset counts) |
| GET | `/api/admin/decks` | All decks (admin) |
| POST | `/api/admin/decks` | Create deck |
| GET | `/api/admin/decks/:id` | Get deck |
| PUT | `/api/admin/decks/:id` | Update deck |
| DELETE | `/api/admin/decks/:id` | Delete deck |
| GET | `/api/admin/assets` | All assets |
| POST | `/api/admin/assets` | Upload / register asset |
| DELETE | `/api/admin/assets/:id` | Delete asset |
| POST | `/api/admin/auth` | Admin login |

---

## Feature Module Convention (Dashboard)

Each feature under `apps/dashboard/src/features/` follows this structure where applicable:

| Folder | Contents |
|--------|----------|
| `model/` | TypeScript types and Zod schemas |
| `routes/` | Route-level page components (default exports) |
| `context/` | React context providers and hooks |
| `utils/` | Pure utility functions |
| `components/` | Feature-specific UI components |
| `api/` | API call functions |
| `index.ts` | Barrel file — public API |

Only add folders that are actually used.

## Key Patterns (Dashboard)

- **Zod validation** — `safeParse()` with errors surfaced to UI
- **Schema-first modeling** — decks, sections, templates, financials are strongly typed before rendering
- **Collection IDs** — `crypto.randomUUID()` for client-side IDs
- **Async cleanup** — `useEffect` hooks use `let cancelled = false` cancellation flags
- **Export separation** — editor UI and PPTX/PDF generation are kept fully separate