# Pine Tar Sports Fund — Nuxt Site (`apps/site/`)

The active application. Nuxt 4 + Vue 3 + TypeScript with SSR. Serves the public marketing pages and all investor deck pages. Content is edited no-code via Nuxt Studio.

## Features

- **Home Page** (`/`) — Pine Tar Sports Fund marketing content (hero, features, metrics, CTA)
- **Deck Listing** (`/decks`) — browse all publicly published offering decks
- **Deck Detail** (`/decks/[slug]`) — view a single deck rendered as a web page
- **Nuxt Studio** (`/admin` in production, `/_studio` in dev) — no-code CMS for editing YAML content

## Getting Started

From the **repo root**:

```sh
nvm use
pnpm setup        # corepack enable && pnpm install --frozen-lockfile
pnpm dev          # starts Nuxt dev server at http://localhost:3000
```

Or from `apps/site/` directly:

```sh
pnpm dev          # nuxt dev
pnpm build        # nuxt build
pnpm preview      # nuxt preview
pnpm typecheck    # nuxt typecheck
pnpm lint         # eslint .
```

## Project Structure

All paths below are relative to `apps/site/`.

```
nuxt.config.ts           # Nuxt config — modules, Studio, global deck components
content.config.ts        # @nuxt/content Zod schemas — drives Studio auto-forms
app.config.ts            # UI theme tokens (primary: red, warning: amber, neutral: zinc)

content/
├── index.yml            # Marketing home page data
└── decks/               # One YAML file per offering deck
    ├── q2-2026-investor.yml
    └── spring-2026-sponsor.yml

app/
├── app.vue              # Root component
├── assets/css/main.css  # Global styles (Tailwind v4)
├── components/
│   ├── AppHeader.vue    # Navigation (About, Offerings, Decks | Contact + View Decks CTA)
│   ├── AppFooter.vue    # Footer with Pine Tar brand copy
│   ├── AppLogo.vue
│   ├── GradientGlow.vue
│   ├── HeroShaders.client.vue
│   ├── HeroTerminal.vue
│   └── deck/            # 12 globally registered deck section components
│       ├── DeckCover.vue
│       ├── DeckExecutiveSummary.vue
│       ├── DeckInvestmentThesis.vue
│       ├── DeckOpportunity.vue
│       ├── DeckMarket.vue
│       ├── DeckProjectOverview.vue
│       ├── DeckTeam.vue
│       ├── DeckUseOfFunds.vue
│       ├── DeckReturns.vue
│       ├── DeckProjections.vue
│       ├── DeckRisksDisclaimer.vue
│       └── DeckClosingCta.vue
└── pages/
    ├── index.vue        # / — Marketing home
    └── decks/
        ├── index.vue    # /decks — Published deck listing
        └── [slug].vue   # /decks/:slug — Deck detail; 404 if unpublished
```

## Data Layer

All content lives in YAML files. There is no database, no server routes, and no auth middleware.

- `content/index.yml` — marketing home page content
- `content/decks/*.yml` — one file per offering deck
- `content.config.ts` — Zod schemas for both collections; `@nuxt/content` v3 validates on read
- `queryCollection('decks')` fetches from the YAML files at request time

Setting `published: false` in a deck file causes `[slug].vue` to throw a 404 for public requests.

## Modules

| Module | Version | Purpose |
|--------|---------|---------|
| `@nuxt/content` | ^3.12.0 | YAML collection + `queryCollection` composable |
| `@nuxt/ui` | ^4.6.1 | Component library (UCard, UButton, UBadge, UPageHero, etc.) |
| `nuxt-studio` | 1.6.0 | No-code CMS — auto-forms from Zod schemas, commits to GitHub |
| `motion-v` | ^2.2.0 | Animation (home page hero) |
| `@vueuse/nuxt` | ^14.2.1 | Vue composable utilities |
| `@nuxt/eslint` | ^1.15.2 | ESLint config with stylistic rules |

## Nuxt Studio Setup

Studio reads schemas from `content.config.ts` and generates form fields automatically.

**Dev**: floating button at `/_studio` (auto-injected when `nuxt-studio` is installed)

**Production**: available at `/admin` (set via `studio.route` in `nuxt.config.ts`)

Studio config in `nuxt.config.ts`:

```ts
studio: {
  route: '/admin',
  repository: {
    provider: 'github',
    owner: 'TruMedia-Creative',
    repo: 'pinetarsportsfund',
    branch: 'main',
    rootDir: 'apps/site'   // monorepo: content root inside apps/site/
  }
}
```

**Required env vars for production:**

```
STUDIO_GITHUB_CLIENT_ID=...
STUDIO_GITHUB_CLIENT_SECRET=...
```

## Validation

All deck data is validated automatically by `@nuxt/content` against the Zod schemas in `content.config.ts`. No manual validation step is needed.

TypeScript: `pnpm typecheck` (runs `nuxt typecheck`).

## Further Reading

