<template>
  <header class="bg-white shadow">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600">
          Pine Tar
        </NuxtLink>
      </div>
      <div class="hidden md:flex space-x-8">
        <NuxtLink to="/" class="text-gray-700 hover:text-gray-900">
          Home
        </NuxtLink>
        <NuxtLink to="/investments" class="text-gray-700 hover:text-gray-900">
          Investments
        </NuxtLink>
        <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900">
          About
        </NuxtLink>
        <NuxtLink to="/contact" class="text-gray-700 hover:text-gray-900">
          Contact
        </NuxtLink>
      </div>
      <div class="flex space-x-4">
        <NuxtLink
          to="/admin"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Admin
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Header component
</script>
