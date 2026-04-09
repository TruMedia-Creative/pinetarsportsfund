import { getDeckByIdOrSlug } from '~/server/utils/mockStore'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const deck = id ? getDeckByIdOrSlug(id) : null

  if (!deck) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Deck not found',
    })
  }

  const filename = `${deck.slug || deck.id}.pptx`
  const summary = deck.marketingMetadata?.summary || 'Marketing deck export placeholder.'

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)

  return [`Pine Tar Sports Fund`, deck.title, '', summary].join('\n')
})