import type { Asset, CreateAssetInput } from "../../../features/assets/model";

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

function loadAssets(): Asset[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Asset[];
  } catch {
    // ignore storage errors
  }
  return [...mockAssets];
}

function saveAssets(data: Asset[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

const assets = loadAssets();

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAssets(): Promise<Asset[]> {
  await delay();
  return [...assets];
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  await delay();
  return assets.find((a) => a.id === id);
}

export async function createAsset(data: CreateAssetInput): Promise<Asset> {
  await delay();
  const now = new Date().toISOString();
  const asset: Asset = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  assets.unshift(asset);
  saveAssets(assets);
  return asset;
}

export async function deleteAsset(id: string): Promise<void> {
  await delay();
  const idx = assets.findIndex((a) => a.id === id);
  if (idx === -1) {
    throw new Error(`Asset not found: ${id}`);
  }
  assets.splice(idx, 1);
  saveAssets(assets);
}
