<template>
  <div>
    <!-- ===== DARK HERO ===== -->
    <div class="page-hero-dark">
      <div class="relative z-10 site-container text-center">
        <div class="section-badge mb-6">
          <span>{{ about?.intro.kicker }}</span>
        </div>
        <h1
          class="mx-auto max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
        >
          {{ about?.intro.headline }}
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          {{ about?.intro.body }}
        </p>
      </div>
    </div>

    <!-- ===== PILLARS ===== -->
    <div class="bg-white py-20 sm:py-24">
      <div class="site-container">
        <div class="mb-14 text-center">
          <p class="section-kicker">Foundation</p>
          <h2 class="section-title mt-3">Three principles behind every deal narrative</h2>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="(pillar, idx) in pillars"
            :key="pillar.title"
            class="pillar-card"
          >
            <span class="pillar-num">{{ String(idx + 1).padStart(2, '0') }}</span>
            <h3 class="mt-4 text-lg font-bold text-slate-900">{{ pillar.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ pillar.copy }}</p>
          </article>
        </div>
      </div>
    </div>

    <!-- ===== PROCESS ===== -->
    <div class="py-20 sm:py-24" style="background: var(--color-bg)">
      <div class="site-container">
        <div class="mb-14 text-center">
          <p class="section-kicker">Our approach</p>
          <h2 class="section-title mt-3">How Pine Tar works</h2>
        </div>
        <div class="process-track">
          <div
            v-for="step in process"
            :key="step.step"
            class="process-step"
          >
            <div class="process-step__num">{{ step.step }}</div>
            <div class="mt-5">
              <h3 class="font-bold text-slate-900">{{ step.label }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ step.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CTA ===== -->
    <div class="bg-white py-16 sm:py-20">
      <div class="site-container">
        <div class="about-cta-card">
          <div class="about-cta-card__inner">
            <p class="section-kicker" style="color: var(--color-accent)">Ready to start?</p>
            <h2 class="mt-3 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Work with Pine Tar Sports Fund
            </h2>
            <p class="mt-4 max-w-lg text-base leading-relaxed text-neutral-300">
              Reviewing allocation options or evaluating your first sports investment mandate? Our team
              frames the story from day one.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink to="/investments" class="btn btn-primary">See live investments</NuxtLink>
              <NuxtLink to="/contact" class="btn btn-outline-white">Contact investment team</NuxtLink>
            </div>
          </div>
          <!-- Decorative radial glows -->
          <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]">
            <div
              class="absolute -right-16 -top-16 h-64 w-64 rounded-full"
              style="background: radial-gradient(circle, rgba(215,164,65,0.22), transparent 70%)"
            />
            <div
              class="absolute -bottom-20 left-8 h-52 w-52 rounded-full"
              style="background: radial-gradient(circle, rgba(143,60,47,0.35), transparent 70%)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

usePageSeo({
  title: 'About',
  description:
    'Learn how Pine Tar Sports Fund structures sports opportunities into investor, sponsor, lender, and municipality-ready narratives.',
  path: '/about',
})

const { data: about } = await useAsyncData('about-page', () =>
  queryCollection('aboutPage').first(),
)

const pillars = computed(() => about.value?.pillars ?? [])
const process = computed(() => about.value?.process ?? [])
</script>
