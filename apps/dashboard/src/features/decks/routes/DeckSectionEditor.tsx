import { useMemo, useRef, useState } from "react";
import type { DeckSection } from "../model/types";
import { AssetPicker } from "../../assets/components";
import type { Asset } from "../../assets/model";
import { Button, SurfacePanel } from "../../../components/ui";
import {
  getBlueprintOptions,
  getSavedLayoutVariant,
  getSectionCompletion,
  getSectionOutline,
  withLayoutVariant,
  type SlideLayoutVariant,
} from "../lib/slideBlueprints";
import type {
  CoverContent,
  ExecutiveSummaryContent,
  UseOfFundsContent,
  ReturnsContent,
  TeamContent,
  ProjectionsContent,
  GenericSectionContent,
  ImageGalleryItem,
  ReturnTableRow,
  UseOfFundsRow,
  UseOfFundsHighlight,
  TimelineItem,
  KeyMetric,
  TeamMember,
  TableOfContentsItem,
  ProjectionsRow,
} from "../model/contentTypes";

interface DeckSectionEditorProps {
  sections: DeckSection[];
  onChange: (sections: DeckSection[]) => void;
  assetIds?: string[];
  onAssetIdsChange?: (assetIds: string[]) => void;
  mode?: "guided" | "expert";
  selectedSectionId?: string;
}

type SectionFilter = "all" | "enabled" | "incomplete";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─────────────────────────────── helpers ────────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-gray-600">{children}</label>;
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}

/* ─────────────────────── Image gallery editor ─────────────────────────── */

