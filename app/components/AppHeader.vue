<script setup lang="ts">
const route = useRoute()
const requestFetch = useRequestFetch()

const { data: authStatus } = await useAsyncData('studio-auth-status', () =>
  requestFetch('/api/__studio/auth/status')
)

const isStudioAuthenticated = computed(() => Boolean(authStatus.value?.authenticated))

const items = computed(() => {
  const baseItems = [
    {
      label: 'About',
      to: '/#about',
      exactHash: true
    },
    {
      label: 'Offerings',
      to: '/#offerings',
      exactHash: true
    },
    {
      label: 'Investment Opportunities',
      to: '/investments',
      active: route.path.startsWith('/investments')
    }
  ]

  if (isStudioAuthenticated.value) {
    baseItems.push({
      label: 'Studio Guide',
      to: '/studio-instructions',
      active: route.path === '/studio-instructions'
    })
  }

  return baseItems
})
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/"
        class="h-6 w-auto shrink-0 font-bold"
      >
        Pinetar Sports Fund
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UColorModeButton class="hidden lg:flex" />
      <UButton
        label="Contact Us"
        color="neutral"
        variant="ghost"
        class="hidden lg:flex"
        to="mailto:info@pinetarsportsfund.com"
      />
      <UButton
        label="View Investment Opportunities"
        color="primary"
        class="hidden lg:flex"
        to="/investments"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />

      <div class="mt-4 flex flex-col gap-2">
        <UButton
          label="Contact Us"
          color="neutral"
          variant="soft"
          block
          to="mailto:info@pinetarsportsfund.com"
        />
        <UButton
          label="View Investment Opportunities"
          color="primary"
          block
          to="/investments"
        />
        <UColorModeButton block />
      </div>
    </template>
  </UHeader>
</template>
