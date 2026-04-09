import { getDashboardStats } from '~/server/utils/mockStore'

export default defineEventHandler(async (event) => {
  try {
    return getDashboardStats()
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch stats',
    })
  }
})
