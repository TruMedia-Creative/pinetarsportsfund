<script setup lang="ts">
definePageMeta({
  colorMode: 'dark'
})

const { data: page } = await useAsyncData('index', () => queryCollection('homePage').first())
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

const copied = ref(false)
async function copy(text: string) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div v-if="page">
    <!-- Hero -->
    <section class="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      <UContainer class="relative z-10">
        <div class="flex flex-col items-center text-center gap-6">
          <!-- Badge -->
          <UBadge
            color="neutral"
            variant="soft"
            :label="page.hero.headline"
            class="rounded-full px-3 py-1.5 gap-1.5 bg-white/5 backdrop-blur"
          >
            <template #leading>
              <UChip inset standalone :ui="{ base: 'animate-pulse ring-0' }" />
            </template>
          </UBadge>

          <!-- Title -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-bold tracking-tighter leading-[1.05] max-w-4xl">
            {{ heroTitle.primary }}
            <template v-if="heroTitle.secondary">
              <br>
              <span
                class="bg-clip-text text-transparent"
                :style="{ backgroundImage: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-200), var(--color-primary-400))' }"
              >
                {{ heroTitle.secondary }}
              </span>
            </template>
          </h1>

          <!-- Description -->
          <p class="mt-1 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-[var(--ui-text)]">
            {{ page.description }}
          </p>

          <!-- Links -->
          <div class="flex flex-wrap justify-center gap-3 mt-2">
            <UButton
              v-for="link in page.hero.links"
              :key="link.label"
              v-bind="link"
            />
          </div>

          <!-- Terminal -->
          <HeroTerminal :lines="page.terminal.lines" class="max-w-2xl mx-auto w-full mt-4" />

          <!-- Logo strip -->
          <div class="max-w-lg mx-auto w-full mt-6">
            <p class="font-mono uppercase text-xs tracking-[0.12em] text-[var(--ui-text-muted)] text-center mb-4">
              {{ page.logos.title }}
            </p>
            <div class="flex flex-wrap justify-center gap-6">
              <UIcon
                v-for="icon in page.logos.items"
                :key="icon"
                :name="icon"
                class="size-6 text-[var(--ui-text-muted)]"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Features -->
    <section id="features" class="py-24 sm:py-32">
      <UContainer class="max-w-5xl">
        <div class="text-center mb-12">
          <p class="font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] mb-3">
            {{ page.features.headline }}
          </p>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tighter max-w-lg mx-auto">
            {{ page.features.title }}
          </h2>
          <p class="mt-4 max-w-md mx-auto text-[var(--ui-text-muted)]">
            {{ page.features.description }}
          </p>
        </div>

        <div class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg)] overflow-hidden">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--ui-border)]">
            <div
              v-for="feature in page.features.items"
              :key="feature.title"
              class="bg-[var(--ui-bg)] p-6 duration-300 hover:bg-[var(--ui-bg-elevated)]"
            >
              <div class="flex size-9 justify-center items-center rounded-lg bg-primary/10 mb-5">
                <UIcon :name="feature.icon" class="text-primary size-5" />
              </div>
              <h3 class="font-medium text-sm tracking-tight mb-2">{{ feature.title }}</h3>
              <p class="text-sm leading-relaxed text-[var(--ui-text-muted)] sm:line-clamp-2 lg:line-clamp-3">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Metrics -->
    <section id="metrics" class="py-24 sm:py-32">
      <UContainer class="max-w-5xl">
        <div class="text-center mb-12">
          <p class="font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] mb-3">
            {{ page.metrics.headline }}
          </p>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tighter max-w-lg mx-auto">
            {{ page.metrics.title }}
          </h2>
          <p class="mt-4 max-w-md mx-auto text-[var(--ui-text-muted)]">
            {{ page.metrics.description }}
          </p>
        </div>

        <div class="rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-bg)] overflow-hidden">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--ui-border)]">
            <div
              v-for="metric in page.metrics.items"
              :key="metric.label"
              class="bg-[var(--ui-bg)] p-6 text-center duration-300 hover:bg-[var(--ui-bg-elevated)]"
            >
              <div :class="['text-4xl font-bold tracking-tight leading-none mb-3', metric.class]">
                {{ metric.value }}
              </div>
              <div class="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ui-text-muted)]">
                {{ metric.label }}
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA -->
    <section class="py-24 sm:py-32">
      <UContainer class="max-w-3xl text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter whitespace-pre-line mb-6">
          {{ page.cta.title }}
        </h2>
        <p class="mx-auto max-w-sm leading-relaxed text-[var(--ui-text-muted)] mb-8">
          {{ page.cta.description }}
        </p>
        <div class="flex flex-col items-center justify-center gap-6">
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
            class="font-mono font-light gap-4"
            size="xl"
            :ui="{ trailingIcon: 'size-5' }"
            @click="copy(page.cta.command)"
          />
        </div>
      </UContainer>
    </section>
  </div>
</template>