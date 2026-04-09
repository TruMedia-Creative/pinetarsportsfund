<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Create New Deck</h1>

    <form @submit.prevent="submitForm" class="bg-white shadow rounded-lg p-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Deck Title
        </label>
        <input
          v-model="form.title"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter deck title"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          v-model="form.description"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          placeholder="Enter deck description"
        ></textarea>
      </div>

      <div class="flex gap-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ loading ? 'Creating...' : 'Create Deck' }}
        </button>
        <NuxtLink
          to="/admin/decks"
          class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const form = ref({
  title: '',
  description: '',
})
const loading = ref(false)

const submitForm = async () => {
  loading.value = true
  try {
    const data = await $fetch<{ id: string }>('/api/admin/decks', {
      method: 'POST',
      body: form.value,
    })
    await navigateTo(`/admin/decks/${data.id}`)
  } catch (error) {
    console.error('Failed to create deck:', error)
  } finally {
    loading.value = false
  }
}
</script>
