<script setup lang="ts">
defineProps<{
  lines: Array<{
    segments: Array<{ text: string; style: string }>
  }>
}>()

const styleMap: Record<string, string> = {
  prompt: 'text-[var(--ui-text-muted)]',
  cmd: 'text-primary font-medium',
  flag: 'text-[var(--ui-text-toned)]',
  dim: 'text-[var(--ui-text-muted)]',
  success: 'text-green-400',
  url: 'text-blue-400 underline',
  'metric-good': 'text-emerald-400 font-medium',
}
</script>

<template>
  <div class="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] overflow-hidden font-mono text-sm">
    <!-- Window chrome -->
    <div class="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--ui-border)] bg-[var(--ui-bg)]">
      <span class="size-3 rounded-full bg-red-500/80" />
      <span class="size-3 rounded-full bg-yellow-500/80" />
      <span class="size-3 rounded-full bg-green-500/80" />
    </div>
    <!-- Lines -->
    <div class="px-5 py-4 space-y-1">
      <div v-for="(line, i) in lines" :key="i" class="leading-relaxed">
        <span
          v-for="(seg, j) in line.segments"
          :key="j"
          :class="styleMap[seg.style] ?? 'text-[var(--ui-text)]'"
        >{{ seg.text }}</span>
      </div>
    </div>
  </div>
</template>
