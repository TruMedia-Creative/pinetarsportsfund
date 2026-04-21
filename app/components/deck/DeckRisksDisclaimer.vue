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
  bullets?: string[]
}>()
</script>

<template>
  <section class="py-20 border-b border-default bg-neutral-950/30">
    <div class="max-w-6xl mx-auto px-6">
      <DeckSectionShell
        :section-title="sectionTitle"
        :subtitle="subtitle"
        :description="description"
        :section-image="sectionImage"
      >
        <p
          v-if="body"
          class="text-muted leading-relaxed mb-8 max-w-3xl whitespace-pre-line"
        >
          {{ body }}
        </p>

        <ul
          v-if="bullets?.length"
          class="space-y-3 max-w-3xl"
        >
          <li
            v-for="(bullet, i) in bullets"
            :key="i"
            class="flex items-start gap-3 text-sm text-dimmed"
          >
            <UIcon
              name="i-lucide-triangle-alert"
              class="text-warning mt-0.5 shrink-0 size-4"
            />
            <span>{{ bullet }}</span>
          </li>
        </ul>
      </DeckSectionShell>
    </div>
  </section>
</template>