function ImageGalleryEditor({
  images,
  onChange,
  onAssetSelected,
  maxImages = 5,
}: {
  images: ImageGalleryItem[];
  onChange: (imgs: ImageGalleryItem[]) => void;
  onAssetSelected?: (assetId: string) => void;
  maxImages?: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const results: ImageGalleryItem[] = await Promise.all(
      files.slice(0, maxImages - images.length).map(async (f) => ({
        url: await readFileAsDataUrl(f),
        alt: f.name,
      })),
    );
    onChange([...images, ...results]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function updateAlt(idx: number, alt: string) {
    const updated = images.map((img, i) => (i === idx ? { ...img, alt } : img));
    onChange(updated);
  }

  function updateUrl(idx: number, url: string) {
    const updated = images.map((img, i) => (i === idx ? { ...img, url } : img));
    onChange(updated);
  }

  function remove(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      {images.map((img, idx) => (
        <div key={idx} className="flex items-start gap-2 rounded border border-gray-200 p-2">
          {img.url && (
            <img
              src={img.url}
              alt={img.alt ?? ""}
              className="h-14 w-20 rounded object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div className="flex-1 space-y-1">
            <TextInput value={img.url} onChange={(v) => updateUrl(idx, v)} placeholder="Image URL" />
            <TextInput value={img.alt ?? ""} onChange={(v) => updateAlt(idx, v)} placeholder="Alt text (optional)" />
            <AssetPicker
              allowedTypes={["image", "chart", "logo", "headshot", "rendering"]}
              previewUrl={img.url}
              onSelect={(asset) => {
                updateUrl(idx, asset.url);
                if (asset.alt) updateAlt(idx, asset.alt);
                onAssetSelected?.(asset.id);
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(idx)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}

      {images.length < maxImages && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange([...images, { url: "" }])}
            className="text-xs text-indigo-600 hover:underline"
          >
            + Add image URL
          </button>
          <span className="text-xs text-gray-400">or</span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs text-indigo-600 hover:underline"
          >
            Upload from device
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Cover section editor ──────────────────────────── */

function CoverEditor({
  content,
  onAssetSelected,
  onChange,
}: {
  content: CoverContent;
  onAssetSelected?: (assetId: string) => void;
  onChange: (c: CoverContent) => void;
}) {
  function set<K extends keyof CoverContent>(key: K, value: CoverContent[K]) {
    onChange({ ...content, [key]: value });
  }

  const heroImages: ImageGalleryItem[] = content.heroImageUrl
    ? [{ url: content.heroImageUrl }]
    : [];

  return (
    <div className="space-y-3">
      <div>
        <FieldLabel>Tagline (e.g. "Investment Opportunity")</FieldLabel>
        <TextInput value={content.tagline ?? ""} onChange={(v) => set("tagline", v)} placeholder="Investment Opportunity" />
      </div>
      <div>
        <FieldLabel>Body / Summary</FieldLabel>
        <TextArea value={content.body ?? ""} onChange={(v) => set("body", v)} placeholder="A brief overview of this opportunity." rows={3} />
      </div>
      <div>
        <FieldLabel>Hero Image</FieldLabel>
        <ImageGalleryEditor
          images={heroImages}
          maxImages={1}
          onAssetSelected={onAssetSelected}
          onChange={(imgs) => set("heroImageUrl", imgs[0]?.url ?? "")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Contact Name</FieldLabel>
          <TextInput value={content.contactName ?? ""} onChange={(v) => set("contactName", v)} placeholder="e.g. Tim Truman" />
        </div>
        <div>
          <FieldLabel>Contact Title</FieldLabel>
          <TextInput value={content.contactTitle ?? ""} onChange={(v) => set("contactTitle", v)} placeholder="e.g. Managing Partner" />
        </div>
        <div>
          <FieldLabel>Company</FieldLabel>
          <TextInput value={content.company ?? ""} onChange={(v) => set("company", v)} placeholder="e.g. Pine Tar Sports" />
        </div>
        <div>
          <FieldLabel>Address</FieldLabel>
          <TextInput value={content.address ?? ""} onChange={(v) => set("address", v)} placeholder="e.g. 491 Morrison Rd, Howe, TX 75459" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Executive Summary editor ──────────────────────── */

function ExecutiveSummaryEditor({
  content,
  onAssetSelected,
  onChange,
}: {
  content: ExecutiveSummaryContent;
  onAssetSelected?: (assetId: string) => void;
  onChange: (c: ExecutiveSummaryContent) => void;
}) {
  function set<K extends keyof ExecutiveSummaryContent>(key: K, value: ExecutiveSummaryContent[K]) {
    onChange({ ...content, [key]: value });
  }

  const toc: TableOfContentsItem[] = content.tableOfContents ?? [];
  const returnRows: ReturnTableRow[] = content.returnsTableRows ?? [];

  function addTocItem() {
    set("tableOfContents", [...toc, { number: toc.length + 1, label: "" }]);
  }

  function updateTocItem(idx: number, label: string) {
    set("tableOfContents", toc.map((item, i) => (i === idx ? { ...item, label } : item)));
  }

  function removeTocItem(idx: number) {
    set("tableOfContents", toc.filter((_, i) => i !== idx).map((item, i) => ({ ...item, number: i + 1 })));
  }

  function addReturnRow() {
    set("returnsTableRows", [...returnRows, { label: "", value: "", highlight: false }]);
  }

  function updateReturnRow(idx: number, field: keyof ReturnTableRow, value: string | boolean) {
    set("returnsTableRows", returnRows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  function removeReturnRow(idx: number) {
    set("returnsTableRows", returnRows.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Body text</FieldLabel>
        <TextArea value={content.body ?? ""} onChange={(v) => set("body", v)} rows={4} placeholder="Strategic partnership opportunity..." />
      </div>

      <div>
        <FieldLabel>Photos (up to 3)</FieldLabel>
        <ImageGalleryEditor
          images={content.images ?? []}
          maxImages={3}
          onAssetSelected={onAssetSelected}
          onChange={(imgs) => set("images", imgs)}
        />
      </div>

      <div>
        <FieldLabel>Table of Contents</FieldLabel>
        <div className="space-y-1">
          {toc.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-medium text-gray-500">{String(item.number).padStart(2, "0")}</span>
              <TextInput value={item.label} onChange={(v) => updateTocItem(idx, v)} placeholder="Section label" />
              <button type="button" onClick={() => removeTocItem(idx)} aria-label="Remove table of contents item" className="text-xs text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <button type="button" onClick={addTocItem} className="text-xs text-indigo-600 hover:underline">+ Add item</button>
        </div>
      </div>

      <div>
        <FieldLabel>Ownership Opportunity & Expected Returns Table</FieldLabel>
        <div>
          <div className="mb-1">
            <TextInput
              value={content.returnsTableTitle ?? ""}
              onChange={(v) => set("returnsTableTitle", v)}
              placeholder="Table title (e.g. Ownership Opportunity & Expected Returns)"
            />
          </div>
          <div className="space-y-1">
            {returnRows.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <TextInput value={row.label} onChange={(v) => updateReturnRow(idx, "label", v)} placeholder="Label" />
                <TextInput value={row.value} onChange={(v) => updateReturnRow(idx, "value", v)} placeholder="Value" />
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={row.highlight ?? false}
                    onChange={(e) => updateReturnRow(idx, "highlight", e.target.checked)}
                  />
                  Highlight
                </label>
                <button type="button" onClick={() => removeReturnRow(idx)} aria-label="Remove returns row" className="text-xs text-red-500 hover:text-red-700">✕</button>
              </div>
            ))}
            <button type="button" onClick={addReturnRow} className="text-xs text-indigo-600 hover:underline">+ Add row</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Use of Funds editor ───────────────────────────── */

function UseOfFundsEditor({
  content,
  onChange,
}: {
  content: UseOfFundsContent;
  onChange: (c: UseOfFundsContent) => void;
}) {
  function set<K extends keyof UseOfFundsContent>(key: K, value: UseOfFundsContent[K]) {
    onChange({ ...content, [key]: value });
  }

  const rows: UseOfFundsRow[] = content.allocationRows ?? [];
  const highlights: UseOfFundsHighlight[] = content.highlights ?? [];

  function addRow() {
    set("allocationRows", [...rows, { category: "", amount: "" }]);
  }

  function updateRow(idx: number, field: keyof UseOfFundsRow, value: string) {
    set("allocationRows", rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  function removeRow(idx: number) {
    set("allocationRows", rows.filter((_, i) => i !== idx));
  }

  function addHighlight() {
    set("highlights", [...highlights, { title: "", body: "" }]);
  }

  function updateHighlight(idx: number, field: keyof UseOfFundsHighlight, value: string) {
    set("highlights", highlights.map((h, i) => (i === idx ? { ...h, [field]: value } : h)));
  }

  function removeHighlight(idx: number) {
    set("highlights", highlights.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Body text</FieldLabel>
        <TextArea value={content.body ?? ""} onChange={(v) => set("body", v)} placeholder="Overview of how funds are allocated." />
      </div>

      <div>
        <FieldLabel>Allocation Table</FieldLabel>
        <div className="space-y-1">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <TextInput value={row.category} onChange={(v) => updateRow(idx, "category", v)} placeholder="Category (e.g. Land Acquisition)" />
              <TextInput value={row.amount} onChange={(v) => updateRow(idx, "amount", v)} placeholder="Amount (e.g. $470,000)" />
              <button type="button" onClick={() => removeRow(idx)} aria-label="Remove allocation row" className="shrink-0 text-xs text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <button type="button" onClick={addRow} className="text-xs text-indigo-600 hover:underline">+ Add row</button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <FieldLabel>Total row label</FieldLabel>
            <TextInput value={content.totalLabel ?? ""} onChange={(v) => set("totalLabel", v)} placeholder="Total Capital Requirement" />
          </div>
          <div>
            <FieldLabel>Total amount</FieldLabel>
            <TextInput value={content.totalAmount ?? ""} onChange={(v) => set("totalAmount", v)} placeholder="$2,500,133" />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Highlights / Callouts (right column)</FieldLabel>
        <div className="space-y-2">
          {highlights.map((h, idx) => (
            <div key={idx} className="rounded border border-gray-200 p-2 space-y-2">
              <div className="flex items-center gap-2">
                <TextInput value={h.title} onChange={(v) => updateHighlight(idx, "title", v)} placeholder="Callout title" />
                <button type="button" onClick={() => removeHighlight(idx)} aria-label="Remove callout" className="shrink-0 text-xs text-red-500 hover:text-red-700">✕</button>
              </div>
              <TextArea value={h.body} onChange={(v) => updateHighlight(idx, "body", v)} placeholder="Callout body text" rows={2} />
            </div>
          ))}
          <button type="button" onClick={addHighlight} className="text-xs text-indigo-600 hover:underline">+ Add callout</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Returns / Timeline editor ─────────────────────── */

function ReturnsEditor({
  content,
  onChange,
}: {
  content: ReturnsContent;
  onChange: (c: ReturnsContent) => void;
}) {
  function set<K extends keyof ReturnsContent>(key: K, value: ReturnsContent[K]) {
    onChange({ ...content, [key]: value });
  }

  const timeline: TimelineItem[] = content.timelineItems ?? [];
  const metrics: KeyMetric[] = content.keyMetrics ?? [];

  function addTimelineItem() {
    set("timelineItems", [...timeline, { period: "", phase: "", description: "" }]);
  }

  function updateTimelineItem(idx: number, field: keyof TimelineItem, value: string) {
    set("timelineItems", timeline.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  }

  function removeTimelineItem(idx: number) {
    set("timelineItems", timeline.filter((_, i) => i !== idx));
  }

  function addMetric() {
    set("keyMetrics", [...metrics, { value: "", label: "" }]);
  }

  function updateMetric(idx: number, field: keyof KeyMetric, value: string) {
    set("keyMetrics", metrics.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  }

  function removeMetric(idx: number) {
    set("keyMetrics", metrics.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Body text</FieldLabel>
        <TextArea value={content.body ?? ""} onChange={(v) => set("body", v)} placeholder="Overview of investor returns..." />
      </div>

      <div>
        <FieldLabel>Timeline Items</FieldLabel>
        <div className="space-y-2">
          {timeline.map((item, idx) => (
            <div key={idx} className="rounded border border-gray-200 p-2 space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <FieldLabel>Period (e.g. "0-12 Months")</FieldLabel>
                  <TextInput value={item.period} onChange={(v) => updateTimelineItem(idx, "period", v)} placeholder="0-12 Months" />
                </div>
                <div>
                  <FieldLabel>Phase (e.g. "CONSTRUCTION PHASE")</FieldLabel>
                  <TextInput value={item.phase} onChange={(v) => updateTimelineItem(idx, "phase", v)} placeholder="CONSTRUCTION PHASE" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <FieldLabel>Description</FieldLabel>
                  <TextArea value={item.description} onChange={(v) => updateTimelineItem(idx, "description", v)} rows={2} placeholder="Description of this phase..." />
                </div>
                <button type="button" onClick={() => removeTimelineItem(idx)} aria-label="Remove timeline item" className="self-start text-xs text-red-500 hover:text-red-700">✕</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addTimelineItem} className="text-xs text-indigo-600 hover:underline">+ Add timeline item</button>
        </div>
      </div>

      <div>
        <FieldLabel>Key Metrics (e.g. "9% / PREFERRED RETURN")</FieldLabel>
        <div className="space-y-1">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <TextInput value={m.value} onChange={(v) => updateMetric(idx, "value", v)} placeholder="9%" />
              <TextInput value={m.label} onChange={(v) => updateMetric(idx, "label", v)} placeholder="PREFERRED RETURN" />
              <button type="button" onClick={() => removeMetric(idx)} aria-label="Remove metric" className="shrink-0 text-xs text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <button type="button" onClick={addMetric} className="text-xs text-indigo-600 hover:underline">+ Add metric</button>
        </div>
      </div>

      <div>
        <FieldLabel>Exit Strategy Title</FieldLabel>
        <TextInput value={content.exitStrategyTitle ?? ""} onChange={(v) => set("exitStrategyTitle", v)} placeholder="Refinance Exit Strategy" />
      </div>
      <div>
        <FieldLabel>Exit Strategy Body</FieldLabel>
        <TextArea value={content.exitStrategyBody ?? ""} onChange={(v) => set("exitStrategyBody", v)} rows={2} placeholder="Our model prioritizes early capital return..." />
      </div>
    </div>
  );
}

/* ─────────────────────── Team editor ──────────────────────────────────── */

function TeamEditor({
  content,
  onAssetSelected,
  onChange,
}: {
  content: TeamContent;
  onAssetSelected?: (assetId: string) => void;
  onChange: (c: TeamContent) => void;
}) {
  function set<K extends keyof TeamContent>(key: K, value: TeamContent[K]) {
    onChange({ ...content, [key]: value });
  }

  const members: TeamMember[] = content.members ?? [];

  function addMember() {
    set("members", [...members, { name: "", title: "", bio: "", imageUrl: "" }]);
  }

  function updateMember(idx: number, field: keyof TeamMember, value: string) {
    set("members", members.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  }

  function removeMember(idx: number) {
    set("members", members.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      <div>
        <FieldLabel>Body text</FieldLabel>
        <TextArea value={content.body ?? ""} onChange={(v) => set("body", v)} placeholder="Our leadership team..." />
      </div>
      {members.map((member, idx) => (
        <div key={idx} className="rounded border border-gray-200 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Team Member {idx + 1}</span>
            <button type="button" onClick={() => removeMember(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Name</FieldLabel>
              <TextInput value={member.name} onChange={(v) => updateMember(idx, "name", v)} placeholder="Full name" />
            </div>
            <div>
              <FieldLabel>Title</FieldLabel>
              <TextInput value={member.title} onChange={(v) => updateMember(idx, "title", v)} placeholder="Role / Title" />
            </div>
          </div>
          <div>
            <FieldLabel>Bio</FieldLabel>
            <TextArea value={member.bio ?? ""} onChange={(v) => updateMember(idx, "bio", v)} rows={2} placeholder="Brief bio..." />
          </div>
          <div>
            <FieldLabel>Photo</FieldLabel>
            <div className="flex items-center gap-2">
              {member.imageUrl && (
                <img src={member.imageUrl} alt={member.name} className="h-12 w-12 rounded-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              )}
              <TextInput value={member.imageUrl ?? ""} onChange={(v) => updateMember(idx, "imageUrl", v)} placeholder="Photo URL" />
              <AssetPicker
                allowedTypes={["headshot", "image"]}
                previewUrl={member.imageUrl}
                onSelect={(asset: Asset) => {
                  updateMember(idx, "imageUrl", asset.url);
                  onAssetSelected?.(asset.id);
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addMember} className="text-xs text-indigo-600 hover:underline">+ Add team member</button>
    </div>
  );
}

/* ─────────────────────── Projections editor ────────────────────────────── */

function ProjectionsEditor({
  content,
  onChange,
}: {
  content: ProjectionsContent;
  onChange: (c: ProjectionsContent) => void;
}) {
  function set<K extends keyof ProjectionsContent>(key: K, value: ProjectionsContent[K]) {
    onChange({ ...content, [key]: value });
  }

  const rows: ProjectionsRow[] = content.rows ?? [];
  const metrics: KeyMetric[] = content.metrics ?? [];

  function addRow() {
    set("rows", [...rows, { label: "", value: "" }]);
  }

  function updateRow(idx: number, field: keyof ProjectionsRow, value: string) {
    set("rows", rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  function removeRow(idx: number) {
    set("rows", rows.filter((_, i) => i !== idx));
  }

  function addMetric() {
    set("metrics", [...metrics, { value: "", label: "" }]);
  }

  function updateMetric(idx: number, field: keyof KeyMetric, value: string) {
    set("metrics", metrics.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  }

  function removeMetric(idx: number) {
    set("metrics", metrics.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Body text</FieldLabel>
        <TextArea value={content.body ?? ""} onChange={(v) => set("body", v)} placeholder="Financial projections overview..." />
      </div>

      <div>
        <FieldLabel>Projection Rows</FieldLabel>
        <div className="space-y-1">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <TextInput value={row.label} onChange={(v) => updateRow(idx, "label", v)} placeholder="Label (e.g. Year 1 Revenue)" />
              <TextInput value={row.value} onChange={(v) => updateRow(idx, "value", v)} placeholder="Value (e.g. $1.2M)" />
              <button type="button" onClick={() => removeRow(idx)} aria-label="Remove projection row" className="shrink-0 text-xs text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <button type="button" onClick={addRow} className="text-xs text-indigo-600 hover:underline">+ Add row</button>
        </div>
      </div>

      <div>
        <FieldLabel>Key Metrics</FieldLabel>
        <div className="space-y-1">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <TextInput value={m.value} onChange={(v) => updateMetric(idx, "value", v)} placeholder="Value (e.g. $600K)" />
              <TextInput value={m.label} onChange={(v) => updateMetric(idx, "label", v)} placeholder="Label (e.g. Annual NOI)" />
              <button type="button" onClick={() => removeMetric(idx)} aria-label="Remove metric" className="shrink-0 text-xs text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <button type="button" onClick={addMetric} className="text-xs text-indigo-600 hover:underline">+ Add metric</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Generic section editor ────────────────────────── */

function GenericEditor({
  content,
  onAssetSelected,
  onChange,
}: {
  content: GenericSectionContent;
  onAssetSelected?: (assetId: string) => void;
  onChange: (c: GenericSectionContent) => void;
}) {
  function set<K extends keyof GenericSectionContent>(key: K, value: GenericSectionContent[K]) {
    onChange({ ...content, [key]: value });
  }

  const bullets: string[] = content.bullets ?? [];

  function addBullet() {
    set("bullets", [...bullets, ""]);
  }

  function updateBullet(idx: number, value: string) {
    set("bullets", bullets.map((b, i) => (i === idx ? value : b)));
  }

  function removeBullet(idx: number) {
    set("bullets", bullets.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      <div>
        <FieldLabel>Body text</FieldLabel>
        <TextArea value={content.body ?? ""} onChange={(v) => set("body", v)} rows={4} placeholder="Section content..." />
      </div>

      <div>
        <FieldLabel>Bullet Points (optional)</FieldLabel>
        <div className="space-y-1">
          {bullets.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <TextInput value={b} onChange={(v) => updateBullet(idx, v)} placeholder="Bullet point..." />
              <button type="button" onClick={() => removeBullet(idx)} aria-label="Remove bullet point" className="shrink-0 text-xs text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <button type="button" onClick={addBullet} className="text-xs text-indigo-600 hover:underline">+ Add bullet</button>
        </div>
      </div>

      <div>
        <FieldLabel>Images</FieldLabel>
        <ImageGalleryEditor
          images={content.images ?? []}
          maxImages={5}
          onAssetSelected={onAssetSelected}
          onChange={(imgs) => set("images", imgs)}
        />
      </div>
    </div>
  );
}

/* ─────────────────────── Section type label map ────────────────────────── */

const SECTION_TYPE_LABELS: Record<string, string> = {
  cover: "Cover",
  executive_summary: "Executive Summary",
  investment_thesis: "Investment Thesis",
  opportunity: "Opportunity",
  market: "Market",
  project_overview: "Project Overview",
  team: "Team",
  use_of_funds: "Use of Funds",
  returns: "Returns & Timeline",
  projections: "Financial Projections",
  risks_disclaimer: "Risk Factors & Disclaimer",
  closing_cta: "Closing / Call to Action",
};

/* ─────────────────────── Individual section card ───────────────────────── */

function SectionCard({
  section,
  onAssetSelected,
  onUpdate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  mode,
  isFocused,
  anchorId,
}: {
  section: DeckSection;
  onAssetSelected: (assetId: string) => void;
  onUpdate: (updated: DeckSection) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  mode: "guided" | "expert";
  isFocused: boolean;
  anchorId: string;
}) {
  const completion = getSectionCompletion(section);
  const outline = getSectionOutline(section);
  const blueprintOptions = getBlueprintOptions(section.type);
  const selectedVariant = getSavedLayoutVariant(section);
  const [manualOpen, setManualOpen] = useState(false);
  const open = manualOpen || isFocused || (mode === "guided" && completion.missing.length > 0);

  function updateContent(content: Record<string, unknown>) {
    onUpdate({ ...section, content });
  }

  function renderEditor() {
    switch (section.type) {
      case "cover":
        return <CoverEditor content={section.content as CoverContent} onAssetSelected={onAssetSelected} onChange={(c) => updateContent(c as Record<string, unknown>)} />;
      case "executive_summary":
        return <ExecutiveSummaryEditor content={section.content as ExecutiveSummaryContent} onAssetSelected={onAssetSelected} onChange={(c) => updateContent(c as Record<string, unknown>)} />;
      case "use_of_funds":
        return <UseOfFundsEditor content={section.content as UseOfFundsContent} onChange={(c) => updateContent(c as Record<string, unknown>)} />;
      case "returns":
        return <ReturnsEditor content={section.content as ReturnsContent} onChange={(c) => updateContent(c as Record<string, unknown>)} />;
      case "team":
        return <TeamEditor content={section.content as TeamContent} onAssetSelected={onAssetSelected} onChange={(c) => updateContent(c as Record<string, unknown>)} />;
      case "projections":
        return <ProjectionsEditor content={section.content as ProjectionsContent} onChange={(c) => updateContent(c as Record<string, unknown>)} />;
      default:
        return <GenericEditor content={section.content as GenericSectionContent} onAssetSelected={onAssetSelected} onChange={(c) => updateContent(c as Record<string, unknown>)} />;
    }
  }

  return (
    <div
      id={anchorId}
      className={`scroll-mt-24 rounded-lg border ${section.isEnabled ? "border-gray-200" : "border-gray-100 opacity-60"} bg-white shadow-sm`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Enable toggle */}
        {mode === "expert" && (
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={section.isEnabled}
              onChange={(e) => onUpdate({ ...section, isEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            <span className="sr-only">Enable section</span>
          </label>
        )}

        {/* Title */}
        <button
          type="button"
          onClick={() => setManualOpen((o) => !o)}
          className="flex-1 text-left"
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-gray-800">
            {SECTION_TYPE_LABELS[section.type] ?? section.type}
          </span>
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            {completion.complete}/{completion.total} ready
          </span>
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              completion.missing.length === 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {completion.missing.length === 0 ? "Ready" : `${completion.missing.length} missing`}
          </span>
          {!section.isEnabled && (
            <span className="ml-2 text-xs text-gray-400">(disabled)</span>
          )}
        </button>

        {/* Reorder buttons */}
        {mode === "expert" && (
          <div className="flex gap-1">
            <button
              type="button"
              disabled={isFirst}
              onClick={onMoveUp}
              className="rounded px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
              title="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={onMoveDown}
              className="rounded px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
              title="Move down"
            >
              ↓
            </button>
          </div>
        )}

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setManualOpen((o) => !o)}
          aria-label={open ? "Collapse section" : "Expand section"}
          className="text-gray-400 hover:text-gray-600"
        >
          {open ? "▲" : "▼"}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <SurfacePanel tone="subtle" padding="sm" className="mb-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Slide Blueprint
              </p>
              <select
                value={selectedVariant}
                onChange={(e) =>
                  onUpdate(withLayoutVariant(section, e.target.value as SlideLayoutVariant))
                }
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
              >
                {blueprintOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-600">
              {blueprintOptions.find((option) => option.id === selectedVariant)?.description}
            </p>
            <div className="mt-2">
              <p className="mb-1 text-xs font-semibold text-slate-700">Outline hint</p>
              <ul className="space-y-0.5 text-xs text-slate-600">
                {outline.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            {completion.missing.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                {completion.missing.slice(0, 2).map((item) => (
                  <li key={item}>Missing: {item}</li>
                ))}
              </ul>
            )}
          </SurfacePanel>

          {/* Editable section title */}
          <div className="mb-3">
            <FieldLabel>Section heading</FieldLabel>
            <TextInput
              value={section.title}
              onChange={(v) => onUpdate({ ...section, title: v })}
              placeholder="Section heading"
            />
          </div>
          {renderEditor()}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Main export ──────────────────────────────────── */

export function DeckSectionEditor({
  sections,
  onChange,
  assetIds = [],
  onAssetIdsChange,
  mode = "expert",
  selectedSectionId,
}: DeckSectionEditorProps) {
  const [filter, setFilter] = useState<SectionFilter>("all");

  function addAssetReference(assetId: string) {
    if (!onAssetIdsChange) return;
    if (assetIds.includes(assetId)) return;
    onAssetIdsChange([...assetIds, assetId]);
  }

  function updateSection(idx: number, updated: DeckSection) {
    const next = sections.map((s, i) => (i === idx ? updated : s));
    onChange(next);
  }

  function moveSection(idx: number, direction: -1 | 1) {
    const target = idx + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[idx], next[target]] = [next[target], next[idx]];
    // Fix sortOrder to match new position
    onChange(next.map((s, i) => ({ ...s, sortOrder: i + 1 })));
  }

  const sectionCounts = useMemo(() => {
    const enabled = sections.filter((section) => section.isEnabled).length;
    const incomplete = sections.filter((section) => getSectionCompletion(section).missing.length > 0).length;
    return {
      total: sections.length,
      enabled,
      incomplete,
    };
  }, [sections]);

  const visibleSections = useMemo(() => {
    return sections.filter((section) => {
      if (filter === "enabled") return section.isEnabled;
      if (filter === "incomplete") return getSectionCompletion(section).missing.length > 0;
      return true;
    });
  }, [filter, sections]);

  const nextIncompleteSection = useMemo(
    () => sections.find((section) => getSectionCompletion(section).missing.length > 0),
    [sections],
  );

  return (
    <div className="space-y-3">
      <SurfacePanel padding="md" className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Editing Controls</h3>
            <p className="text-xs text-slate-500">
              Filter sections, focus incomplete slides, and keep guided work centered on the next missing content.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={filter === "all" ? "primary" : "secondary"} onClick={() => setFilter("all")}>
              All ({sectionCounts.total})
            </Button>
            <Button size="sm" variant={filter === "enabled" ? "primary" : "secondary"} onClick={() => setFilter("enabled")}>
              Enabled ({sectionCounts.enabled})
            </Button>
            <Button size="sm" variant={filter === "incomplete" ? "primary" : "secondary"} onClick={() => setFilter("incomplete")}>
              Needs Work ({sectionCounts.incomplete})
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{sectionCounts.total} total sections</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">{sectionCounts.enabled} enabled</span>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">{sectionCounts.incomplete} incomplete</span>
          </div>
          {nextIncompleteSection && (
            <a href={`#section-card-${nextIncompleteSection.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Jump to next incomplete slide
            </a>
          )}
        </div>
      </SurfacePanel>

      {visibleSections.length === 0 ? (
        <SurfacePanel tone="subtle" padding="lg" className="text-center">
          <h3 className="text-sm font-semibold text-slate-900">No sections match this filter</h3>
          <p className="mt-1 text-sm text-slate-500">Switch the filter to continue editing the rest of the deck.</p>
        </SurfacePanel>
      ) : (
        visibleSections.map((section) => {
          const idx = sections.findIndex((candidate) => candidate.id === section.id);
          return (
        <SectionCard
          key={section.id}
          section={section}
          onAssetSelected={addAssetReference}
          onUpdate={(updated) => updateSection(idx, updated)}
          onMoveUp={() => moveSection(idx, -1)}
          onMoveDown={() => moveSection(idx, 1)}
          isFirst={idx === 0}
          isLast={idx === sections.length - 1}
          mode={mode}
          isFocused={selectedSectionId === section.id}
          anchorId={`section-card-${section.id}`}
        />
          );
        })
      )}
    </div>
  );
}
