<script setup lang="ts">
import type { HomepageContent } from '~/types/homepage';

defineProps<{
  cta: HomepageContent['cta'];
}>();

const { scrollMotion } = useMotion();
</script>

<template>
  <UPageCTA
    variant="naked"
    :ui="{
      container: 'max-w-3xl text-center py-8 sm:py-10 lg:py-12',
      title: 'lg:text-5xl tracking-tighter whitespace-pre-line',
      description: 'mx-auto max-w-sm leading-relaxed text-dimmed',
    }"
  >
    <template #top>
      <GradientGlow class="bottom-0 w-2/3 h-1/2" />
    </template>

    <template #title>
      <Motion as="span" v-bind="scrollMotion()" class="inline-block">
        {{ cta.title }}
      </Motion>
    </template>

    <template #description>
      <Motion as="span" v-bind="scrollMotion(0.1)" class="inline-block">
        {{ cta.description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        class="flex flex-col items-center justify-center gap-6"
        v-bind="scrollMotion(0.2)"
      >
        <UButton v-for="link in cta.links" :key="link.label" v-bind="link" size="xl" />
      </Motion>
    </template>
  </UPageCTA>
</template>
