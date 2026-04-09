<template>
  <NuxtLink v-if="to" :to="to" class="badge-pill">
    <span class="badge-dot" />
    <span>{{ label }}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </NuxtLink>
  <span v-else class="badge-pill">
    <span class="badge-dot" />
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  to?: string
}>()
</script>
