<script setup lang="ts">
defineProps<{
  body?: string
  bullets?: string[]
}>()
</script>

<template>
  <section class="py-20 border-b border-default bg-neutral-950/30">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-warning mb-4">
        Risk Factors
      </p>
      <h2 class="text-3xl font-bold mb-8">
        Risks & Disclaimer
      </h2>

      <p
        v-if="body"
        class="text-muted leading-relaxed mb-8 max-w-3xl whitespace-pre-line"
      >
        {{ body }}
      </p>

      <ul
        v-if="bullets?.length"
        class="space-y-3 max-w-3xl"
      >
        <li
          v-for="(bullet, i) in bullets"
          :key="i"
          class="flex items-start gap-3 text-sm text-dimmed"
        >
          <UIcon
            name="i-lucide-triangle-alert"
            class="text-warning mt-0.5 shrink-0 size-4"
          />
          <span>{{ bullet }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
