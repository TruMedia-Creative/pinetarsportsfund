export type Deck = {
  id: string
  title: string
  slug: string
  slugForPublic?: string
  status: 'draft' | 'ready' | 'exported' | 'archived'
  published: boolean
  content?: Record<string, any>
  marketingMetadata?: {
    summary?: string
    heroImageUrl?: string
    tags?: string[]
    expiresAt?: string
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export type Asset = {
  id: string
  name: string
  type: 'image' | 'chart' | 'logo' | 'headshot' | 'rendering' | 'document'
  url: string
  alt?: string
  tags?: string[]
  createdAt: string
}

export type FinancialModel = {
  id: string
  deckId: string
  projectName: string
  minimumInvestment?: number
  targetRaise?: number
  data?: Record<string, any>
  createdAt: string
}

export type User = {
  id: string
  username: string
  email?: string
  createdAt: string
}
