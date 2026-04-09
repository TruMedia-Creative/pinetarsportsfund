<template>
  <div class="site-container py-16 md:py-20">
    <p class="section-kicker">Contact</p>
    <h1 class="section-title mt-3">Talk with our investment team</h1>
    <p class="mt-4 max-w-2xl text-slate-600">
      Share your project type, capital objective, or deck need. We will route your request to the right Pine Tar workflow.
    </p>

    <div class="mt-12 grid gap-7 lg:grid-cols-[1.25fr_1fr]">
      <section class="rounded-2xl border border-slate-200 bg-white p-7 md:p-8">
        <h2 class="text-2xl font-extrabold text-slate-900">Get in touch</h2>
        <form @submit.prevent="submitForm" class="mt-7 space-y-5">
          <div>
            <label class="label" for="name">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="input"
              required
            />
          </div>

          <div>
            <label class="label" for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input"
              required
            />
          </div>

          <div>
            <label class="label" for="message">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              class="input"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
          >
            {{ loading ? 'Sending message...' : 'Send message' }}
          </button>
        </form>

        <div v-if="success" class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          Thank you. Your request has been received and our team will follow up shortly.
        </div>
      </section>

      <aside class="rounded-2xl border border-slate-200 bg-slate-50 p-7 md:p-8">
        <h2 class="text-xl font-extrabold text-slate-900">Direct channels</h2>
        <ul class="mt-6 space-y-5 text-sm text-slate-600">
          <li>
            <p class="font-semibold text-slate-900">General inquiries</p>
            <a href="mailto:contact@pinetarsportsfund.com" class="hover:text-sky-700">contact@pinetarsportsfund.com</a>
          </li>
          <li>
            <p class="font-semibold text-slate-900">Deck requests</p>
            <p>Investor pitch decks, sponsorship decks, lender / financing decks, and municipality partnership materials.</p>
          </li>
          <li>
            <p class="font-semibold text-slate-900">Coverage</p>
            <p>Sports, venue, and partnership narratives for private and strategic capital discussions.</p>
          </li>
          <li>
            <p class="font-semibold text-slate-900">Response window</p>
            <p>We typically reply within one business day for active deal and deck inquiries.</p>
          </li>
        </ul>
      </aside>
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
