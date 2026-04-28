<script setup lang="ts">
type HomepageAboutTimelineItem = {
  period: string
  label: string
  description: string
}

type HomepageAboutProfile = {
  name: string
  title: string
  quote: string
  body: string
  imageUrl?: string
  credibilityBullets: string[]
  timelineItems: HomepageAboutTimelineItem[]
}

type HomepageLink = {
  label: string
} & Record<string, unknown>

type HomepageContent = {
  seo?: {
    title?: string
    description?: string
  }
  title?: string
  description?: string
  hero: {
    headline?: string
    links: HomepageLink[]
  }
  logos: {
    title: string
    items: string[]
  }
  about: {
    headline?: string
    title: string
    description: string
    primaryProfile: HomepageAboutProfile
    profiles?: HomepageAboutProfile[]
  }
  metrics: {
    headline?: string
    title: string
    description: string
    items: Array<{ value: string, label: string, class: string }>
  }
  features: {
    headline?: string
    title: string
    description: string
    items: Array<{ icon: string, title: string, description: string }>
  }
  cta: {
    title: string
    description: string
    command: string
    links: HomepageLink[]
  }
}

const { data: page } = await useAsyncData<HomepageContent | null>('index', () =>
  queryCollection('content').first() as Promise<HomepageContent | null>
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const heroTitle = computed(() => {
  const [primary = '', ...secondaryParts] = (page.value?.title ?? '').split('\n')

  return {
    primary,
    secondary: secondaryParts.join(' ').trim()
  }
})

function enterMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay }
  }
}

function scrollMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    inViewOptions: { once: true, amount: 1 },
    transition: { duration: 0.6, delay }
  }
}

function staggerMotion(index: number = 0) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    inViewOptions: { once: true, amount: 1 },
    transition: { duration: 0.6, delay: index * 0.08 }
  }
}

const { copy, copied } = useClipboard()
</script>

