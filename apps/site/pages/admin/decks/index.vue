<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Decks</h1>
      <NuxtLink
        to="/admin/decks/new"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create New Deck
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-8">
      Loading decks...
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="deck in decks" :key="deck.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">{{ deck.title }}</td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-sm" :class="getStatusClass(deck.status)">
                {{ deck.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span v-if="deck.published" class="text-green-600">✓ Published</span>
              <span v-else class="text-gray-400">Draft</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ deck.createdAt ? new Date(deck.createdAt).toLocaleDateString() : 'N/A' }}
            </td>
            <td class="px-6 py-4 space-x-2">
              <NuxtLink
                :to="`/admin/decks/${deck.id}`"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </NuxtLink>
              <button
                class="text-red-600 hover:text-red-800 text-sm"
                @click="deleteDeck(deck.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && decks.length === 0" class="text-center py-12 bg-white rounded">
      <p class="text-gray-500">No decks yet. Create one to get started.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '~/lib/schemas'

definePageMeta({
  layout: 'admin',
})

const decks = ref<Deck[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await $fetch<Deck[]>('/api/admin/decks')
    decks.value = response || []
  } catch (error) {
    console.error('Failed to load decks:', error)
  } finally {
    loading.value = false
  }
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    ready: 'bg-green-100 text-green-800',
    exported: 'bg-blue-100 text-blue-800',
    archived: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const deleteDeck = async (id: string) => {
  if (!confirm('Are you sure you want to delete this deck?')) return

  try {
    await $fetch(`/api/admin/decks/${id}`, { method: 'DELETE' })
    decks.value = decks.value.filter((d) => d.id !== id)
  } catch (error) {
    console.error('Failed to delete deck:', error)
  }
}
</script>
