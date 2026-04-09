import type { AudienceType } from "../model/types";
import { defaultTemplates } from "../model/defaultTemplates";

type Template = (typeof defaultTemplates)[number];

export function getTemplates(): Template[] {
  return [...defaultTemplates];
}

export function getTemplateById(id: string): Template | undefined {
  return defaultTemplates.find((t) => t.id === id);
}

export function getTemplatesByAudienceType(
  audienceType: AudienceType,
): Template[] {
  return defaultTemplates.filter((t) =>
    t.supportedAudienceTypes.includes(audienceType),
  );
}

export function getTemplatesByGoal(goal: string): Template[] {
  return defaultTemplates.filter((t) => t.recommendedGoals?.includes(goal));
}

export function getDefaultTemplateForAudienceType(
  audienceType: AudienceType,
): Template | undefined {
  return defaultTemplates.find((t) =>
    t.supportedAudienceTypes.includes(audienceType),
  );
}
