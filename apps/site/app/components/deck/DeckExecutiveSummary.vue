<script setup lang="ts">
defineProps<{
  body?: string
  tableOfContents?: Array<{ number: number, label: string }>
  returnsTableTitle?: string
  returnsTableRows?: Array<{ label: string, value: string, highlight?: boolean }>
}>()
</script>

<template>
  <section class="py-20 border-b border-default">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        Executive Summary
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Overview
      </h2>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Body -->
        <div
          v-if="body"
          class="prose prose-invert max-w-none text-muted leading-relaxed whitespace-pre-line"
        >
          {{ body }}
        </div>

        <!-- Right column: table of contents + returns summary -->
        <div class="space-y-8">
          <div v-if="tableOfContents?.length">
            <p class="text-xs uppercase tracking-widest font-mono text-dimmed mb-3">
              Contents
            </p>
            <ol class="space-y-2">
              <li
                v-for="item in tableOfContents"
                :key="item.number"
                class="flex items-center gap-3 text-sm"
              >
                <span class="font-mono text-primary text-xs tabular-nums w-5 shrink-0">{{ item.number.toString().padStart(2, '0') }}</span>
                <span class="text-muted">{{ item.label }}</span>
              </li>
            </ol>
          </div>

          <div v-if="returnsTableRows?.length">
            <p class="text-xs uppercase tracking-widest font-mono text-dimmed mb-3">
              {{ returnsTableTitle || 'Key Terms' }}
            </p>
            <div class="rounded-xl border border-default overflow-hidden">
              <table class="w-full text-sm">
                <tbody>
                  <tr
                    v-for="row in returnsTableRows"
                    :key="row.label"
                    :class="['border-b border-default last:border-0', row.highlight ? 'bg-primary/5' : '']"
                  >
                    <td class="px-4 py-3 text-dimmed">
                      {{ row.label }}
                    </td>
                    <td :class="['px-4 py-3 font-semibold text-right', row.highlight ? 'text-primary' : '']">
                      {{ row.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
