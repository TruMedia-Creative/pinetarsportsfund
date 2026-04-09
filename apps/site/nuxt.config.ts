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
    '@nuxtjs/supabase',
  ],

  // Supabase — credentials are env vars; redirect config makes all pages public by default
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    secretKey: process.env.NUXT_SUPABASE_SECRET_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      // Exclude all public pages from automatic auth redirect.
      // Admin pages can add their own middleware if needed.
      exclude: ['*'],
    },
  },

  // Content Configuration — Nuxt Content v3
  // Collections are defined in content.config.ts
  content: {
    renderer: {
      anchorLinks: false,
    },
    experimental: {
      sqliteConnector: 'native',
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
    supabaseServiceKey: process.env.NUXT_SUPABASE_SECRET_KEY || '',
    jwt: {
      secret: process.env.JWT_SECRET,
      expires: '7d',
    },
    // Public keys (exposed to client)
    public: {
      apiBase: '/api',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    },
  },

  // Nitro Configuration
  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: true,
      routes: ['/investments', '/sitemap.xml'],
      ignore: ['/admin'],
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
