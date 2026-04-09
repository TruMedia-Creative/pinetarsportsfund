<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Edit Deck</h1>
      <NuxtLink to="/admin/decks" class="text-blue-600 hover:text-blue-800">
        Back to Decks
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12">
      Loading deck...
    </div>

    <div v-else-if="deck">
      <div class="bg-white shadow rounded-lg p-8 space-y-6 mb-8">
        <h2 class="text-2xl font-bold">{{ deck.title }}</h2>
        <p class="text-gray-600">Created {{ deck.createdAt ? new Date(deck.createdAt).toLocaleDateString() : 'N/A' }}</p>

        <div class="border-t pt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="deck.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="exported">Exported</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Published</label>
            <input v-model="deck.published" type="checkbox" class="h-4 w-4" />
          </div>

          <div v-if="deck.published && deck.marketingMetadata">
            <label class="block text-sm font-medium text-gray-700 mb-2">Summary</label>
            <textarea
              v-model="deck.marketingMetadata.summary"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows="3"
            ></textarea>
          </div>

          <button
            @click="saveDeck"
            :disabled="saving"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Deck not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '~/lib/schemas'

definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const deckId = route.params.id as string
const deck = ref<Deck | null>(null)
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  try {
    const response = await $fetch<Deck>(`/api/admin/decks/${deckId}`)
    deck.value = response
  } catch (error) {
    console.error('Failed to load deck:', error)
  } finally {
    loading.value = false
  }
})

const saveDeck = async () => {
  if (!deck.value) return
  
  saving.value = true
  try {
    await $fetch(`/api/admin/decks/${deckId}`, {
      method: 'PUT',
      body: deck.value,
    })
    alert('Deck saved successfully!')
  } catch (error) {
    console.error('Failed to save deck:', error)
  } finally {
    saving.value = false
  }
}
</script>
