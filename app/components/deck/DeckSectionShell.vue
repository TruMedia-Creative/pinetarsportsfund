<script setup lang="ts">
import { computed } from 'vue'

type SectionImage = {
  url?: string
  alt?: string
  caption?: string
  captionStyle?: 'below' | 'overlay' | 'both'
  layout?: 'hidden' | 'right' | 'left' | 'banner-top'
}

const props = defineProps<{
  sectionTitle?: string
  subtitle?: string
  description?: string
  sectionImage?: SectionImage
}>()

const layout = computed(() => props.sectionImage?.layout || 'hidden')
const hasImage = computed(() => Boolean(props.sectionImage?.url && layout.value !== 'hidden'))
const showBanner = computed(() => hasImage.value && layout.value === 'banner-top')
const showSidebar = computed(() => hasImage.value && (layout.value === 'left' || layout.value === 'right'))
const captionStyle = computed(() => props.sectionImage?.captionStyle || 'below')
const showOverlayCaption = computed(() => Boolean(props.sectionImage?.caption) && (captionStyle.value === 'overlay' || captionStyle.value === 'both'))
const showBelowCaption = computed(() => Boolean(props.sectionImage?.caption) && (captionStyle.value === 'below' || captionStyle.value === 'both'))
const sectionDescription = computed(() => props.description || props.subtitle)
</script>

<template>
  <div class="space-y-8">
    <div
      v-if="showBanner"
      class="rounded-2xl overflow-hidden border border-default"
    >
      <div class="relative aspect-[16/7]">
        <img
          :src="sectionImage?.url"
          :alt="sectionImage?.alt || sectionTitle || 'Section image'"
          class="w-full h-full object-cover"
        >
        <div
          v-if="showOverlayCaption"
          class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3"
        >
          <p class="text-sm text-white/90">
            {{ sectionImage?.caption }}
          </p>
        </div>
      </div>
      <p
        v-if="showBelowCaption"
        class="px-4 py-3 text-sm text-dimmed border-t border-default"
      >
        {{ sectionImage?.caption }}
      </p>
    </div>

    <div
      v-if="sectionTitle || sectionDescription"
      class="space-y-3"
    >
      <h2
        v-if="sectionTitle"
        class="text-3xl font-bold"
      >
        {{ sectionTitle }}
      </h2>
      <p
        v-if="sectionDescription"
        class="text-base text-dimmed"
      >
        {{ sectionDescription }}
      </p>
    </div>

    <div
      v-if="showSidebar && layout === 'left'"
      class="grid lg:grid-cols-2 gap-12 items-start"
    >
      <div class="rounded-2xl overflow-hidden border border-default">
        <div class="relative">
          <img
            :src="sectionImage?.url"
            :alt="sectionImage?.alt || sectionTitle || 'Section image'"
            class="w-full h-auto object-cover"
          >
          <div
            v-if="showOverlayCaption"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3"
          >
            <p class="text-sm text-white/90">
              {{ sectionImage?.caption }}
            </p>
          </div>
        </div>
        <p
          v-if="showBelowCaption"
          class="px-4 py-3 text-sm text-dimmed border-t border-default"
        >
          {{ sectionImage?.caption }}
        </p>
      </div>

      <div>
        <slot />
      </div>
    </div>

    <div
      v-else-if="showSidebar && layout === 'right'"
      class="grid lg:grid-cols-2 gap-12 items-start"
    >
      <div>
        <slot />
      </div>

      <div class="rounded-2xl overflow-hidden border border-default">
        <div class="relative">
          <img
            :src="sectionImage?.url"
            :alt="sectionImage?.alt || sectionTitle || 'Section image'"
            class="w-full h-auto object-cover"
          >
          <div
            v-if="showOverlayCaption"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3"
          >
            <p class="text-sm text-white/90">
              {{ sectionImage?.caption }}
            </p>
          </div>
        </div>
        <p
          v-if="showBelowCaption"
          class="px-4 py-3 text-sm text-dimmed border-t border-default"
        >
          {{ sectionImage?.caption }}
        </p>
      </div>
    </div>

    <div v-else>
      <slot />
    </div>
  </div>
</template>
