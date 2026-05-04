<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: deck } = await useAsyncData(`project-${slug}`, () =>
  queryCollection('projects').where('stem', '=', `projects/${slug}`).first()
)

if (!deck.value || !deck.value.published) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const deckDescription = deck.value.subtitle || `${deck.value.projectName} — operational youth sports complex from Pine Tar Sports Fund.`

useSeoMeta({
  title: `${deck.value.title} — Pine Tar Sports Fund`,
  description: deckDescription
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
        label="All Projects"
        to="/projects"
        color="neutral"
        variant="ghost"
        size="sm"
        leading-icon="i-lucide-arrow-left"
      />
    </div>

    <!-- Cover (always shown) -->
    <DeckCover
      :title="deck.title"
      :deck-subtitle="deck.subtitle"
      :project-name="deck.projectName"
      :audience-type="deck.audienceType"
      v-bind="deck.cover"
    />

    <!-- Sections in fixed narrative order -->

    <DeckExecutiveSummary
      v-if="deck.executiveSummary?.enabled !== false"
      v-bind="deck.executiveSummary"
    />

    <DeckProjectOverview
      v-if="deck.projectOverview?.enabled !== false && deck.projectOverview"
      v-bind="deck.projectOverview"
    />

    <DeckProjectMap
      v-if="deck.location"
      v-bind="deck.location"
    />

    <DeckMarket
      v-if="deck.market?.enabled !== false && deck.market"
      v-bind="deck.market"
    />

    <DeckOperationalPerformance
      v-if="deck.operationalPerformance?.enabled !== false && deck.operationalPerformance"
      v-bind="deck.operationalPerformance"
    />

    <DeckTeam
      v-if="deck.team?.enabled !== false && deck.team"
      v-bind="deck.team"
    />

    <DeckInvestmentThesis
      v-if="deck.investmentThesis?.enabled !== false && deck.investmentThesis"
      v-bind="deck.investmentThesis"
    />

    <DeckReturns
      v-if="deck.returns?.enabled !== false && deck.returns"
      v-bind="deck.returns"
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
