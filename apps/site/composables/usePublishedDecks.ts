import type { Deck } from '~/lib/schemas'

export const usePublishedDecks = () => {
  const decks = ref<Deck[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPublishedDecks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Deck[]>('/api/decks', {
        query: { published: 'true' },
      })
      decks.value = response || []
    } catch (err) {
      error.value = 'Failed to fetch decks'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPublishedDecks()
  })

  return {
    decks: readonly(decks),
    loading: readonly(loading),
    error: readonly(error),
    refresh: fetchPublishedDecks,
  }
}
