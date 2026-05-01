import { readdirSync } from 'node:fs'

const investmentDeckRoutes = readdirSync(new URL('./content/investments', import.meta.url), { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.yml'))
  .map(entry => `/investments/${entry.name.replace(/\.yml$/, '')}`)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    'nuxt-studio',
    '@nuxt/hints',
    '@vercel/analytics'
  ],

  // Register deck section components globally so Studio component picker can list them
  components: [
    { path: '~/components/deck', global: true },
    '~/components'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_SITE_URL || process.env.SITE_URL || 'https://pinetarsportsfund.com',
    name: 'Pine Tar Sports Fund'
  },
  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  // Server-only runtime config.  Nuxt automatically maps NUXT_ADMIN_USERNAME
  // and NUXT_ADMIN_PASSWORD env vars into these keys at runtime.
  runtimeConfig: {
    adminUsername: '',
    adminPassword: ''
  },

  experimental: {
    payloadExtraction: false
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      routes: ['/', '/investments', ...investmentDeckRoutes],
      crawlLinks: false
    }
  },

  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger']
    }
  },
  debug: process.env.NODE_ENV === 'development',

  hooks: {
    'vite:extendConfig'(config) {
      const optimizeDeps = config.optimizeDeps

      if (!optimizeDeps || !Array.isArray(optimizeDeps.include)) {
        return
      }

      optimizeDeps.include = optimizeDeps.include.filter((entry) => {
        return typeof entry !== 'string' || !entry.startsWith('@nuxtjs/mdc >')
      })
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  ogImage: {
    zeroRuntime: true
  },

  studio: {
    // Internal login page used by Studio's built-in OAuth providers (kept as
    // fallback / keyboard-shortcut target).  The user-facing login lives at
    // /admin via app/pages/admin.vue which uses simple username/password auth.
    route: '/_studio-auth',

    repository: {
      provider: 'github',
      owner: 'TruMedia-Creative',
      repo: 'pinetarsportsfund',
      branch: 'main'
    },

    meta: {
      components: {
        groups: [
          { label: 'Deck Sections', include: ['Deck*'] },
          { label: 'Layout', include: ['App*'] },
          { label: 'UI', include: ['Gradient*', 'Hero*'] }
        ]
      }
    }
  }
})
