<script setup lang="ts">
const { data: studioAuth } = await useFetch<{ authenticated: boolean }>(
  '/api/__studio/auth/status',
  {
    key: 'studio-auth-status',
    default: () => ({ authenticated: false }),
  }
);

const isStudioAuthenticated = computed(() => studioAuth.value?.authenticated ?? false);

type HeaderLink = {
  label: string;
  mobileLabel?: string;
  to: string;
  color?: 'neutral' | 'primary';
  variant?: 'ghost' | 'soft' | 'solid';
};

const navigationLinks = computed<HeaderLink[]>(() => {
  if (isStudioAuthenticated.value) {
    return [
      { label: 'About', to: '/#about', color: 'neutral', variant: 'ghost' },
      { label: 'Studio Guide', to: '/studio-instructions', color: 'primary', variant: 'soft' },
      { label: 'Logout', to: '/logout', color: 'neutral', variant: 'ghost' }
    ];
  }

  return [
    { label: 'About', to: '/#about', color: 'neutral', variant: 'ghost' },
    { label: 'Projects', to: '/projects', color: 'neutral', variant: 'ghost' },
    {
      label: 'View Investment Opportunities',
      mobileLabel: 'Investments',
      to: '/investments',
      color: 'primary',
      variant: 'solid'
    }
  ];
});
</script>

<template>
  <div class="sticky top-0 z-40 border-b border-default/70 bg-default/92 backdrop-blur">
    <UHeader
      :ui="{
        container: 'py-3',
        right: 'flex items-center gap-2 sm:gap-3',
      }"
    >
      <template #left>
        <NuxtLink
          to="/"
          class="min-w-0 max-w-52 text-sm leading-tight font-bold text-default sm:max-w-none sm:text-base"
        >
          Pine Tar Sports Fund
        </NuxtLink>
      </template>

      <template #right>
        <UBadge
          v-if="isStudioAuthenticated"
          color="primary"
          variant="soft"
          class="hidden lg:inline-flex font-mono text-[11px] uppercase tracking-[0.22em]"
        >
          Studio Active
        </UBadge>

        <div class="hidden items-center gap-2 sm:gap-3 md:flex">
          <UButton
            v-for="link in navigationLinks"
            :key="link.label"
            :label="link.label"
            :to="link.to"
            :color="link.color"
            :variant="link.variant"
          />
        </div>

        <UColorModeButton />
      </template>
    </UHeader>

    <nav class="border-t border-default/70 px-4 py-3 md:hidden">
      <div class="mx-auto flex max-w-7xl flex-wrap gap-2">
        <UBadge
          v-if="isStudioAuthenticated"
          color="primary"
          variant="soft"
          class="mb-1 inline-flex w-fit font-mono text-[11px] uppercase tracking-[0.22em]"
        >
          Studio Active
        </UBadge>
        <UButton
          v-for="link in navigationLinks"
          :key="`mobile-${link.label}`"
          :label="link.mobileLabel ?? link.label"
          :to="link.to"
          :color="link.color"
          :variant="link.variant"
          class="min-w-28 flex-1 justify-center"
          size="sm"
        />
      </div>
    </nav>
  </div>
</template>
