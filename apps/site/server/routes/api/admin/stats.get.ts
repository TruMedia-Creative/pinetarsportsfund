import { runQuery, executeInsert, getDatabase } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const decks = runQuery('SELECT * FROM decks WHERE 1=1 ORDER BY createdAt DESC')
    
    const stats = {
      totalDecks: decks.length,
      publishedDecks: decks.filter((d: any) => d.published).length,
      draftDecks: decks.filter((d: any) => d.status === 'draft').length,
      totalAssets: 0,
    }
    
    return stats
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch stats',
    })
  }
})
