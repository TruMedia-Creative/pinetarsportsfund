# Architecture

This document covers architectural decisions and patterns for the Pine Tar Sports Fund monorepo.

The primary active application is **`apps/site/`** (`@pinetarsf/site`) — a Nuxt 4 site that serves both the public marketing pages and the investor deck system.

`apps/dashboard/` (the original React deck builder) has been archived. See [`apps/dashboard/ARCHIVED.md`](../apps/dashboard/ARCHIVED.md).

---

## Site Architecture (`apps/site/`)

### Overview

`apps/site/` is a Nuxt 4 + Vue 3 + TypeScript application with SSR. It serves:

- **Marketing home page** — hero, features, metrics, CTA
- **Deck listing** (`/decks`) — browse all publicly published offering decks
- **Deck detail** (`/decks/[slug]`) — view a single deck rendered as a full web page
- **No admin backend** — content editing is handled by Nuxt Studio (see below)

### Data Layer: YAML Files via @nuxt/content

All deck data lives in `content/decks/*.yml`. There is no database. Key properties:

- `content.config.ts` defines the `decks` collection schema using `@nuxt/content` v3 + Zod
- Each YAML file is one deck; the filename becomes the URL slug
- `published: boolean` gates public visibility — `published: false` decks return 404
- Git history serves as version history

Using `queryCollection('decks')` in pages to fetch deck data:

```ts
// Listing page — published only
const { data: decks } = await useAsyncData('decks', () =>
  queryCollection('decks').all()
)

// Detail page — by slug suffix
const { data: deck } = await useAsyncData(`deck-${slug}`, () =>
  queryCollection('decks').where('stem', 'LIKE', `%${slug}`).first()
)
```

### Content Editing: Nuxt Studio

`nuxt-studio` v1.6.0 provides a no-code CMS layer:

- **Dev**: floating Studio button in the bottom-right corner (auto-injected at `/_studio`)
- **Production**: accessible at `/admin` (configured via `studio.route`)
- Studio reads Zod schemas from `content.config.ts` and auto-generates form fields
- Saves are committed to GitHub (`TruMedia-Creative/pinetarsportsfund`, branch `main`, `rootDir: 'apps/site'`)
- Authentication: GitHub OAuth via `STUDIO_GITHUB_CLIENT_ID` / `STUDIO_GITHUB_CLIENT_SECRET` env vars

### Deck Rendering

Each deck page (`app/pages/decks/[slug].vue`) renders all 12 section components in fixed narrative order. Sections with `enabled: false` are skipped via `v-if`.

Components receive props directly from the YAML data via `v-bind`.

**Section order (fixed):**

```
cover → executiveSummary → investmentThesis → opportunity → market →
projectOverview → team → useOfFunds → returns → projections →
risksDisclaimer → closingCta
```

### Deck Section Components

12 globally registered Vue components live in `app/components/deck/`. They are registered via:

```ts
// nuxt.config.ts
components: [
  { path: '~/components/deck', global: true },
  '~/components'
]
```

Global registration makes them available in the Nuxt Studio component picker.

| Component | Section |
|-----------|---------|
| `DeckCover` | Hero, tagline, audience badge, contact info |
| `DeckExecutiveSummary` | Body prose + TOC + returns table |
| `DeckInvestmentThesis` | Body + checkmark bullet list |
| `DeckOpportunity` | Body + arrow bullets + optional image |
| `DeckMarket` | Body + 4-column metric grid |
| `DeckProjectOverview` | Body + image grid |
| `DeckTeam` | Avatar grid (initials fallback + imageUrl) |
| `DeckUseOfFunds` | Allocation table + highlights |
| `DeckReturns` | Key metrics + timeline + exit strategy |
| `DeckProjections` | Projection rows + metric highlights |
| `DeckRisksDisclaimer` | Warning icon bullets, amber styling |
| `DeckClosingCta` | Centered CTA + contact attribution |

### Schema Design

`content.config.ts` defines two collections:

- `content` (`source: 'index.yml'`, `type: 'page'`) — marketing home page
- `decks` (`source: 'decks/*.yml'`, `type: 'data'`) — one entry per deck

All 12 section schemas are composed from a shared `sectionBase` (`{ enabled: z.boolean().default(true) }`). Fields annotated with `.editor({ input: 'media' })` render as image pickers in Studio; `.editor({ input: 'textarea' })` render as multi-line text.

### App Modules

| Module | Version | Purpose |
|--------|---------|---------|
| `nuxt` | ^4.4.2 | Framework |
| `@nuxt/content` | ^3.12.0 | YAML collection + `queryCollection` |
| `@nuxt/ui` | ^4.6.1 | Component library (`UCard`, `UButton`, `UBadge`, etc.) |
| `nuxt-studio` | 1.6.0 | No-code CMS layer |
| `motion-v` | ^2.2.0 | Animation |
| `@vueuse/nuxt` | ^14.2.1 | Vue composable utilities |

### Brand

| Token | Value |
|-------|-------|
| `primary` | `red` |
| `warning` | `amber` |
| `neutral` | `zinc` |

Configured in `app/app.config.ts`.

### Routing

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `app/pages/index.vue` | Marketing home |
| `/decks` | `app/pages/decks/index.vue` | Published deck listing |
| `/decks/[slug]` | `app/pages/decks/[slug].vue` | Deck detail; 404 if unpublished |

### No Server Routes

`apps/site/` has no `server/` directory. All data comes from YAML files via `@nuxt/content`. There is no auth middleware, no API routes, and no database dependency.

