<template>
  <div>
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold mb-4">Pine Tar Sports Fund</h1>
        <p class="text-xl mb-8">
          Discover premium investment opportunities in sports and entertainment
        </p>
        <NuxtLink
          to="/investments"
          class="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100"
        >
          Explore Investments
        </NuxtLink>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold mb-12 text-center">Why Invest With Us</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Curated Opportunities</h3>
            <p class="text-gray-600">
              Access carefully vetted investment opportunities in the sports and entertainment sectors.
            </p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Expert Analysis</h3>
            <p class="text-gray-600">
              Benefit from detailed market analysis and projections from industry experts.
            </p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Transparency</h3>
            <p class="text-gray-600">
              Full transparency on financial models, use of funds, and expected returns.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
