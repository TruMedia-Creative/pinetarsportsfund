<template>
  <header class="site-header">
    <nav class="site-container py-5 flex items-center justify-between gap-4">
      <NuxtLink to="/" class="brand-mark">
        <span class="brand-mark__dot" />
        Pine Tar Sports Fund
      </NuxtLink>

      <div class="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="hover:text-slate-900 transition-colors"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink to="/admin" class="btn btn-primary hidden sm:inline-flex">Admin</NuxtLink>
        <button
          type="button"
          class="mobile-nav-toggle md:hidden"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle navigation"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>

    <div v-if="mobileMenuOpen" class="mobile-nav-panel md:hidden">
      <div class="site-container py-4 flex flex-col gap-3">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="mobile-nav-link"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink to="/admin" class="btn btn-primary justify-center" @click="mobileMenuOpen = false">Admin</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Investments', to: '/investments' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false
  },
)
</script>