- [README.md](./README.md) — monorepo overview and scripts
- [ProjectLayout.md](./ProjectLayout.md) — full directory map
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) — content editing quick-start
- [docs/architecture.md](./docs/architecture.md) — architecture decisions


## Getting Started

From the **repo root**:

```sh
nvm use
pnpm setup        # corepack enable && pnpm install --frozen-lockfile
pnpm dev:site     # starts Nuxt dev server at http://localhost:3000
```

Or from `apps/site/` directly:

```sh
pnpm dev          # nuxi dev
pnpm build        # nuxi build
pnpm preview      # nuxi preview
pnpm typecheck    # nuxi typecheck
pnpm lint         # eslint
```

Admin login: `admin` / `password` (demo credentials — change before production)

## Project Structure

All paths below are relative to `apps/site/`.

```
nuxt.config.ts           # Nuxt configuration (modules, Tailwind, SSR, image)
app.vue                  # Root component

assets/
└── css/main.css         # Global styles (Tailwind v4 + custom)

components/
├── layout/
│   ├── Header.vue       # Site navigation header
│   └── Footer.vue       # Site footer
└── ui/                  # Shared UI primitives

composables/
├── useAuth.ts           # Auth state — login(), logout(), checkAuth()
├── useDeck.ts           # Deck CRUD operations against server API
├── usePublishedDecks.ts # Investment gallery data
└── usePageSeo.ts        # Per-page SEO via useHead()

layouts/
├── default.vue          # Public site layout
├── admin.vue            # Admin area layout (with sidebar nav)
└── blank.vue            # Bare layout (login page, etc.)

lib/
├── schemas/index.ts     # Shared Zod validation schemas
└── types/models.ts      # Shared TypeScript types (Deck, Asset, etc.)

pages/                   # File-based routing
├── index.vue            # /           — Home
├── about.vue            # /about
├── contact.vue          # /contact
├── login.vue            # /login
├── investments/
│   ├── index.vue        # /investments       — Gallery
│   └── [slug].vue       # /investments/:slug — Detail
└── admin/
    ├── index.vue        # /admin             — Dashboard
    ├── assets.vue       # /admin/assets
    ├── settings.vue     # /admin/settings
    └── decks/
        ├── index.vue    # /admin/decks
        ├── new.vue      # /admin/decks/new
        └── [id]/        # /admin/decks/:id   — Edit

server/
├── middleware/auth.ts   # Protects /admin routes
├── utils/mockStore.ts   # In-memory mock data store
└── routes/api/
    ├── decks.get.ts               # GET  /api/decks
    ├── decks/[id].get.ts          # GET  /api/decks/:id
    ├── contact.post.ts            # POST /api/contact
    └── admin/
        ├── stats.get.ts           # GET    /api/admin/stats
        ├── decks.get.ts           # GET    /api/admin/decks
        ├── decks.post.ts          # POST   /api/admin/decks
        ├── decks/[id].get.ts      # GET    /api/admin/decks/:id
        ├── decks/[id].put.ts      # PUT    /api/admin/decks/:id
        ├── decks/[id].delete.ts   # DELETE /api/admin/decks/:id
        ├── assets.get.ts          # GET    /api/admin/assets
        ├── assets.post.ts         # POST   /api/admin/assets
        ├── assets/                # DELETE /api/admin/assets/:id
        └── auth/
            ├── logout.post.ts     # POST /api/admin/auth/logout
            └── me.get.ts          # GET  /api/admin/auth/me
```

## Authentication

The admin area is protected by `server/middleware/auth.ts`. Login sends credentials to `POST /api/admin/auth`.

The `useAuth` composable manages client-side auth state.

**Default credentials (demo only):** `admin` / `password`

For production, update the login handler in `server/routes/api/admin/auth/auth.post.ts`, add password hashing (bcrypt), and implement proper session/JWT management.

## Data Layer

The site uses an in-memory mock store (`server/utils/mockStore.ts`) initialized at server start. There is no external database dependency in the current setup.

The store holds decks, assets, and user data in memory. Data does not persist across server restarts.

## Modules

| Module | Purpose |
|--------|---------|
| `@nuxt/ui` | Pre-built Vue components |
| `@nuxt/content` | Markdown/JSON content (reserved) |
| `@nuxt/image` | Responsive image optimization |
| `@nuxt/icon` | Icon library |

## Validation

- **Zod** schemas in `lib/schemas/index.ts` for all data validation
- **VeeValidate** for client-side form validation
- TypeScript throughout

## Currently Implemented

- Basic deck CRUD via admin pages and API routes
- Published deck gallery (`/investments`)
- Asset management (`/admin/assets`)
- Admin auth middleware
- Contact form (submission only — email delivery not wired)

## Not Yet Implemented

- Email delivery for the contact form
- PPTX export (lives in `apps/dashboard/` — see the React dashboard)
- File uploads (assets registered by URL only)
- Password hashing (bcrypt)
- Full JWT implementation
- Persistent database

## Further Reading

- [README.md](./README.md) — monorepo overview
- [ProjectLayout.md](./ProjectLayout.md) — full directory map
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) — admin quick-start
