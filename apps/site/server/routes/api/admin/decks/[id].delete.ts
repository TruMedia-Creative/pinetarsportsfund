import { deleteDeck } from '~/server/utils/mockStore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Deck id is required',
      })
    }

    if (!deleteDeck(id)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Deck not found',
      })
    }

    return { success: true, id }
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode) {
      throw error
    }

    console.error('Error deleting deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete deck',
    })
  }
})
