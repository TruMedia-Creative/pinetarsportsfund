import { z } from 'zod'

export const DeckSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().optional(),
  slugForPublic: z.string().optional(),
  status: z.enum(['draft', 'ready', 'exported', 'archived']).default('draft'),
  published: z.boolean().default(false),
  content: z.record(z.string(), z.any()).optional(),
  marketingMetadata: z.object({
    summary: z.string().optional(),
    heroImageUrl: z.string().optional(),
    tags: z.array(z.string()).optional(),
    expiresAt: z.string().optional(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  publishedAt: z.string().optional(),
})

export const AssetSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  type: z.enum(['image', 'chart', 'logo', 'headshot', 'rendering', 'document']),
  url: z.string().url(),
  alt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
})

export const FinancialModelSchema = z.object({
  id: z.string().uuid().optional(),
  deckId: z.string().uuid(),
  projectName: z.string(),
  minimumInvestment: z.number().optional(),
  targetRaise: z.number().optional(),
  data: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().optional(),
})

export type Deck = z.infer<typeof DeckSchema>
export type Asset = z.infer<typeof AssetSchema>
export type FinancialModel = z.infer<typeof FinancialModelSchema>
