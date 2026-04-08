import type { Deck, CreateDeckInput } from "../../../features/decks/model";
import { apiRequest } from "../http";
import {
  deleteRowById,
  getRowById,
  listRows,
  seedTableFromLegacyOrDefaults,
  upsertRow,
} from "./sqlite";

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
    sections: [
      {
        id: "d1-s01",
        type: "cover",
        title: "Cover",
        isEnabled: true,
        sortOrder: 1,
        content: {
          tagline: "Accredited Investor Opportunity",
          body: "Pine Tar Sports Fund is developing a 58,000 sq ft multi-use indoor sports complex in Nashville, TN with diversified recurring revenue and a clear stabilization path.",
          contactName: "Marcus Webb",
          contactTitle: "Managing Partner",
          company: "Pine Tar Sports Fund",
          address: "Nashville, Tennessee",
        },
      },
      {
        id: "d1-s02",
        type: "executive_summary",
        title: "Executive Summary",
        isEnabled: true,
        sortOrder: 2,
        content: {
          body: "The project combines high-demand youth athletics infrastructure with durable real-estate fundamentals. Total capitalization is $12.5M, including a $4.2M equity raise.",
          returnsTableTitle: "Target Economics",
          returnsTableRows: [
            { label: "Equity Raise", value: "$4.2M", highlight: true },
            { label: "Preferred Return", value: "8%" },
            { label: "Target IRR", value: "17-22%" },
            { label: "Hold Period", value: "5-7 years" },
          ],
        },
      },
      {
        id: "d1-s03",
        type: "investment_thesis",
        title: "Investment Thesis",
        isEnabled: true,
        sortOrder: 3,
        content: {
          body: "Indoor youth sports remains undersupplied in fast-growing metros. Pine Tar's site and programming create a defensible local platform.",
          bullets: [
            "Strong population growth in target trade area",
            "Multiple revenue streams (rentals, memberships, tournaments, events)",
            "Real-asset downside protection with operating upside",
            "Institutional sale or refinance optionality at stabilization",
          ],
        },
      },
      {
        id: "d1-s04",
        type: "use_of_funds",
        title: "Use of Funds",
        isEnabled: true,
        sortOrder: 4,
        content: {
          body: "Equity will be used for project completion, technology, and operating reserves.",
          allocationRows: [
            { category: "Land & Site Work", amount: "$1.8M" },
            { category: "Construction", amount: "$7.2M" },
            { category: "Equipment & Technology", amount: "$1.4M" },
            { category: "Working Capital Reserve", amount: "$0.95M" },
            { category: "Soft Costs", amount: "$1.15M" },
          ],
          totalLabel: "Total Project Cost",
          totalAmount: "$12.5M",
        },
      },
      {
        id: "d1-s05",
        type: "returns",
        title: "Returns",
        isEnabled: true,
        sortOrder: 5,
        content: {
          body: "Investor distributions begin after operational stabilization with a preferred return waterfall.",
          keyMetrics: [
            { value: "8%", label: "Preferred Return" },
            { value: "17-22%", label: "Target IRR" },
            { value: "2.2x-2.8x", label: "Target MOIC" },
          ],
          exitStrategyTitle: "Exit Strategy",
          exitStrategyBody: "Planned exit through strategic sale or refinance once NOI and occupancy targets are achieved.",
        },
      },
      {
        id: "d1-s06",
        type: "projections",
        title: "Projections",
        isEnabled: true,
        sortOrder: 6,
        content: {
          body: "Conservative ramp assumptions support durable NOI and DSCR at stabilization.",
          rows: [
            { label: "Year 1 Revenue", value: "$1.84M" },
            { label: "Year 2 Revenue", value: "$2.61M" },
            { label: "Year 3 Revenue", value: "$3.18M" },
            { label: "Stabilized NOI", value: "$1.43M" },
            { label: "Year 3 DSCR", value: "1.62x" },
          ],
        },
      },
      {
        id: "d1-s07",
        type: "team",
        title: "Team",
        isEnabled: true,
        sortOrder: 7,
        content: {
          members: [
            { name: "Marcus Webb", title: "Managing Partner", bio: "20+ years in commercial development and operations." },
            { name: "Danielle Ortiz", title: "Partner, Operations", bio: "Former multi-site athletics operator focused on utilization and retention." },
            { name: "Kevin Zhao", title: "CFO", bio: "Structured debt and equity across real estate and specialty facilities." },
          ],
        },
      },
      {
        id: "d1-s08",
        type: "risks_disclaimer",
        title: "Risks & Disclaimer",
        isEnabled: true,
        sortOrder: 8,
        content: {
          bullets: [
            "Forward-looking statements are based on assumptions and may differ from actual results",
            "Construction timelines and costs may vary",
            "This material is for informational use by qualified investors",
          ],
        },
      },
    ],
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
    sections: [
      {
        id: "d2-s01",
        type: "cover",
        title: "Cover",
        isEnabled: true,
        sortOrder: 1,
        content: {
          tagline: "Debt Financing Package",
          body: "Lender package for Pine Tar Fieldhouse outlining collateral, sources and uses, and debt service profile.",
        },
      },
      {
        id: "d2-s02",
        type: "executive_summary",
        title: "Executive Summary",
        isEnabled: true,
        sortOrder: 2,
        content: {
          body: "Borrower seeks $8.3M in senior debt financing supported by stabilized cash flow from diversified facility operations.",
        },
      },
      {
        id: "d2-s03",
        type: "project_overview",
        title: "Project Overview",
        isEnabled: true,
        sortOrder: 3,
        content: {
          bullets: [
            "58,000 sq ft indoor fieldhouse",
            "Prime suburban location with strong access",
            "Pre-leasing and program commitments underway",
          ],
        },
      },
      {
        id: "d2-s04",
        type: "use_of_funds",
        title: "Sources & Uses",
        isEnabled: true,
        sortOrder: 4,
        content: {
          allocationRows: [
            { category: "Senior Loan", amount: "$8.3M" },
            { category: "Equity", amount: "$4.2M" },
          ],
          totalLabel: "Total Capitalization",
          totalAmount: "$12.5M",
        },
      },
      {
        id: "d2-s05",
        type: "projections",
        title: "Debt Coverage",
        isEnabled: true,
        sortOrder: 5,
        content: {
          rows: [
            { label: "Year 1 DSCR", value: "1.18x" },
            { label: "Year 2 DSCR", value: "1.44x" },
            { label: "Year 3 DSCR", value: "1.62x" },
            { label: "LTV at Close", value: "66%" },
          ],
        },
      },
      {
        id: "d2-s06",
        type: "returns",
        title: "Repayment Profile",
        isEnabled: true,
        sortOrder: 6,
        content: {
          body: "Cash flows support full debt service under base and downside scenarios.",
          timelineItems: [
            { period: "2025", phase: "Close", description: "Construction and permanent financing close" },
            { period: "2026", phase: "Ramp", description: "Operating ramp and occupancy growth" },
            { period: "2027+", phase: "Stabilize", description: "Stable debt service with refinance optionality" },
          ],
        },
      },
    ],
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
    sections: [
      {
        id: "d3-s01",
        type: "cover",
        title: "Cover",
        isEnabled: true,
        sortOrder: 1,
        content: {
          tagline: "Sponsorship Opportunities",
          body: "Hometown Arena offers year-round brand visibility through events, leagues, camps, and digital channels.",
        },
      },
      {
        id: "d3-s02",
        type: "executive_summary",
        title: "Executive Summary",
        isEnabled: true,
        sortOrder: 2,
        content: {
          body: "The arena hosts 300K+ annual visits across youth sports, tournaments, and community programming.",
        },
      },
      {
        id: "d3-s03",
        type: "opportunity",
        title: "Sponsorship Opportunity",
        isEnabled: true,
        sortOrder: 3,
        content: {
          bullets: [
            "Naming rights for primary court and training zones",
            "Jersey and event branding integration",
            "On-site and digital campaign activations",
          ],
        },
      },
      {
        id: "d3-s04",
        type: "market",
        title: "Audience Reach",
        isEnabled: true,
        sortOrder: 4,
        content: {
          bullets: [
            "Family-oriented demographic with high local engagement",
            "Repeat monthly attendance from leagues and clubs",
            "Strong social amplification through athlete networks",
          ],
        },
      },
      {
        id: "d3-s05",
        type: "returns",
        title: "Sponsor Value",
        isEnabled: true,
        sortOrder: 5,
        content: {
          keyMetrics: [
            { value: "300K+", label: "Annual Visits" },
            { value: "52", label: "Weeks of Exposure" },
            { value: "4", label: "Package Tiers" },
          ],
        },
      },
      {
        id: "d3-s06",
        type: "closing_cta",
        title: "Next Steps",
        isEnabled: true,
        sortOrder: 6,
        content: {
          bullets: [
            "Select package tier",
            "Finalize activation plan",
            "Sign annual sponsorship agreement",
          ],
        },
      },
    ],
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
    templateId: "tpl-municipality-partnership",
    projectName: "Riverside Sports Village",
    subtitle: "Public-Private Partnership Proposal",
    summary:
      "A public-private partnership proposal presenting economic impact projections, community benefits, and infrastructure requirements for Riverside Sports Village.",
    sections: [
      {
        id: "d4-s01",
        type: "cover",
        title: "Cover",
        isEnabled: true,
        sortOrder: 1,
        content: {
          tagline: "Public-Private Partnership Proposal",
          body: "Riverside Sports Village is a regional facility project designed to expand recreation access and drive local economic activity.",
        },
      },
      {
        id: "d4-s02",
        type: "executive_summary",
        title: "Executive Summary",
        isEnabled: true,
        sortOrder: 2,
        content: {
          body: "The project combines private capital and municipal coordination to deliver long-term community amenities and measurable tax impact.",
        },
      },
      {
        id: "d4-s03",
        type: "opportunity",
        title: "Community Need",
        isEnabled: true,
        sortOrder: 3,
        content: {
          bullets: [
            "Shortage of year-round youth and community sports space",
            "Need for safe after-school programming capacity",
            "Opportunity to attract weekend tournament visitors",
          ],
        },
      },
      {
        id: "d4-s04",
        type: "investment_thesis",
        title: "Municipal Partnership Case",
        isEnabled: true,
        sortOrder: 4,
        content: {
          bullets: [
            "Private operator execution with public-interest outcomes",
            "Predictable operations and maintenance plan",
            "Shared governance model with transparent KPIs",
          ],
        },
      },
      {
        id: "d4-s05",
        type: "use_of_funds",
        title: "Capital Plan",
        isEnabled: true,
        sortOrder: 5,
        content: {
          allocationRows: [
            { category: "Private Capital", amount: "$9.1M" },
            { category: "Municipal Infrastructure Support", amount: "$3.4M" },
          ],
          totalLabel: "Total Project Budget",
          totalAmount: "$12.5M",
        },
      },
      {
        id: "d4-s06",
        type: "projections",
        title: "Economic Impact",
        isEnabled: true,
        sortOrder: 6,
        content: {
          rows: [
            { label: "Direct Jobs", value: "48" },
            { label: "Annual Visitor Spend", value: "$6.2M" },
            { label: "Annual Local Tax Impact", value: "$780K" },
          ],
        },
      },
      {
        id: "d4-s07",
        type: "closing_cta",
        title: "Requested Action",
        isEnabled: true,
        sortOrder: 7,
        content: {
          bullets: [
            "Approve partnership framework",
            "Authorize infrastructure coordination",
            "Advance to definitive agreement drafting",
          ],
        },
      },
    ],
    assetIds: [],
    updatedAt: "2025-02-14T16:00:00Z",
    createdAt: "2024-12-01T09:00:00Z",
  },
];

