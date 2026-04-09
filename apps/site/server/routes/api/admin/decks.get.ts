import { listDecks } from '~/server/utils/mockStore'

export default defineEventHandler(async () => {
  try {
    return listDecks()
  } catch (error) {
    console.error('Error fetching decks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch decks',
    })
  }
})
