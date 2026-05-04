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
  since?: string
  acreage?: string
  fields?: Array<{ type: string, count: number }>
  capacityPercent?: number
  annualRevenue?: string
  eventTypes?: string[]
  anchorTenants?: string[]
  metrics?: Array<{ value: string, label: string }>
}>()
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
        <div
          v-if="body"
          class="max-w-2xl text-muted leading-relaxed whitespace-pre-line mb-12"
        >
          {{ body }}
        </div>

        <!-- Key metric cards -->
        <div
          v-if="metrics?.length"
          class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
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

        <div class="grid md:grid-cols-2 gap-12">
          <!-- Field breakdown -->
          <div v-if="fields?.length">
            <h4 class="text-sm font-semibold uppercase tracking-widest text-dimmed mb-4">
              Field Breakdown
            </h4>
            <ul class="space-y-3">
              <li
                v-for="field in fields"
                :key="field.type"
                class="flex items-center justify-between py-3 border-b border-default last:border-0"
              >
                <span class="text-sm font-medium">{{ field.type }}</span>
                <span class="text-sm font-bold text-primary">{{ field.count }} fields</span>
              </li>
              <li
                v-if="acreage"
                class="flex items-center justify-between py-3 border-b border-default last:border-0"
              >
                <span class="text-sm font-medium">Total Acreage</span>
                <span class="text-sm font-bold text-primary">{{ acreage }}</span>
              </li>
              <li
                v-if="since"
                class="flex items-center justify-between py-3 border-b border-default last:border-0"
              >
                <span class="text-sm font-medium">Operational Since</span>
                <span class="text-sm font-bold text-primary">{{ since }}</span>
              </li>
              <li
                v-if="capacityPercent"
                class="flex items-center justify-between py-3"
              >
                <span class="text-sm font-medium">Avg. Capacity</span>
                <span class="text-sm font-bold text-primary">{{ capacityPercent }}%</span>
              </li>
            </ul>
          </div>

          <!-- Events & tenants -->
          <div class="space-y-8">
            <div v-if="eventTypes?.length">
              <h4 class="text-sm font-semibold uppercase tracking-widest text-dimmed mb-4">
                Event Types
              </h4>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="event in eventTypes"
                  :key="event"
                  color="primary"
                  variant="subtle"
                >
                  {{ event }}
                </UBadge>
              </div>
            </div>

            <div v-if="anchorTenants?.length">
              <h4 class="text-sm font-semibold uppercase tracking-widest text-dimmed mb-4">
                Anchor Tenants & Partners
              </h4>
              <ul class="space-y-2">
                <li
                  v-for="tenant in anchorTenants"
                  :key="tenant"
                  class="flex items-center gap-2 text-sm"
                >
                  <UIcon
                    name="i-lucide-check-circle"
                    class="text-primary size-4 shrink-0"
                  />
                  {{ tenant }}
                </li>
              </ul>
            </div>

            <div v-if="annualRevenue">
              <h4 class="text-sm font-semibold uppercase tracking-widest text-dimmed mb-2">
                Annual Revenue Run-Rate
              </h4>
              <p class="text-2xl font-bold text-primary">
                {{ annualRevenue }}
              </p>
            </div>
          </div>
        </div>
      </DeckSectionShell>
    </div>
  </section>
</template>
