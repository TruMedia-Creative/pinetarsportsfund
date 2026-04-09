import { getDeckByIdOrSlug } from '~/server/utils/mockStore'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    const deck = id ? getDeckByIdOrSlug(id) : null

    if (!deck) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Deck not found',
      })
    }
    
    return deck
  } catch (error: any) {
    if (error.statusCode === 404) throw error

    console.error('Error fetching deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch deck',
    })
  }
})
