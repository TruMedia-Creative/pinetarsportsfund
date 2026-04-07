import type { DeckSection } from "../model/types";
import type { SlideTemplate, TemplateSectionDefinition } from "../../templates/model/types";

/**
 * Converts a SlideTemplate into an array of default DeckSection objects.
 *
 * Only sections where `defaultEnabled` is true are included.
 * Sections are returned in ascending `sortOrder`.
 * Client-side ids are generated with `crypto.randomUUID()`.
 */
export function createDeckSectionsFromTemplate(template: SlideTemplate): DeckSection[] {
  return template.sectionDefinitions
    .filter((def: TemplateSectionDefinition) => def.defaultEnabled)
    .sort((a: TemplateSectionDefinition, b: TemplateSectionDefinition) => a.sortOrder - b.sortOrder)
    .map((def: TemplateSectionDefinition): DeckSection => ({
      id: crypto.randomUUID(),
      type: def.type,
      title: def.defaultTitle,
      isEnabled: true,
      sortOrder: def.sortOrder,
      content: {},
    }));
}
