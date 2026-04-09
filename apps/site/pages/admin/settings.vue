<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">Settings</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-xl font-bold mb-4">Account Settings</h2>
        <form @submit.prevent="saveSettings" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="settings.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Settings
          </button>
        </form>
      </div>

      <div class="bg-white shadow rounded-lg p-8">
        <h2 class="text-xl font-bold mb-4">Site Settings</h2>
        <form @submit.prevent="saveSiteSettings" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              v-model="settings.siteName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Site URL
            </label>
            <input
              v-model="settings.siteUrl"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Support Email
            </label>
            <input
              v-model="settings.supportEmail"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Site Settings
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const settings = ref({
  email: 'admin@pinetarsportsfund.com',
  siteName: 'Pine Tar Sports Fund',
  siteUrl: 'https://pinetarsportsfund.com',
  supportEmail: 'support@pinetarsportsfund.com',
})

const saveSettings = async () => {
  alert('Settings saved!')
}

const saveSiteSettings = async () => {
  alert('Site settings saved!')
}
</script>
