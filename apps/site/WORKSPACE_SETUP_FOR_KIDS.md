# How This Website Workspace Is Set Up (For a 10-Year-Old)

Think of this folder like a big LEGO city for a website.

- The city is in `apps/site`.
- Nuxt (a web framework) is like the city builder.
- Vue files (`.vue`) are like LEGO building instructions.

## The Big Idea

This website has:

1. Public pages people can visit (Home, About, Investments)
2. Admin pages for the team (manage decks, assets, settings)
3. A mini server inside the app that gives data to pages

So it is like:

- Front desk (pages people see)
- Back office (admin + API routes)
- Storage room (mock data store)

## Important Files and Folders

### 1) App Start

- `app.vue`
  - The first wrapper of the app.
  - Shows loading bar and the current page.

- `nuxt.config.ts`
  - The control panel for the whole site.
  - Turns on SSR (server-side rendering), modules, runtime settings, and more.

- `package.json`
  - The command list.
  - Includes scripts like `dev`, `build`, and `typecheck`.

### 2) What People See

- `pages/`
  - Each file is a page route.
  - Example:
    - `pages/index.vue` -> home page
    - `pages/about.vue` -> about page
    - `pages/contact.vue` -> contact page
    - `pages/investments/index.vue` -> list of opportunities
    - `pages/investments/[slug].vue` -> one specific opportunity

### 3) Page Frames (Layouts)

- `layouts/default.vue`
  - Reusable page frame with Header + Footer.
- `layouts/admin.vue`
  - Frame for admin pages.
- `layouts/blank.vue`
  - Minimal frame when needed.

Think of layouts like picture frames that hold the page content.

### 4) Reusable Pieces

- `components/`
  - Reusable UI pieces (buttons, cards, forms, header, footer).

### 5) Smart Helpers

- `composables/`
  - Reusable logic helpers.
  - Example helpers:
    - `usePublishedDecks.ts` gets public decks from `/api/decks`.
    - `useDeck.ts` helps admin create/update/delete decks.
    - `useAuth.ts` handles login/logout/checking user.

Think of composables like helper robots that do repeat jobs.

### 6) Data Types and Rules

- `lib/types/`
  - Defines shapes of data (like what a deck looks like).
- `lib/schemas/`
  - Validation rules (checks data is valid).

### 7) Server Side (Back Office)

- `server/routes/`
  - API endpoints (little doors pages can knock on for data).
  - Examples:
    - `server/routes/api/decks.get.ts` for public deck list
    - `server/routes/api/admin/decks.get.ts` for admin deck list

- `server/middleware/auth.ts`
  - Security guard for admin pages/routes.

- `server/utils/auth.ts`
  - Login token and auth cookie logic.

- `server/utils/mockStore.ts`
  - Fake in-memory database with starter deck/asset data.
  - Great for development because it works without a real database server.

### 8) Styling and Look

- `assets/css/main.css`
  - Main CSS styles.
- `tailwind.config.ts`
  - Tailwind setup (utility classes for styling).

## How Data Moves (Simple)

1. A page loads in the browser.
2. A composable asks an API route for data.
3. API route reads or updates data in `mockStore.ts`.
4. Data goes back to the page.
5. Page shows it on screen.

That is like:

- Kid asks librarian for a book.
- Librarian checks shelf.
- Librarian gives book back.

## Admin Safety (Simple)

- If you go to `/admin`, middleware checks if you are logged in.
- If not logged in, you get sent to `/login`.
- Login uses secure cookie/token logic.

## Commands You Run Most

From `apps/site`:

- `pnpm dev` -> start the site locally
- `pnpm build` -> build for production
- `pnpm preview` -> preview built site
- `pnpm typecheck` -> check TypeScript types
- `pnpm lint` -> check code style

## Quick Mental Map

- `pages` = screens
- `layouts` = frames
- `components` = LEGO pieces
- `composables` = helper robots
- `server/routes` = API doors
- `server/utils/mockStore.ts` = pretend database shelf
- `nuxt.config.ts` = master control panel

If you remember that map, you can find your way around this workspace fast.
