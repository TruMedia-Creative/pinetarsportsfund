# Architecture Overview — Pine Tar Sports Fund

> **Scope**: Full codebase · **Depth**: Overview · **Generated**: 2026-05-04

---

## 1. Purpose & Context

Pine Tar Sports Fund is a **marketing and investor-relations web application** for a sports-focused private investment fund. Its primary function is to present investment opportunities — called *decks* — to qualified accredited investors, lenders, and sponsors. Content is managed via a gated CMS overlay (Nuxt Studio) without requiring a separate database or backend service.

---

## 2. System Overview

```mermaid src="./diagrams/system-overview.mmd" alt="Pine Tar Sports Fund system overview"```

### Major Subsystems

| Subsystem | Technology | Role |
|-----------|-----------|------|
| **Frontend / Pages** | Nuxt 4 (App Router), Vue 3 | Renders all public-facing pages and the admin login |
| **Content Layer** | `@nuxt/content` v3 + Zod | Validates and queries YAML investment decks at build time via SQLite |
| **Deck Component System** | Vue SFCs — globally registered | Renders each section of an investment deck from structured content data |
| **Auth Layer** | Nitro API routes + h3 `useSession` | Guards Nuxt Studio access with a username/password flow and encrypted session cookie |
| **CMS Overlay** | `nuxt-studio` | Visual editor that pushes content commits to GitHub via a PAT |
| **Deployment** | Vercel (static output + serverless functions) | Hosts pre-rendered pages with immutable asset caching |

---

## 3. Page & Route Inventory

| Route | Rendering | Description |
|-------|-----------|-------------|
| `/` | SSG (pre-rendered) | Homepage — hero, about, narrative sections, how-it-works |
| `/investments` | SSG | Listing of published investment decks |
| `/investments/[slug]` | SSG (one per YAML file) | Full investment deck rendered from YAML content |
| `/admin` | Client-only (`layout: false`) | Username/password login for Nuxt Studio access |
| `/logout` | Client-only | Clears the studio-session cookie and redirects |
| `/studio-instructions` | Protected (studio-auth middleware) | Instructions page for content editors |
| `/_studio-auth` | Internal | Nuxt Studio's OAuth fallback route |

### Route Generation at Build Time

`nuxt.config.ts` reads `content/investments/*.yml` at build time via Node `readdirSync` and registers each YAML file as a pre-rendered static route. New deck files are automatically discovered on the next deploy with no config change required.

---

## 4. Content Architecture

```mermaid src="./diagrams/deck-data-flow.mmd" alt="Investment deck data flow"```

### Data Flow — Investment Deck

1. **Author** edits `content/investments/<slug>.yml` (directly or via Nuxt Studio).
2. `content.config.ts` defines a Zod collection schema (`investments`) with typed sub-schemas for every deck section.
3. At build time, `@nuxt/content` validates every YAML file against the schema and writes the collection to a local SQLite database (`.data/`).
4. `pages/investments/[slug].vue` queries the collection via `queryCollection('investments').where('stem', '=', ...)` inside `useAsyncData`. If `published !== true`, a 404 is thrown.
5. The page passes top-level fields as props to globally registered `Deck*` components, rendering sections in a fixed narrative order.

### Content Collections

| Collection | Source Glob | Key Fields |
|------------|-------------|------------|
| `investments` | `content/investments/*.yml` | `title`, `subtitle`, `projectName`, `audienceType`, `published`, section objects |
| `homepage` (inferred) | `content/index.yml` | `hero`, `logos`, `about`, `narrative`, `mechanism`, `process` sections |

### `published` Flag

The `published` boolean is the sole access-control gate for public visitors. Drafts can be committed and deployed without being visible; the `/investments` index page filters to `published === true` and the slug page throws a 404 for unpublished decks.

---

## 5. Auth Architecture

```mermaid src="./diagrams/auth-flow.mmd" alt="Studio authentication flow"```

### API Contracts

| Endpoint | Method | Request Body | Success Response | Error Responses |
|----------|--------|-------------|-----------------|-----------------|
| `/api/__studio/auth/login` | `POST` | `{ username, password }` | `200 { ok: true }` + sets `studio-session` cookie | `401 Unauthorized`, `429 Too Many Requests` |
| `/api/__studio/auth/status` | `GET` | — (reads cookie) | `{ authenticated: boolean }` | `200 { authenticated: false }` on error |
| `/api/__studio/auth/logout` | `POST` | — (reads cookie) | `{ ok: true }` + clears cookie | — |

### Security Controls

| Control | Implementation |
|---------|---------------|
| Rate limiting | In-memory per-IP map, max 5 attempts per 15-minute window → 429 |
| Credential storage | `NUXT_ADMIN_USERNAME` / `NUXT_ADMIN_PASSWORD` env vars only |
| Session encryption | `h3 useSession` with `studio.auth.sessionSecret`; cookie scoped to `path=/` |
| Studio git writes | `STUDIO_GITHUB_TOKEN` env var (GitHub PAT) — never exposed to browser |

### Middleware

