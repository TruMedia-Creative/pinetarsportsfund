import { executeInsert } from '~/server/utils/db'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const id = randomUUID()

    const sql = `
      INSERT INTO assets (
        id, name, type, url, alt, tags, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `

    const params = [
      id,
      body.name,
      body.type,
      body.url,
      body.alt || null,
      JSON.stringify(body.tags || []),
    ]

    executeInsert(sql, params)

    return { id, ...body }
  } catch (error) {
    console.error('Error creating asset:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create asset',
    })
  }
})
