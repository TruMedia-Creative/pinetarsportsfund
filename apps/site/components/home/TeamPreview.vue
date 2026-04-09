<template>
  <div class="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800">
    <div class="grid grid-cols-1 gap-px sm:grid-cols-3">
      <div v-for="member in team" :key="member.name" class="bg-neutral-950 p-6 transition-colors hover:bg-neutral-900">
        <div
          class="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-base font-black text-white"
          style="background: linear-gradient(145deg, #8f3c2f, #bf6b4d)"
          aria-hidden="true"
        >
          {{ initials(member.name) }}
        </div>
        <p class="font-semibold tracking-tight text-white">{{ member.name }}</p>
        <p class="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-red-400">{{ member.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: teamMembers } = await useAsyncData('site-team', () =>
  queryCollection('team').all(),
)

const team = computed(() => teamMembers.value ?? [])

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}
</script>
