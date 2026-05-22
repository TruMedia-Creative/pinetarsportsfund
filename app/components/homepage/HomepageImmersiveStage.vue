<script setup lang="ts">
import type {
  HomepageNarrativeSection,
  HomepageMechanismSection,
  HomepageProcessSection,
} from '~/types/homepage';

defineProps<{
  problem: HomepageNarrativeSection;
  guide: HomepageNarrativeSection;
  mechanism: HomepageMechanismSection;
  process: HomepageProcessSection;
}>();

const SECTION_UI = {
  root: 'scroll-mt-(--ui-header-height)',
  container: 'max-w-6xl py-4 sm:py-6 lg:py-8',
} as const;

const immersiveStage = ref<HTMLElement | null>(null);
useHomepageImmersiveScroll(immersiveStage);

const { scrollMotion, staggerMotion } = useMotion();
</script>

<template>
  <div ref="immersiveStage" class="homepage-immersive-stage relative isolate">
    <div
      class="homepage-immersive-atmosphere pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2"
    />
    <div
      class="homepage-immersive-orbit pointer-events-none absolute left-[6%] top-[10%] z-0 hidden lg:block"
      data-home-orbit
    >
      <div class="homepage-immersive-ring size-56 rounded-full border border-secondary/12" />
      <div
        class="homepage-immersive-ring absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/12"
      />
      <div
        class="homepage-immersive-ring absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/18"
      />
    </div>
    <div
      class="homepage-immersive-orbit pointer-events-none absolute right-[7%] top-[18%] z-0 hidden lg:block"
      data-home-orbit
    >
      <div class="homepage-immersive-ring size-64 rounded-full border border-primary/10" />
      <div
        class="homepage-immersive-ring absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/14"
      />
      <div
        class="homepage-immersive-ring absolute left-1/2 top-1/2 size-18 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/16"
      />
    </div>
    <div
      class="homepage-immersive-diamond pointer-events-none absolute left-[7%] bottom-[30%] z-0 hidden size-24 rotate-45 rounded-[1.75rem] border border-primary/10 bg-default/25 lg:block"
    />
    <div
      class="homepage-immersive-diamond pointer-events-none absolute right-[8%] top-[12%] z-0 hidden size-28 rotate-45 rounded-[2rem] border border-primary/12 bg-default/25 lg:block"
    />
    <div
      class="homepage-immersive-diamond pointer-events-none absolute right-[6%] bottom-[14%] z-0 hidden size-16 rotate-45 border border-secondary/12 bg-default/35 lg:block"
    />

    <!-- Problem -->
    <UPageSection id="problem" :ui="SECTION_UI">
      <div class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0" data-home-scene>
        <div class="pointer-events-none absolute inset-0 z-0" data-home-scene-accent>
          <div
            class="absolute left-[4%] top-16 h-40 w-40 rounded-full bg-primary/8 blur-3xl sm:h-56 sm:w-56"
          />
        </div>
        <div class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20" data-home-scene-content>
          <Motion
            as="div"
            v-bind="scrollMotion(0.1)"
            class="relative z-10 grid gap-10 px-5 sm:px-6 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(21rem,0.9fr)] lg:items-center lg:gap-14 lg:px-8"
          >
            <h2
              class="max-w-4xl text-[clamp(3.05rem,7.2vw,6.4rem)] font-semibold tracking-[-0.065em] leading-[0.94] text-default text-balance"
            >
              {{ problem.title }}
            </h2>

            <div
              class="max-w-xl space-y-6 text-lg leading-[1.75] text-default/82 sm:text-[1.32rem]"
            >
              <p v-for="paragraph in problem.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- Guide -->
    <UPageSection id="guide" :ui="SECTION_UI">
      <div class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0" data-home-scene>
        <div class="pointer-events-none absolute inset-0 z-0" data-home-scene-accent>
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-secondary/8"
          />
          <div
            class="absolute right-[2%] top-12 h-48 w-48 rounded-full bg-secondary/8 blur-3xl sm:h-64 sm:w-64"
          />
        </div>
        <div class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20" data-home-scene-content>
          <Motion
            as="div"
            v-bind="scrollMotion(0.1)"
            class="relative z-10 grid gap-10 px-5 sm:px-6 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)] lg:items-center lg:gap-16 lg:px-8"
          >
            <h2
              class="max-w-[8.5ch] text-[clamp(2.9rem,5.1vw,5rem)] font-semibold tracking-[-0.06em] leading-[0.97] text-default text-balance"
            >
              {{ guide.title }}
            </h2>

            <div
              class="max-w-[29rem] space-y-6 text-lg leading-[1.75] text-default/82 sm:text-[1.28rem]"
            >
              <p v-for="paragraph in guide.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- Mechanism -->
    <UPageSection id="mechanism" :ui="SECTION_UI">
      <div class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0" data-home-scene>
        <div class="pointer-events-none absolute inset-0 z-0" data-home-scene-accent>
          <div
            class="absolute inset-0 bg-gradient-to-b from-bg-elevated/70 via-transparent to-transparent"
          />
          <div
            class="absolute left-[50%] top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl sm:h-72 sm:w-72"
          />
        </div>
        <div class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20" data-home-scene-content>
          <Motion
            as="div"
            v-bind="scrollMotion(0.1)"
            class="relative z-10 grid gap-10 px-5 sm:px-6 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-14 lg:px-8"
          >
            <div class="max-w-3xl space-y-6">
              <h2
                class="max-w-[8.2ch] text-[clamp(2.9rem,5.9vw,5.5rem)] font-semibold tracking-[-0.06em] leading-[0.94] text-default text-balance"
              >
                {{ mechanism.title }}
              </h2>
              <p class="max-w-xl text-lg leading-[1.75] text-default/82 sm:text-[1.22rem]">
                {{ mechanism.description }}
              </p>
            </div>

            <div
              class="grid gap-x-8 gap-y-6 border-t border-default/55 pt-8 sm:grid-cols-2 lg:pt-12"
            >
              <Motion
                v-for="(item, index) in mechanism.items"
                :key="item"
                v-bind="staggerMotion(index)"
              >
                <div class="space-y-3 border-b border-default/45 pb-5">
                  <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary/80">
                    {{ String(index + 1).padStart(2, '0') }}
                  </p>
                  <p class="text-base font-medium tracking-tight text-default/84 sm:text-lg">
                    {{ item }}
                  </p>
                </div>
              </Motion>
            </div>
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- Process -->
    <UPageSection id="process" :ui="SECTION_UI">
      <div class="relative isolate py-12 sm:py-16 lg:min-h-screen lg:py-0" data-home-scene>
        <div class="pointer-events-none absolute inset-0 z-0" data-home-scene-accent>
          <div
            class="absolute inset-x-0 top-12 h-36 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl"
          />
        </div>
        <div class="lg:min-h-[calc(100svh-5.5rem)] lg:pt-28 lg:pb-20" data-home-scene-content>
          <Motion
            as="div"
            v-bind="scrollMotion(0.1)"
            class="relative z-10 space-y-10 px-5 sm:px-6 lg:flex lg:min-h-[calc(100svh-5.5rem)] lg:flex-col lg:justify-center lg:px-8"
          >
            <h2
              class="max-w-4xl text-[clamp(3.05rem,7vw,6.2rem)] font-semibold tracking-[-0.06em] leading-[0.92] text-default text-balance"
            >
              {{ process.title }}
            </h2>

            <div class="divide-y divide-default/45 border-y border-default/45">
              <Motion
                v-for="(item, index) in process.items"
                :key="item.step"
                v-bind="staggerMotion(index)"
              >
                <div
                  class="grid gap-4 py-6 sm:gap-6 sm:py-8 lg:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:py-9"
                >
                  <p
                    class="font-mono text-xs uppercase tracking-[0.16em] text-primary/80 lg:pt-3"
                  >
                    Step {{ item.step }}
                  </p>
                  <h3
                    class="text-2xl font-semibold tracking-[-0.04em] text-default sm:text-3xl lg:max-w-sm"
                  >
                    {{ item.title }}
                  </h3>
                  <p class="max-w-xl text-base leading-[1.75] text-default/82 sm:text-lg">
                    {{ item.description }}
                  </p>
                </div>
              </Motion>
            </div>
          </Motion>
        </div>
      </div>
    </UPageSection>
  </div>
</template>
