# Copilot Instructions — Pine Tar Sports Fund Deck Builder

## Product context
This is a deck-building web app for Pine Tar Sports Fund and related investment offerings.
Core flow:
1) User signs in
2) User creates or edits a deck via structured forms
3) App assembles branded slide content from reusable sections and templates
4) User previews the deck in-browser and exports deliverables such as PPTX and PDF
5) Admin dashboard manages brand settings, templates, default content blocks, and deck records

Primary use cases:
- Investor pitch decks
- Sponsorship decks
- Lender / financing decks
- Municipality / partnership decks
- Project-specific investment summaries

## Non-goals (for now)
- No public event landing pages
- No ticketing, livestreaming, or speaker/session management
- No highly dynamic slide canvas editor like PowerPoint or Canva
- No heavy back-end assumptions unless explicitly requested
- No AI-generated financial assumptions unless explicitly requested

## Tech constraints
- Vite + React + TypeScript
- React Router for routing
- Zod for validation
- Prefer composition over inheritance
- Keep modules local-first: clean boundaries so backend can be swapped later
- Keep export logic isolated from form/editor logic

## Architecture rules
- Use feature-first modules under `src/features/*`
- Keep shared utilities in `src/lib/*`
- Keep pure UI components in `src/components/ui/*`
- Keep app-shell/layout pieces in `src/components/layout/*`
- Each feature should have only the folders it actually needs, but when applicable use:
  - `components/`
  - `api/`
  - `model/` (types + zod schemas)
  - `routes/` (route-level pages)
  - `utils/`
  - `index.ts` exports

## Domain model assumptions

### Brand model
Branding is app-scoped for Pine Tar Sports Fund, but should be structured so additional brands or sub-brands can be supported later.

Typical fields:
- `id`
- `name`
- `logoUrl`
- `primaryColor`
- `accentColor`
- `fontFamily`
- `contactInfo`
- `legalDisclaimer`
- `defaultDeckTheme`

### Deck model
- `DeckStatus`: `draft | ready | exported | archived`
- Typical fields:
  - `id`
  - `title`
  - `slug`
  - `audienceType` (`investor | lender | sponsor | municipality | internal`)
  - `status`
  - `templateId`
  - `projectName`
  - `subtitle?`
  - `summary?`
  - `sections`
  - `assetIds`
  - `financialModelId?`
  - `updatedAt`
  - `createdAt`

### Section model
Deck sections should be structured, reorderable, and typed.

Examples:
- cover
- executive summary
- investment thesis
- opportunity
- market
- project overview
- team
- use of funds
- returns
- projections
- risks / disclaimer
- closing / CTA

Each section should generally include:
- `id`
- `type`
- `title`
- `isEnabled`
- `sortOrder`
- `content`

### Template model
Templates define the layout and content expectations for deck sections.

Typical fields:
- `id`
- `name`
- `description`
- `supportedAudienceTypes`
- `sectionDefinitions`
- `themeOverrides?`

### Asset model
Assets represent uploaded or linked media used in decks.

Typical fields:
- `id`
- `name`
- `type` (`image | chart | logo | headshot | rendering | document`)
- `url`
- `alt?`
- `tags?`

### Financial model
Financial data should be modeled separately from general deck metadata.

Typical fields:
- `id`
- `projectName`
- `minimumInvestment?`
- `targetRaise?`
- `preferredReturn?`
- `equityStructure?`
- `useOfFunds`
- `forecastRows`
- `assumptions`
- `notes?`

## Routing assumptions
Expected route patterns:
- `/login`
- `/`
- `/decks`
- `/decks/new`
- `/decks/:deckId/edit`
- `/decks/:deckId/preview`
- `/exports/:deckId`
- `/admin`
- `/settings`

Public share routes can be added later, but should not drive the architecture.

## Coding style
- Prefer small, testable functions and explicit types
- No implicit `any`
- Use named exports for utilities, default exports for route components only
- Use `async/await`, never mix with `.then()` chains
- Avoid global state unless necessary
- Favor schema-first modeling before UI expansion
- Prefer deterministic transformations from structured data to deck output

## Output expectations from Copilot
When generating code:
- Include TypeScript types and Zod schemas where applicable
- Include minimal UI scaffolding to demonstrate flow
- Provide realistic placeholder data for mock APIs when backend is not present
- Keep deck editing logic separate from deck export logic
- Prefer reusable section/template abstractions over hardcoding one-off slides
- Keep financial calculations explicit and inspectable

## Export guidance
This project is fundamentally a document/deck generation app, not just a CRUD dashboard.

When implementing export features:
- Treat PPTX/PDF generation as a dedicated layer
- Keep mapping from app data → deck sections → output files explicit
- Avoid burying export logic inside React components
- Prefer helpers/builders under `src/lib/pptx/*` or feature-level export utilities
- Preserve ordering and enable/disable behavior for sections

## Mock data and local-first behavior
Until a real backend exists:
- Use localStorage-backed mock APIs under `src/lib/api/mock/*`
- Seed realistic Pine Tar Sports Fund example data
- Keep CRUD interfaces stable so the mock layer can later be replaced
- Do not assume network persistence unless explicitly requested

## Security + privacy
- Do not log sensitive investment or user data unnecessarily
- Treat financial assumptions and investor-facing content as sensitive business data
- Sanitize user-provided URLs and uploaded asset references
- Keep export filenames and identifiers predictable but non-sensitive

## Testing guidance (optional)
- If tests are requested, use Vitest + React Testing Library
- Focus tests first on:
  - Zod validation
  - deck section ordering
  - financial model normalization
  - export mapping helpers
  - asset URL sanitization

## Toolchain + bootstrap
- Node version is pinned in `.nvmrc` (currently `22`). Use `nvm use` or the version from that file.
- pnpm is the primary and CI-supported package manager. npm may work but is not guaranteed; prefer pnpm and do **not** use yarn.
- pnpm is activated via Corepack — never install it globally with npm.
- All commands should be run from the **repo root**.

### Standard agent sequence
```sh
# 1. Install (only needed once, or after lockfile changes)
pnpm bootstrap   # runs: corepack enable && pnpm install --frozen-lockfile

# 2. Validate (lint + typecheck + build)
pnpm check       # runs: pnpm lint && pnpm typecheck && pnpm build
```

### Performance tips
- Skip `pnpm bootstrap` if `node_modules` is already up-to-date (lockfile unchanged).
- Prefer `pnpm lint` / `pnpm typecheck` / `pnpm build` individually when only one check is needed.