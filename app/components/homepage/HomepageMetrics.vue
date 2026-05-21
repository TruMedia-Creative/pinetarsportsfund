<script setup lang="ts">
import type { HomepageContent } from '~/types/homepage';

defineProps<{
  metrics: HomepageContent['metrics'];
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
  <UPageSection id="metrics" :ui="SECTION_UI">
    <template #headline>
      <Motion as="span" v-bind="scrollMotion()" class="inline-block">
        {{ metrics.headline }}
      </Motion>
    </template>

    <template #title>
      <Motion as="span" v-bind="scrollMotion(0.1)" class="inline-block">
        {{ metrics.title }}
      </Motion>
    </template>

    <template #description>
      <Motion as="span" v-bind="scrollMotion(0.2)" class="inline-block">
        {{ metrics.description }}
      </Motion>
    </template>

    <div class="rounded-2xl border border-default bg-default overflow-hidden">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px">
        <Motion
          v-for="(metric, index) in metrics.items"
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
</template>
