<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#09090b' : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
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
      <div class="investor-site-pattern pointer-events-none absolute inset-0 z-0" />

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
