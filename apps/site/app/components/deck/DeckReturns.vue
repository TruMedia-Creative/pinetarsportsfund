<script setup lang="ts">
defineProps<{
  body?: string
  timelineItems?: Array<{ period: string; phase: string; description: string }>
  keyMetrics?: Array<{ value: string; label: string }>
  exitStrategyTitle?: string
  exitStrategyBody?: string
}>()
</script>

<template>
  <section class="py-20 border-b border-default bg-neutral-950/50">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        Returns & Timeline
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Investment Returns
      </h2>

      <!-- Key metrics -->
      <div
        v-if="keyMetrics?.length"
        class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
      >
        <div
          v-for="metric in keyMetrics"
          :key="metric.label"
          class="rounded-xl border border-default p-5 text-center"
        >
          <p class="text-2xl font-bold text-primary mb-1">
            {{ metric.value }}
          </p>
          <p class="text-xs text-dimmed">
            {{ metric.label }}
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Timeline -->
        <div v-if="timelineItems?.length">
          <p class="text-xs uppercase tracking-widest font-mono text-dimmed mb-6">
            Project Timeline
          </p>
          <div class="space-y-0">
            <div
              v-for="(item, i) in timelineItems"
              :key="i"
              class="relative flex gap-5"
            >
              <!-- Line connector -->
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full bg-primary shrink-0 mt-1" />
                <div
                  v-if="i < timelineItems.length - 1"
                  class="w-px flex-1 bg-primary/20 mt-1 mb-0"
                />
              </div>
              <div class="pb-8">
                <p class="font-mono text-xs text-primary mb-1">
                  {{ item.period }}
                </p>
                <p class="font-semibold mb-1">
                  {{ item.phase }}
                </p>
                <p class="text-sm text-dimmed">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div v-if="body">
            <p class="text-muted leading-relaxed whitespace-pre-line">
              {{ body }}
            </p>
          </div>

          <div
            v-if="exitStrategyBody"
            class="rounded-xl border border-default p-6"
          >
            <p class="font-semibold mb-3">
              {{ exitStrategyTitle || 'Exit Strategy' }}
            </p>
            <p class="text-sm text-dimmed leading-relaxed whitespace-pre-line">
              {{ exitStrategyBody }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
