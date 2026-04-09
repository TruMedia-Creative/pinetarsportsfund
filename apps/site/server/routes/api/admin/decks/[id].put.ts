import { runQueryOne, executeInsert } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const sql = `
      UPDATE decks 
      SET status = ?, published = ?, marketingMetadata = ?, updatedAt = datetime('now')
      WHERE id = ?
    `

    const params = [
      body.status || 'draft',
      body.published ? 1 : 0,
      JSON.stringify(body.marketingMetadata || {}),
      id,
    ]

    executeInsert(sql, params)

    return { success: true, id }
  } catch (error) {
    console.error('Error updating deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update deck',
    })
  }
})
