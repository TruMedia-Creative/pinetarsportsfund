<script setup lang="ts">
defineProps<{
  sectionTitle?: string
  subtitle?: string
  description?: string
  sectionImage?: {
    url?: string
    alt?: string
    caption?: string
    captionStyle?: 'below' | 'overlay' | 'both'
    layout?: 'hidden' | 'right' | 'left' | 'banner-top'
  }
  body?: string
  images?: Array<{ url: string, alt?: string }>
}>()
</script>

<template>
  <section class="py-20 border-b border-default">
    <div class="max-w-6xl mx-auto px-6">
      <DeckSectionShell
        :section-title="sectionTitle"
        :subtitle="subtitle"
        :description="description"
        :section-image="sectionImage"
      >
        <div
          v-if="body"
          class="prose prose-invert max-w-3xl text-muted leading-relaxed whitespace-pre-line mb-12"
        >
          {{ body }}
        </div>

        <div
          v-if="images?.length"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="(img, i) in images"
            :key="i"
            class="rounded-xl overflow-hidden border border-default aspect-video"
          >
            <img
              :src="img.url"
              :alt="img.alt || 'Project image'"
              class="w-full h-full object-cover"
            >
          </div>
        </div>
      </DeckSectionShell>
    </div>
  </section>
</template>
