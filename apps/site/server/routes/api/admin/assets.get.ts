import { listAssets } from '~/server/utils/mockStore'

export default defineEventHandler(async (event) => {
  try {
    return listAssets()
  } catch (error) {
    console.error('Error fetching assets:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch assets',
    })
  }
})
