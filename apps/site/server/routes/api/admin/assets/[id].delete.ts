import { deleteAsset } from '~/server/utils/mockStore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Asset id is required',
      })
    }

    if (!deleteAsset(id)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Asset not found',
      })
    }

    return { success: true, id }
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode) {
      throw error
    }

    console.error('Error deleting asset:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete asset',
    })
  }
})
