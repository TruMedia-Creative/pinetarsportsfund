import { runQueryOne } from '~/server/utils/db'

interface Deck {
  id: string
  title: string
  slug: string
}

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const deck = runQueryOne<Deck>('SELECT * FROM decks WHERE id = ?', [id])

    if (!deck) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Deck not found',
      })
    }

    // Here you would generate the PPTX file
    // For now, returning a placeholder response
    return {
      message: 'PPTX export would be generated here',
      deckId: id,
      title: deck.title,
    }
  } catch (error: any) {
    if (error.statusCode === 404) throw error

    console.error('Error exporting deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to export deck',
    })
  }
})
