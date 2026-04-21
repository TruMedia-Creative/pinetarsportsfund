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
  <section class="py-20 border-b border-default bg-primary/3">
    <div class="max-w-6xl mx-auto px-6">
      <DeckSectionShell
        :section-title="sectionTitle"
        :subtitle="subtitle"
        :description="description"
        :section-image="sectionImage"
      >
        <div class="grid lg:grid-cols-2 gap-12 items-start">
          <p
            v-if="body"
            class="text-lg text-muted leading-relaxed whitespace-pre-line"
          >
            {{ body }}
          </p>

          <ul
            v-if="bullets?.length"
            class="space-y-4"
          >
            <li
              v-for="(bullet, i) in bullets"
              :key="i"
              class="flex items-start gap-3"
            >
              <UIcon
                name="i-lucide-check-circle"
                class="text-primary mt-0.5 shrink-0 size-5"
              />
              <span class="text-muted">{{ bullet }}</span>
            </li>
          </ul>
        </div>
      </DeckSectionShell>
    </div>
  </section>
</template>
