import { runQuery, executeInsert } from '~/server/utils/db'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const decks = runQuery('SELECT * FROM decks ORDER BY createdAt DESC')
    return decks
  } catch (error) {
    console.error('Error fetching decks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch decks',
    })
  }
})
