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

type HomepageNarrativeSection = {
  title: string
  paragraphs: string[]
}

type HomepageMechanismSection = {
  title: string
  description: string
  items: string[]
}

type HomepageProcessItem = {
  step: string
  title: string
  description: string
}

type HomepageProcessSection = {
  title: string
  items: HomepageProcessItem[]
}

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
  problem: HomepageNarrativeSection
  guide: HomepageNarrativeSection
  mechanism: HomepageMechanismSection
  process: HomepageProcessSection
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

const HERO_MOTION_DELAYS = {
  headline: 0.2,
  title: 0.35,
  description: 0.5,
  links: 0.65,
  preview: 0.75,
  logos: 0.85
} as const

const DEFAULT_SECTION_UI = {
  root: 'scroll-mt-(--ui-header-height)',
  container: 'max-w-5xl py-8 sm:py-10 lg:py-12',
  headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
  title: 'max-w-lg mx-auto',
  description: 'max-w-md mx-auto text-dimmed'
} as const

const ABOUT_SECTION_UI = {
  ...DEFAULT_SECTION_UI,
  title: 'max-w-2xl mx-auto',
  description: 'max-w-2xl mx-auto text-dimmed'
} as const

const IMMERSIVE_SECTION_UI = {
  root: 'scroll-mt-(--ui-header-height)',
  container: 'max-w-6xl py-4 sm:py-6 lg:py-8'
} as const

const FADE_IN_UP = {
  initial: { opacity: 0, y: 16 },
  transition: { duration: 0.6 }
} as const

const REVEAL_IN_VIEW_OPTIONS = {
  once: true,
  amount: 0.2
} as const

const { data: page } = await useAsyncData<HomepageContent | null>('index', () =>
  queryCollection('content').path('/').first() as Promise<HomepageContent | null>
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description
const isPrimaryProfileImageBroken = ref(false)
const prefersReducedMotion = usePreferredReducedMotion()
const immersiveStage = ref<HTMLElement | null>(null)

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

useHomepageImmersiveScroll(immersiveStage)

const heroTitle = computed(() => {
  const [primary = '', ...secondaryParts] = (page.value?.title ?? '').split('\n')

  return {
    primary,
    secondary: secondaryParts.join(' ').trim()
  }
})

function enterMotion(delay: number = 0) {
  if (prefersReducedMotion.value === 'reduce') {
    return {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0, delay: 0 }
    }
  }

  return {
    initial: FADE_IN_UP.initial,
    animate: { opacity: 1, y: 0 },
    transition: { ...FADE_IN_UP.transition, delay }
  }
}

function scrollMotion(delay: number = 0) {
  if (prefersReducedMotion.value === 'reduce') {
    return {
      initial: { opacity: 1, y: 0 },
      whileInView: { opacity: 1, y: 0 },
      inViewOptions: REVEAL_IN_VIEW_OPTIONS,
      transition: { duration: 0, delay: 0 }
    }
  }

  return {
    initial: FADE_IN_UP.initial,
    whileInView: { opacity: 1, y: 0 },
    inViewOptions: REVEAL_IN_VIEW_OPTIONS,
    transition: { ...FADE_IN_UP.transition, delay }
  }
}

function staggerMotion(index: number = 0) {
  if (prefersReducedMotion.value === 'reduce') {
    return {
      initial: { opacity: 1, y: 0 },
      whileInView: { opacity: 1, y: 0 },
      inViewOptions: REVEAL_IN_VIEW_OPTIONS,
      transition: { duration: 0, delay: 0 }
    }
  }

  return {
    initial: FADE_IN_UP.initial,
    whileInView: { opacity: 1, y: 0 },
    inViewOptions: REVEAL_IN_VIEW_OPTIONS,
    transition: { ...FADE_IN_UP.transition, delay: index * 0.08 }
  }
}
</script>

