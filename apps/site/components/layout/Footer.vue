<template>
  <footer class="site-footer mt-20">
    <div class="site-container py-14">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="text-xl font-extrabold text-slate-50">{{ siteFooter?.brand.name }}</h3>
          <p class="mt-3 text-sm text-slate-400">
            {{ siteFooter?.brand.tagline }}
          </p>
        </div>

        <div>
          <h4 class="footer-title">Explore</h4>
          <ul class="footer-links">
            <li v-for="link in exploreLinks" :key="link.to">
              <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Investor Relations</h4>
          <ul class="footer-links">
            <li><a :href="`mailto:${siteFooter?.investorRelations.email}`">{{ siteFooter?.investorRelations.email }}</a></li>
            <li>{{ siteFooter?.investorRelations.note }}</li>
            <li>{{ siteFooter?.investorRelations.responseTime }}</li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Legal</h4>
          <ul class="footer-links">
            <li v-for="line in legalLines" :key="line">{{ line }}</li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500 flex flex-col sm:flex-row sm:justify-between gap-2">
        <p>&copy; {{ year }} {{ siteFooter?.brand.name }}. All rights reserved.</p>
        <p>Built for structured sports fundraising and partner storytelling.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { data: siteFooter } = await useAsyncData('site-footer', () =>
  queryCollection('footer').first(),
)

const exploreLinks = computed(() => siteFooter.value?.exploreLinks ?? [])
const legalLines = computed(() => siteFooter.value?.legalLines ?? [])
const year = new Date().getFullYear()
</script>
