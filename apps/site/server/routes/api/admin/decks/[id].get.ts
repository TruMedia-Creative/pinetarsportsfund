import { getDeckById } from '~/server/utils/mockStore'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const deck = id ? getDeckById(id) : null

  if (!deck) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Deck not found',
    })
  }

  return deck
})