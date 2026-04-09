/**
 * Shared deck-row mapping helpers for Nitro server routes.
 * Maps Supabase snake_case DB rows to the site's Deck schema.
 */

export interface DbDeckRow {
  id: string
  title: string
  slug: string
  audience_type: string
  status: string
  template_id: string
  project_name: string
  subtitle: string | null
  summary: string | null
  goal: string | null
  depth: string | null
  sections: unknown[]
  asset_ids: string[]
  financial_model_id: string | null
  theme: Record<string, unknown> | null
  published: boolean
  marketing_metadata: {
    summary?: string
    heroImageUrl?: string
    tags?: string[]
    expiresAt?: string
  } | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export function mapDeckRow(row: DbDeckRow) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status as 'draft' | 'ready' | 'exported' | 'archived',
    published: row.published,
    marketingMetadata: row.marketing_metadata ?? undefined,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
