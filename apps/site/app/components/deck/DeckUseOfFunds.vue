<script setup lang="ts">
defineProps<{
  body?: string
  allocationRows?: Array<{ category: string; amount: string }>
  totalLabel?: string
  totalAmount?: string
  highlights?: Array<{ title: string; body: string }>
}>()
</script>

<template>
  <section class="py-20 border-b border-default">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        Use of Funds
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Capital Allocation
      </h2>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Allocation table -->
        <div v-if="allocationRows?.length">
          <p
            v-if="body"
            class="text-muted mb-6 leading-relaxed"
          >
            {{ body }}
          </p>
          <div class="rounded-xl border border-default overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-default/50">
                  <th class="px-4 py-3 text-left text-dimmed font-medium">
                    Category
                  </th>
                  <th class="px-4 py-3 text-right text-dimmed font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in allocationRows"
                  :key="row.category"
                  class="border-b border-default last:border-0"
                >
                  <td class="px-4 py-3 text-muted">
                    {{ row.category }}
                  </td>
                  <td class="px-4 py-3 font-mono text-right">
                    {{ row.amount }}
                  </td>
                </tr>
                <tr
                  v-if="totalLabel"
                  class="bg-primary/5 border-t-2 border-primary/20"
                >
                  <td class="px-4 py-3 font-bold">
                    {{ totalLabel }}
                  </td>
                  <td class="px-4 py-3 font-bold font-mono text-right text-primary">
                    {{ totalAmount }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Highlights -->
        <div
          v-if="highlights?.length"
          class="space-y-6"
        >
          <div
            v-for="highlight in highlights"
            :key="highlight.title"
            class="rounded-xl border border-default p-5"
          >
            <p class="font-semibold mb-2">
              {{ highlight.title }}
            </p>
            <p class="text-sm text-dimmed leading-relaxed">
              {{ highlight.body }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
