<template>
  <div>
    <section class="hero-shell pt-14 pb-20 lg:pt-20 lg:pb-28">
      <div class="site-container">
        <p class="eyebrow">Investor decks. Sponsor stories. Lender-ready materials.</p>
        <h1 class="hero-title mt-5 max-w-4xl">Sports investment narratives built for diligence, not hype.</h1>
        <p class="hero-copy mt-6 max-w-2xl">
          Pine Tar Sports Fund packages sports opportunities into structured materials for investors, sponsors, lenders,
          and municipal partners, with clear use-of-funds logic, market framing, and export-ready decks.
        </p>

        <div class="mt-9 flex flex-wrap gap-3">
          <NuxtLink to="/investments" class="btn btn-primary">Explore current opportunities</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-ghost">Book investor call</NuxtLink>
        </div>

        <div class="hero-console mt-10">
          <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Engagement snapshot</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-700">
            <li>- investor memo, sponsorship summary, and lender packet aligned</li>
            <li>- venue demand, rights value, and use-of-funds positioned clearly</li>
            <li>- municipality and partnership talking points export-ready</li>
            <li class="text-emerald-700">- current pipeline includes active and upcoming opportunities</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="site-container py-6 md:py-10">
      <p class="section-kicker">Built for core sports capital conversations</p>
      <div class="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 md:grid-cols-4">
        <p class="trust-chip">Investor Decks</p>
        <p class="trust-chip">Sponsor Mandates</p>
        <p class="trust-chip">Lender Packages</p>
        <p class="trust-chip">Municipality Partnerships</p>
      </div>
    </section>

    <section class="site-container py-14 md:py-20">
      <p class="section-kicker">Capabilities</p>
      <h2 class="section-title mt-3">Every signal, one underwriting surface.</h2>
      <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article class="feature-card" v-for="feature in features" :key="feature.title">
          <h3 class="text-lg font-bold text-slate-900">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-slate-600">{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <section class="site-container py-14 md:py-20">
      <div class="metric-panel">
        <div>
          <p class="section-kicker text-sky-200">By the numbers</p>
          <h2 class="section-title mt-3 text-white">Built for deal flow you have not hit yet.</h2>
        </div>
        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div class="metric-chip">
            <p class="metric-value">$640M+</p>
            <p class="metric-label">Pipeline screened</p>
          </div>
          <div class="metric-chip">
            <p class="metric-value">91%</p>
            <p class="metric-label">Target match quality</p>
          </div>
          <div class="metric-chip">
            <p class="metric-value">38</p>
            <p class="metric-label">Live opportunities</p>
          </div>
          <div class="metric-chip">
            <p class="metric-value">6 wk</p>
            <p class="metric-label">Median close cycle</p>
          </div>
        </div>
      </div>
    </section>

    <section class="site-container pb-24">
      <div class="cta-strip">
        <h2 class="text-3xl md:text-4xl font-black text-slate-900">Ready to deploy capital with sharper context?</h2>
        <p class="mt-4 text-slate-600 max-w-2xl">
          Start with active opportunities or speak directly with our investment team to align on thesis, return profile,
          and risk boundaries.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink to="/investments" class="btn btn-primary">View active investments</NuxtLink>
          <NuxtLink to="/about" class="btn btn-ghost">Meet the team</NuxtLink>
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

const features = [
  {
    title: 'Audience-Specific Positioning',
    description:
      'Shape one opportunity into investor, sponsor, lender, and municipality narratives without rewriting the core story each time.',
  },
  {
    title: 'Structured Opportunity Framing',
    description:
      'Present venue economics, partnership strategy, media drivers, and capital needs in a sequence that holds up in diligence.',
  },
  {
    title: 'Clear Use-of-Funds Logic',
    description:
      'Translate project spend, revenue timing, and milestone risk into simple, defensible capital narratives.',
  },
  {
    title: 'Reusable Deck Workflows',
    description:
      'Move from draft to preview to export with repeatable templates instead of rebuilding every pitch from a blank slide deck.',
  },
  {
    title: 'Export-Ready Deliverables',
    description:
      'Generate polished PPTX and PDF outputs that can be sent directly to capital sources and operating partners.',
  },
  {
    title: 'Disciplined Story Control',
    description:
      'Keep assumptions, section order, and branding consistent so every deck says the same thing to the right audience.',
  },
]
</script>
