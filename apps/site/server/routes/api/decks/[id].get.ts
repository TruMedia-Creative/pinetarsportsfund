import { runQueryOne } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  try {
    const deck = runQueryOne('SELECT * FROM decks WHERE id = ? OR slugForPublic = ?', [id, id])
    
    if (!deck) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Deck not found',
      })
    }
    
    return deck
  } catch (error: any) {
    if (error.statusCode === 404) throw error
    
    console.error('Error fetching deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch deck',
    })
  }
})
