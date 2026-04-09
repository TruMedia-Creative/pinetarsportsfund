import { z } from "zod/v4";
import { audienceTypeSchema, sectionTypeSchema } from "../../templates/model";

export const deckStatusSchema = z.enum(["draft", "ready", "exported", "archived"]);

export type DeckStatusInput = z.infer<typeof deckStatusSchema>;

export const deckGoalSchema = z.enum([
  "raise_equity",
  "secure_debt",
  "win_sponsor",
  "municipal_partnership",
  "board_update",
  "teaser",
]);

export type DeckGoalInput = z.infer<typeof deckGoalSchema>;

export const deckDepthSchema = z.enum(["short", "standard", "deep_dive"]);

export type DeckDepthInput = z.infer<typeof deckDepthSchema>;

export const slideSpacingSchema = z.enum(["compact", "normal", "relaxed"]);

export const deckThemeSchema = z.object({
  backgroundColor: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  slideSpacing: slideSpacingSchema.optional(),
});

export type DeckThemeInput = z.infer<typeof deckThemeSchema>;

export const deckSectionSchema = z.object({
  id: z.string(),
  type: sectionTypeSchema,
  title: z.string().min(1),
  isEnabled: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  content: z.record(z.string(), z.unknown()),
});

export type DeckSectionInput = z.infer<typeof deckSectionSchema>;

export const deckSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1),
  audienceType: audienceTypeSchema,
  status: deckStatusSchema,
  templateId: z.string().min(1),
  projectName: z.string().min(1, "Project name is required"),
  subtitle: z.string().optional(),
  summary: z.string().optional(),
  goal: deckGoalSchema.optional(),
  depth: deckDepthSchema.optional(),
  sections: z.array(deckSectionSchema),
  assetIds: z.array(z.string()),
  financialModelId: z.string().optional(),
  theme: deckThemeSchema.optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
});

export type DeckInput = z.infer<typeof deckSchema>;

export const createDeckSchema = deckSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
