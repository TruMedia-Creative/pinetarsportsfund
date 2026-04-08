import type { Asset, CreateAssetInput } from "../../../features/assets/model";
import {
  deleteRowById,
  getRowById,
  listRows,
  seedTableFromLegacyOrDefaults,
  upsertRow,
} from "./sqlite";

const STORAGE_KEY = "mock.assets";

const mockAssets: Asset[] = [
  {
    id: "a-1",
    name: "Nashville Facility Exterior",
    type: "rendering",
    url: "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&w=1200&q=80",
    alt: "Exterior rendering of a sports facility",
    tags: ["facility", "exterior"],
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "a-2",
    name: "Youth Training Session",
    type: "image",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    alt: "Youth athletes in training",
    tags: ["youth", "training"],
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
];

let seeded = false;

async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  await seedTableFromLegacyOrDefaults("assets", STORAGE_KEY, mockAssets);
  seeded = true;
}

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAssets(): Promise<Asset[]> {
  await delay();
  await ensureSeeded();
  const assets = await listRows<Asset>("assets");
  return [...assets];
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  await delay();
  await ensureSeeded();
  return getRowById<Asset>("assets", id);
}

export async function createAsset(data: CreateAssetInput): Promise<Asset> {
  await delay();
  await ensureSeeded();
  const now = new Date().toISOString();
  const asset: Asset = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await upsertRow("assets", asset);
  return asset;
}

export async function deleteAsset(id: string): Promise<void> {
  await delay();
  await ensureSeeded();
  const existing = await getRowById<Asset>("assets", id);
  if (!existing) {
    throw new Error(`Asset not found: ${id}`);
  }
  await deleteRowById("assets", id);
}
