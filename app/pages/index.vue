<script setup lang="ts">
import type { HomepageContent } from '~/types/homepage';

const { data: page } = await useAsyncData<HomepageContent | null>(
  'index',
  () => queryCollection('content').path('/').first() as Promise<HomepageContent | null>,
);
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const title = page.value?.seo?.title || page.value?.title;
const description = page.value?.seo?.description || page.value?.description;

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<template>
  <MotionConfig v-if="page" reduced-motion="user">
    <div class="homepage-motion-root motion-root">
      <HomepageHero
        :hero="page.hero"
        :logos="page.logos"
        :title="page.title"
        :description="page.description"
      />
      <HomepageMetrics :metrics="page.metrics" />
      <HomepageImmersiveStage
        :problem="page.problem"
        :guide="page.guide"
        :mechanism="page.mechanism"
        :process="page.process"
      />
      <HomepageFeatures :features="page.features" />
      <HomepageAbout :about="page.about" />
      <HomepageCta :cta="page.cta" />
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


