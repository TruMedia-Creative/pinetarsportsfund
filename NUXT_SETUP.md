# Pine Tar Sports Fund — Nuxt Site (`apps/site/`)

The public-facing marketing site and investment gallery. Built with Nuxt 4 + Vue 3 + TypeScript, SSR-enabled.

## Features

- **Home Page** — hero section and marketing content
- **Investment Gallery** (`/investments`) — browse published decks
- **Investment Detail** (`/investments/[slug]`) — view a single deck
- **About & Contact** — informational pages with contact form
- **Admin Area** (`/admin`) — deck management, asset library, settings
- **Login** (`/login`) — admin authentication

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
