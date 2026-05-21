<script setup lang="ts">
import type { HomepageContent } from '~/types/homepage';

defineProps<{
  about: HomepageContent['about'];
}>();

const SECTION_UI = {
  root: 'scroll-mt-(--ui-header-height)',
  container: 'max-w-5xl py-8 sm:py-10 lg:py-12',
  headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
  title: 'max-w-2xl mx-auto',
  description: 'max-w-2xl mx-auto text-dimmed',
} as const;

const primaryProfileImage = {
  webpSrcSet:
    '/homepage/tim-headshot-320.webp 320w, /homepage/tim-headshot-480.webp 480w, /homepage/tim-headshot-640.webp 640w, /homepage/tim-headshot-800.webp 800w',
  jpegSrcSet:
    '/homepage/tim-headshot-320.jpg 320w, /homepage/tim-headshot-480.jpg 480w, /homepage/tim-headshot-640.jpg 640w, /homepage/tim-headshot-800.jpg 800w',
  sizes:
    '(min-width: 1280px) 420px, (min-width: 1024px) 36vw, (min-width: 640px) 70vw, calc(100vw - 48px)',
} as const;

const isPrimaryProfileImageBroken = ref(false);

const { scrollMotion } = useMotion();
</script>

<template>
  <UPageSection id="about" :ui="SECTION_UI">
    <template #headline>
      <Motion as="span" v-bind="scrollMotion()" class="inline-block">
        {{ about.headline }}
      </Motion>
    </template>

    <template #title>
      <Motion as="span" v-bind="scrollMotion(0.1)" class="inline-block whitespace-pre-line">
        {{ about.title }}
      </Motion>
    </template>

    <template #description>
      <Motion as="span" v-bind="scrollMotion(0.2)" class="inline-block">
        {{ about.description }}
      </Motion>
    </template>

    <div class="overflow-hidden rounded-2xl border border-default bg-default">
      <div class="grid gap-px lg:grid-cols-[0.9fr_1.1fr]">
        <Motion v-bind="scrollMotion(0.1)">
          <div class="flex flex-col gap-6 bg-elevated/70 p-6 sm:p-8">
            <div
              class="overflow-hidden rounded-2xl border border-default bg-default/80 shadow-sm ring-1 ring-default/60"
            >
              <div
                class="aspect-[4/5] bg-gradient-to-br from-primary/15 via-bg-elevated to-bg-default"
              >
                <picture
                  v-if="about.primaryProfile.imageUrl && !isPrimaryProfileImageBroken"
                >
                  <source
                    :srcset="primaryProfileImage.webpSrcSet"
                    :sizes="primaryProfileImage.sizes"
                    type="image/webp"
                  />
                  <img
                    src="/homepage/tim-headshot-480.jpg"
                    :srcset="primaryProfileImage.jpegSrcSet"
                    :sizes="primaryProfileImage.sizes"
                    :alt="`${about.primaryProfile.name} portrait`"
                    width="800"
                    height="1200"
                    loading="lazy"
                    decoding="async"
                    class="size-full object-cover object-[68%_32%]"
                    @error="isPrimaryProfileImageBroken = true"
                  />
                </picture>
                <div v-else class="flex size-full items-center justify-center text-center">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-dimmed">
                      Photo coming soon
                    </p>
                    <p
                      class="mt-4 text-4xl font-semibold tracking-tight text-default sm:text-5xl"
                    >
                      {{ about.primaryProfile.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-default bg-default/80 p-5">
              <p class="font-mono text-xs uppercase tracking-[0.12em] text-dimmed">
                {{ about.primaryProfile.title }}
              </p>
              <p class="mt-3 text-lg leading-relaxed tracking-tight text-default">
                "{{ about.primaryProfile.quote }}"
              </p>
            </div>
          </div>
        </Motion>

        <Motion v-bind="scrollMotion(0.2)">
          <div class="flex h-full flex-col bg-default p-6 sm:p-8">
            <div>
              <p class="text-2xl font-semibold tracking-tight text-default sm:text-3xl">
                {{ about.primaryProfile.name }}
              </p>
              <p class="mt-2 text-sm uppercase tracking-[0.12em] text-dimmed">
                {{ about.primaryProfile.title }}
              </p>
              <p class="mt-6 text-base leading-relaxed text-default">
                {{ about.primaryProfile.body }}
              </p>
            </div>

            <div>
              <p class="font-mono text-xs uppercase tracking-[0.12em] text-dimmed">
                Milestones
              </p>
              <div class="mt-4 space-y-4">
                <div
                  v-for="item in about.primaryProfile.timelineItems"
                  :key="`${item.period}-${item.label}`"
                  class="rounded-xl border border-default bg-elevated/60 p-4"
                >
                  <p class="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                    {{ item.period }}
                  </p>
                  <p class="mt-2 text-sm font-semibold tracking-tight text-default">
                    {{ item.label }}
                  </p>
                  <p v-if="item.description" class="mt-2 text-sm leading-relaxed text-dimmed">
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
</template>
