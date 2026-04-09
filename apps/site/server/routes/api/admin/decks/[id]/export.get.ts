import { getDeckById } from '~/server/utils/mockStore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const deck = id ? getDeckById(id) : null

    if (!deck) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Deck not found',
      })
    }

    return {
      message: 'PPTX export placeholder',
      deckId: id,
      title: deck.title,
    }
  } catch (error: any) {
    if (error.statusCode === 404) throw error

    console.error('Error exporting deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to export deck',
    })
  }
})
