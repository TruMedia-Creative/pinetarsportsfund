<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">Assets</h1>

    <div class="bg-white shadow rounded-lg p-8">
      <h2 class="text-xl font-bold mb-4">Upload New Asset</h2>

      <form @submit.prevent="handleUpload" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Asset Name
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Team Photo"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Asset Type
          </label>
          <select v-model="form.type" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="image">Image</option>
            <option value="chart">Chart</option>
            <option value="logo">Logo</option>
            <option value="headshot">Headshot</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            URL
          </label>
          <input
            v-model="form.url"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="https://..."
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ loading ? 'Uploading...' : 'Upload Asset' }}
        </button>
      </form>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Type</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">URL</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="asset in assets" :key="asset.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">{{ asset.name }}</td>
            <td class="px-6 py-4">{{ asset.type }}</td>
            <td class="px-6 py-4">
              <a :href="asset.url" target="_blank" class="text-blue-600 hover:text-blue-800 truncate block max-w-xs">
                View
              </a>
            </td>
            <td class="px-6 py-4">
              <button
                class="text-red-600 hover:text-red-800 text-sm"
                @click="deleteAsset(asset.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Asset {
  id: string
  name: string
  type: string
  url: string
}

definePageMeta({
  layout: 'admin',
})

const form = ref({
  name: '',
  type: 'image',
  url: '',
})
const assets = ref<Asset[]>([])
const loading = ref(false)

const handleUpload = async () => {
  loading.value = true
  try {
    const response = await $fetch<Asset>('/api/admin/assets', {
      method: 'POST',
      body: form.value,
    })
    assets.value.push(response)
    form.value = { name: '', type: 'image', url: '' }
  } catch (error) {
    console.error('Failed to upload asset:', error)
  } finally {
    loading.value = false
  }
}

const deleteAsset = async (id: string) => {
  if (!confirm('Delete this asset?')) return
  try {
    await $fetch(`/api/admin/assets/${id}`, { method: 'DELETE' })
    assets.value = assets.value.filter((a) => a.id !== id)
  } catch (error) {
    console.error('Failed to delete asset:', error)
  }
}

onMounted(async () => {
  try {
    const response = await $fetch<Asset[]>('/api/admin/assets')
    assets.value = response || []
  } catch (error) {
    console.error('Failed to load assets:', error)
  }
})
</script>
