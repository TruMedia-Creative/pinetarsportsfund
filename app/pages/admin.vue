<script setup lang="ts">
/**
 * /admin — Simple credentials login page for Nuxt Studio.
 *
 * After a successful login the Studio session cookie is set and the user is
 * redirected to the home page where the Studio editor overlay activates
 * automatically via the client-side plugin.
 */
definePageMeta({ layout: false })

useHead({ title: 'Admin Login — Pine Tar Sports Fund' })

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await $fetch('/api/__studio/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })

    // Session cookie is now set.  Navigate to the home page where the Studio
    // client-side plugin will detect the session and load the editor overlay.
    await navigateTo('/', { external: true })
  } catch (err: unknown) {
    const fetchErr = err as { data?: { message?: string } }
    error.value = fetchErr?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
    <div class="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
      <!-- Logo / brand -->
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-semibold text-white">
          Content Studio
        </h1>
        <p class="mt-1 text-sm text-zinc-400">
          Sign in to edit your site.
        </p>
      </div>

      <!-- Error banner -->
      <div
        v-if="error"
        class="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400"
      >
        {{ error }}
      </div>

      <!-- Login form -->
      <form
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
        <div>
          <label
            for="username"
            class="mb-1 block text-sm font-medium text-zinc-300"
          >Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            required
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 outline-none ring-offset-zinc-900 focus:ring-2 focus:ring-red-500"
            placeholder="admin"
          >
        </div>

        <div>
          <label
            for="password"
            class="mb-1 block text-sm font-medium text-zinc-300"
          >Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 outline-none ring-offset-zinc-900 focus:ring-2 focus:ring-red-500"
            placeholder="••••••••"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-zinc-500">
        Pine Tar Sports Fund &mdash; Content Studio
      </p>
    </div>
  </div>
</template>
