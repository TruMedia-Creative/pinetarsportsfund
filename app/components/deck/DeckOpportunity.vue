<script setup lang="ts">
defineProps<{
  body?: string
  bullets?: string[]
  imageUrl?: string
}>()
</script>

<template>
  <section class="py-20 border-b border-default">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        The Opportunity
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Market Opportunity
      </h2>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <div class="space-y-8">
          <p
            v-if="body"
            class="text-lg text-muted leading-relaxed whitespace-pre-line"
          >
            {{ body }}
          </p>

          <ul
            v-if="bullets?.length"
            class="space-y-3"
          >
            <li
              v-for="(bullet, i) in bullets"
              :key="i"
              class="flex items-start gap-3"
            >
              <span class="text-primary font-bold shrink-0">→</span>
              <span class="text-muted">{{ bullet }}</span>
            </li>
          </ul>
        </div>

        <div
          v-if="imageUrl"
          class="rounded-2xl overflow-hidden border border-default"
        >
          <img
            :src="imageUrl"
            alt="Opportunity visual"
            class="w-full h-auto object-cover"
          >
        </div>
      </div>
    </div>
  </section>
</template>
