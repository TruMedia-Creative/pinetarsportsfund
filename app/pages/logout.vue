<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Admin Logout - Pine Tar Sports Fund' })

const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const error = ref('')

async function handleLogout() {
  error.value = ''
  state.value = 'loading'

  try {
    await $fetch('/api/__studio/auth/logout', {
      method: 'POST'
    })

    state.value = 'success'
  } catch (err: unknown) {
    const fetchErr = err as { data?: { message?: string } }
    error.value = fetchErr?.data?.message || 'Logout failed. Please try again.'
    state.value = 'error'
  }
}

onMounted(() => {
  void handleLogout()
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
    <div class="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-semibold text-white">
          Content Studio
        </h1>
        <p class="mt-1 text-sm text-zinc-400">
          <template v-if="state === 'loading'">
            Signing you out.
          </template>
          <template v-else-if="state === 'success'">
            You have been signed out.
          </template>
          <template v-else>
            We could not complete logout.
          </template>
        </p>
      </div>

      <div
        v-if="state === 'loading'"
        class="rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300"
      >
        Clearing your Studio session cookie now.
      </div>

      <div
        v-else-if="state === 'success'"
        class="space-y-4"
      >
        <div class="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Your Studio session has been cleared.
        </div>

        <NuxtLink
          to="/admin"
          class="block w-full rounded-lg bg-red-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Back to login
        </NuxtLink>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <div
          role="alert"
          class="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {{ error }}
        </div>

        <button
          type="button"
          class="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          @click="handleLogout"
        >
          Try again
        </button>
      </div>

      <p class="mt-6 text-center text-xs text-zinc-500">
        Pine Tar Sports Fund - Content Studio
      </p>
    </div>
  </div>
</template>