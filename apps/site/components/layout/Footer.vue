<template>
  <footer class="bg-gray-900 text-white mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="text-lg font-bold mb-4">Pine Tar Sports Fund</h3>
          <p class="text-gray-400">
            Investment opportunities in sports and entertainment
          </p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Navigation</h4>
          <ul class="space-y-2 text-gray-400">
            <li><NuxtLink to="/" class="hover:text-white">Home</NuxtLink></li>
            <li><NuxtLink to="/investments" class="hover:text-white">Investments</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-white">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white">Contact</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Legal</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="#" class="hover:text-white">Privacy</a></li>
            <li><a href="#" class="hover:text-white">Terms</a></li>
            <li><a href="#" class="hover:text-white">Disclaimer</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Contact</h4>
          <p class="text-gray-400">
            <a href="mailto:contact@pinetarsportsfund.com" class="hover:text-white">
              contact@pinetarsportsfund.com
            </a>
          </p>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>&copy; 2024 Pine Tar Sports Fund. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
