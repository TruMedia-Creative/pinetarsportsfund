<script setup lang="ts">
defineProps<{
  body?: string
  metrics?: Array<{ value: string; label: string }>
}>()
</script>

<template>
  <section class="py-20 border-b border-default bg-neutral-950/50">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        Market Context
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Market Overview
      </h2>

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
    </div>
  </section>
</template>
