import { AUDIENCE_LABELS } from "../model/types";
import type { SlideTemplate } from "../model/types";

interface TemplateCardProps {
  template: SlideTemplate;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const sectionCount = template.sectionDefinitions.length;

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      aria-pressed={isSelected}
      className={[
        "w-full rounded-lg border-2 p-5 text-left transition-colors",
        isSelected
          ? "border-indigo-600 bg-indigo-50"
          : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
        {isSelected && (
          <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">
            Selected
          </span>
        )}
      </div>

      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{template.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {template.supportedAudienceTypes.map((audience) => (
          <span
            key={audience}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
          >
            {AUDIENCE_LABELS[audience] ?? audience}
          </span>
        ))}
        <span className="ml-auto text-xs text-gray-400">
          {sectionCount} section{sectionCount !== 1 ? "s" : ""}
        </span>
      </div>
    </button>
  );
}
