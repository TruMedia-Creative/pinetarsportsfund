<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-gray-500 text-sm">Total Decks</div>
        <div class="text-4xl font-bold mt-2">{{ stats.totalDecks }}</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-gray-500 text-sm">Published</div>
        <div class="text-4xl font-bold mt-2">{{ stats.publishedDecks }}</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-gray-500 text-sm">Assets</div>
        <div class="text-4xl font-bold mt-2">{{ stats.totalAssets }}</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-gray-500 text-sm">Draft Decks</div>
        <div class="text-4xl font-bold mt-2">{{ stats.draftDecks }}</div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-8">
      <h2 class="text-2xl font-bold mb-4">Quick Actions</h2>
      <div class="space-y-4">
        <NuxtLink
          to="/admin/decks"
          class="block px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          → Manage Decks
        </NuxtLink>
        <NuxtLink
          to="/admin/assets"
          class="block px-6 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
        >
          → Manage Assets
        </NuxtLink>
        <NuxtLink
          to="/admin/settings"
          class="block px-6 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
        >
          → Settings
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stats {
  totalDecks: number
  publishedDecks: number
  draftDecks: number
  totalAssets: number
}

definePageMeta({
  layout: 'admin',
})

const stats = ref<Stats>({
  totalDecks: 0,
  publishedDecks: 0,
  draftDecks: 0,
  totalAssets: 0,
})

onMounted(async () => {
  try {
    const response = await $fetch<Stats>('/api/admin/stats')
    stats.value = response
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
})
</script>
