import type { Asset, CreateAssetInput } from "../../../features/assets/model";
import { supabase } from "../../supabase";

interface DbAssetRow {
  id: string;
  name: string;
  type: Asset["type"];
  url: string;
  alt: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: DbAssetRow): Asset {
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

export async function getAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbAssetRow[]).map(mapRow);
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as DbAssetRow) : undefined;
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("assets")
    .insert({
      name: input.name,
      type: input.type,
      url: input.url,
      alt: input.alt ?? null,
      tags: input.tags ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as DbAssetRow);
}

export async function deleteAsset(id: string): Promise<void> {
  const { error } = await supabase.from("assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
