export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,

  // CSS & Styling
  css: ['~/assets/css/main.css'],

  // PostCSS (inlined to avoid external postcss.config.js conflict)
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
  ],

  // Content Configuration
  content: {
    documentDriven: false,
    sources: {
      content: {
        driver: 'fs',
        base: './content',
      },
    },
    markdown: {
      anchorLinks: false,
    },
  },

  // Image Configuration
  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      thumbnail: {
        modifiers: {
          width: 240,
          height: 160,
        },
      },
      card: {
        modifiers: {
          width: 400,
          height: 300,
        },
      },
    },
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Runtime Config
  runtimeConfig: {
    // Private keys only accessible server-side
    database: {
      path: process.env.DATABASE_PATH || './data/app.sqlite.bin',
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expires: '7d',
    },
    adminAuth: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@pinetarsportsfund.com',
    },
    // Public keys (exposed to client)
    public: {
      apiBase: '/api',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    },
  },

  // Nitro Configuration
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/investments', '/sitemap.xml'],
      ignore: ['/admin'],
    },
    storage: {
      data: {
        driver: 'fs',
        base: './data',
      },
    },
  },

  // Auto-imports
  imports: {
    autoImport: true,
  },

  // Dev Tools
  devtools: {
    enabled: true,
  },
})
