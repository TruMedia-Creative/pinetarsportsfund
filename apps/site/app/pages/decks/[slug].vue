<script setup lang="ts">
definePageMeta({
  colorMode: 'dark'
})

const route = useRoute()
const slug = route.params.slug as string

const { data: deck } = await useAsyncData(`deck-${slug}`, () =>
  queryCollection('decks').where('stem', 'LIKE', `%${slug}`).first()
)

// 404 if not found or not published
if (!deck.value || !deck.value.published) {
  throw createError({ statusCode: 404, statusMessage: 'Deck not found', fatal: true })
}

useSeoMeta({
  title: `${deck.value.title} — Pine Tar Sports Fund`,
  description: deck.value.subtitle || `${deck.value.projectName} offering deck from Pine Tar Sports Fund.`
})
</script>

<template>
  <div
    v-if="deck"
    class="min-h-screen"
  >
    <!-- Back nav -->
    <div class="max-w-6xl mx-auto px-6 pt-8">
      <UButton
        label="All Decks"
        to="/decks"
        color="neutral"
        variant="ghost"
        size="sm"
        leading-icon="i-lucide-arrow-left"
      />
    </div>

    <!-- Cover (always shown) -->
    <DeckCover
      :title="deck.title"
      :subtitle="deck.subtitle"
      :project-name="deck.projectName"
      :audience-type="deck.audienceType"
      v-bind="deck.cover"
    />

    <!-- Sections in fixed narrative order -->

    <DeckExecutiveSummary
      v-if="deck.executiveSummary?.enabled !== false"
      v-bind="deck.executiveSummary"
    />

    <DeckInvestmentThesis
      v-if="deck.investmentThesis?.enabled !== false && deck.investmentThesis"
      v-bind="deck.investmentThesis"
    />

    <DeckOpportunity
      v-if="deck.opportunity?.enabled !== false && deck.opportunity"
      v-bind="deck.opportunity"
    />

    <DeckMarket
      v-if="deck.market?.enabled !== false && deck.market"
      v-bind="deck.market"
    />

    <DeckProjectOverview
      v-if="deck.projectOverview?.enabled !== false && deck.projectOverview"
      v-bind="deck.projectOverview"
    />

    <DeckTeam
      v-if="deck.team?.enabled !== false && deck.team"
      v-bind="deck.team"
    />

    <DeckUseOfFunds
      v-if="deck.useOfFunds?.enabled !== false && deck.useOfFunds"
      v-bind="deck.useOfFunds"
    />

    <DeckReturns
      v-if="deck.returns?.enabled !== false && deck.returns"
      v-bind="deck.returns"
    />

    <DeckProjections
      v-if="deck.projections?.enabled !== false && deck.projections"
      v-bind="deck.projections"
    />

    <DeckRisksDisclaimer
      v-if="deck.risksDisclaimer?.enabled !== false && deck.risksDisclaimer"
      v-bind="deck.risksDisclaimer"
    />

    <DeckClosingCta
      v-if="deck.closingCta?.enabled !== false && deck.closingCta"
      v-bind="deck.closingCta"
    />
  </div>
</template>