<template>
  <div v-if="page">
    <!-- Hero -->
    <UPageHero
      :ui="{
        container: 'relative z-10 py-10 sm:py-14 lg:py-20',
        wrapper: 'flex flex-col items-center',
        title: 'sm:text-6xl lg:text-7xl xl:text-[80px] tracking-tighter leading-[1.05]',
        description: 'mt-5 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-default',
        links: 'gap-3'
      }"
    >
      <template #top>
        <GradientGlow class="top-0 h-1/2 w-2/3 opacity-70" />
      </template>

      <template #headline>
        <Motion v-bind="enterMotion(0.2)">
          <UBadge
            color="neutral"
            variant="soft"
            :label="page.hero.headline"
            class="rounded-full px-3 py-1.5"
          />
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="enterMotion(0.35)"
          class="inline-block"
        >
          {{ heroTitle.primary }}
          <br v-if="heroTitle.secondary">
          <span
            v-if="heroTitle.secondary"
            class="text-primary/90"
          >
            {{ heroTitle.secondary }}
          </span>
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="enterMotion(0.5)"
          class="inline-block"
        >
          {{ page.description }}
        </Motion>
      </template>

      <template #links>
        <Motion
          class="flex flex-wrap justify-center gap-6"
          v-bind="enterMotion(0.65)"
        >
          <UButton
            v-for="link in page.hero.links"
            :key="link.label"
            v-bind="link"
          />
        </Motion>
      </template>
      <template #body>
        <Motion
          class="mx-auto w-full max-w-5xl"
          v-bind="enterMotion(0.75)"
        >
          <div class="overflow-hidden rounded-2xl border border-default bg-elevated/70 shadow-xl ring-1 ring-default/60 backdrop-blur-sm">
            <div class="aspect-[16/10] sm:aspect-[16/9]">
              <img
                src="/index.png"
                alt="Pinetar Sports Fund dashboard preview"
                class="size-full object-cover object-top"
              >
            </div>
          </div>
        </Motion>
      </template>
      <template #bottom>
        <GradientGlow class="bottom-0 w-2/3 h-1/2" />
      </template>

      <Motion
        class="max-w-lg mx-auto w-full"
        v-bind="enterMotion(0.85)"
      >
        <UPageLogos
          :title="page.logos.title"
          :items="page.logos.items"
          :ui="{
            title: 'font-mono uppercase text-xs tracking-[0.12em] text-dimmed',
            logos: 'gap-0',
            logo: 'text-muted size-6'
          }"
        />
      </Motion>
    </UPageHero>

    <!-- Metrics -->
    <UPageSection
      id="metrics"
      :ui="{
        root: 'scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl py-8 sm:py-10 lg:py-12',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.metrics.headline }}
        </Motion>
      </template>
      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.metrics.title }}
        </Motion>
      </template>
      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.metrics.description }}
        </Motion>
      </template>

      <div class="rounded-2xl border border-default bg-default overflow-hidden">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px">
          <Motion
            v-for="(metric, index) in page.metrics.items"
            :key="metric.label"
            v-bind="staggerMotion(index)"
          >
            <div class="flex flex-col items-center justify-center px-6 py-6 text-center">
              <p :class="['text-4xl font-bold tracking-tight leading-none', metric.class]">
                {{ metric.value }}
              </p>
              <p class="mt-3 font-mono text-xs uppercase tracking-[0.06em] text-dimmed">
                {{ metric.label }}
              </p>
            </div>
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- Features -->
    <UPageSection
      id="features"
      :ui="{
        root: 'scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl py-8 sm:py-10 lg:py-12',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.features.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.features.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.features.description }}
        </Motion>
      </template>

      <div class="rounded-2xl border border-default bg-default overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
          <Motion
            v-for="(feature, index) in page.features.items"
            :key="feature.title"
            v-bind="staggerMotion(index)"
          >
            <UPageCard
              :icon="feature.icon"
              :title="feature.title"
              :description="feature.description"
              class="rounded-none duration-300"
              to="#"
              :ui="{
                leading: 'mb-5 flex size-9 justify-center rounded-lg bg-primary/10',
                title: 'text-sm tracking-tight',
                description: 'text-sm leading-relaxed sm:line-clamp-2 lg:line-clamp-3 text-dimmed'
              }"
            />
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- About -->
    <UPageSection
      id="about"
      :ui="{
        root: 'scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl py-8 sm:py-10 lg:py-12',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-2xl mx-auto',
        description: 'max-w-2xl mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.about.headline }}
        </Motion>
      </template>
      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block whitespace-pre-line"
        >
          {{ page.about.title }}
        </Motion>
      </template>
      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.about.description }}
        </Motion>
      </template>

      <div class="overflow-hidden rounded-2xl border border-default bg-default">
        <div class="grid gap-px lg:grid-cols-[0.9fr_1.1fr]">
          <Motion v-bind="scrollMotion(0.1)">
            <div class="flex h-full flex-col justify-between bg-elevated/70 p-6 sm:p-8">
              <div class="overflow-hidden rounded-2xl border border-default bg-default/80 shadow-sm ring-1 ring-default/60">
                <div class="aspect-[4/5] bg-gradient-to-br from-primary/15 via-bg-elevated to-bg-default">
                  <img
                    v-if="page.about.primaryProfile.imageUrl"
                    :src="page.about.primaryProfile.imageUrl"
                    :alt="`${page.about.primaryProfile.name} portrait`"
                    class="size-full object-cover"
                  >
                  <div
                    v-else
                    class="flex size-full items-center justify-center text-center"
                  >
                    <div>
                      <p class="font-mono text-xs uppercase tracking-[0.18em] text-dimmed">
                        Photo coming soon
                      </p>
                      <p class="mt-4 text-4xl font-semibold tracking-tight text-default sm:text-5xl">
                        {{ page.about.primaryProfile.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 rounded-2xl border border-default bg-default/80 p-5">
                <p class="font-mono text-xs uppercase tracking-[0.12em] text-dimmed">
                  {{ page.about.primaryProfile.title }}
                </p>
                <p class="mt-3 text-lg leading-relaxed tracking-tight text-default">
                  "{{ page.about.primaryProfile.quote }}"
                </p>
              </div>
            </div>
          </Motion>

          <Motion v-bind="scrollMotion(0.2)">
            <div class="flex h-full flex-col bg-default p-6 sm:p-8">
              <div>
                <p class="text-2xl font-semibold tracking-tight text-default sm:text-3xl">
                  {{ page.about.primaryProfile.name }}
                </p>
                <p class="mt-2 text-sm uppercase tracking-[0.12em] text-dimmed">
                  {{ page.about.primaryProfile.title }}
                </p>
                <p class="mt-6 text-base leading-relaxed text-default">
                  {{ page.about.primaryProfile.body }}
                </p>
              </div>

              <div class="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <p class="font-mono text-xs uppercase tracking-[0.12em] text-dimmed">
                    Credibility markers
                  </p>
                  <ul class="mt-4 space-y-3">
                    <li
                      v-for="bullet in page.about.primaryProfile.credibilityBullets"
                      :key="bullet"
                      class="flex items-start gap-3 text-sm leading-relaxed text-default"
                    >
                      <UIcon
                        name="i-lucide-badge-check"
                        class="mt-0.5 size-4 shrink-0 text-primary"
                      />
                      <span>{{ bullet }}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <p class="font-mono text-xs uppercase tracking-[0.12em] text-dimmed">
                    Milestones
                  </p>
                  <div class="mt-4 space-y-4">
                    <div
                      v-for="item in page.about.primaryProfile.timelineItems"
                      :key="`${item.period}-${item.label}`"
                      class="rounded-xl border border-default bg-elevated/60 p-4"
                    >
                      <p class="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                        {{ item.period }}
                      </p>
                      <p class="mt-2 text-sm font-semibold tracking-tight text-default">
                        {{ item.label }}
                      </p>
                      <p class="mt-2 text-sm leading-relaxed text-dimmed">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- CTA -->
    <UPageCTA
      variant="naked"
      :ui="{
        container: 'max-w-3xl text-center py-8 sm:py-10 lg:py-12',
        title: 'lg:text-5xl tracking-tighter whitespace-pre-line',
        description: 'mx-auto max-w-sm leading-relaxed text-dimmed'
      }"
    >
      <template #top>
        <GradientGlow class="bottom-0 w-2/3 h-1/2" />
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.cta.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.cta.description }}
        </Motion>
      </template>

      <template #links>
        <Motion
          class="flex flex-col items-center justify-center gap-6"
          v-bind="scrollMotion(0.2)"
        >
          <UButton
            v-for="link in page.cta.links"
            :key="link.label"
            v-bind="link"
            size="xl"
          />

          <UButton
            :label="page.cta.command"
            :trailing-icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            color="neutral"
            variant="subtle"
            class="font-mono font-light text-toned gap-4"
            size="xl"
            :ui="{ trailingIcon: 'size-5' }"
            @click="copy(page.cta.command)"
          />
        </Motion>
      </template>
    </UPageCTA>
  </div>
</template>
