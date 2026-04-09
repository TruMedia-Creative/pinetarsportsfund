import { executeInsert } from '~/server/utils/db'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const id = randomUUID()
    const slug = body.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50)

    const sql = `
      INSERT INTO decks (
        id, title, slug, status, published, 
        content, marketingMetadata, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `

    const params = [
      id,
      body.title,
      slug,
      'draft',
      0,
      JSON.stringify({}),
      JSON.stringify({}),
    ]

    executeInsert(sql, params)

    return { id, title: body.title, slug, status: 'draft' }
  } catch (error) {
    console.error('Error creating deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create deck',
    })
  }
})
