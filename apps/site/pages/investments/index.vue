<template>
  <div>
    <!-- ===== DARK HERO ===== -->
    <div class="page-hero-dark">
      <div class="relative z-10 site-container text-center">
        <div class="section-badge mb-6">
          <span>Investments</span>
        </div>
        <h1
          class="mx-auto max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl"
        >
          Current opportunities
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-400">
          Browse active opportunities and sample deck narratives spanning investor raises,
          sponsorship positioning, and venue-backed development stories.
        </p>
      </div>
    </div>

    <!-- ===== CARD GRID ===== -->
    <div class="py-16 sm:py-20" style="background: var(--color-bg)">
      <div class="site-container">
        <!-- Skeleton loading -->
        <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="investment-card">
            <div class="skeleton aspect-video w-full rounded-xl" />
            <div class="mt-5 space-y-3">
              <div class="skeleton h-6 w-3/4 rounded" />
              <div class="skeleton h-4 w-full rounded" />
              <div class="skeleton h-4 w-5/6 rounded" />
              <div class="mt-4 flex gap-2">
                <div class="skeleton h-5 w-16 rounded-full" />
                <div class="skeleton h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- Deck cards -->
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="deck in publishedDecks"
            :key="deck.id"
            class="investment-card group"
            @click="navigateTo(`/investments/${deck.slugForPublic}`)"
          >
            <!-- Image with gradient overlay -->
            <div class="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
              <NuxtImg
                v-if="deck.marketingMetadata?.heroImageUrl"
                :src="deck.marketingMetadata.heroImageUrl"
                :alt="deck.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                Image pending
              </div>
              <!-- Hover gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <div class="mt-5">
              <div class="flex items-start justify-between gap-3">
                <h2 class="text-lg font-bold leading-snug text-slate-900">{{ deck.title }}</h2>
                <!-- Status badge -->
                <span class="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Open
                </span>
              </div>

              <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                {{ deck.marketingMetadata?.summary || 'Summary will be provided in deck details.' }}
              </p>

              <div class="mt-4 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in deck.marketingMetadata?.tags"
                  :key="tag"
                  class="chip"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span class="text-slate-400 text-xs">
                  {{ formatExpiry(deck.marketingMetadata?.expiresAt) }}
                </span>
                <NuxtLink
                  :to="`/investments/${deck.slugForPublic}`"
                  class="inline-flex items-center gap-1 font-bold text-slate-800 transition-colors hover:text-amber-700"
                >
                  View details
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div
          v-if="!loading && publishedDecks.length === 0"
          class="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-14 text-center"
        >
          <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="text-slate-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
            </svg>
          </div>
          <p class="text-base font-bold text-slate-700">No active offerings right now</p>
          <p class="mt-2 text-sm text-slate-500">
            Check back soon or contact our team for upcoming opportunities.
          </p>
          <NuxtLink to="/contact" class="btn btn-ghost mt-6 text-sm">
            Contact the team
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '~/lib/schemas'

definePageMeta({
  layout: 'default',
})

usePageSeo({
  title: 'Investments',
  description:
    'Review active Pine Tar Sports Fund opportunities and sample sports investment narratives across investor, sponsor, and venue-backed stories.',
  path: '/investments',
})

const decks = ref<Deck[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await $fetch<Deck[]>('/api/decks', { query: { published: 'true' } })
    decks.value = response || []
  } catch (error) {
    console.error('Failed to load decks:', error)
  } finally {
    loading.value = false
  }
})

const publishedDecks = computed(() => {
  return decks.value.filter((d) => d.published)
})

const formatExpiry = (expiresAt?: string) => {
  if (!expiresAt) {
    return 'Rolling review window'
  }

  const parsed = new Date(expiresAt)
  if (Number.isNaN(parsed.valueOf())) {
    return 'Rolling review window'
  }

  return `Window closes ${parsed.toLocaleDateString()}`
}
</script>
