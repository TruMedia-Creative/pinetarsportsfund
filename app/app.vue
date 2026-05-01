<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()

const color = computed(() => colorMode.value === 'dark' ? '#09090b' : 'white')
const showGlobalInvestorPattern = computed(() => route.path !== '/')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  ogImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Pine Tar Sports Fund',
  ogSiteName: 'Pine Tar Sports Fund',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :toaster="{ expand: false }">
    <div class="relative min-h-screen overflow-x-clip">
      <div
        v-if="showGlobalInvestorPattern"
        class="investor-site-pattern pointer-events-none absolute inset-0 z-0"
      />

      <div class="relative z-10">
        <AppHeader />

        <UMain>
          <NuxtPage />
        </UMain>

        <AppFooter />
      </div>
    </div>
  </UApp>
</template>
