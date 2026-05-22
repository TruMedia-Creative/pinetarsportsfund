<script setup lang="ts">
const { data: studioAuth } = await useFetch<{ authenticated: boolean }>(
  '/api/__studio/auth/status',
  {
    key: 'studio-auth-status',
    default: () => ({ authenticated: false }),
  }
);

const isStudioAuthenticated = computed(() => studioAuth.value?.authenticated ?? false);
const isMobileMenuOpen = ref(false);
const route = useRoute();

type HeaderLink = {
  label: string;
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
    { label: 'View Investment Opportunities', to: '/investments', color: 'primary', variant: 'solid' }
  ];
});

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false;
  }
);
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
          class="min-w-0 max-w-[12.5rem] text-sm leading-tight font-bold text-default sm:max-w-none sm:text-base"
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

        <UButton
          :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          color="neutral"
          variant="ghost"
          class="md:hidden"
          :aria-label="isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-navigation"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        />
      </template>
    </UHeader>

    <nav
      v-if="isMobileMenuOpen"
      id="mobile-navigation"
      class="border-t border-default/70 px-4 py-3 md:hidden"
    >
      <div class="mx-auto flex max-w-7xl flex-col gap-2">
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
          :label="link.label"
          :to="link.to"
          :color="link.color"
          :variant="link.variant"
          class="w-full justify-center"
          size="lg"
          @click="isMobileMenuOpen = false"
        />
      </div>
    </nav>
  </div>
</template>
