<script setup lang="ts">
const { data: decks } = await useAsyncData('decks-list', () =>
  queryCollection('decks').all()
)

// Guard: only show published decks to public viewers.
// Studio's real-time preview bypasses this since it renders the raw data.
const visibleDecks = computed(() =>
  (decks.value ?? []).filter(d => d.published)
)

const audienceLabels: Record<string, string> = {
  investor: 'Investor',
  lender: 'Lender',
  sponsor: 'Sponsor',
  municipality: 'Municipality',
  internal: 'Internal'
}

const audienceColors: Record<string, string> = {
  investor: 'primary',
  lender: 'success',
  sponsor: 'warning',
  municipality: 'info',
  internal: 'neutral'
}

useSeoMeta({
  title: 'Investment Decks — Pine Tar Sports Fund',
  description: 'Browse active investment, sponsorship, and partnership decks from Pine Tar Sports Fund.'
})
</script>

<template>
  <div>
    <UPageHero
      :ui="{
        root: 'pb-16 pt-24',
        container: 'max-w-5xl',
        title: 'sm:text-4xl lg:text-5xl'
      }"
    >
      <template #title>
        Active Offering Decks
      </template>
      <template #description>
        Browse current investment, sponsorship, and partnership opportunities from Pine Tar Sports Fund. All offerings are available to qualified accredited investors.
      </template>
    </UPageHero>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      <div
        v-if="visibleDecks.length"
        class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="deck in visibleDecks"
          :key="deck.stem"
          :to="`/decks/${deck.stem?.split('/').pop()}`"
          class="block group"
        >
          <UCard
            class="h-full transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-lg"
            :ui="{ body: 'p-6 space-y-4' }"
          >
            <div class="flex items-start justify-between gap-4">
              <h2 class="font-semibold leading-tight group-hover:text-primary transition-colors">
                {{ deck.title }}
              </h2>
              <UBadge
                :color="(audienceColors[deck.audienceType] as never) || 'neutral'"
                variant="subtle"
                size="sm"
                class="shrink-0"
              >
                {{ audienceLabels[deck.audienceType] || deck.audienceType }}
              </UBadge>
            </div>

            <p
              v-if="deck.subtitle"
              class="text-sm text-dimmed leading-relaxed"
            >
              {{ deck.subtitle }}
            </p>

            <div class="flex items-center justify-between pt-2 border-t border-default">
              <p class="text-xs font-mono text-dimmed">
                {{ deck.projectName }}
              </p>
              <UIcon
                name="i-lucide-arrow-right"
                class="text-dimmed group-hover:text-primary group-hover:translate-x-0.5 transition-all size-4"
              />
            </div>
          </UCard>
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-24"
      >
        <UIcon
          name="i-lucide-file-x"
          class="size-12 text-dimmed mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold mb-2">
          No active decks
        </h3>
        <p class="text-dimmed text-sm max-w-sm mx-auto">
          No publicly available offering decks at this time. Check back soon or contact us directly.
        </p>
        <UButton
          label="Contact Us"
          class="mt-6"
          color="primary"
          to="mailto:info@pinetarsportsfund.com"
        />
      </div>
    </div>
  </div>
</template>
