import type { SlideTemplate } from "../model/types";
import { TemplateCard } from "./TemplateCard";

interface TemplateSelectorProps {
  templates: SlideTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  if (templates.length === 0) {
    return (
      <p className="text-sm text-gray-500">No templates available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={template.id === selectedTemplateId}
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  );
}
