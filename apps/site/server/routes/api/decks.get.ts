import { serverSupabaseClient } from '#supabase/server'
import type { DbDeckRow } from '~/server/utils/deckMapper'
import { mapDeckRow } from '~/server/utils/deckMapper'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const client = await serverSupabaseClient(event)

  try {
    let q = client
      .from('decks')
      .select('id, title, slug, status, published, marketing_metadata, published_at, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (query.published === 'true') {
      q = q.eq('published', true)
    }

    const { data, error } = await q
    if (error) throw error

    return (data as DbDeckRow[]).map(mapDeckRow)
  } catch (err) {
    console.error('Error fetching decks:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch decks',
    })
  }
})