let seeded = false;

async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  await seedTableFromLegacyOrDefaults("decks", STORAGE_KEY, mockDecks);
  seeded = true;
}

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDecks(): Promise<Deck[]> {
  await delay();
  try {
    return await apiRequest<Deck[]>("/decks");
  } catch {
    // fall back to client storage when API is unavailable
  }
  await ensureSeeded();
  const decks = await listRows<Deck>("decks");
  return [...decks];
}

export async function getDeckById(id: string): Promise<Deck | undefined> {
  await delay();
  try {
    return await apiRequest<Deck>(`/decks/${id}`);
  } catch {
    // fall back to client storage when API is unavailable
  }
  await ensureSeeded();
  return getRowById<Deck>("decks", id);
}

export async function createDeck(data: CreateDeckInput): Promise<Deck> {
  await delay();
  try {
    return await apiRequest<Deck>("/decks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    // fall back to client storage when API is unavailable
  }
  await ensureSeeded();
  const now = new Date().toISOString();
  const deck: Deck = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await upsertRow("decks", deck);
  return deck;
}

export async function updateDeck(
  id: string,
  data: Partial<CreateDeckInput>,
): Promise<Deck> {
  await delay();
  try {
    return await apiRequest<Deck>(`/decks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    // fall back to client storage when API is unavailable
  }
  await ensureSeeded();
  const existing = await getRowById<Deck>("decks", id);
  if (!existing) {
    throw new Error(`Deck not found: ${id}`);
  }
  const updated: Deck = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await upsertRow("decks", updated);
  return updated;
}

export async function deleteDeck(id: string): Promise<void> {
  await delay();
  try {
    await apiRequest<void>(`/decks/${id}`, { method: "DELETE" });
    return;
  } catch {
    // fall back to client storage when API is unavailable
  }
  await ensureSeeded();
  const existing = await getRowById<Deck>("decks", id);
  if (!existing) {
    throw new Error(`Deck not found: ${id}`);
  }
  await deleteRowById("decks", id);
}
