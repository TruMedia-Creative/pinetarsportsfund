<script setup lang="ts">
const props = defineProps<{
  address?: string
  city?: string
  state?: string
  zip?: string
  mapEmbedUrl?: string
  caption?: string
}>()

const fullAddress = computed(() => {
  const parts = [props.address, props.city, props.state, props.zip].filter(Boolean)
  return parts.join(', ')
})

// Build embed URL from address if a custom one is not provided
const resolvedEmbedUrl = computed(() => {
  if (props.mapEmbedUrl) return props.mapEmbedUrl
  if (!fullAddress.value) return null
  return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress.value)}&output=embed`
})
</script>

<template>
  <section
    v-if="resolvedEmbedUrl || fullAddress"
    class="py-20 border-b border-default bg-muted/20"
  >
    <div class="max-w-6xl mx-auto px-6">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-1">
          Location
        </h2>
        <p
          v-if="fullAddress"
          class="text-dimmed flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-map-pin"
            class="size-4 shrink-0"
          />
          {{ fullAddress }}
        </p>
      </div>

      <div
        v-if="resolvedEmbedUrl"
        class="rounded-2xl overflow-hidden border border-default shadow-sm aspect-video"
      >
        <iframe
          :src="resolvedEmbedUrl"
          :title="`Map of ${fullAddress || 'project location'}`"
          class="w-full h-full"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        />
      </div>
      <div
        v-else
        class="rounded-2xl border border-default p-8 text-center text-dimmed"
      >
        <UIcon
          name="i-lucide-map"
          class="size-10 mx-auto mb-3 opacity-40"
        />
        <p class="text-sm">
          Map coming soon
        </p>
      </div>

      <p
        v-if="caption"
        class="text-xs text-dimmed mt-3 text-center"
      >
        {{ caption }}
      </p>
    </div>
  </section>
</template>
