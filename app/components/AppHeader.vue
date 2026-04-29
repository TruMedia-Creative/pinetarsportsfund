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

    <template #right>
      <UButton
        label="View Investment Opportunities"
        color="primary"
        to="/investments"
      />
      <UColorModeButton />
    </template>
  </UHeader>
</template>
