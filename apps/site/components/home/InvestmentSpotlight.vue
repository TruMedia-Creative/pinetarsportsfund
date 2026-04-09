<template>
  <div
    v-if="featured"
    class="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px">
      <!-- Image side -->
      <div class="relative min-h-[280px] bg-neutral-950">
        <img
          :src="featured.marketingMetadata?.heroImageUrl ?? fallbackImage"
          :alt="featured.title"
          class="h-full w-full object-cover"
          style="min-height: 280px"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-neutral-950/40 to-transparent" />
      </div>

      <!-- Body side -->
      <div class="bg-neutral-950 px-8 py-10 flex flex-col justify-center">
        <p class="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500">
          Featured opportunity
        </p>
        <h3 class="mt-3 text-2xl font-bold leading-snug tracking-tight text-white">
          {{ featured.title }}
        </h3>
        <p v-if="featured.marketingMetadata?.summary" class="mt-3 text-sm leading-relaxed text-neutral-400">
          {{ featured.marketingMetadata.summary }}
        </p>
        <div v-if="featured.marketingMetadata?.tags?.length" class="mt-5 flex flex-wrap gap-2">
          <span
            v-for="tag in featured.marketingMetadata.tags"
            :key="tag"
            class="rounded-full border border-amber-500/25 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-400"
          >
            {{ tag }}
          </span>
        </div>
        <NuxtLink
          :to="`/investments/${featured.slugForPublic ?? featured.slug}`"
          class="mt-8 inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
        >
          View opportunity
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>

  <div
    v-else-if="loading"
    class="rounded-2xl border border-neutral-800 bg-neutral-950 p-12 text-center text-sm text-neutral-600"
  >
    Loading opportunities…
  </div>

  <div
    v-else
    class="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950 p-10 text-center text-sm text-neutral-600"
  >
    No featured opportunities at this time.
  </div>
</template>

<script setup lang="ts">
const fallbackImage =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'

const { decks, loading } = usePublishedDecks()

const featured = computed(() => decks.value[0] ?? null)
</script>
