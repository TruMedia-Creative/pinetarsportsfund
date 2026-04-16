<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
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
    label: 'Decks',
    to: '/decks',
    active: route.path.startsWith('/decks')
  }
])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="h-6 w-auto shrink-0 font-bold">
        Pinetar Sports Fund 
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UButton
        label="Contact Us"
        color="neutral"
        variant="ghost"
        class="hidden lg:flex"
        to="mailto:info@pinetarsportsfund.com"
      />
      <UButton
        label="View Decks"
        color="primary"
        class="hidden lg:flex"
        to="/decks"
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
          label="View Decks"
          color="primary"
          block
          to="/decks"
        />
      </div>
    </template>
  </UHeader>
</template>
