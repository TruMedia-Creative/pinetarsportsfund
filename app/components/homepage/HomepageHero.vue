<script setup lang="ts">
import type { HomepageContent } from '~/types/homepage';

const props = defineProps<{
  hero: HomepageContent['hero'];
  logos: HomepageContent['logos'];
  title?: string;
  description?: string;
}>();

const HERO_MOTION_DELAYS = {
  headline: 0.2,
  title: 0.35,
  description: 0.5,
  links: 0.65,
  preview: 0.75,
  logos: 0.85,
} as const;

const heroPreviewImage = {
  webpSrcSet:
    '/homepage/index-640.webp 640w, /homepage/index-1024.webp 1024w, /homepage/index-1440.webp 1440w',
  jpegSrcSet:
    '/homepage/index-640.jpg 640w, /homepage/index-1024.jpg 1024w, /homepage/index-1440.jpg 1440w',
  sizes: '(min-width: 1280px) 1024px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)',
} as const;

const heroTitle = computed(() => {
  const [primary = '', ...secondaryParts] = (props.title ?? '').split('\n');
  return {
    primary,
    secondary: secondaryParts.join(' ').trim(),
  };
});

const { enterMotion } = useMotion();
</script>

<template>
  <UPageHero
    :ui="{
      container: 'relative z-10 py-10 sm:py-14 lg:py-20',
      wrapper: 'flex flex-col items-center',
      title: 'sm:text-6xl lg:text-7xl xl:text-[80px] tracking-tighter leading-[1.05]',
      description: 'mt-5 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-default',
      links: 'gap-3',
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
          :label="hero.headline"
          class="rounded-full px-3 py-1.5"
        />
      </Motion>
    </template>

    <template #title>
      <Motion as="span" v-bind="enterMotion(HERO_MOTION_DELAYS.title)" class="inline-block">
        {{ heroTitle.primary }}
        <br v-if="heroTitle.secondary" />
        <span v-if="heroTitle.secondary" class="text-primary/90">
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
        {{ description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        class="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        v-bind="enterMotion(HERO_MOTION_DELAYS.links)"
      >
        <UButton
          v-for="link in hero.links"
          :key="link.label"
          v-bind="link"
          class="w-full justify-center sm:w-auto"
          size="lg"
        />
      </Motion>
    </template>

    <template #body>
      <Motion class="mx-auto w-full max-w-5xl" v-bind="enterMotion(HERO_MOTION_DELAYS.preview)">
        <div
          class="overflow-hidden rounded-2xl border border-default bg-elevated/70 shadow-xl ring-1 ring-default/60 backdrop-blur-sm"
        >
          <div class="aspect-[16/10] sm:aspect-[16/9]">
            <picture>
              <source
                :srcset="heroPreviewImage.webpSrcSet"
                :sizes="heroPreviewImage.sizes"
                type="image/webp"
              />
              <img
                src="/homepage/index-1024.jpg"
                :srcset="heroPreviewImage.jpegSrcSet"
                :sizes="heroPreviewImage.sizes"
                alt="Pinetar Sports Fund dashboard preview"
                width="1440"
                height="811"
                fetchpriority="high"
                loading="eager"
                decoding="async"
                class="size-full object-cover object-top"
              />
            </picture>
          </div>
        </div>
      </Motion>
    </template>

    <template #bottom>
      <GradientGlow class="bottom-0 w-2/3 h-1/2" />
    </template>

    <Motion class="max-w-lg mx-auto w-full" v-bind="enterMotion(HERO_MOTION_DELAYS.logos)">
      <UPageLogos
        :title="logos.title"
        :items="logos.items"
        :ui="{
          title: 'font-mono uppercase text-xs tracking-[0.12em] text-dimmed',
          logos: 'gap-0',
          logo: 'text-muted size-6',
        }"
      />
    </Motion>
  </UPageHero>
</template>
