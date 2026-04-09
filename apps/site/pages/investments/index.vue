<template>
  <div class="site-container py-16 md:py-20">
    <p class="section-kicker">Investments</p>
    <h1 class="section-title mt-3">Current opportunities</h1>
    <p class="mt-4 max-w-3xl text-slate-600">
      Browse active opportunities and sample deck narratives spanning investor raises, sponsorship positioning, and venue-backed development stories.
    </p>

    <div v-if="loading" class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
    </div>

    <div v-else class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="deck in publishedDecks"
        :key="deck.id"
        class="investment-card group"
        @click="navigateTo(`/investments/${deck.slugForPublic}`)"
      >
        <div class="h-44 overflow-hidden rounded-xl bg-slate-100">
          <NuxtImg
            v-if="deck.marketingMetadata?.heroImageUrl"
            :src="deck.marketingMetadata.heroImageUrl"
            :alt="deck.title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="h-full w-full flex items-center justify-center text-sm text-slate-400">
            Image pending
          </div>
        </div>

        <div class="mt-5">
          <h2 class="text-xl font-extrabold text-slate-900">{{ deck.title }}</h2>
          <p class="mt-2 text-sm text-slate-600">{{ deck.marketingMetadata?.summary || 'Summary will be provided in deck details.' }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in deck.marketingMetadata?.tags"
              :key="tag"
              class="chip"
            >
              {{ tag }}
            </span>
          </div>

          <div class="mt-6 flex items-center justify-between text-sm">
            <span class="text-slate-500">
              {{ formatExpiry(deck.marketingMetadata?.expiresAt) }}
            </span>
            <NuxtLink
              :to="`/investments/${deck.slugForPublic}`"
              class="font-semibold text-slate-900 transition-colors hover:text-sky-700"
            >
              View details
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <div v-if="!loading && publishedDecks.length === 0" class="mt-14 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
      <p class="text-lg font-semibold text-slate-700">No active offerings right now.</p>
      <p class="mt-2 text-sm text-slate-500">Check back soon or contact our team for upcoming opportunities.</p>
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
