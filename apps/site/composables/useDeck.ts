import type { Deck } from '~/lib/schemas'

export const useDeck = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDeck = async (id: string): Promise<Deck | null> => {
    loading.value = true
    error.value = null
    try {
      const deck = await $fetch<Deck>(`/api/admin/decks/${id}`)
      return deck
    } catch (err) {
      error.value = 'Failed to fetch deck'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createDeck = async (data: Partial<Deck>): Promise<Deck | null> => {
    loading.value = true
    error.value = null
    try {
      const deck = await $fetch<Deck>('/api/admin/decks', {
        method: 'POST',
        body: data,
      })
      return deck
    } catch (err) {
      error.value = 'Failed to create deck'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateDeck = async (id: string, data: Partial<Deck>): Promise<Deck | null> => {
    loading.value = true
    error.value = null
    try {
      const deck = await $fetch<Deck>(`/api/admin/decks/${id}`, {
        method: 'PUT',
        body: data,
      })
      return deck
    } catch (err) {
      error.value = 'Failed to update deck'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteDeck = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/admin/decks/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (err) {
      error.value = 'Failed to delete deck'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
  }
}
