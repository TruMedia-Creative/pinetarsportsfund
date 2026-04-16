<script setup lang="ts">
defineProps<{
  body?: string
  bullets?: string[]
}>()
</script>

<template>
  <section class="py-20 border-b border-default bg-primary/3">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        Investment Thesis
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Why This Deal
      </h2>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <p
          v-if="body"
          class="text-lg text-muted leading-relaxed whitespace-pre-line"
        >
          {{ body }}
        </p>

        <ul
          v-if="bullets?.length"
          class="space-y-4"
        >
          <li
            v-for="(bullet, i) in bullets"
            :key="i"
            class="flex items-start gap-3"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="text-primary mt-0.5 shrink-0 size-5"
            />
            <span class="text-muted">{{ bullet }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
