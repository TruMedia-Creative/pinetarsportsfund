# apps/dashboard — ARCHIVED

This app was the original React + Vite + TypeScript deck builder dashboard.

It has been superseded by the Nuxt Content + Nuxt Studio approach in `apps/site/`.

**What replaced it:**
- `apps/site/content/decks/*.yml` — deck content files (edited via Nuxt Studio)
- `apps/site/content.config.ts` — deck collection schema (auto-generates Studio forms)
- `apps/site/app/components/deck/` — 12 branded section components
- `apps/site/app/pages/decks/` — public deck listing and detail pages

**Retained for reference.** The PPTX generation logic in `src/lib/pptx/builders.ts` and the data models in `src/features/decks/model/` may be useful if PPTX export is ever re-added.

**Do not run** — dependencies may be outdated.
