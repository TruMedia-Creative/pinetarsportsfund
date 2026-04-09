import { runQuery, getDatabase } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  try {
    let sql = 'SELECT * FROM decks'
    const params: any[] = []
    
    if (query.published === 'true') {
      sql += ' WHERE published = 1'
    }
    
    sql += ' ORDER BY createdAt DESC'
    
    const decks = runQuery(sql, params)
    return decks
  } catch (error) {
    console.error('Error fetching decks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch decks',
    })
  }
})
