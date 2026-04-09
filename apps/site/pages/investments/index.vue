<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-8">Available Investment Opportunities</h1>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="deck in publishedDecks"
        :key="deck.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateTo(`/investments/${deck.slugForPublic}`)"
      >
        <div class="bg-gray-200 h-40 flex items-center justify-center">
          <NuxtImg
            v-if="deck.marketingMetadata?.heroImageUrl"
            :src="deck.marketingMetadata.heroImageUrl"
            :alt="deck.title"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-gray-500">No image</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">{{ deck.title }}</h3>
          <p class="text-gray-600 mb-4">{{ deck.marketingMetadata?.summary }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in deck.marketingMetadata?.tags"
              :key="tag"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">
              {{ new Date(deck.marketingMetadata?.expiresAt || '').toLocaleDateString() }}
            </span>
            <NuxtLink
              :to="`/investments/${deck.slugForPublic}`"
              class="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && publishedDecks.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">No investment opportunities available at the moment.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '~/lib/schemas'

definePageMeta({
  layout: 'default',
})

const decks = ref<Deck[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await $fetch<Deck[]>('/api/decks', { query: { published: 'true' } })
    decks.value = response || []
  } catch (error) {
    console.error('Failed to load decks:', error)
  } finally {
    loading.value = false
  }
})

const publishedDecks = computed(() => {
  return decks.value.filter((d) => d.published)
})
</script>
