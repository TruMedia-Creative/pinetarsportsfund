<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-8">About Pine Tar Sports Fund</h1>

    <div class="prose prose-lg max-w-none">
      <p class="text-xl text-gray-600 mb-6">
        Pine Tar Sports Fund is a premier investment platform dedicated to identifying and 
        nurturing exceptional opportunities in sports and entertainment.
      </p>

      <h2 class="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
      <p>
        We connect sophisticated investors with carefully curated investment opportunities in the 
        sports industry. Our team combines deep industry expertise, rigorous financial analysis, 
        and a commitment to transparency.
      </p>

      <h2 class="text-2xl font-bold mt-12 mb-4">Our Approach</h2>
      <ul class="space-y-4">
        <li>
          <strong>Rigorous Due Diligence:</strong> Every opportunity is thoroughly vetted by our 
          experienced team of sports industry veterans and financial analysts.
        </li>
        <li>
          <strong>Transparency:</strong> We provide comprehensive documentation, detailed financial 
          projections, and clear reporting on all investments.
        </li>
        <li>
          <strong>Long-term Value:</strong> We focus on building sustainable businesses with 
          strong growth potential and competitive advantages.
        </li>
      </ul>

      <h2 class="text-2xl font-bold mt-12 mb-4">Contact Us</h2>
      <p>
        Interested in learning more? <NuxtLink to="/contact" class="text-blue-600 hover:text-blue-800">
          Get in touch
        </NuxtLink> with our investment team.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
