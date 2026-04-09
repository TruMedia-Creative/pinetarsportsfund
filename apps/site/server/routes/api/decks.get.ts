import { listDecks, listPublishedDecks } from '~/server/utils/mockStore'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    if (query.published === 'true') {
      return listPublishedDecks()
    }

    return listDecks()
  } catch (error) {
    console.error('Error fetching decks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch decks',
    })
  }
})
