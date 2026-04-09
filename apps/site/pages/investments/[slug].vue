<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <NuxtLink to="/investments" class="text-blue-600 hover:text-blue-800 mb-6 inline-block">
      &larr; Back to Investments
    </NuxtLink>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="deck">
      <h1 class="text-4xl font-bold mb-2">{{ deck.title }}</h1>

      <div class="flex gap-4 mb-8">
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          @click="downloadDeck"
        >
          Download PPTX
        </button>
        <button
          class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          @click="shareDeck"
        >
          Share
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-8">
        <h2 class="text-2xl font-bold mb-4">Investment Summary</h2>
        <p class="text-gray-700 mb-6">{{ deck.marketingMetadata?.summary }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-b">
          <div>
            <h3 class="font-semibold text-gray-700">Categories</h3>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="tag in deck.marketingMetadata?.tags"
                :key="tag"
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700">Opportunity Window</h3>
            <p v-if="deck.marketingMetadata?.expiresAt" class="text-gray-600 mt-2">
              Closes on {{ new Date(deck.marketingMetadata.expiresAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <div class="mt-8">
          <h3 class="text-xl font-bold mb-4">Full Details</h3>
          <p class="text-gray-700">
            Download the full pitch deck to review detailed financial projections, management team, and investment terms.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">Investment opportunity not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '~/lib/schemas'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const slug = route.params.slug as string
const deck = ref<Deck | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await $fetch<Deck>(`/api/decks/${slug}`)
    deck.value = response
  } catch (error) {
    console.error('Failed to load deck:', error)
  } finally {
    loading.value = false
  }
})

const downloadDeck = async () => {
  if (!deck.value) return
  try {
    const response = await $fetch(`/api/decks/${deck.value.id}/export`, {
      responseType: 'blob',
    })
    // Download file
    const url = URL.createObjectURL(response as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${deck.value.slug}.pptx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download deck:', error)
  }
}

const shareDeck = () => {
  if (!deck.value) return
  if (navigator.share) {
    navigator.share({
      title: deck.value.title,
      text: deck.value.marketingMetadata?.summary,
      url: window.location.href,
    })
  } else {
    // Fallback: copy to clipboard
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }
}
</script>
