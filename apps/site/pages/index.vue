<template>
  <div class="bg-neutral-950">
    <!-- ===================================================
         1. HERO — centered, dark, gradient glow top
         =================================================== -->
    <section class="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-24">
      <!-- Gradient glow — brand red, top center -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style="background: radial-gradient(ellipse 70% 55% at 50% -5%, rgba(143,60,47,0.45), transparent)"
      />
      <!-- Gradient glow — gold, top-right -->
      <div
        class="pointer-events-none absolute right-0 top-0 h-[400px] w-1/2"
        style="background: radial-gradient(ellipse 60% 40% at 80% 0%, rgba(215,164,65,0.12), transparent)"
      />

      <div class="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <!-- Badge -->
        <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span class="text-xs font-semibold tracking-wide text-neutral-300">
            New Investment Opportunities Now Open
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="text-neutral-500" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <!-- Headline -->
        <h1 class="text-5xl font-bold tracking-tighter leading-[1.04] text-white sm:text-6xl lg:text-7xl xl:text-[80px]">
          Sports investment narratives<br>
          <span
            class="animate-shimmer bg-clip-text text-transparent"
            style="background-image: linear-gradient(135deg, #f87171, #fbbf24, #fde68a, #fbbf24, #f87171)"
          >
            built for diligence.
          </span>
        </h1>

        <!-- Description -->
        <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          Pine Tar Sports Fund packages sports opportunities into structured materials for investors,
          sponsors, lenders, and municipal partners — with clear use-of-funds logic, market framing,
          and export-ready decks.
        </p>

        <!-- CTAs -->
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/investments"
            class="inline-flex items-center rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-800"
          >
            Explore current opportunities
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Book investor call
          </NuxtLink>
        </div>

        <!-- Hero image — stadium placeholder -->
        <div class="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60">
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=80"
              alt="Sports venue — placeholder"
              class="h-auto w-full block"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
            <div class="absolute bottom-4 left-4">
              <div class="rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 backdrop-blur-sm">
                <p class="text-[10px] font-bold uppercase tracking-widest text-amber-400">Active Pipeline</p>
                <p class="text-xl font-black text-white leading-tight">$640M+</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Logo strip — inside hero like the reference -->
        <div class="mx-auto mt-12 max-w-3xl border-t border-neutral-800 pt-10">
          <p class="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
            Trusted by capital groups &amp; project sponsors
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <span v-for="p in partners" :key="p" class="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              {{ p }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================================================
         2. CAPABILITIES — gap-px bordered grid
         =================================================== -->
    <section class="py-24 sm:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <!-- Section header -->
        <div class="mb-12 text-center">
          <p class="font-mono text-xs font-medium uppercase tracking-[0.14em] text-red-500">Capabilities</p>
          <h2 class="mx-auto mt-4 max-w-lg text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Every signal, one underwriting surface.
          </h2>
          <p class="mx-auto mt-4 max-w-md text-neutral-500">
            No more rebuilding every pitch from scratch. One source of truth, shaped for every audience.
          </p>
        </div>

        <!-- Feature grid: gap-px creates the separating 1px border lines -->
        <div class="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800">
          <div class="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="group bg-neutral-950 p-6 transition-colors duration-300 hover:bg-neutral-900"
            >
              <div class="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Icon :name="feature.icon" class="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <h3 class="text-sm font-semibold tracking-tight text-white">{{ feature.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-neutral-500 sm:line-clamp-3">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================================================
         3. INVESTMENT SPOTLIGHT
         =================================================== -->
    <section class="py-4 sm:py-8">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="font-mono text-xs font-medium uppercase tracking-[0.14em] text-amber-500">Featured opportunity</p>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Capital deployed with context.
            </h2>
          </div>
          <NuxtLink
            to="/investments"
            class="inline-flex items-center gap-1.5 self-start rounded-xl border border-neutral-800 bg-transparent px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:bg-neutral-900 sm:self-auto"
          >
            All opportunities
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
        <InvestmentSpotlight />
      </div>
    </section>

    <!-- ===================================================
         4. METRICS — gap-px bordered grid
         =================================================== -->
    <section class="py-24 sm:py-32">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <p class="font-mono text-xs font-medium uppercase tracking-[0.14em] text-amber-500">By the numbers</p>
          <h2 class="mx-auto mt-4 max-w-lg text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for deal flow you haven't hit yet.
          </h2>
          <p class="mx-auto mt-4 max-w-md text-neutral-500">
            Process sophisticated deal structures across investors, sponsors, lenders, and municipality partners.
          </p>
        </div>

        <div class="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800">
          <div class="grid grid-cols-2 gap-px lg:grid-cols-4">
            <div
              v-for="m in metrics"
              :key="m.label"
              class="bg-neutral-950 p-8 text-center transition-colors duration-300 hover:bg-neutral-900"
            >
              <p class="text-4xl font-bold tracking-tight text-white">{{ m.value }}</p>
              <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-500">{{ m.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================================================
         5. TEAM PREVIEW
         =================================================== -->
    <section class="py-4 sm:py-8">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10">
          <p class="font-mono text-xs font-medium uppercase tracking-[0.14em] text-red-500">The team</p>
          <h2 class="mt-3 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            People who know both the field and the deal table.
          </h2>
        </div>
        <TeamPreview />
        <div class="mt-8">
          <NuxtLink
            to="/about"
            class="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-transparent px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:bg-neutral-900"
          >
            Meet the full team
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===================================================
         6. CTA — centered, gradient glow at bottom
         =================================================== -->
    <section class="relative py-24 sm:py-32">
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-[400px]"
        style="background: radial-gradient(ellipse 70% 50% at 50% 100%, rgba(215,164,65,0.14), transparent)"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-[300px]"
        style="background: radial-gradient(ellipse 50% 40% at 50% 100%, rgba(143,60,47,0.12), transparent)"
      />
      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold tracking-tighter text-white lg:text-5xl">
          Ready to deploy capital<br>with sharper context?
        </h2>
        <p class="mx-auto mt-5 max-w-sm leading-relaxed text-neutral-400">
          Start with active opportunities or speak directly with our investment team to align on
          thesis, return profile, and risk boundaries.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink
            to="/investments"
            class="inline-flex items-center rounded-xl bg-red-700 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-800"
          >
            View active investments
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="inline-flex items-center rounded-xl border border-neutral-800 bg-transparent px-6 py-3.5 text-sm font-bold text-neutral-300 transition-colors hover:bg-neutral-900"
          >
            Meet the team
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

usePageSeo({
  title: 'Pine Tar Sports Fund',
  description:
    'Structured deck workflows for investor raises, sponsorship campaigns, lender packages, and municipality partnerships in sports.',
  path: '/',
})

const partners = [
  'Sunbelt Capital',
  'Apex Venue Partners',
  'Gulf Coast Ventures',
  'Stadium District Fund',
  'Civic Sports Alliance',
  'Meridian Sports Capital',
]

const metrics = [
  { value: '$640M+', label: 'Pipeline screened' },
  { value: '91%', label: 'Target match quality' },
  { value: '38', label: 'Live opportunities' },
  { value: '6 wk', label: 'Median close cycle' },
]

const features = [
  {
    icon: 'i-lucide-users',
    title: 'Audience-Specific Positioning',
    description:
      'Shape one opportunity into investor, sponsor, lender, and municipality narratives without rewriting the core story each time.',
  },
  {
    icon: 'i-lucide-layout-panel-left',
    title: 'Structured Opportunity Framing',
    description:
      'Present venue economics, partnership strategy, media drivers, and capital needs in a sequence that holds up in diligence.',
  },
  {
    icon: 'i-lucide-pie-chart',
    title: 'Clear Use-of-Funds Logic',
    description:
      'Translate project spend, revenue timing, and milestone risk into simple, defensible capital narratives.',
  },
  {
    icon: 'i-lucide-layers',
    title: 'Reusable Deck Workflows',
    description:
      'Move from draft to preview to export with repeatable templates instead of rebuilding every pitch from a blank slide deck.',
  },
  {
    icon: 'i-lucide-download',
    title: 'Export-Ready Deliverables',
    description:
      'Generate polished PPTX and PDF outputs that can be sent directly to capital sources and operating partners.',
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Disciplined Story Control',
    description:
      'Keep assumptions, section order, and branding consistent so every deck says the same thing to the right audience.',
  },
]
</script>
