import { randomUUID } from 'crypto'
import type { Asset, Deck } from '~/lib/types/models'

type DeckInput = Partial<Deck> & {
  title?: string
  description?: string
}

type AssetInput = Partial<Asset> & {
  name?: string
  type?: Asset['type']
  url?: string
}

const now = () => new Date().toISOString()

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || randomUUID()
}

const seededDecks: Deck[] = [
  {
    id: 'deck-sunbelt-ballpark-district',
    title: 'Sunbelt Ballpark District Redevelopment',
    slug: 'sunbelt-ballpark-district-redevelopment',
    slugForPublic: 'sunbelt-ballpark-district-redevelopment',
    status: 'ready',
    published: true,
    content: {},
    marketingMetadata: {
      summary: 'A venue-led redevelopment story combining premium seating upgrades, sponsorship inventory, and adjacent mixed-use revenue.',
      heroImageUrl: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?auto=format&fit=crop&w=1200&q=80',
      tags: ['Investor Deck', 'Baseball', 'Mixed Use'],
      expiresAt: '2026-12-31T00:00:00.000Z',
    },
    createdAt: '2026-01-15T12:00:00.000Z',
    updatedAt: '2026-03-20T12:00:00.000Z',
    publishedAt: '2026-03-20T12:00:00.000Z',
  },
  {
    id: 'deck-gulf-coast-tournament-campus',
    title: 'Gulf Coast Tournament Campus',
    slug: 'gulf-coast-sports-village',
    slugForPublic: 'gulf-coast-sports-village',
    status: 'ready',
    published: true,
    content: {},
    marketingMetadata: {
      summary: 'A municipality and hospitality partnership narrative anchored by tournament demand, destination spend, and recurring event revenue.',
      heroImageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
      tags: ['Municipality Deck', 'Youth Sports', 'Hospitality'],
      expiresAt: '2026-11-15T00:00:00.000Z',
    },
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-03-28T12:00:00.000Z',
    publishedAt: '2026-03-28T12:00:00.000Z',
  },
  {
    id: 'deck-regional-sponsorship-platform',
    title: 'Regional Sponsorship Platform',
    slug: 'regional-sponsorship-platform',
    status: 'draft',
    published: false,
    content: {},
    marketingMetadata: {
      summary: 'Draft sponsorship and partnership deck for a multi-property sports marketing platform.',
      tags: ['Sponsor Deck', 'Draft'],
    },
    createdAt: '2026-03-05T12:00:00.000Z',
    updatedAt: '2026-03-05T12:00:00.000Z',
  },
]

const seededAssets: Asset[] = [
  {
    id: 'asset-primary-logo',
    name: 'Primary Logo',
    type: 'logo',
    url: 'https://dummyimage.com/600x240/0f172a/ffffff&text=Pine+Tar+Sports+Fund',
    createdAt: '2026-01-05T12:00:00.000Z',
  },
]

const decks = [...seededDecks]
const assets = [...seededAssets]

export function listDecks() {
  return [...decks].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export function listPublishedDecks() {
  return listDecks().filter((deck) => deck.published)
}

export function getDeckById(id: string) {
  return decks.find((deck) => deck.id === id)
}

export function getDeckByIdOrSlug(identifier: string) {
  return decks.find((deck) => deck.id === identifier || deck.slugForPublic === identifier || deck.slug === identifier)
}

export function createDeck(input: DeckInput) {
  const title = input.title?.trim() || 'Untitled Deck'
  const createdAt = now()
  const deck: Deck = {
    id: randomUUID(),
    title,
    slug: slugify(title),
    slugForPublic: undefined,
    status: 'draft',
    published: false,
    content: {},
    marketingMetadata: input.description
      ? { summary: input.description }
      : {},
    createdAt,
    updatedAt: createdAt,
    publishedAt: undefined,
  }

  decks.unshift(deck)
  return deck
}

export function updateDeck(id: string, input: DeckInput) {
  const existingDeck = getDeckById(id)
  if (!existingDeck) {
    return null
  }

  const nextPublished = Boolean(input.published)
  const nextTitle = input.title?.trim() || existingDeck.title

  const updatedDeck: Deck = {
    ...existingDeck,
    ...input,
    title: nextTitle,
    slug: input.slug?.trim() || existingDeck.slug || slugify(nextTitle),
    slugForPublic: nextPublished
      ? input.slugForPublic?.trim() || existingDeck.slugForPublic || existingDeck.slug || slugify(nextTitle)
      : input.slugForPublic?.trim() || existingDeck.slugForPublic,
    published: nextPublished,
    marketingMetadata: {
      ...existingDeck.marketingMetadata,
      ...input.marketingMetadata,
    },
    updatedAt: now(),
    publishedAt: nextPublished
      ? existingDeck.publishedAt || now()
      : undefined,
  }

  const deckIndex = decks.findIndex((deck) => deck.id === id)
  decks.splice(deckIndex, 1, updatedDeck)
  return updatedDeck
}

export function deleteDeck(id: string) {
  const deckIndex = decks.findIndex((deck) => deck.id === id)
  if (deckIndex === -1) {
    return false
  }

  decks.splice(deckIndex, 1)
  return true
}

export function listAssets() {
  return [...assets].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export function createAsset(input: AssetInput) {
  const asset: Asset = {
    id: randomUUID(),
    name: input.name?.trim() || 'Untitled Asset',
    type: input.type || 'image',
    url: input.url?.trim() || 'https://dummyimage.com/1200x800/e5e7eb/111827&text=Asset',
    alt: input.alt,
    tags: input.tags,
    createdAt: now(),
  }

  assets.unshift(asset)
  return asset
}

export function deleteAsset(id: string) {
  const assetIndex = assets.findIndex((asset) => asset.id === id)
  if (assetIndex === -1) {
    return false
  }

  assets.splice(assetIndex, 1)
  return true
}

export function getDashboardStats() {
  const allDecks = listDecks()
  const allAssets = listAssets()

  return {
    totalDecks: allDecks.length,
    publishedDecks: allDecks.filter((deck) => deck.published).length,
    draftDecks: allDecks.filter((deck) => deck.status === 'draft').length,
    totalAssets: allAssets.length,
  }
}