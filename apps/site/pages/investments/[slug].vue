<template>
  <div>
    <div class="site-container pb-16 pt-8 md:pb-20 md:pt-10">
      <!-- Back nav -->
      <NuxtLink
        to="/investments"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All investments
      </NuxtLink>

      <!-- Loading skeleton -->
      <div v-if="loading" class="mt-8 space-y-6">
        <div class="skeleton h-[380px] w-full rounded-[1.75rem]" />
        <div class="skeleton h-10 w-2/3 rounded-lg" />
        <div class="skeleton h-5 w-full rounded" />
        <div class="skeleton h-5 w-4/5 rounded" />
      </div>

      <!-- Content -->
      <div v-else-if="deck" class="mt-8">
        <!-- Hero image with overlaid title -->
        <div class="investment-hero">
          <img
            v-if="deck.marketingMetadata?.heroImageUrl"
            :src="deck.marketingMetadata.heroImageUrl"
            :alt="deck.title"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div v-else class="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
          <div class="investment-hero__overlay" />
          <div class="investment-hero__content">
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in deck.marketingMetadata?.tags" :key="tag"
                class="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white/80 backdrop-blur-sm">
                {{ tag }}
              </span>
            </div>
            <h1 class="text-3xl font-bold leading-snug tracking-tight text-white sm:text-4xl">
              {{ deck.title }}
            </h1>
          </div>
        </div>

        <!-- Summary + sidebar -->
        <div class="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <!-- Summary -->
          <div>
            <p class="section-kicker">Investment overview</p>
            <p class="mt-4 text-lg leading-relaxed text-slate-600">
              {{ deck.marketingMetadata?.summary || 'A structured sports opportunity with materials prepared for investor and partner review.' }}
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <button class="btn btn-primary" @click="downloadDeck">Download pitch deck</button>
              <button class="btn btn-ghost" @click="shareDeck">Share opportunity</button>
            </div>
          </div>

          <!-- Stat sidebar -->
          <aside class="detail-sidebar">
            <div class="detail-stat-card">
              <p class="detail-stat-label">Opportunity window</p>
              <p class="detail-stat-value">{{ formatExpiry(deck.marketingMetadata?.expiresAt) }}</p>
            </div>
            <div class="detail-stat-card">
              <p class="detail-stat-label">Distribution</p>
              <p class="detail-stat-value">Qualified investors and strategic partners</p>
            </div>
            <div class="detail-stat-card">
              <p class="detail-stat-label">Status</p>
              <p class="detail-stat-value">{{ deck.published ? 'Open for review' : 'Private review only' }}</p>
            </div>
          </aside>
        </div>

        <!-- Detail panels -->
        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <article class="detail-panel">
            <h2 class="text-xl font-bold text-slate-900">Investment summary</h2>
            <p class="mt-4 text-sm leading-relaxed text-slate-600">
              This page is designed to show how Pine Tar frames a sports opportunity for capital
              conversations, with summary language, sector tags, downloadable materials, and a clear
              path into diligence.
            </p>
            <div class="mt-7 grid gap-4 sm:grid-cols-2">
              <div class="mini-panel">
                <h3 class="text-sm font-bold text-slate-900">Why it stands out</h3>
                <p class="mt-2 text-xs leading-relaxed text-slate-500">
                  Clear positioning, disciplined use-of-funds language, and a repeatable structure
                  for investor review.
                </p>
              </div>
              <div class="mini-panel">
                <h3 class="text-sm font-bold text-slate-900">Investor materials</h3>
                <p class="mt-2 text-xs leading-relaxed text-slate-500">
                  Public summary content, downloadable deck output, and shareable links available
                  from this page.
                </p>
              </div>
            </div>
          </article>

          <article class="detail-panel">
            <h2 class="text-xl font-bold text-slate-900">Next steps</h2>
            <ol class="mt-5 space-y-4">
              <li class="flex gap-4 text-sm text-slate-600">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-slate-800 border border-slate-200">1</span>
                Review the summary and sector tags above.
              </li>
              <li class="flex gap-4 text-sm text-slate-600">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-slate-800 border border-slate-200">2</span>
                Download the latest deck for detailed terms and projections.
              </li>
              <li class="flex gap-4 text-sm text-slate-600">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-slate-800 border border-slate-200">3</span>
                Share internally or contact our team to begin diligence.
              </li>
            </ol>
            <NuxtLink to="/contact" class="btn btn-primary mt-8">Contact investor relations</NuxtLink>
          </article>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <p class="text-base font-bold text-slate-700">Investment opportunity not found.</p>
        <p class="mt-2 text-sm text-slate-500">
          Return to the listing page to review currently published deals.
        </p>
        <NuxtLink to="/investments" class="btn btn-ghost mt-6">Back to investments</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '~/lib/schemas'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const slug = route.params.slug as string
const deck = ref<Deck | null>(null)
const loading = ref(true)

usePageSeo({
  title: () => deck.value?.title || 'Investment Opportunity',
  description: () => deck.value?.marketingMetadata?.summary || 'Review a Pine Tar Sports Fund opportunity overview and downloadable deck materials.',
  path: () => route.path,
  image: () => deck.value?.marketingMetadata?.heroImageUrl || '/pine-tar-og.svg',
  type: 'article',
})

onMounted(async () => {
  try {
    const response = await $fetch<Deck>(`/api/decks/${slug}`)
    deck.value = response
  } catch (error) {
    console.error('Failed to load deck:', error)
  } finally {
    loading.value = false
  }
})

const downloadDeck = async () => {
  if (!deck.value) return
  try {
    const response = await $fetch<string>(`/api/decks/${deck.value.id}/export`, {
      responseType: 'text',
    })
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${deck.value.slug}.pptx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download deck:', error)
  }
}

const shareDeck = () => {
  if (!deck.value) return
  if (navigator.share) {
    navigator.share({
      title: deck.value.title,
      text: deck.value.marketingMetadata?.summary,
      url: window.location.href,
    })
  } else {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard.')
  }
}

const formatExpiry = (expiresAt?: string) => {
  if (!expiresAt) {
    return 'Rolling review'
  }

  const parsed = new Date(expiresAt)
  if (Number.isNaN(parsed.valueOf())) {
    return 'Rolling review'
  }

  return parsed.toLocaleDateString()
}
</script>
