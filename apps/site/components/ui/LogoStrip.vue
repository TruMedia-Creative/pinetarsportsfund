<template>
  <div class="logo-strip">
    <div class="site-container">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
        <p class="logo-strip__label">Trusted by</p>
        <div class="logo-strip__track">
          <span v-for="partner in partners" :key="partner" class="logo-chip">{{ partner }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const partners = [
  'Sunbelt Capital',
  'Apex Venue Partners',
  'Gulf Coast Ventures',
  'Stadium District Fund',
  'Civic Sports Alliance',
  'Meridian Sports Capital',
]
</script>
