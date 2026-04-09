import type { DeckSection } from "../model/types";
import type { SlideTemplate, TemplateSectionDefinition } from "../../templates/model/types";
import { getBlueprintOptions } from "../lib/slideBlueprints";

/**
 * Converts a SlideTemplate into an array of default DeckSection objects.
 *
 * Sections where `defaultEnabled` is explicitly set to `false` are excluded;
 * all others (including those with `defaultEnabled` unset) are included.
 * Sections are returned in ascending `sortOrder`.
 * Client-side ids are generated with `crypto.randomUUID()`.
 */
export function createDeckSectionsFromTemplate(template: SlideTemplate): DeckSection[] {
  return template.sectionDefinitions
    .filter((def: TemplateSectionDefinition) => def.defaultEnabled !== false)
    .sort((a: TemplateSectionDefinition, b: TemplateSectionDefinition) => a.sortOrder - b.sortOrder)
    .map((def: TemplateSectionDefinition): DeckSection => ({
      id: crypto.randomUUID(),
      type: def.type,
      title: def.defaultTitle,
      isEnabled: true,
      sortOrder: def.sortOrder,
      content: {
        body: def.defaultContent,
        layoutVariant: getBlueprintOptions(def.type)[0]?.id ?? "narrative",
      },
    }));
}
