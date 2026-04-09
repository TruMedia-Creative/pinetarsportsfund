import { serverSupabaseClient } from '#supabase/server'
import type { DbDeckRow } from '~/server/utils/deckMapper'
import { mapDeckRow } from '~/server/utils/deckMapper'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const client = await serverSupabaseClient(event)

  try {
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Missing deck id or slug' })
    }

    // Support both UUID id and slug lookups from public pages
    const { data, error } = await client
      .from('decks')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .eq('published', true)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Deck not found' })
    }

    return mapDeckRow(data as DbDeckRow)
  } catch (err: unknown) {
    if ((err as { statusCode?: number }).statusCode === 404) throw err
    console.error('Error fetching deck:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch deck',
    })
  }
})
