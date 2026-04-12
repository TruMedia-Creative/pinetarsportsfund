<script setup lang="ts">
defineProps<{
  body?: string
  members?: Array<{
    name: string
    title: string
    bio?: string
    imageUrl?: string
  }>
}>()
</script>

<template>
  <section class="py-20 border-b border-default bg-primary/3">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-xs uppercase tracking-widest font-mono text-primary mb-4">
        Team
      </p>
      <h2 class="text-3xl font-bold mb-4">
        Leadership
      </h2>

      <p
        v-if="body"
        class="text-muted max-w-2xl mb-12"
      >
        {{ body }}
      </p>

      <div
        v-if="members?.length"
        class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="member in members"
          :key="member.name"
          class="flex flex-col gap-4"
        >
          <div class="w-16 h-16 rounded-full bg-default border border-default overflow-hidden shrink-0">
            <img
              v-if="member.imageUrl"
              :src="member.imageUrl"
              :alt="member.name"
              class="w-full h-full object-cover"
            >
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-lg font-bold text-primary"
            >
              {{ member.name.charAt(0) }}
            </div>
          </div>

          <div>
            <p class="font-semibold">
              {{ member.name }}
            </p>
            <p class="text-sm text-primary mb-2">
              {{ member.title }}
            </p>
            <p
              v-if="member.bio"
              class="text-sm text-dimmed leading-relaxed"
            >
              {{ member.bio }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
