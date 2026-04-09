<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-8">Contact Us</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 class="text-2xl font-bold mb-6">Get In Touch</h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              v-model="form.message"
              rows="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {{ loading ? 'Sending...' : 'Send Message' }}
          </button>
        </form>

        <div v-if="success" class="mt-4 p-4 bg-green-50 text-green-800 rounded-lg">
          Thank you for your message. We'll be in touch soon!
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-6">Contact Information</h2>
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Email</h3>
            <a href="mailto:contact@pinetarsportsfund.com" class="text-blue-600 hover:text-blue-800">
              contact@pinetarsportsfund.com
            </a>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Office</h3>
            <p class="text-gray-600">
              Pine Tar Sports Fund<br />
              Investment & Sports Management<br />
              United States
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Hours</h3>
            <p class="text-gray-600">
              Monday - Friday: 9:00 AM - 6:00 PM EST<br />
              Saturday & Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
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
