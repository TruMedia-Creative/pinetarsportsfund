<template>
  <div>
    <!-- ===== DARK HERO ===== -->
    <div class="page-hero-dark">
      <div class="relative z-10 site-container text-center">
        <div class="section-badge mb-6">
          <span>Contact</span>
        </div>
        <h1
          class="mx-auto max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl"
        >
          Talk with our investment team
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400">
          Share your project type, capital objective, or deck need. We will route your request
          to the right Pine Tar workflow.
        </p>
      </div>
    </div>

    <!-- ===== FORM + CHANNELS ===== -->
    <div class="py-16 sm:py-20" style="background: var(--color-bg)">
      <div class="site-container">
        <div class="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <!-- Form card -->
          <section class="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <h2 class="text-2xl font-bold text-slate-900">Get in touch</h2>
            <p class="mt-1.5 text-sm text-slate-500">We respond to all inquiries within one business day.</p>

            <form @submit.prevent="submitForm" class="mt-7 space-y-5">
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label class="label" for="name">Full name</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="input"
                    placeholder="Jamie Hartwell"
                    required
                  />
                </div>
                <div>
                  <label class="label" for="email">Email address</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="input"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="label" for="message">Tell us about your project</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="6"
                  class="input resize-none"
                  placeholder="Describe the opportunity, asset type, or capital objective…"
                  required
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span v-if="loading">Sending message…</span>
                <span v-else>Send message</span>
              </button>
            </form>

            <div
              v-if="success"
              class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
            >
              Thank you. Your request has been received and our team will follow up shortly.
            </div>
          </section>

          <!-- Channels sidebar -->
          <aside class="space-y-4">
            <div class="mb-6">
              <p class="section-kicker">Direct channels</p>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">
                Prefer to reach us directly? Use any of the channels below.
              </p>
            </div>

            <div
              v-for="channel in channels"
              :key="channel.heading"
              class="channel-card"
            >
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                {{ channel.heading }}
              </p>
              <a
                v-if="channel.isEmail"
                :href="`mailto:${channel.content}`"
                class="mt-1 block text-base font-semibold text-slate-900 transition-colors hover:text-amber-700"
              >
                {{ channel.content }}
              </a>
              <p v-else class="mt-1 text-base font-semibold text-slate-900">
                {{ channel.content }}
              </p>
            </div>

            <!-- Schedule note -->
            <div class="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
              <p class="text-sm font-semibold text-slate-700">Scheduling a review?</p>
              <p class="mt-1.5 text-xs leading-relaxed text-slate-500">
                For due-diligence calls and formal introductions, our team prefers a brief written
                summary first. Include it in your message above.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

usePageSeo({
  title: 'Contact',
  description:
    'Contact Pine Tar Sports Fund about investor decks, sponsorship decks, lender packages, and municipality partnership materials.',
  path: '/contact',
})

const { data: contactData } = await useAsyncData('contact-page', () =>
  queryCollection('contactPage').first(),
)

const channels = computed(() => contactData.value?.channels ?? [])

const form = ref({
  name: '',
  email: '',
  message: '',
})
const loading = ref(false)
const success = ref(false)

const submitForm = async () => {
  loading.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form.value,
    })
    success.value = true
    form.value = { name: '', email: '', message: '' }
    setTimeout(() => {
      success.value = false
    }, 5000)
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    loading.value = false
  }
}
</script>