`app/middleware/studio-auth.ts` runs on both server and client sides. It calls `/api/__studio/auth/status`; any non-authenticated request to a guarded route is redirected to `/admin`.

---

## 6. Deployment Architecture

| Concern | Configuration |
|---------|--------------|
| **Framework** | `vercel.json` → `framework: nuxtjs`, build: `nuxi build`, output: `.output/public` |
| **Install** | `pnpm install --frozen-lockfile` |
| **Static asset caching** | `/_nuxt/(.*)` → `Cache-Control: public, max-age=31536000, immutable` |
| **Security headers** | All routes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` |
| **Payload extraction** | Disabled (`payloadExtraction: false`) to avoid hydration issues with the content layer |
| **Pre-rendered routes** | `/`, `/investments`, all `/investments/:slug` routes; `crawlLinks: false` (explicit list only) |

---

## 7. Frontend Shell

### `app.vue` — Root Layout

- Wraps all pages in `<UApp>` (Nuxt UI).
- Applies a global `investor-site-pattern` background on all non-homepage routes.
- Injects `AppHeader` and `AppFooter` globally.
- Sets global `<head>` meta: viewport, theme-color (reactive to dark/light mode), Google Fonts preconnect, favicon set, PWA web manifest.

### Routing & Scroll Behavior

`app/router.options.ts` implements custom scroll restoration:

- Hash-target navigation polls the DOM for the target element for up to 20 animation frames.
- Respects `prefers-reduced-motion` — uses `'auto'` scroll behavior instead of `'smooth'` when set.

---

## 8. Deck Component System

All components in `app/components/deck/` are registered globally (via `nuxt.config.ts`) so the Nuxt Studio component picker can discover them.

| Component | Deck Section |
|-----------|-------------|
| `DeckCover` | Hero/cover slide with tagline and contact info |
| `DeckExecutiveSummary` | Summary stats, table of contents, returns table |
| `DeckInvestmentThesis` | Thesis body and bullet points |
| `DeckMarket` | Market context narrative |
| `DeckOpportunity` | Opportunity overview |
| `DeckProjectOverview` | Specific project details |
| `DeckTeam` | Team member profiles |
| `DeckUseOfFunds` | Capital allocation breakdown |
| `DeckReturns` | Returns and timeline |
| `DeckProjections` | Financial projections |
| `DeckRisksDisclaimer` | Legal risk disclosures |
| `DeckClosingCta` | Call-to-action / next steps |
| `DeckSectionShell` | Shared layout wrapper for section containers |

Each section is independently `enabled` via YAML — a section with `enabled: false` is not rendered.

---

## 9. Key Dependencies

| Package | Role |
|---------|------|
| `@nuxt/ui` v4 | Component library (UApp, UButton, UPageHero, etc.) |
| `@nuxt/content` v3 | YAML → SQLite content pipeline with typed collections |
| `nuxt-studio` | Visual CMS overlay that writes back to git |
| `gsap` + `ScrollTrigger` | Homepage immersive scroll animations (pre-bundled via Vite `optimizeDeps`) |
| `motion-v` | Vue animation primitives (Nuxt module) |
| `@nuxtjs/seo` + `nuxt-og-image` | SEO meta and OG image generation (`zeroRuntime: true`) |
| `better-sqlite3` | Runtime SQLite driver for `@nuxt/content` |
| `@vercel/analytics` | Client-side analytics beacon |
| `h3` | HTTP framework underlying Nitro API routes |

---

## 10. Testing

| Layer | Tool | Location |
|-------|------|----------|
| E2E — navigation & scroll | Playwright | [e2e/navigation-scroll.spec.ts](../e2e/navigation-scroll.spec.ts) |
| E2E — pitch deck creation flow | Playwright | [e2e/pitch-deck-creation.spec.ts](../e2e/pitch-deck-creation.spec.ts) |

Tests run against a live dev or preview server. The `check` script (`pnpm lint && pnpm typecheck && pnpm test:e2e`) is the full quality gate before merge.

---

## 11. Gaps & Open Questions

| # | Area | Gap |
|---|------|-----|
| G1 | **Rate limiter persistence** | The in-memory rate limiter resets on cold-start. Under Vercel serverless (ephemeral functions), each invocation may get a fresh in-memory store, effectively providing no brute-force protection. A Redis or Vercel KV–backed limiter is needed for production hardening. |
| G2 | **Session secret at runtime** | The source of `studio.auth.sessionSecret` is not visible in `.env.example`. If unset or empty, `h3 useSession` may produce unsigned/unencrypted sessions. |
| G3 | **Per-deck OG images** | `nuxt-og-image` is installed with `zeroRuntime: true` but no per-deck OG template was observed. Deck pages likely fall back to the global `/og-image.png`. |
| G4 | **`published` bypass in Studio preview** | Studio real-time preview explicitly bypasses the `published` filter (noted in source). If an unauthorized user gains Studio access, all draft decks are readable. |
| G5 | **Single admin credential** | There is one shared username/password for all Studio editors. No per-user audit trail or access revocation is possible without a credential change. |

---

<small>Generated with GitHub Copilot as directed by Larry Ontruman</small>
