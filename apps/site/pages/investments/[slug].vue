<template>
  <div class="site-container py-16 md:py-20">
    <NuxtLink to="/investments" class="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900">
      &larr; Back to investments
    </NuxtLink>

    <div v-if="loading" class="py-16 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
    </div>

    <div v-else-if="deck" class="mt-8">
      <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p class="section-kicker">Investment detail</p>
          <h1 class="section-title mt-3 max-w-3xl">{{ deck.title }}</h1>
          <p class="mt-5 max-w-2xl text-lg text-slate-600">
            {{ deck.marketingMetadata?.summary || 'A structured sports opportunity with materials prepared for investor and partner review.' }}
          </p>

          <div class="mt-6 flex flex-wrap gap-2">
            <span v-for="tag in deck.marketingMetadata?.tags" :key="tag" class="chip">{{ tag }}</span>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <button class="btn btn-primary" @click="downloadDeck">Download pitch deck</button>
            <button class="btn btn-ghost" @click="shareDeck">Share opportunity</button>
          </div>
        </div>

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
      </section>

      <section class="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="h-64 bg-slate-100 md:h-80">
          <NuxtImg
            v-if="deck.marketingMetadata?.heroImageUrl"
            :src="deck.marketingMetadata.heroImageUrl"
            :alt="deck.title"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Presentation image pending
          </div>
        </div>
      </section>

      <section class="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article class="detail-panel">
          <h2 class="text-2xl font-extrabold text-slate-900">Investment summary</h2>
          <p class="mt-4 text-slate-600">
            This page is designed to show how Pine Tar frames a sports opportunity for capital conversations, with summary language,
            sector tags, downloadable materials, and a clear path into diligence.
          </p>
          <div class="mt-8 grid gap-4 md:grid-cols-2">
            <div class="mini-panel">
              <h3 class="font-bold text-slate-900">Why it stands out</h3>
              <p class="mt-2 text-sm text-slate-600">Clear positioning, disciplined use-of-funds language, and a repeatable structure for investor review.</p>
            </div>
            <div class="mini-panel">
              <h3 class="font-bold text-slate-900">Investor materials</h3>
              <p class="mt-2 text-sm text-slate-600">Public summary content, downloadable deck output, and shareable links are available directly from this page.</p>
            </div>
          </div>
        </article>

        <article class="detail-panel">
          <h2 class="text-2xl font-extrabold text-slate-900">Next steps</h2>
          <ol class="mt-5 space-y-4 text-sm text-slate-600">
            <li><strong>1.</strong> Review the summary and sector tags.</li>
            <li><strong>2.</strong> Download the latest deck for detailed terms and projections.</li>
            <li><strong>3.</strong> Share internally or contact our team to begin diligence.</li>
          </ol>
          <NuxtLink to="/contact" class="btn btn-primary mt-8">Contact investor relations</NuxtLink>
        </article>
      </section>
    </div>

    <div v-else class="mt-12 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
      <p class="text-lg font-semibold text-slate-700">Investment opportunity not found.</p>
      <p class="mt-2 text-sm text-slate-500">Return to the listing page to review currently published deals.</p>
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
