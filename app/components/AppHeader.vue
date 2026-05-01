<script setup lang="ts">
const { data: studioAuth } = await useFetch('/api/__studio/auth/status', {
  key: 'studio-auth-status',
  default: () => ({ authenticated: false })
})

const isStudioAuthenticated = computed(() => studioAuth.value?.authenticated ?? false)
</script>

<template>
  <UHeader
    :ui="{
      right: 'flex items-center gap-2 sm:gap-3'
    }"
  >
    <template #left>
      <NuxtLink
        to="/"
        class="h-6 w-auto shrink-0 font-bold"
      >
        Pinetar Sports Fund
      </NuxtLink>
    </template>

    <template #right>
      <template v-if="isStudioAuthenticated">
        <UBadge
          color="primary"
          variant="soft"
          class="hidden md:inline-flex font-mono text-[11px] uppercase tracking-[0.22em]"
        >
          Studio Active
        </UBadge>
        <UButton
          label="Studio Guide"
          color="primary"
          variant="soft"
          to="/studio-instructions"
        />
        <UButton
          label="Logout"
          color="neutral"
          variant="ghost"
          to="/logout"
        />
      </template>
      <UButton
        v-else
        label="View Investment Opportunities"
        color="primary"
        to="/investments"
      />
      <UColorModeButton />
    </template>
  </UHeader>
</template>
