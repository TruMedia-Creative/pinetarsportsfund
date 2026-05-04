<script setup lang="ts">
type ProjectAudienceType = 'investor' | 'lender' | 'sponsor' | 'municipality' | 'internal'

type ProjectListItem = {
  stem: string
  title: string
  subtitle?: string
  projectName?: string
  published: boolean
  audienceType?: ProjectAudienceType | string
  location?: {
    city?: string
    state?: string
  }
}

const { data: projects } = await useAsyncData<ProjectListItem[]>('projects-list', async () => {
  const documents = await queryCollection('projects').all()

  return documents.map(document => ({
    stem: document.stem ?? '',
    title: document.title ?? '',
    subtitle: document.subtitle ?? undefined,
    projectName: document.projectName ?? undefined,
    published: Boolean(document.published),
    audienceType: document.audienceType ?? undefined,
    location: document.location ?? undefined
  }))
})

const visibleProjects = computed(() =>
  (projects.value ?? []).filter(d => d.published)
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

function getProjectSlug(stem: string) {
  return stem.split('/').pop() || stem
}

function getAudienceLabel(audienceType?: string) {
  return audienceType ? (audienceLabels[audienceType] || audienceType) : 'General'
}

function getAudienceColor(audienceType?: string) {
  return (audienceType ? audienceColors[audienceType] : undefined) || 'neutral'
}

useSeoMeta({
  title: 'Operational Projects — Pine Tar Sports Fund',
  description: 'Explore our portfolio of operational youth sports complexes across Texas — all fully built and generating revenue.'
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
        Operational Projects
      </template>
      <template #description>
        Our portfolio of fully operational youth sports complexes across Texas. Each facility is generating active revenue through tournaments, leagues, and community programming.
      </template>
    </UPageHero>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      <div
        v-if="visibleProjects.length"
        class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="project in visibleProjects"
          :key="project.stem"
          :to="`/projects/${getProjectSlug(project.stem)}`"
          class="block group"
        >
          <UCard
            class="h-full transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-lg"
            :ui="{ body: 'p-6 space-y-4' }"
          >
            <div class="flex items-start justify-between gap-4">
              <h2 class="font-semibold leading-tight group-hover:text-primary transition-colors">
                {{ project.title }}
              </h2>
              <div class="flex flex-col items-end gap-1.5 shrink-0">
                <UBadge
                  color="success"
                  variant="subtle"
                  size="sm"
                >
                  Operational
                </UBadge>
                <UBadge
                  :color="getAudienceColor(project.audienceType) as never"
                  variant="soft"
                  size="sm"
                >
                  {{ getAudienceLabel(project.audienceType) }}
                </UBadge>
              </div>
            </div>

            <p
              v-if="project.subtitle"
              class="text-sm text-dimmed leading-relaxed"
            >
              {{ project.subtitle }}
            </p>

            <div class="flex items-center justify-between pt-2 border-t border-default">
              <p class="text-xs font-mono text-dimmed flex items-center gap-1">
                <UIcon
                  v-if="project.location?.city"
                  name="i-lucide-map-pin"
                  class="size-3"
                />
                {{ project.location?.city && project.location?.state
                  ? `${project.location.city}, ${project.location.state}`
                  : project.projectName }}
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
          name="i-lucide-hard-hat"
          class="size-12 text-dimmed mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold mb-2">
          Projects coming soon
        </h3>
        <p class="text-dimmed text-sm max-w-sm mx-auto">
          Our operational project portfolio will be listed here. Check back soon or contact us to learn more.
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
