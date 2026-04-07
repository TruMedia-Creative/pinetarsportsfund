import type { Deck, CreateDeckInput } from "../../../features/decks/model";

const STORAGE_KEY = "mock.decks";

export const mockDecks: Deck[] = [
  {
    id: "d-1",
    title: "Pine Tar Sports Complex – Investor Pitch",
    slug: "pine-tar-sports-complex-investor-pitch",
    audienceType: "investor",
    status: "ready",
    templateId: "tpl-investor-pitch",
    projectName: "Pine Tar Sports Complex",
    subtitle: "A Premier Multi-Use Sports Facility in the Heart of the Market",
    summary:
      "Pine Tar Sports Fund is acquiring and developing a premier multi-use sports complex targeting accredited investors with preferred returns and a clear exit strategy.",
    sections: [],
    assetIds: [],
    updatedAt: "2025-03-10T12:00:00Z",
    createdAt: "2025-01-15T09:00:00Z",
  },
  {
    id: "d-2",
    title: "Pine Tar Fieldhouse – Lender Package",
    slug: "pine-tar-fieldhouse-lender-package",
    audienceType: "lender",
    status: "draft",
    templateId: "tpl-lender-financing",
    projectName: "Pine Tar Fieldhouse",
    subtitle: "Debt Financing Overview & Project Feasibility",
    summary:
      "A comprehensive lender package detailing the debt structure, collateral, and projected debt-service coverage ratios for the Pine Tar Fieldhouse development.",
    sections: [],
    assetIds: [],
    updatedAt: "2025-04-01T08:30:00Z",
    createdAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "d-3",
    title: "Hometown Arena – Sponsorship Deck",
    slug: "hometown-arena-sponsorship-deck",
    audienceType: "sponsor",
    status: "draft",
    templateId: "tpl-sponsorship",
    projectName: "Hometown Arena",
    subtitle: "Brand Exposure & Community Partnership Opportunities",
    summary:
      "Sponsorship opportunities at Hometown Arena, offering premium visibility, naming rights, and community-facing brand activations for aligned corporate partners.",
    sections: [],
    assetIds: [],
    updatedAt: "2025-03-28T15:00:00Z",
    createdAt: "2025-03-01T11:00:00Z",
  },
  {
    id: "d-4",
    title: "Riverside Sports Village – Municipal Proposal",
    slug: "riverside-sports-village-municipal",
    audienceType: "municipality",
    status: "exported",
    templateId: "tpl-municipality",
    projectName: "Riverside Sports Village",
    subtitle: "Public-Private Partnership Proposal",
    summary:
      "A public-private partnership proposal presenting economic impact projections, community benefits, and infrastructure requirements for Riverside Sports Village.",
    sections: [],
    assetIds: [],
    updatedAt: "2025-02-14T16:00:00Z",
    createdAt: "2024-12-01T09:00:00Z",
  },
];

function loadDecks(): Deck[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Deck[];
  } catch {
    // ignore storage errors
  }
  return [...mockDecks];
}

function saveDecks(data: Deck[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

const decks: Deck[] = loadDecks();

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDecks(): Promise<Deck[]> {
  await delay();
  return [...decks];
}

export async function getDeckById(id: string): Promise<Deck | undefined> {
  await delay();
  return decks.find((d) => d.id === id);
}

export async function createDeck(data: CreateDeckInput): Promise<Deck> {
  await delay();
  const now = new Date().toISOString();
  const deck: Deck = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  decks.push(deck);
  saveDecks(decks);
  return deck;
}

export async function updateDeck(
  id: string,
  data: Partial<CreateDeckInput>,
): Promise<Deck> {
  await delay();
  const index = decks.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error(`Deck not found: ${id}`);
  }
  decks[index] = { ...decks[index], ...data, updatedAt: new Date().toISOString() };
  saveDecks(decks);
  return decks[index];
}

export async function deleteDeck(id: string): Promise<void> {
  await delay();
  const index = decks.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error(`Deck not found: ${id}`);
  }
  decks.splice(index, 1);
  saveDecks(decks);
}
