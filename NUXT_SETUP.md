# Pine Tar Sports Fund - Nuxt 4 Implementation

A modern, full-stack web application for managing investment decks and publishing them to investors. Built with Nuxt 4, Vue 3, and SQLite.

## 🎯 Features

### Marketing Site
- **Home Page**: Showcase investment opportunities
- **Investment Gallery**: Browse published decks
- **Investment Details**: View detailed deck information
- **About & Contact Pages**: Informational content and contact form

### Admin Dashboard
- **Deck Management**: Create, edit, and delete decks
- **Asset Library**: Upload and manage images and supporting files
- **Publishing**: Publish decks with marketing metadata
- **PPTX Export**: Generate PowerPoint presentations from decks
- **Settings**: Manage account and site configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 22 (check `.nvmrc`)
- pnpm 10.0.0+

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your settings:
```env
DATABASE_PATH=./data/app.sqlite.bin
JWT_SECRET=your-secret-key-here
SITE_URL=http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

### Development

Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## 📁 Project Structure

```
├── server/
│   ├── routes/api/           # API endpoints
│   ├── middleware/           # Request middleware (auth, etc.)
│   ├── plugins/              # Server initialization plugins
│   └── utils/                # Database utilities
├── pages/                    # File-based routing (auto-generates routes)
│   ├── index.vue            # Home page
│   ├── about.vue            # About page
│   ├── contact.vue          # Contact form
│   ├── investments/         # Gallery and detail pages
│   ├── admin/               # Admin dashboard
│   └── login.vue            # Admin login
├── components/
│   ├── layout/              # Header, footer
│   ├── forms/               # Form components
│   ├── deck/                # Deck-specific UI
│   └── ui/                  # Reusable UI components
├── composables/             # Vue composition functions
├── lib/
│   ├── schemas/             # Zod validation schemas
│   ├── types/               # TypeScript types
│   ├── pptx/                # PPTX generation utilities
│   └── utils/               # Helper functions
├── layouts/                 # Page layouts
├── content/                 # Markdown content (for future use)
├── assets/                  # Static assets and styles
└── nuxt.config.ts          # Nuxt configuration
```

## 🔐 Authentication

Default admin login:
- **Username**: admin
- **Password**: password

⚠️ **Important**: Change these credentials in production!

To modify authentication, update:
- `server/routes/api/admin/auth.post.ts` - Login endpoint
- `server/middleware/auth.ts` - Route protection
- `composables/useAuth.ts` - Client-side auth state

## 💾 Database

The app uses SQLite with the following tables:

- **decks**: Deck content and metadata
- **assets**: Uploaded images and files
- **financial_models**: Financial projections
- **users**: User accounts (future expansion)

Database file location: `./data/app.sqlite.bin` (configurable via `DATABASE_PATH`)

### Database Schema

#### Decks
```sql
CREATE TABLE decks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft',
  published INTEGER DEFAULT 0,
  publishedAt TEXT,
  slugForPublic TEXT,
  content JSON,
  marketingMetadata JSON,
  createdAt TEXT,
  updatedAt TEXT
)
```

#### Assets
```sql
CREATE TABLE assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  url TEXT NOT NULL,
  alt TEXT,
  tags JSON,
  createdAt TEXT
)
```

## 🛠️ Utilities & Composables

### Composables

- **`useDeck()`**: Deck CRUD operations
  - `fetchDeck(id)` - Get single deck
  - `createDeck(data)` - Create new deck
  - `updateDeck(id, data)` - Update deck
  - `deleteDeck(id)` - Delete deck

- **`usePublishedDecks()`**: Fetch published decks for gallery
  - Automatically loads on mount
  - Returns array of published decks

- **`useAuth()`**: Authentication state
  - `login(username, password)` - Login user
  - `logout()` - Logout
  - `checkAuth()` - Verify current session

### API Routes

#### Public API
- `GET /api/decks` - List published decks
- `GET /api/decks/:id` - Get deck details
- `POST /api/contact` - Submit contact form

#### Admin API
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/decks` - List all decks
- `POST /api/admin/decks` - Create deck
- `PUT /api/admin/decks/:id` - Update deck
- `DELETE /api/admin/decks/:id` - Delete deck
- `GET /api/admin/decks/:id/export` - Export PPTX
- `GET /api/admin/assets` - List assets
- `POST /api/admin/assets` - Upload asset
- `DELETE /api/admin/assets/:id` - Delete asset

## 🎨 Styling

The project uses:
- **Tailwind CSS v4** with typography and forms plugins
- **@nuxt/ui** for pre-built components
- Custom CSS variables in `assets/css/main.css`

## 📝 Validation

All forms use:
- **Zod** schemas for validation (`lib/schemas/index.ts`)
- **VeeValidate** for Vue form validation
- **TypeScript** for type safety

## 🔄 Development Workflow

1. **Feature Development**
   ```bash
   pnpm dev
   ```

2. **Type Checking**
   ```bash
   pnpm typecheck
   ```

3. **Linting**
   ```bash
   pnpm lint
   ```

4. **Full Check**
   ```bash
   pnpm check  # lint + typecheck + build
   ```

## 📦 Core Dependencies

- **nuxt** ^4.0.0 - Framework
- **vue** ^3.0.0 - UI framework
- **@nuxt/ui** ^3.0.0 - Component library
- **@nuxt/content** ^2.13.0 - Markdown content
- **@nuxt/seo** ^2.2.0 - SEO management
- **@nuxt/image** ^1.8.0 - Image optimization
- **tailwindcss** ^4.0.0 - Styling
- **zod** ^4.3.6 - Validation
- **pptxgenjs** ^4.0.1 - PPTX generation
- **vee-validate** ^4.14.0 - Form validation
- **better-sqlite3** ^9.2.0 - Database

## 🚨 Known Limitations

Currently implemented:
- ✅ Basic deck CRUD operations
- ✅ Admin dashboard and pages
- ✅ Public investment gallery
- ✅ Asset management
- ✅ Contact form

Not yet implemented:
- ❌ Email sending (contact form)
- ❌ PPTX export functionality
- ❌ Password hashing (bcrypt)
- ❌ JWT token validation
- ❌ File uploads
- ❌ Markdown content management
- ❌ Full SEO optimization

## 🔮 Next Steps

1. **Implement PPTX Export**
   - Migrate logic from React version
   - Create presentation builder service

2. **Add Authentication**
   - Implement bcrypt for password hashing
   - Add JWT token validation
   - Create user management system

3. **Email Integration**
   - Set up SMTP service
   - Create email templates
   - Implement contact form emails

4. **File Uploads**
   - Create multipart form handler
   - Implement file storage
   - Add image optimization

5. **Content Management**
   - Upload Markdown files to `content/` folder
   - Enable Nuxt Content rendering
   - Create SEO-optimized landing pages

6. **Testing**
   - Write tests using Vitest
   - Add component tests
   - Create E2E tests

## 📞 Support

For issues or questions:
1. Check the [Nuxt documentation](https://nuxt.com)
2. Review the [Nuxt UI documentation](https://ui.nuxt.com)
3. Check the [Vue 3 guide](https://vuejs.org)

## 📄 License

All rights reserved - Pine Tar Sports Fund
