<script setup lang="ts">
const props = defineProps<{
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
  tableOfContents?: Array<{ number: number, label: string }>
  returnsTableTitle?: string
  returnsTableRows?: Array<{ label: string, value: string, highlight?: boolean }>
}>()

const normalizedReturnsTableRows = computed(() =>
  (props.returnsTableRows ?? []).filter((row): row is { label: string, value: string, highlight?: boolean } =>
    Boolean(row && typeof row.label === 'string' && typeof row.value === 'string')
  )
)
</script>

<template>
  <section class="py-20 border-b border-default">
    <div class="max-w-6xl mx-auto px-6">
      <DeckSectionShell
        :section-title="sectionTitle"
        :subtitle="subtitle"
        :description="description"
        :section-image="sectionImage"
      >
        <div class="grid lg:grid-cols-2 gap-12">
          <div
            v-if="body"
            class="prose prose-invert max-w-none text-muted leading-relaxed whitespace-pre-line"
          >
            {{ body }}
          </div>

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

            <div v-if="normalizedReturnsTableRows.length">
              <p class="text-xs uppercase tracking-widest font-mono text-dimmed mb-3">
                {{ returnsTableTitle || 'Key Terms' }}
              </p>
              <div class="rounded-xl border border-default overflow-hidden">
                <table class="w-full text-sm">
                  <tbody>
                    <tr
                      v-for="row in normalizedReturnsTableRows"
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
      </DeckSectionShell>
    </div>
  </section>
</template>
