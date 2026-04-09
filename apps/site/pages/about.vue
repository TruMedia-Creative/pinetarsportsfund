<template>
  <div class="site-container py-16 md:py-20">
    <p class="section-kicker">About</p>
    <h1 class="section-title mt-3 max-w-3xl">A disciplined platform for packaging sports opportunities into fundable stories.</h1>

    <p class="mt-6 max-w-3xl text-lg text-slate-600">
      Pine Tar Sports Fund helps turn sports projects and investment theses into clear public-facing and investor-facing
      narratives across equity raises, sponsorship strategies, lender materials, and partnership conversations.
    </p>

    <div class="mt-12 grid gap-5 md:grid-cols-3">
      <article class="feature-card" v-for="pillar in pillars" :key="pillar.title">
        <h2 class="text-lg font-bold text-slate-900">{{ pillar.title }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ pillar.copy }}</p>
      </article>
    </div>

    <section class="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div class="rounded-2xl border border-slate-200 bg-white p-7">
        <h2 class="text-2xl font-extrabold text-slate-900">How Pine Tar works</h2>
        <ol class="mt-6 space-y-5 text-slate-700">
          <li>
            <strong>1. Define the audience:</strong> We start with who needs to say yes, whether that is capital, sponsors, lenders, or public partners.
          </li>
          <li>
            <strong>2. Structure the story:</strong> We organize thesis, opportunity, team, projections, and use of funds into a sequence that reads cleanly.
          </li>
          <li>
            <strong>3. Support diligence:</strong> Financial assumptions and supporting assets stay explicit so the story can withstand review.
          </li>
          <li>
            <strong>4. Export and reuse:</strong> Once a deck works, it becomes a repeatable template for the next raise, partner meeting, or campaign.
          </li>
        </ol>
      </div>

      <aside class="rounded-2xl border border-slate-200 bg-slate-50 p-7">
        <h3 class="text-xl font-extrabold text-slate-900">Work with us</h3>
        <p class="mt-3 text-sm text-slate-600">
          Reviewing allocation options or evaluating your first sports investment mandate?
        </p>
        <div class="mt-6 flex flex-col gap-3">
          <NuxtLink to="/investments" class="btn btn-primary text-center">See live investments</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-ghost text-center">Contact investment team</NuxtLink>
        </div>
      </aside>
    </section>
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

const pillars = [
  {
    title: 'Audience-First Messaging',
    copy: 'Every deck is shaped around the decision-maker on the other side, not around generic presentation filler.',
  },
  {
    title: 'Structured Transparency',
    copy: 'Assumptions, project context, and use of funds stay visible so every conversation starts from the same factual base.',
  },
  {
    title: 'Reusable Deal Infrastructure',
    copy: 'Templates, assets, and export flows are built to be reused across multiple offerings instead of recreated each cycle.',
  },
]
</script>
