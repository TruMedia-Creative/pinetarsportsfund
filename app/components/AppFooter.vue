<script setup lang="ts">
const links = [
  { label: 'Investment Opportunities', to: '/investments' },
  { label: 'Contact', to: 'mailto:info@pinetarsportsfund.com' },
  { label: 'Privacy', to: '#' },
  { label: 'Terms', to: '#' },
];
</script>

<template>
  <UFooter
    :ui="{
      container: 'border-t border-default py-6 lg:py-8',
      left: 'w-full text-center md:w-auto md:text-left',
      right: 'w-full justify-center gap-x-1 gap-y-1 md:w-auto md:justify-end',
    }"
  >
    <template #left>
      <p class="text-xs text-dimmed sm:text-sm">Pine Tar Sports Fund • © {{ new Date().getFullYear() }}</p>
    </template>

    <template #right>
      <UButton
        v-for="link in links"
        :key="link.label"
        :label="link.label"
        :to="link.to"
        color="neutral"
        variant="link"
        class="font-light whitespace-nowrap"
        size="sm"
      />
    </template>
  </UFooter>
</template>
