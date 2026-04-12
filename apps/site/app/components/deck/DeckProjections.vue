<script setup lang="ts">
defineProps<{
  body?: string
  rows?: Array<{ label: string; value: string }>
  metrics?: Array<{ value: string; label: string }>
}>()
</script>

<template>
  <section class="py-20 border-b border-default">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        Financial Projections
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Projections
      </h2>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <p
            v-if="body"
            class="text-muted leading-relaxed mb-8 whitespace-pre-line"
          >
            {{ body }}
          </p>

          <div
            v-if="rows?.length"
            class="rounded-xl border border-default overflow-hidden"
          >
            <table class="w-full text-sm">
              <tbody>
                <tr
                  v-for="row in rows"
                  :key="row.label"
                  class="border-b border-default last:border-0"
                >
                  <td class="px-4 py-3 text-dimmed">
                    {{ row.label }}
                  </td>
                  <td class="px-4 py-3 font-mono font-semibold text-right">
                    {{ row.value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="metrics?.length"
          class="grid grid-cols-2 gap-4"
        >
          <div
            v-for="metric in metrics"
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
      </div>
    </div>
  </section>
</template>
