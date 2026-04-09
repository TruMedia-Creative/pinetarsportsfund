/**
 * @pinetarsf/shared
 *
 * Canonical TypeScript types for the Pine Tar Sports Fund monorepo.
 * These reflect the Supabase Postgres schema (snake_case → camelCase mapped).
 */

// ── Enumerations ────────────────────────────────────────────────────────────

export type DeckStatus = "draft" | "ready" | "exported" | "archived";

export type AudienceType =
  | "investor"
  | "lender"
  | "sponsor"
  | "municipality"
  | "internal";

export type DeckGoal =
  | "raise_equity"
  | "secure_debt"
  | "win_sponsor"
  | "municipal_partnership"
  | "board_update"
  | "teaser";

export type DeckDepth = "short" | "standard" | "deep_dive";

export type AssetType =
  | "image"
  | "chart"
  | "logo"
  | "headshot"
  | "rendering"
  | "document";

// ── Deck ────────────────────────────────────────────────────────────────────

export interface DeckMarketingMetadata {
  summary?: string;
  heroImageUrl?: string;
  tags?: string[];
  expiresAt?: string;
}

export interface DeckTheme {
  backgroundColor?: string;
  primaryColor?: string;
  accentColor?: string;
  slideSpacing?: "compact" | "normal" | "relaxed";
}

export interface DeckSection {
  id: string;
  type: string;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
  content: Record<string, unknown>;
}

export interface Deck {
  id: string;
  title: string;
  slug: string;
  audienceType: AudienceType;
  status: DeckStatus;
  templateId: string;
  projectName: string;
  subtitle?: string;
  summary?: string;
  goal?: DeckGoal;
  depth?: DeckDepth;
  sections: DeckSection[];
  assetIds: string[];
  financialModelId?: string;
  theme?: DeckTheme;
  published: boolean;
  marketingMetadata?: DeckMarketingMetadata;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
}

// ── Asset ───────────────────────────────────────────────────────────────────

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  alt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Financial Model ─────────────────────────────────────────────────────────

export interface FinancialUseOfFundsRow {
  category: string;
  amount: string;
}

export interface FinancialForecastRow {
  label: string;
  value: string;
}

export interface FinancialModel {
  id: string;
  projectName: string;
  minimumInvestment?: string;
  targetRaise?: string;
  preferredReturn?: string;
  equityStructure?: string;
  useOfFunds: FinancialUseOfFundsRow[];
  forecastRows: FinancialForecastRow[];
  assumptions: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Tenant ──────────────────────────────────────────────────────────────────

export interface TenantBranding {
  logoUrl?: string;
  primaryColor: string;
  fontFamily?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  domain?: string;
  branding: TenantBranding;
}

// ── Supabase DB row types (snake_case) ──────────────────────────────────────
// These match the raw Postgres column names returned by Supabase.

export interface DbDeckRow {
  id: string;
  title: string;
  slug: string;
  audience_type: AudienceType;
  status: DeckStatus;
  template_id: string;
  project_name: string;
  subtitle: string | null;
  summary: string | null;
  goal: DeckGoal | null;
  depth: DeckDepth | null;
  sections: DeckSection[];
  asset_ids: string[];
  financial_model_id: string | null;
  theme: DeckTheme | null;
  published: boolean;
  marketing_metadata: DeckMarketingMetadata | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAssetRow {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  alt: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface DbFinancialModelRow {
  id: string;
  project_name: string;
  minimum_investment: string | null;
  target_raise: string | null;
  preferred_return: string | null;
  equity_structure: string | null;
  use_of_funds: FinancialUseOfFundsRow[];
  forecast_rows: FinancialForecastRow[];
  assumptions: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Mapping helpers ─────────────────────────────────────────────────────────

export function mapDbDeck(row: DbDeckRow): Deck {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    audienceType: row.audience_type,
    status: row.status,
    templateId: row.template_id,
    projectName: row.project_name,
    subtitle: row.subtitle ?? undefined,
    summary: row.summary ?? undefined,
    goal: row.goal ?? undefined,
    depth: row.depth ?? undefined,
    sections: row.sections ?? [],
    assetIds: row.asset_ids ?? [],
    financialModelId: row.financial_model_id ?? undefined,
    theme: row.theme ?? undefined,
    published: row.published,
    marketingMetadata: row.marketing_metadata ?? undefined,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDbAsset(row: DbAssetRow): Asset {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    url: row.url,
    alt: row.alt ?? undefined,
    tags: row.tags ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDbFinancialModel(row: DbFinancialModelRow): FinancialModel {
  return {
    id: row.id,
    projectName: row.project_name,
    minimumInvestment: row.minimum_investment ?? undefined,
    targetRaise: row.target_raise ?? undefined,
    preferredReturn: row.preferred_return ?? undefined,
    equityStructure: row.equity_structure ?? undefined,
    useOfFunds: row.use_of_funds ?? [],
    forecastRows: row.forecast_rows ?? [],
    assumptions: row.assumptions,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
