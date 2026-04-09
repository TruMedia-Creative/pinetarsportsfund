<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      name: 'theme-color',
      content: '#8f3c2f',
    },
  ],
})
</script>
