# Admin / Content Editing Guide

Deck content is edited via **Nuxt Studio** — a no-code CMS that auto-generates forms from the Zod schemas in `content.config.ts` and commits changes directly to GitHub.

There is no separate login flow or admin database. Authentication is handled by GitHub OAuth.

---

## Accessing the Editor

### Development

1. Run `pnpm dev` from the repo root (or `apps/site/`)
2. A floating Studio button appears in the bottom-right corner of the browser
3. Click it to open the Studio editor panel, or go to `http://localhost:3000/_studio`

### Production

The Studio editor is available at `/admin` (e.g. `https://pinetarsportsfund.com/admin`).

You will be prompted to authenticate with GitHub. Only users with write access to the `TruMedia-Creative/pinetarsportsfund` repository can edit content.

Required env vars for production Studio auth:

```
STUDIO_GITHUB_CLIENT_ID=...
STUDIO_GITHUB_CLIENT_SECRET=...
```

---

## Creating a New Deck

### Option A — Nuxt Studio (no-code)

1. Open Studio (floating button in dev, or `/admin` in production)
2. Navigate to **Content → decks**
3. Click **New file** and enter a slug (e.g. `fall-2026-investor`)
4. Fill in the auto-generated form fields for each section
5. Set `published` to `false` while drafting
6. When ready, toggle `published` to `true` — Studio commits the YAML to GitHub and the deck goes live at `/decks/fall-2026-investor`

### Option B — YAML file directly

1. Create a file in `apps/site/content/decks/`:
   ```sh
   cp apps/site/content/decks/q2-2026-investor.yml apps/site/content/decks/my-new-deck.yml
   ```
2. Edit the YAML — the filename becomes the URL slug
3. Set `published: false` until ready
4. Commit and push — the deck is live once `published: true`

Minimum required fields:

```yaml
title: "My Deck Title"
subtitle: "Optional subtitle"
projectName: "Project Name"
audienceType: investor   # investor | lender | sponsor | municipality | internal
published: false
```

---

## Managing Deck Sections

Each deck has 12 named sections. Sections are rendered in fixed narrative order on the deck page.

To **hide a section** for a specific deck, set `enabled: false`:

```yaml
investmentThesis:
  enabled: false
```

To **show a section**, either omit `enabled` (defaults to `true`) or set it to `true`.

The `cover` section has no `enabled` toggle — it is always displayed.

### Section order

1. Cover
2. Executive Summary
3. Investment Thesis
4. Opportunity
5. Market
6. Project Overview
7. Team
8. Use of Funds
9. Returns
10. Projections
11. Risks / Disclaimer
12. Closing / CTA

---

## Publishing and Unpublishing

Set `published: true` in the YAML (via Studio or directly) to make a deck visible at `/decks/[slug]`.

Set `published: false` to hide it — public visitors will receive a 404. Studio preview bypasses the published check so you can review a draft before publishing.

---

## Deck Audience Types

| Value | Description |
|-------|-------------|
| `investor` | Preferred equity / investment offering |
| `lender` | Debt / financing offering |
| `sponsor` | Naming rights, branding, sponsorship |
| `municipality` | Government / community partnership |
| `internal` | Internal reference or working draft |

The audience type displays as a badge on the deck listing and detail pages.

---

## Working with Media

Image URL fields in Studio render a media picker. You can paste any publicly accessible image URL (CDN, S3, etc.).

All image fields in `content.config.ts` are annotated with `.editor({ input: 'media' })` which activates the Studio media picker widget.

---

## Tips

- Keep `published: false` while writing — no one can see it until you flip it
- Use the `subtitle` field for a 1–2 sentence teaser that appears on the deck listing card
- The `projectName` field appears as a monospace label on deck cards
- Section `body` fields support multiple paragraphs — use Studio's textarea or write multiline YAML strings
- Git history is your version history — every Studio save is a GitHub commit


## Dashboard Overview

The admin area lives at `/admin` and is protected by auth middleware (`apps/site/server/middleware/auth.ts`).

### Home Dashboard (`/admin`)
The main dashboard shows key statistics:
- Total Decks
- Published Decks
- Draft Decks
- Total Assets

### Manage Decks

#### Creating a Deck
1. Go to Admin → Decks → New (`/admin/decks/new`)
2. Enter a title and description
3. Save — you'll be taken to the edit page

#### Editing a Deck
1. Go to Admin → Decks (`/admin/decks`)
2. Click "Edit" on any deck
3. Modify the deck:
   - **Status**: Change deck stage (draft → ready → exported)
   - **Published**: Toggle to publish/unpublish
   - **Summary**: Add marketing summary (visible on public page when published)
4. Save changes

#### Publishing a Deck
1. Open a deck for editing
2. Check the "Published" checkbox
3. Fill in marketing metadata:
   - **Summary**: Brief description for the gallery
   - **Tags**: Categories (investor, lender, sponsor, etc.)
   - **Expiration**: When the opportunity closes
4. Save — the deck will appear in the public Investment Gallery at `/investments`

#### Deleting a Deck
1. Go to Admin → Decks
2. Click "Delete" on the deck and confirm

### Managing Assets

#### Uploading Assets
1. Go to Admin → Assets (`/admin/assets`)
2. Fill in the upload form:
   - **Asset Name**: Friendly name
   - **Type**: `image | chart | logo | headshot | document | rendering`
   - **URL**: Link to the file (can be external)
3. Click "Upload Asset"

#### Deleting Assets
1. Go to Admin → Assets
2. Click "Delete" — note that existing deck references may break

### Settings (`/admin/settings`)
- Account: email and password
- Site: site name, site URL, support email

## Common Tasks

### Create an Investment Opportunity Deck

1. Go to Admin → Decks → New
2. Enter project name (e.g. "Real Estate Investment - Downtown Development")
3. Build sections — cover, executive summary, opportunity, financials, use of funds
4. Upload assets — property images, financial charts, team photos (Admin → Assets)
5. Fill in marketing metadata (summary, tags, expiration)
6. Publish — deck appears in the Investment Gallery at `/investments`
7. Share the direct link: `/investments/[deck-slug]`

### Export a Deck as PowerPoint

> PPTX export is implemented in the **React dashboard** (`apps/dashboard/`), not the Nuxt site.
> Run `pnpm dev:dashboard` to access the full deck builder with export functionality.

## Tips & Best Practices

**Do:**
- Use clear, descriptive deck titles
- Publish only when a deck is ready for investor review
- Upload high-quality images
- Keep summaries concise (2–3 sentences)
- Set realistic expiration dates

**Don't:**
- Leave draft decks published unintentionally
- Delete assets that are still in use
- Use low-resolution images

## Troubleshooting

**Can't log in** — check credentials, clear browser cookies, restart the dev server

**Changes not saving** — check browser console for errors, refresh the page

**Can't see published decks in gallery** — confirm "Published" is checked, check `/investments` after refresh

**Assets not loading** — verify the URL is correct and publicly accessible

## Security Notes

This is a demo / development setup. For production:

1. **Change default credentials** — update or replace `apps/site/server/routes/api/admin/auth.post.ts`
2. **Add password hashing** — bcrypt for stored passwords
3. **Implement proper JWT** with expiration and refresh tokens
4. **Enable HTTPS** — SSL certificates, secure cookies, proper CORS
5. **Database** — move to a persistent database with access controls and backups

## Further Reading

- [README.md](./README.md) — monorepo overview and scripts
- [ProjectLayout.md](./ProjectLayout.md) — full directory structure
- [docs/architecture.md](./docs/architecture.md) — architecture decisions
