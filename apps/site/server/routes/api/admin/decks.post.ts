import { z } from 'zod'
import { createDeck } from '~/server/utils/mockStore'

const createDeckSchema = z.object({
  title: z.string().trim().min(1).max(140).optional(),
  description: z.string().trim().max(2000).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const input = createDeckSchema.parse(body)
    const deck = createDeck(input)

    return {
      id: deck.id,
      title: deck.title,
      slug: deck.slug,
      status: deck.status,
    }
  } catch (error: unknown) {
    if ((error as { name?: string }).name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid deck payload',
        data: (error as { flatten: () => unknown }).flatten(),
      })
    }

    console.error('Error creating deck:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create deck',
    })
  }
})
