# Pine Tar Sports Fund

Marketing site and investor deck platform for Pine Tar Sports Fund. Built with [Nuxt 4](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com), and [Nuxt Studio](https://nuxt.studio) for no-code content editing.

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in the values (see [Environment Variables](#environment-variables) below).

## Development

```bash
pnpm dev          # http://localhost:3000
```

In development the Studio editor appears as a floating button — no login required.

## Homepage Media Assets

The homepage hero preview and primary profile portrait now use pre-generated responsive assets from `public/homepage/`.

If you replace `public/index.png` or `public/tim-headshot.jpg`, regenerate the matching JPG and WebP derivatives in `public/homepage/` so the homepage keeps its reduced payload and responsive image behavior.

## Production

```bash
pnpm build
pnpm preview      # local preview of the production build
```

Deployed on **Vercel**. Push to `main` to trigger a deploy.

Vercel Web Analytics is wired through `@vercel/analytics`. After deployment, enable **Analytics** for the project in the Vercel dashboard to start collecting page views and visitors.

## Content Editing (Nuxt Studio)

All content lives in YAML files under `content/`. Nuxt Studio provides a visual editor that commits changes directly to GitHub.

### Investment Content Editing FAQ

If you are editing an investment page in Studio and need field-level guidance quickly:

1. How do I add a photo when replacing an image URL?
	Edit the image field directly in the entry. Common fields are `cover.heroImageUrl`, `sectionImage.url`, `projectOverview.images[].url`, and `team.members[].imageUrl`. These use Studio media input and typically store project-relative paths like `/howe-phases.png`.

2. How do I edit bullets like Proven Phase I, Anchor Tenant, Scarcity Value, and Experienced Operator?
	Edit `investmentThesis.bullets`. If you are updating bullets in the Phases section, edit `opportunity.bullets`.

3. How do I edit content under phases?
	Edit `returns.timelineItems[].phase` for timeline phase labels. Edit `opportunity.body` and `projectOverview.body` for phase narrative text.

4. Where is the edit info for Dugout Howe Complex Phase II consists of ...?
	That text is in `projectOverview.body`, not in Phase I budget fields.

For the full walkthrough, open the in-app Studio Guide at `/studio-instructions` after logging in at `/admin`.

### Admin Login

Visit **`/admin`** to sign in with the credentials set via `NUXT_ADMIN_USERNAME` and `NUXT_ADMIN_PASSWORD` environment variables. After login, the Studio editor overlay appears on every page and the header switches to Studio actions with links to the Studio guide and logout.

Visit **`/logout`** to clear the Studio session cookie and return to the login flow.

### How it works

1. `/admin` shows a simple username/password form (no OAuth setup needed).
2. On successful login a signed session cookie is set that the Studio client-side plugin recognises.
3. `/logout` clears that same signed session cookie when editing is finished.
4. Studio uses `STUDIO_GITHUB_TOKEN` (a GitHub PAT) to push content changes to the repository.

### Keyboard shortcut

Press **⌘.** (Cmd + period) on any page to jump to the login screen.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `STUDIO_GITHUB_TOKEN` | **Yes** (prod) | GitHub Personal Access Token with `repo` scope. Studio uses this to push content commits. |
| `NUXT_ADMIN_USERNAME` | **Yes** (prod) | Username for the `/admin` login page. |
| `NUXT_ADMIN_PASSWORD` | **Yes** (prod) | Password for the `/admin` login page. Use a strong, unique value. |
| `NUXT_SITE_URL` | No | Canonical site URL used for sitemap, robots, canonical tags, and absolute OG image URLs. |
| `SITE_URL` | No | Legacy fallback for canonical site URL. Prefer `NUXT_SITE_URL`. |

On Vercel, set these under **Settings → Environment Variables**. The repository connection (`VERCEL_GIT_*`) is handled automatically by Vercel.

The production SEO setup exposes `sitemap.xml` and `robots.txt`, and public pages use the shared `/public/og-image.png` asset for Open Graph previews.

## Renovate

Install the [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository for automated dependency updates.
