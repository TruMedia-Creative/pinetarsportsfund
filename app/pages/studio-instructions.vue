<script setup lang="ts">
definePageMeta({
  middleware: ['studio-auth']
})

useSeoMeta({
  title: 'Studio Investment Instructions - Pine Tar Sports Fund',
  description: 'Step-by-step guide for creating, updating, and publishing investment opportunity pages with Nuxt Studio content.'
})

const workflowSteps = [
  {
    title: 'Sign in to Studio',
    body: 'Visit /admin, enter your Studio credentials, and return to the site. When you are finished editing, visit /logout to clear the Studio session. In development, Studio is available automatically.'
  },
  {
    title: 'Create or open an investment entry',
    body: 'In Studio content, use the investments collection. New entries live under content/investments with filenames like summer-2026-investor.yml. Open an existing entry there when you want to modify a page instead of creating a new one.'
  },
  {
    title: 'Set top-level metadata first',
    body: 'Start with title, projectName, audienceType, and published. Add subtitle when you want supporting text on the listing card and detail page. Keep published set to false while drafting.'
  },
  {
    title: 'Edit sections in narrative order',
    body: 'Complete sections from cover through closingCta. The cover section is always rendered on the detail page. The remaining sections are optional and respect enabled: false when you want them hidden.'
  },
  {
    title: 'Review draft behavior',
    body: 'While published is false, the entry stays off the public /investments list and the public /investments/[slug] route returns 404. Use Studio to review the draft content before going live.'
  },
  {
    title: 'Publish and verify routes',
    body: 'Set published to true only when ready for public view. After publishing, verify the card appears on /investments and the full page renders at /investments/[slug].'
  }
]

const requiredFields = [
  'title (string, required)',
  'subtitle (string, optional)',
  'projectName (string, required)',
  'audienceType (investor | lender | sponsor | municipality | internal)',
  'published (boolean, defaults to false)'
]

const editNotes = [
  'The filename under content/investments becomes the slug used at /investments/[slug].',
  'Open an existing investments entry when you need to change copy, media, or section data without changing the URL.',
  'Rename the YAML file only when you intentionally want to change the public slug.',
  'Optional sections may be omitted entirely or left in place with enabled: false.'
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
  'File name matches the final slug you want under /investments/[slug]',
  'Title, subtitle, projectName, and audience badge are correct',
  'Contact emails and CTA links are valid',
  'Any optional sections are intentionally omitted or disabled with enabled: false',
  'After publishing, the page loads at /investments/[slug] with no missing content blocks',
  'After publishing, the listing card appears correctly on /investments'
]

const starterTemplate = `title: Summer 2026 Investor Opportunity
subtitle: Preferred equity raise for a new multi-use sports complex
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

market:
  enabled: true
  body: Summarize the local demand, audience, and market timing.

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
        Studio Guide: Add or Update Investment Pages
      </template>
      <template #description>
        This page walks your team through creating, editing, validating, and publishing investment opportunity content using Nuxt Studio and the investments YAML schema.
      </template>
    </UPageHero>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
      <UPageSection
        title="Workflow"
        description="Use this flow when you add a new investment page or update an existing one."
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
        title="Top-Level Metadata"
        description="These fields drive collection validation and the public page summary."
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
        title="Modify Existing Pages"
        description="Use these rules when you are editing an entry that already exists."
        :ui="{
          container: 'max-w-none px-0 sm:px-0 lg:px-0',
          title: 'text-2xl',
          description: 'text-dimmed'
        }"
      >
        <UCard :ui="{ body: 'p-6' }">
          <ul class="space-y-2 text-sm">
            <li
              v-for="note in editNotes"
              :key="note"
              class="flex items-start gap-2"
            >
              <UIcon
                name="i-lucide-file-pen-line"
                class="size-4 mt-0.5 text-primary"
              />
              <span>{{ note }}</span>
            </li>
          </ul>
        </UCard>
      </UPageSection>

      <UPageSection
        title="Section Order"
        description="Investment pages render in this fixed narrative sequence. cover always renders; the remaining sections are optional."
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
        description="Use this as a clean baseline when creating a new file under content/investments."
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
        description="Run this check before making an investment page public."
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
