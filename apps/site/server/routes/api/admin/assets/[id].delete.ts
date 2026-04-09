import { executeInsert } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const sql = 'DELETE FROM assets WHERE id = ?'
    executeInsert(sql, [id])

    return { success: true, id }
  } catch (error) {
    console.error('Error deleting asset:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete asset',
    })
  }
})
