<script setup lang="ts">
definePageMeta({
  middleware: ['studio-auth']
})

useSeoMeta({
  title: 'Studio Deck Instructions - Pine Tar Sports Fund',
  description: 'Step-by-step guide for creating and publishing new pitch decks with Nuxt Studio content.'
})

const workflowSteps = [
  {
    title: 'Sign in to Studio',
    body: 'Visit /admin, enter your Studio credentials, and return to the site. When you are finished editing, visit /logout to clear the Studio session. In development, Studio is available automatically.'
  },
  {
    title: 'Create a new deck file',
    body: 'In Studio content, open the decks collection and create a new entry under content/decks. Use a clean filename slug like summer-2026-investor.yml.'
  },
  {
    title: 'Fill the required metadata first',
    body: 'Start with title, projectName, audienceType, and published. Keep published set to false while drafting.'
  },
  {
    title: 'Build sections in narrative order',
    body: 'Complete sections from cover through closingCta. Toggle enabled false for sections you do not want rendered.'
  },
  {
    title: 'Preview and validate',
    body: 'Preview /decks/[your-slug] to verify the deck rendering and /decks to confirm list behavior before publishing.'
  },
  {
    title: 'Publish',
    body: 'Set published to true only when ready for public view. Once published, the deck appears on /decks and the direct slug route.'
  }
]

const requiredFields = [
  'title (string, required)',
  'projectName (string, required)',
  'audienceType (investor | lender | sponsor | municipality | internal)',
  'published (boolean, defaults to false)'
]

const sectionOrder = [
  'cover',
  'executiveSummary',
  'investmentThesis',
  'opportunity',
  'market',
  'projectOverview',
  'team',
  'useOfFunds',
  'returns',
  'projections',
  'risksDisclaimer',
  'closingCta'
]

const publishChecklist = [
  'Deck loads at /decks/[slug] with no missing content blocks',
  'Audience badge and title are correct on /decks listing',
  'Contact emails and CTA links are valid',
  'Any optional sections are intentionally disabled with enabled: false',
  'published is set to true only for final/public decks'
]

const starterTemplate = `title: Summer 2026 Investor Deck
projectName: Example Sports Complex
audienceType: investor
published: false

cover:
  enabled: true
  tagline: Investment Opportunity
  contactName: Your Name
  contactTitle: Managing Partner
  company: Pine Tar Sports Fund

executiveSummary:
  enabled: true
  body: Add a concise investment summary.

opportunity:
  enabled: true
  body: Explain why this raise window matters now.

closingCta:
  enabled: true
  ctaText: Request Data Room Access
  ctaUrl: mailto:invest@pinetarsportsfund.com`
</script>

<template>
  <div>
    <UPageHero
      :ui="{
        root: 'pt-24 pb-14',
        container: 'max-w-5xl',
        title: 'sm:text-4xl lg:text-5xl',
        description: 'max-w-3xl text-base sm:text-lg leading-relaxed'
      }"
    >
      <template #title>
        Studio Guide: Create New Pitch Decks
      </template>
      <template #description>
        This page walks your team through creating, drafting, validating, and publishing new deck content using Nuxt Studio and the decks YAML schema.
      </template>
    </UPageHero>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
      <UPageSection
        title="Workflow"
        description="Follow this sequence each time you launch a new deck."
        :ui="{
          container: 'max-w-none px-0 sm:px-0 lg:px-0',
          title: 'text-2xl',
          description: 'text-dimmed'
        }"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UCard
            v-for="(step, index) in workflowSteps"
            :key="step.title"
            :ui="{ body: 'p-5 space-y-2' }"
          >
            <p class="text-xs font-mono text-primary uppercase tracking-wide">
              Step {{ index + 1 }}
            </p>
            <h3 class="text-base font-semibold">
              {{ step.title }}
            </h3>
            <p class="text-sm text-dimmed leading-relaxed">
              {{ step.body }}
            </p>
          </UCard>
        </div>
      </UPageSection>

      <UPageSection
        title="Required Deck Metadata"
        description="These fields must be present to satisfy the decks collection schema."
        :ui="{
          container: 'max-w-none px-0 sm:px-0 lg:px-0',
          title: 'text-2xl',
          description: 'text-dimmed'
        }"
      >
        <UCard :ui="{ body: 'p-6' }">
          <ul class="space-y-2 text-sm">
            <li
              v-for="field in requiredFields"
              :key="field"
              class="flex items-start gap-2"
            >
              <UIcon
                name="i-lucide-check-circle-2"
                class="size-4 mt-0.5 text-primary"
              />
              <span>{{ field }}</span>
            </li>
          </ul>
        </UCard>
      </UPageSection>

      <UPageSection
        title="Section Order"
        description="Deck pages render in this fixed narrative sequence."
        :ui="{
          container: 'max-w-none px-0 sm:px-0 lg:px-0',
          title: 'text-2xl',
          description: 'text-dimmed'
        }"
      >
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <UCard
            v-for="(section, index) in sectionOrder"
            :key="section"
            :ui="{ body: 'p-4 flex items-center gap-3' }"
          >
            <UBadge
              color="neutral"
              variant="soft"
            >
              {{ index + 1 }}
            </UBadge>
            <span class="text-sm font-medium">{{ section }}</span>
          </UCard>
        </div>
      </UPageSection>

      <UPageSection
        title="Starter Template"
        description="Use this as a clean baseline when creating a new deck file."
        :ui="{
          container: 'max-w-none px-0 sm:px-0 lg:px-0',
          title: 'text-2xl',
          description: 'text-dimmed'
        }"
      >
        <UCard :ui="{ body: 'p-0 overflow-hidden' }">
          <pre class="overflow-x-auto p-5 text-xs sm:text-sm bg-elevated text-toned"><code>{{ starterTemplate }}</code></pre>
        </UCard>
      </UPageSection>

      <UPageSection
        title="Pre-Publish Checklist"
        description="Run this check before making a deck public."
        :ui="{
          container: 'max-w-none px-0 sm:px-0 lg:px-0',
          title: 'text-2xl',
          description: 'text-dimmed'
        }"
      >
        <UCard :ui="{ body: 'p-6' }">
          <ul class="space-y-2 text-sm">
            <li
              v-for="item in publishChecklist"
              :key="item"
              class="flex items-start gap-2"
            >
              <UIcon
                name="i-lucide-circle-check"
                class="size-4 mt-0.5 text-success"
              />
              <span>{{ item }}</span>
            </li>
          </ul>
        </UCard>
      </UPageSection>
    </div>
  </div>
</template>
