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
  "executive_summary",
  "investment_thesis",
  "opportunity",
  "market",
  "project_overview",
  "team",
  "use_of_funds",
  "returns",
  "projections",
  "risks_disclaimer",
  "closing_cta",
]);

export type AudienceTypeInput = z.infer<typeof audienceTypeSchema>;

export type SectionTypeInput = z.infer<typeof sectionTypeSchema>;

export const sectionTemplateSchema = z.object({
  id: z.string(),
  type: sectionTypeSchema,
  title: z.string().min(1),
  isEnabled: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  content: z.record(z.string(), z.unknown()),
});

export type SectionTemplateInput = z.infer<typeof sectionTemplateSchema>;

export const templateSectionDefinitionSchema = z.object({
  id: z.string(),
  type: sectionTypeSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  isRequired: z.boolean(),
  defaultEnabled: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  defaultContent: z.record(z.string(), z.unknown()),
});

export type TemplateSectionDefinitionInput = z.infer<
  typeof templateSectionDefinitionSchema
>;

export const themeOverridesSchema = z.object({
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
});

export type ThemeOverridesInput = z.infer<typeof themeOverridesSchema>;

export const slideTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  supportedAudienceTypes: z.array(audienceTypeSchema).min(1),
  sectionDefinitions: z.array(templateSectionDefinitionSchema),
  themeOverrides: themeOverridesSchema.optional(),
});

export type SlideTemplateInput = z.infer<typeof slideTemplateSchema>;
