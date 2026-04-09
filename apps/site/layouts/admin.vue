<template>
  <div class="min-h-screen flex">
    <aside class="w-64 bg-gray-900 text-white p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold">Admin</h1>
      </div>
      <nav class="space-y-4">
        <NuxtLink to="/admin" class="block p-2 rounded hover:bg-gray-800">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/decks" class="block p-2 rounded hover:bg-gray-800">
          Decks
        </NuxtLink>
        <NuxtLink to="/admin/assets" class="block p-2 rounded hover:bg-gray-800">
          Assets
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="block p-2 rounded hover:bg-gray-800">
          Settings
        </NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 bg-gray-50 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Admin layout
</script>
