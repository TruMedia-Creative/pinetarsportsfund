<script setup lang="ts">
import type { HomepageContent } from '~/types/homepage';

defineProps<{
  features: HomepageContent['features'];
}>();

const SECTION_UI = {
  root: 'scroll-mt-(--ui-header-height)',
  container: 'max-w-5xl py-8 sm:py-10 lg:py-12',
  headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
  title: 'max-w-lg mx-auto',
  description: 'max-w-md mx-auto text-dimmed',
} as const;

const { scrollMotion, staggerMotion } = useMotion();
</script>

<template>
  <UPageSection id="features" :ui="SECTION_UI">
    <template #headline>
      <Motion as="span" v-bind="scrollMotion()" class="inline-block">
        {{ features.headline }}
      </Motion>
    </template>

    <template #title>
      <Motion as="span" v-bind="scrollMotion(0.1)" class="inline-block">
        {{ features.title }}
      </Motion>
    </template>

    <template #description>
      <Motion as="span" v-bind="scrollMotion(0.2)" class="inline-block">
        {{ features.description }}
      </Motion>
    </template>

    <div class="rounded-2xl border border-default bg-default overflow-hidden">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
        <Motion
          v-for="(feature, index) in features.items"
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
              description:
                'text-sm leading-relaxed sm:line-clamp-2 lg:line-clamp-3 text-dimmed',
            }"
          />
        </Motion>
      </div>
    </div>
  </UPageSection>
</template>
