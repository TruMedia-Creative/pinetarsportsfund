# Admin Dashboard Quick Start

This guide covers the admin area of the **Nuxt site** (`apps/site/`) at `/admin`.

## Logging In

1. Navigate to `http://localhost:3000/login`
2. Use the test credentials:
   - **Username**: `admin`
   - **Password**: `password`

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
