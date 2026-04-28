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
  metrics?: Array<{ value: string, label: string }>
}>()
</script>

<template>
  <section class="py-20 border-b border-default bg-primary/3">
    <div class="max-w-6xl mx-auto px-6">
      <DeckSectionShell
        :section-title="sectionTitle"
        :subtitle="subtitle"
        :description="description"
        :section-image="sectionImage"
      >
        <div
          v-if="body"
          class="max-w-2xl text-muted leading-relaxed whitespace-pre-line mb-12"
        >
          {{ body }}
        </div>

        <div
          v-if="metrics?.length"
          class="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="metric in metrics"
            :key="metric.label"
            class="rounded-2xl border border-default p-6 text-center hover:border-primary/40 transition-colors"
          >
            <p class="text-3xl font-bold text-primary mb-2">
              {{ metric.value }}
            </p>
            <p class="text-sm text-dimmed">
              {{ metric.label }}
            </p>
          </div>
        </div>
      </DeckSectionShell>
    </div>
  </section>
</template>
