<script setup lang="ts">
defineProps<{
  body?: string
  ctaText?: string
  ctaUrl?: string
  contactName?: string
  contactTitle?: string
  contactEmail?: string
}>()
</script>

<template>
  <section class="py-28">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-6">
        Get In Touch
      </p>

      <h2 class="text-4xl font-bold mb-6">
        Ready to take the next step?
      </h2>

      <p
        v-if="body"
        class="text-lg text-muted mb-10 leading-relaxed max-w-2xl mx-auto"
      >
        {{ body }}
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <UButton
          v-if="ctaText && ctaUrl"
          :label="ctaText"
          :to="ctaUrl"
          color="primary"
          size="xl"
          trailing-icon="i-lucide-arrow-right"
        />
        <UButton
          v-if="contactEmail"
          :to="`mailto:${contactEmail}`"
          label="Send Email"
          color="neutral"
          variant="outline"
          size="xl"
          leading-icon="i-lucide-mail"
        />
      </div>

      <div
        v-if="contactName"
        class="border-t border-default pt-8"
      >
        <p class="font-semibold">
          {{ contactName }}
        </p>
        <p
          v-if="contactTitle"
          class="text-sm text-dimmed"
        >
          {{ contactTitle }}
        </p>
        <p
          v-if="contactEmail"
          class="text-sm text-primary mt-1"
        >
          {{ contactEmail }}
        </p>
      </div>
    </div>
  </section>
</template>
