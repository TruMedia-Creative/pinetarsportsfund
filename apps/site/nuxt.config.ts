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

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Register deck section components globally so Studio component picker can list them
  components: [
    { path: '~/components/deck', global: true },
    '~/components'
  ],

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  studio: {
    // Accessible at /admin in production (dev shows floating button automatically)
    route: '/admin',
    repository: {
      provider: 'github',
      owner: 'TruMedia-Creative',
      repo: 'pinetarsportsfund',
      branch: 'main',
      // Monorepo: content root is inside apps/site/
      rootDir: 'apps/site'
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
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})