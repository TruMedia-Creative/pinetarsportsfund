export type AssetType =
  | "image"
  | "chart"
  | "logo"
  | "headshot"
  | "rendering"
  | "document";

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

export interface CreateAssetInput {
  name: string;
  type: AssetType;
  url: string;
  alt?: string;
  tags?: string[];
}
