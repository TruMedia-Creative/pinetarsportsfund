import { z } from "zod/v4";

export const audienceTypeSchema = z.enum([
  "investor",
  "lender",
  "sponsor",
  "municipality",
  "internal",
]);

export const sectionTypeSchema = z.enum([
  "cover",
  "executive-summary",
  "investment-thesis",
  "market",
  "opportunity",
  "project-overview",
  "use-of-funds",
  "returns",
  "projections",
  "team",
  "risks-disclaimer",
  "closing-cta",
]);

export const sectionDefinitionSchema = z.object({
  type: sectionTypeSchema,
  defaultTitle: z.string().min(1),
  defaultContent: z.string().optional(),
  isRequired: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
});

export const themeOverridesSchema = z.object({
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
});

export const templateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  supportedAudienceTypes: z.array(audienceTypeSchema).min(1),
  sectionDefinitions: z.array(sectionDefinitionSchema).min(1),
  themeOverrides: themeOverridesSchema.optional(),
});

export type TemplateInput = z.infer<typeof templateSchema>;