<template>
  <MotionConfig
    v-if="page"
    reduced-motion="user"
  >
    <div class="homepage-motion-root">
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
          <Motion v-bind="enterMotion(HERO_MOTION_DELAYS.headline)">
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
            v-bind="enterMotion(HERO_MOTION_DELAYS.title)"
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
            v-bind="enterMotion(HERO_MOTION_DELAYS.description)"
            class="inline-block"
          >
            {{ page.description }}
          </Motion>
        </template>

        <template #links>
          <Motion
            class="flex flex-wrap justify-center gap-6"
            v-bind="enterMotion(HERO_MOTION_DELAYS.links)"
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
            v-bind="enterMotion(HERO_MOTION_DELAYS.preview)"
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
          v-bind="enterMotion(HERO_MOTION_DELAYS.logos)"
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
        :ui="DEFAULT_SECTION_UI"
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

      <div
        ref="immersiveStage"
        class="homepage-immersive-stage relative isolate"
      >
        <div class="homepage-immersive-atmosphere pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2" />
        <div
          class="homepage-immersive-orbit pointer-events-none absolute left-[6%] top-[10%] z-0 hidden lg:block"
          data-home-orbit
        >
          <div class="homepage-immersive-ring size-56 rounded-full border border-secondary/12" />
          <div class="homepage-immersive-ring absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/12" />
          <div class="homepage-immersive-ring absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/18" />
        </div>
        <div
          class="homepage-immersive-orbit pointer-events-none absolute right-[7%] top-[18%] z-0 hidden lg:block"
          data-home-orbit
        >
          <div class="homepage-immersive-ring size-64 rounded-full border border-primary/10" />
          <div class="homepage-immersive-ring absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/14" />
          <div class="homepage-immersive-ring absolute left-1/2 top-1/2 size-18 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/16" />
        </div>
        <div class="homepage-immersive-diamond pointer-events-none absolute left-[7%] bottom-[30%] z-0 hidden size-24 rotate-45 rounded-[1.75rem] border border-primary/10 bg-default/25 lg:block" />
        <div class="homepage-immersive-diamond pointer-events-none absolute right-[8%] top-[12%] z-0 hidden size-28 rotate-45 rounded-[2rem] border border-primary/12 bg-default/25 lg:block" />
        <div class="homepage-immersive-diamond pointer-events-none absolute right-[6%] bottom-[14%] z-0 hidden size-16 rotate-45 border border-secondary/12 bg-default/35 lg:block" />

        <!-- Problem -->
        <UPageSection
          id="problem"
          :ui="IMMERSIVE_SECTION_UI"
        >
          <div
            class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0"
            data-home-scene
          >
            <div
              class="pointer-events-none absolute inset-0 z-0"
              data-home-scene-accent
            >
              <div class="absolute left-[4%] top-16 h-40 w-40 rounded-full bg-primary/8 blur-3xl sm:h-56 sm:w-56" />
            </div>
            <div
              class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20"
              data-home-scene-content
            >
              <Motion
                as="div"
                v-bind="scrollMotion(0.1)"
                class="relative z-10 grid gap-10 px-5 sm:px-6 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(21rem,0.9fr)] lg:items-center lg:gap-14 lg:px-8"
              >
                <h2 class="max-w-4xl text-[clamp(3.05rem,7.2vw,6.4rem)] font-semibold tracking-[-0.065em] leading-[0.94] text-default text-balance">
                  {{ page.problem.title }}
                </h2>

                <div class="max-w-xl space-y-6 text-lg leading-[1.75] text-default/82 sm:text-[1.32rem]">
                  <p
                    v-for="paragraph in page.problem.paragraphs"
                    :key="paragraph"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </Motion>
            </div>
          </div>
        </UPageSection>

        <!-- Guide -->
        <UPageSection
          id="guide"
          :ui="IMMERSIVE_SECTION_UI"
        >
          <div
            class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0"
            data-home-scene
          >
            <div
              class="pointer-events-none absolute inset-0 z-0"
              data-home-scene-accent
            >
              <div class="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-secondary/8" />
              <div class="absolute right-[2%] top-12 h-48 w-48 rounded-full bg-secondary/8 blur-3xl sm:h-64 sm:w-64" />
            </div>
            <div
              class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20"
              data-home-scene-content
            >
              <Motion
                as="div"
                v-bind="scrollMotion(0.1)"
                class="relative z-10 grid gap-10 px-5 sm:px-6 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)] lg:items-center lg:gap-16 lg:px-8"
              >
                <h2 class="max-w-[8.5ch] text-[clamp(2.9rem,5.1vw,5rem)] font-semibold tracking-[-0.06em] leading-[0.97] text-default text-balance">
                  {{ page.guide.title }}
                </h2>

                <div class="max-w-[29rem] space-y-6 text-lg leading-[1.75] text-default/82 sm:text-[1.28rem]">
                  <p
                    v-for="paragraph in page.guide.paragraphs"
                    :key="paragraph"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </Motion>
            </div>
          </div>
        </UPageSection>

        <!-- Mechanism -->
        <UPageSection
          id="mechanism"
          :ui="IMMERSIVE_SECTION_UI"
        >
          <div
            class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0"
            data-home-scene
          >
            <div
              class="pointer-events-none absolute inset-0 z-0"
              data-home-scene-accent
            >
              <div class="absolute inset-0 bg-gradient-to-b from-bg-elevated/70 via-transparent to-transparent" />
              <div class="absolute left-[50%] top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl sm:h-72 sm:w-72" />
            </div>
            <div
              class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20"
              data-home-scene-content
            >
              <Motion
                as="div"
                v-bind="scrollMotion(0.1)"
                class="relative z-10 grid gap-10 px-5 sm:px-6 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-14 lg:px-8"
              >
                <div class="max-w-3xl space-y-6">
                  <h2 class="max-w-[8.2ch] text-[clamp(2.9rem,5.9vw,5.5rem)] font-semibold tracking-[-0.06em] leading-[0.94] text-default text-balance">
                    {{ page.mechanism.title }}
                  </h2>
                  <p class="max-w-xl text-lg leading-[1.75] text-default/82 sm:text-[1.22rem]">
                    {{ page.mechanism.description }}
                  </p>
                </div>

                <div class="grid gap-x-8 gap-y-6 border-t border-default/55 pt-8 sm:grid-cols-2 lg:pt-12">
                  <Motion
                    v-for="(item, index) in page.mechanism.items"
                    :key="item"
                    v-bind="staggerMotion(index)"
                  >
                    <div class="space-y-3 border-b border-default/45 pb-5">
                      <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary/80">
                        {{ String(index + 1).padStart(2, '0') }}
                      </p>
                      <p class="text-base font-medium tracking-tight text-default/84 sm:text-lg">
                        {{ item }}
                      </p>
                    </div>
                  </Motion>
                </div>
              </Motion>
            </div>
          </div>
        </UPageSection>

        <!-- Process -->
        <UPageSection
          id="process"
          :ui="IMMERSIVE_SECTION_UI"
        >
          <div
            class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0"
            data-home-scene
          >
            <div
              class="pointer-events-none absolute inset-0 z-0"
              data-home-scene-accent
            >
              <div class="absolute inset-x-0 top-12 h-36 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl" />
            </div>
            <div
              class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20"
              data-home-scene-content
            >
              <Motion
                as="div"
                v-bind="scrollMotion(0.1)"
                class="relative z-10 space-y-10 px-5 sm:px-6 lg:flex lg:min-h-[calc(100svh-5.5rem)] lg:flex-col lg:justify-center lg:px-8"
              >
                <h2 class="max-w-4xl text-[clamp(3.05rem,7vw,6.2rem)] font-semibold tracking-[-0.06em] leading-[0.92] text-default text-balance">
                  {{ page.process.title }}
                </h2>

                <div class="divide-y divide-default/45 border-y border-default/45">
                  <Motion
                    v-for="(item, index) in page.process.items"
                    :key="item.step"
                    v-bind="staggerMotion(index)"
                  >
                    <div class="grid gap-4 py-6 sm:gap-6 sm:py-8 lg:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:py-9">
                      <p class="font-mono text-xs uppercase tracking-[0.16em] text-primary/80 lg:pt-3">
                        Step {{ item.step }}
                      </p>
                      <h3 class="text-2xl font-semibold tracking-[-0.04em] text-default sm:text-3xl lg:max-w-sm">
                        {{ item.title }}
                      </h3>
                      <p class="max-w-xl text-base leading-[1.75] text-default/82 sm:text-lg">
                        {{ item.description }}
                      </p>
                    </div>
                  </Motion>
                </div>
              </Motion>
            </div>
          </div>
        </UPageSection>
      </div>

      <!-- Features -->
      <UPageSection
        id="features"
        :ui="DEFAULT_SECTION_UI"
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
        :ui="ABOUT_SECTION_UI"
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
              <div class="flex flex-col gap-6 bg-elevated/70 p-6 sm:p-8">
                <div class="overflow-hidden rounded-2xl border border-default bg-default/80 shadow-sm ring-1 ring-default/60">
                  <div class="aspect-[4/5] bg-gradient-to-br from-primary/15 via-bg-elevated to-bg-default">
                    <img
                      v-if="page.about.primaryProfile.imageUrl && !isPrimaryProfileImageBroken"
                      :src="page.about.primaryProfile.imageUrl"
                      :alt="`${page.about.primaryProfile.name} portrait`"
                      class="size-full object-cover object-[68%_32%]"
                      @error="isPrimaryProfileImageBroken = true"
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

                <div class="rounded-2xl border border-default bg-default/80 p-5">
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
                      <p
                        v-if="item.description"
                        class="mt-2 text-sm leading-relaxed text-dimmed"
                      >
                        {{ item.description }}
                      </p>
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
          </Motion>
        </template>
      </UPageCTA>
    </div>
  </MotionConfig>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .homepage-motion-root :deep([style*='opacity:0']),
  .homepage-motion-root :deep([style*='opacity: 0']) {
    opacity: 1 !important;
  }

  .homepage-motion-root :deep([style*='translateY']) {
    transform: none !important;
  }
}
</style>
