<script setup lang="ts">
definePageMeta({
  middleware: ['studio-auth']
})

useSeoMeta({
  title: 'Studio Guide: Investment & Project Pages - Pine Tar Sports Fund',
  description: 'Step-by-step guide for creating, editing, and publishing investment opportunities and operational project pages with Nuxt Studio.'
})

const workflowSteps = [
  {
    title: 'Sign in to Studio',
    body: 'Visit /admin and enter your Studio credentials. After login, use the header links for Studio Guide and Logout while the Studio session is active. In development, Studio is available automatically.'
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

const editorFaq = [
  {
    question: 'How do I add a photo when replacing a URL?',
    answer: 'Open the image field in Studio and use the media picker. Replace only the value for the image field you want to change.',
    fields: [
      'cover.heroImageUrl',
      'any sectionImage.url (for example investmentThesis.sectionImage.url)',
      'projectOverview.images[].url',
      'team.members[].imageUrl'
    ],
    appearsIn: 'The matching section where that image field is used on /investments/[slug].'
  },
  {
    question: 'How do I edit bullets like Proven Phase I, Anchor Tenant, Scarcity Value, and Experienced Operator?',
    answer: 'Edit the bullet list items directly in the investment thesis section.',
    fields: [
      'investmentThesis.bullets',
      'opportunity.bullets (if you need to update phase bullets in the Phases section)'
    ],
    appearsIn: 'investmentThesis.bullets renders in the Investment Thesis section; opportunity.bullets renders in the Phases/Opportunity section.'
  },
  {
    question: 'How do I edit content under phases?',
    answer: 'There are two phase content areas: timeline labels and narrative copy.',
    fields: [
      'returns.timelineItems[].phase (phase labels in timeline)',
      'opportunity.body (phase narrative copy)',
      'projectOverview.body (long-form phase details)'
    ],
    appearsIn: 'Timeline phase chips render in Returns, while body copy renders in the Opportunity and Project Overview sections.'
  },
  {
    question: 'Where do I edit text for Dugout Howe Complex Phase II consists of ... ?',
    answer: 'That text is not in Phase I budget fields. It is stored in the project overview body content.',
    fields: [
      'projectOverview.body'
    ],
    appearsIn: 'Project Overview section on the investment detail page.'
  }
]

const mediaFieldTips = [
  'Image fields use Studio media input and usually store a project-relative path such as /howe-phases.png.',
  'Use sectionImage.layout to control placement: hidden, right, left, or banner-top.',
  'If an image update does not appear, confirm you edited the correct section for that page and that the section is enabled.'
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

// ── Projects tab data ────────────────────────────────────────────────────────

const projectsWorkflowSteps = [
  {
    title: 'Open the project YML in Studio',
    body: 'In Studio content, open the projects collection. The four current entries are dugout-greenville.yml, dugout-whitewright.yml, dugout-millsap.yml, and dugout-temple.yml. Open the one you want to edit.'
  },
  {
    title: 'Upload photos to the public folder',
    body: 'Add photos to public/projects/dugout-{slug}/ (e.g. public/projects/dugout-greenville/). Reference them in the YML as /projects/dugout-greenville/hero.jpg. Use descriptive filenames: hero.jpg for the main cover, photo-1.jpg, photo-2.jpg for the gallery.'
  },
  {
    title: 'Set the location and map embed URL',
    body: 'Fill in location.address, city, state, and zip. For the map: go to maps.google.com → search the address → click Share → Embed a map → copy only the src value from the iframe code (it looks like https://www.google.com/maps/embed?pb=...). Paste that into location.mapEmbedUrl.'
  },
  {
    title: 'Fill in operational performance data',
    body: 'Complete the operationalPerformance section: since (year opened, e.g. "March 2023"), acreage, fields array (type + count per field type), capacityPercent (0–100), annualRevenue, eventTypes list, and anchorTenants list. These power the stat grid on the detail page.'
  },
  {
    title: 'Complete the remaining sections',
    body: 'Work through cover (hero photo + contact info), executiveSummary, projectOverview (gallery images + body copy), market (demo metrics), team (member bios + photos), investmentThesis (labeled "Expansion Opportunity"), returns, risksDisclaimer, and closingCta.'
  },
  {
    title: 'Set published: true and verify',
    body: 'Keep published: false while drafting. Once all required fields are filled, set published: true. Verify the card appears on /projects and the detail page loads at /projects/dugout-{slug} with no missing content blocks.'
  }
]

const projectsRequiredFields = [
  'title (string, required)',
  'subtitle (string, optional — shown on the listing card)',
  'projectName (string, required)',
  'audienceType (investor | lender | sponsor | municipality | internal)',
  'published (boolean, defaults to false)',
  'location.address (string)',
  'location.city (string)',
  'location.state (string)',
  'location.zip (string)',
  'location.mapEmbedUrl (Google Maps embed src URL)'
]

const projectsOperationalFields = [
  'since — year or date the facility opened (e.g. "March 2023")',
  'acreage — total site size as a string (e.g. "12.4 acres")',
  'fields — array of { type, count } (e.g. type: "Baseball", count: 4)',
  'capacityPercent — integer 0–100 representing average occupancy',
  'annualRevenue — formatted revenue string (e.g. "$420,000")',
  'eventTypes — array of strings (e.g. ["Tournaments", "League Play", "Field Rentals"])',
  'anchorTenants — array of tenant/partner names (leave empty if none yet)'
]

const projectsSectionOrder = [
  { name: 'cover', note: 'Always shown' },
  { name: 'executiveSummary', note: 'Optional' },
  { name: 'projectOverview', note: 'Photos + body' },
  { name: 'location (map)', note: 'Auto from location fields' },
  { name: 'market', note: 'Demo metrics' },
  { name: 'operationalPerformance', note: 'Stats + field breakdown' },
  { name: 'team', note: 'Member bios' },
  { name: 'investmentThesis', note: 'Labeled "Expansion Opportunity"' },
  { name: 'returns', note: 'Timeline + metrics' },
  { name: 'risksDisclaimer', note: 'Required for investor decks' },
  { name: 'closingCta', note: 'Final call to action' }
]

const projectsMediaTips = [
  'Hero image: set cover.heroImageUrl to /projects/dugout-{slug}/hero.jpg — this is the large background on the cover section.',
  'Gallery images: add items to projectOverview.images[]. Each needs a url and alt field.',
  'Team photos: set team.members[].imageUrl to /projects/dugout-{slug}/team-{name}.jpg.',
  'Google Maps embed URL: go to maps.google.com → search address → Share → "Embed a map" tab → copy the src attribute value only (not the full iframe tag).',
  'If a photo does not appear, confirm the file is in the correct public/projects/dugout-{slug}/ folder and the path in the YML starts with /projects/.'
]

const projectsPublishChecklist = [
  'All photos in public/projects/dugout-{slug}/ and paths in YML match exactly',
  'location.mapEmbedUrl is a valid Google Maps embed src URL (visit the detail page to confirm the map loads)',
  'operationalPerformance fields are filled: since, acreage, fields, capacityPercent, annualRevenue, eventTypes',
  'cover.heroImageUrl, contactName, contactTitle, and company are set',
  'closingCta.ctaUrl is a valid mailto or link',
  'published: false while still drafting — set to true only when ready',
  'After publishing: card appears on /projects with city/state and "Operational" badge',
  'After publishing: detail page loads at /projects/dugout-{slug} with no missing sections'
]

const projectsStarterTemplate = `title: Dugout Greenville
subtitle: Operational Youth Sports Complex — Greenville, TX
projectName: Dugout Greenville
audienceType: investor
published: false

location:
  address: 123 Main St
  city: Greenville
  state: TX
  zip: 75401
  mapEmbedUrl: https://www.google.com/maps/embed?pb=...

cover:
  enabled: true
  tagline: Investment Opportunity
  heroImageUrl: /projects/dugout-greenville/hero.jpg
  contactName: Tim Truman
  contactTitle: Managing Partner
  company: PineTar Sports Fund

operationalPerformance:
  enabled: true
  sectionTitle: Operational Performance
  since: March 2023
  acreage: 12 acres
  fields:
    - type: Baseball
      count: 4
    - type: Softball
      count: 2
  capacityPercent: 78
  annualRevenue: "$420,000"
  eventTypes:
    - Tournaments
    - League Play
    - Field Rentals
  metrics:
    - value: "6"
      label: Fields
    - value: "2023"
      label: Operational Since
    - value: "$420K"
      label: Annual Revenue
    - value: "78%"
      label: Avg. Capacity`
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
        Studio Guide: Investment & Project Pages
      </template>
      <template #description>
        Use the tabs below to find the right workflow — creating or updating fundraising investment decks, or filling in data for an operational project facility.
      </template>
    </UPageHero>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <UTabs
        :items="[
          { label: 'Investment Decks', slot: 'investments' },
          { label: 'Operational Projects', slot: 'projects' }
        ]"
        class="w-full"
      >
        <!-- ── Investments tab ─────────────────────────────────────────────── -->
        <template #investments>
          <div class="pt-10 space-y-16">
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
              title="Editing FAQ"
              description="Direct answers for the most common content update questions in Studio."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <div class="space-y-4">
                <UCard
                  v-for="item in editorFaq"
                  :key="item.question"
                  :ui="{ body: 'p-6 space-y-4' }"
                >
                  <div class="space-y-1">
                    <h3 class="text-base font-semibold">
                      {{ item.question }}
                    </h3>
                    <p class="text-sm text-dimmed leading-relaxed">
                      {{ item.answer }}
                    </p>
                  </div>

                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-toned mb-2">
                      Edit These Fields
                    </p>
                    <ul class="space-y-1 text-sm">
                      <li
                        v-for="field in item.fields"
                        :key="field"
                        class="flex items-start gap-2"
                      >
                        <UIcon
                          name="i-lucide-arrow-right-circle"
                          class="size-4 mt-0.5 text-primary"
                        />
                        <span class="font-mono text-xs sm:text-sm">{{ field }}</span>
                      </li>
                    </ul>
                  </div>

                  <p class="text-sm leading-relaxed">
                    <span class="font-semibold">Where it appears:</span>
                    {{ item.appearsIn }}
                  </p>
                </UCard>

                <UCard :ui="{ body: 'p-6' }">
                  <p class="text-sm font-semibold mb-2">
                    Media Field Tips
                  </p>
                  <ul class="space-y-2 text-sm">
                    <li
                      v-for="tip in mediaFieldTips"
                      :key="tip"
                      class="flex items-start gap-2"
                    >
                      <UIcon
                        name="i-lucide-image"
                        class="size-4 mt-0.5 text-primary"
                      />
                      <span>{{ tip }}</span>
                    </li>
                  </ul>
                </UCard>
              </div>
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
        </template>

        <!-- ── Projects tab ───────────────────────────────────────────────── -->
        <template #projects>
          <div class="pt-10 space-y-16">
            <UPageSection
              title="Workflow"
              description="Follow these steps when filling in an existing project entry or updating a live one."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <div class="grid gap-4 sm:grid-cols-2">
                <UCard
                  v-for="(step, index) in projectsWorkflowSteps"
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
              title="Required Fields"
              description="These fields must be filled before setting published: true."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <UCard :ui="{ body: 'p-6' }">
                <ul class="space-y-2 text-sm">
                  <li
                    v-for="field in projectsRequiredFields"
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
              title="Operational Performance Fields"
              description="These 7 fields power the stat grid, field breakdown table, and event type badges on the detail page."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <UCard :ui="{ body: 'p-6' }">
                <ul class="space-y-2 text-sm">
                  <li
                    v-for="field in projectsOperationalFields"
                    :key="field"
                    class="flex items-start gap-2"
                  >
                    <UIcon
                      name="i-lucide-bar-chart-2"
                      class="size-4 mt-0.5 text-primary"
                    />
                    <span class="font-mono text-xs sm:text-sm">{{ field }}</span>
                  </li>
                </ul>
              </UCard>
            </UPageSection>

            <UPageSection
              title="Section Order"
              description="Project pages render in this fixed order. The map section is automatic when location fields are present."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <UCard
                  v-for="(section, index) in projectsSectionOrder"
                  :key="section.name"
                  :ui="{ body: 'p-4 flex items-center gap-3' }"
                >
                  <UBadge
                    color="neutral"
                    variant="soft"
                  >
                    {{ index + 1 }}
                  </UBadge>
                  <div>
                    <p class="text-sm font-medium">
                      {{ section.name }}
                    </p>
                    <p class="text-xs text-dimmed">
                      {{ section.note }}
                    </p>
                  </div>
                </UCard>
              </div>
            </UPageSection>

            <UPageSection
              title="Photos & Map"
              description="How to add media to a project page."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <UCard :ui="{ body: 'p-6' }">
                <ul class="space-y-2 text-sm">
                  <li
                    v-for="tip in projectsMediaTips"
                    :key="tip"
                    class="flex items-start gap-2"
                  >
                    <UIcon
                      name="i-lucide-image"
                      class="size-4 mt-0.5 text-primary"
                    />
                    <span>{{ tip }}</span>
                  </li>
                </ul>
              </UCard>
            </UPageSection>

            <UPageSection
              title="Starter Template"
              description="Copy this into a new file under content/projects/ as a baseline. Use the filename as the slug (e.g. dugout-greenville.yml → /projects/dugout-greenville)."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <UCard :ui="{ body: 'p-0 overflow-hidden' }">
                <pre class="overflow-x-auto p-5 text-xs sm:text-sm bg-elevated text-toned"><code>{{ projectsStarterTemplate }}</code></pre>
              </UCard>
            </UPageSection>

            <UPageSection
              title="Pre-Publish Checklist"
              description="Run this check before setting published: true on any project page."
              :ui="{
                container: 'max-w-none px-0 sm:px-0 lg:px-0',
                title: 'text-2xl',
                description: 'text-dimmed'
              }"
            >
              <UCard :ui="{ body: 'p-6' }">
                <ul class="space-y-2 text-sm">
                  <li
                    v-for="item in projectsPublishChecklist"
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
        </template>
      </UTabs>
    </div>
  </div>
</template>
