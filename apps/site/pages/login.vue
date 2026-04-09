<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8">Admin Login</h1>

      <form @submit.prevent="handleLogin" class="bg-white shadow rounded-lg p-8 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter password"
            required
          />
        </div>

        <div v-if="error" class="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="text-center mt-6 text-gray-600 text-sm">
        Default credentials: admin / admin
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

usePageSeo({
  title: 'Admin Login',
  description: 'Secure sign-in for Pine Tar Sports Fund administration.',
  path: '/login',
  noindex: true,
})

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const { login } = useAuth()

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const success = await login(username.value, password.value)
    if (success) {
      await navigateTo('/admin')
    } else {
      error.value = 'Invalid username or password'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
