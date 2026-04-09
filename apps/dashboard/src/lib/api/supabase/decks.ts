import type { Deck, CreateDeckInput } from "../../../features/decks/model";
import type { DeckMarketingMetadata } from "../../../features/decks/model/types";
import { supabase } from "../../supabase";

interface DbDeckRow {
  id: string;
  title: string;
  slug: string;
  audience_type: Deck["audienceType"];
  status: Deck["status"];
  template_id: string;
  project_name: string;
  subtitle: string | null;
  summary: string | null;
  goal: Deck["goal"] | null;
  depth: Deck["depth"] | null;
  sections: Deck["sections"];
  asset_ids: string[];
  financial_model_id: string | null;
  theme: Deck["theme"] | null;
  published: boolean;
  marketing_metadata: DeckMarketingMetadata | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Mapping: DB row → app type ───────────────────────────────────────────────

function mapRow(row: DbDeckRow): Deck {
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
    marketingMetadata: (row.marketing_metadata ?? undefined) as DeckMarketingMetadata | undefined,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Mapping: app type → DB row (for writes) ──────────────────────────────────

function toDbRow(
  data: Omit<CreateDeckInput, "id" | "createdAt" | "updatedAt"> & { published?: boolean; marketingMetadata?: DeckMarketingMetadata },
) {
  return {
    title: data.title,
    slug: data.slug,
    audience_type: data.audienceType,
    status: data.status,
    template_id: data.templateId,
    project_name: data.projectName,
    subtitle: data.subtitle ?? null,
    summary: data.summary ?? null,
    goal: data.goal ?? null,
    depth: data.depth ?? null,
    sections: data.sections ?? [],
    asset_ids: data.assetIds ?? [],
    financial_model_id: data.financialModelId ?? null,
    theme: data.theme ?? null,
    published: data.published ?? false,
    marketing_metadata: data.marketingMetadata ?? null,
  };
}

// ── API functions ─────────────────────────────────────────────────────────────

export async function getDecks(): Promise<Deck[]> {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbDeckRow[]).map(mapRow);
}

export async function getDeckById(id: string): Promise<Deck | undefined> {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as DbDeckRow) : undefined;
}

export async function createDeck(
  input: Omit<CreateDeckInput, never>,
): Promise<Deck> {
  const now = new Date().toISOString();

  // Derive a slug from the title if not present
  const slug =
    (input as { slug?: string }).slug ||
    input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    `deck-${Date.now()}`;

  const row = {
    ...toDbRow({ ...input, slug }),
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("decks")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as DbDeckRow);
}

export async function updateDeck(
  id: string,
  input: Partial<Deck>,
): Promise<Deck> {
  const changes: Record<string, unknown> = {};

  if (input.title !== undefined) changes.title = input.title;
  if (input.slug !== undefined) changes.slug = input.slug;
  if (input.audienceType !== undefined) changes.audience_type = input.audienceType;
  if (input.status !== undefined) changes.status = input.status;
  if (input.templateId !== undefined) changes.template_id = input.templateId;
  if (input.projectName !== undefined) changes.project_name = input.projectName;
  if (input.subtitle !== undefined) changes.subtitle = input.subtitle;
  if (input.summary !== undefined) changes.summary = input.summary;
  if (input.goal !== undefined) changes.goal = input.goal;
  if (input.depth !== undefined) changes.depth = input.depth;
  if (input.sections !== undefined) changes.sections = input.sections;
  if (input.assetIds !== undefined) changes.asset_ids = input.assetIds;
  if (input.financialModelId !== undefined) changes.financial_model_id = input.financialModelId;
  if (input.theme !== undefined) changes.theme = input.theme;
  if (input.published !== undefined) {
    changes.published = input.published;
    if (input.published && !input.publishedAt) {
      changes.published_at = new Date().toISOString();
    }
  }
  if (input.publishedAt !== undefined) changes.published_at = input.publishedAt;
  if (input.marketingMetadata !== undefined) changes.marketing_metadata = input.marketingMetadata;

  const { data, error } = await supabase
    .from("decks")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as DbDeckRow);
}

export async function deleteDeck(id: string): Promise<void> {
  const { error } = await supabase.from("decks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Kept for backward compatibility — aliases used in some feature imports
export { getDeckById as mockDecks };
