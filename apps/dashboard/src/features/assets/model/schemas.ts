import { z } from "zod/v4";

export const assetTypeSchema = z.enum([
  "image",
  "chart",
  "logo",
  "headshot",
  "rendering",
  "document",
]);

export const assetSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: assetTypeSchema,
  url: z.string().min(1),
  alt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createAssetSchema = assetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AssetType = z.infer<typeof assetTypeSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
