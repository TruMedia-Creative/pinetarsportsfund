import { z } from 'zod'
import { DeckSchema } from '~/lib/schemas'
import { updateDeck } from '~/server/utils/mockStore'

const updateDeckSchema = DeckSchema.partial().extend({
  title: z.string().trim().min(1).max(140).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Deck id is required',
      })
    }

    const input = updateDeckSchema.parse(body)
    const deck = updateDeck(id, input)
    if (!deck) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Deck not found',
      })
    }

    return deck
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid deck payload',
        data: error.flatten(),
      })
    }

    if ((error as { statusCode?: number }).statusCode) {
      throw error
    }

    console.error('Error updating deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update deck',
    })
  }
})
