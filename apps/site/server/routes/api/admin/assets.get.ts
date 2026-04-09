import { runQuery } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const assets = runQuery('SELECT * FROM assets ORDER BY createdAt DESC')
    return assets
  } catch (error) {
    console.error('Error fetching assets:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch assets',
    })
  }
})
