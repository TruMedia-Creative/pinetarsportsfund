// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    'nuxt-studio'
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

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
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

  studio: {
    // Internal login page used by Studio's built-in OAuth providers (kept as
    // fallback / keyboard-shortcut target).  The user-facing login lives at
    // /admin via app/pages/admin.vue which uses simple username/password auth.
    route: '/_studio-auth',

    // Repository block removed — Vercel auto-detects from VERCEL_GIT_* env
    // vars at build time.  Set STUDIO_GITHUB_TOKEN on Vercel so Studio can
    // push content changes to the repo.

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
