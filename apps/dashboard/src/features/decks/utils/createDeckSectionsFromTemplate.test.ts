import { createDeckSectionsFromTemplate } from "./createDeckSectionsFromTemplate";
import type { SlideTemplate } from "../../templates/model";

describe("createDeckSectionsFromTemplate", () => {
  it("filters disabled sections and returns enabled sections sorted by sortOrder", () => {
    const template: SlideTemplate = {
      id: "tpl-1",
      name: "Investor",
      description: "Investor template",
      supportedAudienceTypes: ["investor"],
      sectionDefinitions: [
        {
          type: "market",
          defaultTitle: "Market",
          isRequired: false,
          defaultEnabled: false,
          sortOrder: 3,
          defaultContent: "Ignore",
        },
        {
          type: "cover",
          defaultTitle: "Cover",
          isRequired: true,
          sortOrder: 2,
          defaultContent: "Cover content",
        },
        {
          type: "executive_summary",
          defaultTitle: "Summary",
          isRequired: true,
          sortOrder: 1,
          defaultContent: "Summary content",
        },
      ],
    };

    const sections = createDeckSectionsFromTemplate(template);

    expect(sections).toHaveLength(2);
    expect(sections.map((section) => section.type)).toEqual([
      "executive_summary",
      "cover",
    ]);
    expect(sections.every((section) => section.isEnabled)).toBe(true);
    expect(sections[0]?.content).toEqual({
      body: "Summary content",
      layoutVariant: "narrative",
    });
  });
});
