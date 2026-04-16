<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  projectName: string
  audienceType: string
  tagline?: string
  heroImageUrl?: string
  contactName?: string
  contactTitle?: string
  company?: string
  address?: string
}>()

const audienceLabels: Record<string, string> = {
  investor: 'Investor',
  lender: 'Lender',
  sponsor: 'Sponsor',
  municipality: 'Municipality',
  internal: 'Internal'
}

const audienceColors: Record<string, string> = {
  investor: 'primary',
  lender: 'success',
  sponsor: 'warning',
  municipality: 'info',
  internal: 'neutral'
}
</script>

<template>
  <section class="relative min-h-[70vh] flex items-center border-b border-default overflow-hidden">
    <!-- Background image (if provided) -->
    <div
      v-if="heroImageUrl"
      class="absolute inset-0 z-0"
    >
      <img
        :src="heroImageUrl"
        :alt="projectName"
        class="w-full h-full object-cover opacity-20"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
    </div>

    <div class="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <div class="flex items-center gap-3 mb-6">
          <UBadge
            :color="(audienceColors[audienceType] as never) || 'neutral'"
            variant="subtle"
            size="md"
          >
            {{ audienceLabels[audienceType] || audienceType }}
          </UBadge>
          <UBadge
            v-if="tagline"
            color="neutral"
            variant="soft"
            size="md"
          >
            {{ tagline }}
          </UBadge>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
          {{ title }}
        </h1>

        <p
          v-if="subtitle"
          class="text-xl text-dimmed mb-8"
        >
          {{ subtitle }}
        </p>

        <div
          v-if="contactName || company"
          class="pt-8 border-t border-default"
        >
          <p
            v-if="company"
            class="text-sm font-semibold text-dimmed uppercase tracking-widest mb-1"
          >
            {{ company }}
          </p>
          <p
            v-if="contactName"
            class="font-medium"
          >
            {{ contactName }}<span
              v-if="contactTitle"
              class="text-dimmed"
            > — {{ contactTitle }}</span>
          </p>
          <p
            v-if="address"
            class="text-sm text-dimmed mt-1"
          >
            {{ address }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
