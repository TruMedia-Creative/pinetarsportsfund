import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import { getDeckById, createDeck, updateDeck, getDecks } from "../../../lib/api/supabase/decks";
import { getFinancialModels } from "../../../lib/api/supabase/financials";
import { getAssets } from "../../../lib/api/supabase/assets";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { defaultTemplates, AUDIENCE_LABELS, AUDIENCE_TYPES } from "../../templates/model";
import type { AudienceType } from "../../templates/model";
import type { DeckDepth, DeckGoal, DeckStatus, DeckTheme, SlideSpacing, DeckMarketingMetadata } from "../model";
import type { FinancialModel } from "../../financials/model";
import type { CreateFinancialModelInput } from "../../financials/model";
import { createFinancialModel, updateFinancialModel } from "../../../lib/api/supabase/financials";
import { ForecastTable, ReturnsForm } from "../../financials";
import type { Asset } from "../../assets/model";
import { DECK_THEME_DEFAULTS } from "../model";
import type { DeckSection } from "../model/types";
import { createDeckSectionsFromTemplate } from "../utils/createDeckSectionsFromTemplate";
import { DeckSectionEditor } from "./DeckSectionEditor";
import { getSectionCompletion, getSectionOutline } from "../lib/slideBlueprints";

/** Map each audience type to the first matching template's ID, if one exists. */
const AUDIENCE_TEMPLATE_MAP: Partial<Record<AudienceType, string>> = Object.fromEntries(
  (["investor", "lender", "sponsor", "municipality", "internal"] as AudienceType[]).map(
    (audience) => {
      const match = defaultTemplates.find((t) =>
        t.supportedAudienceTypes.includes(audience),
      );
      return [audience, match?.id ?? ""];
    },
  ),
);

/** Only offer audience types that have an assigned template. */
const ALL_AUDIENCE_OPTIONS = AUDIENCE_TYPES.map((value) => ({
  value,
  label: AUDIENCE_LABELS[value],
}));

const AUDIENCE_OPTIONS = ALL_AUDIENCE_OPTIONS.filter((o) =>
  Boolean(AUDIENCE_TEMPLATE_MAP[o.value]),
);

const STATUS_OPTIONS: { value: DeckStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "exported", label: "Exported" },
  { value: "archived", label: "Archived" },
];

const SPACING_OPTIONS: { value: SlideSpacing; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
];

const WORKFLOW_MODE_OPTIONS = [
  { value: "guided", label: "Guided" },
  { value: "expert", label: "Expert" },
] as const;

const GOAL_OPTIONS: { value: DeckGoal; label: string }[] = [
  { value: "raise_equity", label: "Raise Equity" },
  { value: "secure_debt", label: "Secure Debt" },
  { value: "win_sponsor", label: "Win Sponsorship" },
  { value: "municipal_partnership", label: "Municipal Partnership" },
  { value: "board_update", label: "Board Update" },
  { value: "teaser", label: "Teaser Deck" },
];

const DEPTH_OPTIONS: { value: DeckDepth; label: string }[] = [
  { value: "short", label: "Short (7-8 slides)" },
  { value: "standard", label: "Standard (10-12 slides)" },
  { value: "deep_dive", label: "Deep Dive (12+ slides)" },
];

const STARTER_PACK_OPTIONS = [
  { value: "fast_start", label: "Fast-start sample" },
  { value: "blank", label: "Blank shell" },
  { value: "clone", label: "Clone an existing deck" },
] as const;

type WorkflowMode = (typeof WORKFLOW_MODE_OPTIONS)[number]["value"];
type StarterPack = (typeof STARTER_PACK_OPTIONS)[number]["value"];

interface ChecklistItem {
  label: string;
  done: boolean;
}

function applyDepthToSections(sections: DeckSection[], depth: DeckDepth): DeckSection[] {
  if (depth === "deep_dive") {
    return sections;
  }

  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
  const maxSlides = depth === "short" ? 8 : 11;
  return sorted
    .map((section, index) => ({
      ...section,
      isEnabled: index < maxSlides,
      sortOrder: index + 1,
    }));
}

/** Default brand colours shown as placeholders. */
const DEFAULT_BG_COLOR = DECK_THEME_DEFAULTS.backgroundColor;
const DEFAULT_PRIMARY_COLOR = DECK_THEME_DEFAULTS.primaryColor;
const DEFAULT_ACCENT_COLOR = DECK_THEME_DEFAULTS.accentColor;

/** Derive a URL-safe slug from a title string. */
function deriveSlug(title: string): string {
  const raw = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return raw || `deck-${Date.now()}`;
}

export default function DeckFormPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(deckId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // `createdDeckId` tracks the id of a deck just created in this session.
  // In edit mode we always use the `deckId` route param directly.
  const [createdDeckId, setCreatedDeckId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [audienceType, setAudienceType] = useState<AudienceType>("investor");
  const [goal, setGoal] = useState<DeckGoal>("raise_equity");
  const [depth, setDepth] = useState<DeckDepth>("standard");
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>("guided");
  const [starterPack, setStarterPack] = useState<StarterPack>("fast_start");
  const [cloneDeckId, setCloneDeckId] = useState("");
  const [status, setStatus] = useState<DeckStatus>("draft");
  const [subtitle, setSubtitle] = useState("");
  const [summary, setSummary] = useState("");
  const [existingSlug, setExistingSlug] = useState("");
  const [sections, setSections] = useState<DeckSection[]>([]);
  const [assetIds, setAssetIds] = useState<string[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [financialModels, setFinancialModels] = useState<FinancialModel[]>([]);
  const [existingDecks, setExistingDecks] = useState<{ id: string; title: string }[]>([]);
  const [financialModelId, setFinancialModelId] = useState("");
  const [financialDraft, setFinancialDraft] = useState<FinancialModel | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [theme, setTheme] = useState<DeckTheme>({ ...DECK_THEME_DEFAULTS });
  const [published, setPublished] = useState(false);
  const [marketingMetadata, setMarketingMetadata] = useState<DeckMarketingMetadata>({});
  const sectionFocusId = searchParams.get("section") ?? undefined;

  const filteredTemplates = useMemo(() => {
    const byAudience = defaultTemplates.filter((template) =>
      template.supportedAudienceTypes.includes(audienceType),
    );
    const byGoal = byAudience.filter(
      (template) =>
        !template.recommendedGoals || template.recommendedGoals.includes(goal),
    );
    return byGoal.length > 0 ? byGoal : byAudience;
  }, [audienceType, goal]);

  const sectionProgress = useMemo(() => {
    if (sections.length === 0) {
      return { complete: 0, total: 0, ratio: 0 };
    }
    const totals = sections.reduce(
      (acc, section) => {
        const completion = getSectionCompletion(section);
        return {
          complete: acc.complete + completion.complete,
          total: acc.total + completion.total,
        };
      },
      { complete: 0, total: 0 },
    );
    return {
      ...totals,
      ratio: totals.total === 0 ? 0 : totals.complete / totals.total,
    };
  }, [sections]);

  const enabledSectionCount = useMemo(
    () => sections.filter((section) => section.isEnabled).length,
    [sections],
  );

  const setupChecklist = useMemo<ChecklistItem[]>(() => {
    const resolvedTemplateId = selectedTemplateId ?? AUDIENCE_TEMPLATE_MAP[audienceType] ?? "";
    return [
      { label: "Deck title", done: title.trim().length > 0 },
      { label: "Project name", done: projectName.trim().length > 0 },
      { label: "Template selected", done: resolvedTemplateId.length > 0 },
      { label: "At least one slide enabled", done: enabledSectionCount > 0 },
    ];
  }, [audienceType, enabledSectionCount, projectName, selectedTemplateId, title]);

  const completedChecklistCount = setupChecklist.filter((item) => item.done).length;
  const nextChecklistItem = setupChecklist.find((item) => !item.done)?.label;

  useEffect(() => {
    getFinancialModels()
      .then((models) => setFinancialModels(models))
      .catch(() => {
        // non-blocking; form remains usable without linked models
      });

    getAssets()
      .then((all) => setAssets(all))
      .catch(() => {
        // non-blocking; deck editing still works
      });

    getDecks()
      .then((allDecks) =>
        setExistingDecks(
          allDecks.map((deck) => ({ id: deck.id, title: deck.title })),
        ),
      )
      .catch(() => {
        // non-blocking; clone starter remains optional
      });
  }, []);

  useEffect(() => {
    const model = financialModels.find((m) => m.id === financialModelId) ?? null;
    setFinancialDraft(model);
  }, [financialModelId, financialModels]);

  useEffect(() => {
    if (!deckId) return;
    getDeckById(deckId)
      .then((deck) => {
        if (!deck) {
          setError("Deck not found.");
          setLoading(false);
          return;
        }
        setTitle(deck.title);
        setProjectName(deck.projectName);
        setAudienceType(deck.audienceType);
        setGoal(deck.goal ?? "raise_equity");
        setDepth(deck.depth ?? "standard");
        setStatus(deck.status);
        setSubtitle(deck.subtitle ?? "");
        setSummary(deck.summary ?? "");
        setExistingSlug(deck.slug);
        setAssetIds(deck.assetIds ?? []);
        setFinancialModelId(deck.financialModelId ?? "");
        if (deck.theme) setTheme(deck.theme);
        setPublished(deck.published ?? false);
        if (deck.marketingMetadata) setMarketingMetadata(deck.marketingMetadata);
        setSelectedTemplateId(deck.templateId);
        // If the deck was saved before section editing existed, seed from template.
        if (deck.sections.length > 0) {
          setSections(deck.sections);
        } else {
          const templateId = AUDIENCE_TEMPLATE_MAP[deck.audienceType];
          const template = defaultTemplates.find((t) => t.id === templateId);
          setSections(template ? createDeckSectionsFromTemplate(template) : []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load deck.");
        setLoading(false);
      });
  }, [deckId]);

  /** Re-seed sections when audience type changes on a NEW deck. */
  useEffect(() => {
    if (isEdit) return;
    if (starterPack === "clone") return;
    const templateId = selectedTemplateId ?? AUDIENCE_TEMPLATE_MAP[audienceType];
    if (!templateId) return;
    const template = defaultTemplates.find((t) => t.id === templateId);
    if (!template) return;
    const seededSections = createDeckSectionsFromTemplate(template);
    if (starterPack === "blank") {
      setSections(
        seededSections.map((section) => ({
          ...section,
          content: { ...section.content, body: "" },
        })),
      );
      return;
    }
    setSections(applyDepthToSections(seededSections, depth));
  }, [audienceType, depth, isEdit, selectedTemplateId, starterPack]);

  useEffect(() => {
    if (isEdit) return;
    if (filteredTemplates.length === 0) return;
    if (!selectedTemplateId || !filteredTemplates.some((t) => t.id === selectedTemplateId)) {
      setSelectedTemplateId(filteredTemplates[0]?.id ?? null);
    }
  }, [filteredTemplates, isEdit, selectedTemplateId]);

  useEffect(() => {
    if (isEdit) return;
    if (starterPack !== "clone" || !cloneDeckId) return;
    getDeckById(cloneDeckId)
      .then((deck) => {
        if (!deck) return;
        setTitle(`${deck.title} (Copy)`);
        setProjectName(deck.projectName);
        setAudienceType(deck.audienceType);
        setGoal(deck.goal ?? goal);
        setDepth(deck.depth ?? depth);
        setSubtitle(deck.subtitle ?? "");
        setSummary(deck.summary ?? "");
        setSelectedTemplateId(deck.templateId);
        setSections(
          deck.sections.map((section) => ({
            ...section,
            id: crypto.randomUUID(),
          })),
        );
      })
      .catch(() => {
        // non-blocking; starter can still be switched by user
      });
  }, [cloneDeckId, depth, goal, isEdit, starterPack]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const templateId = selectedTemplateId ?? AUDIENCE_TEMPLATE_MAP[audienceType] ?? "";
    if (!templateId) {
      setError("No template is available for the selected audience type.");
      setSaving(false);
      return;
    }

    // On create: derive slug from title. On edit: preserve the existing slug.
    const slug = isEdit ? existingSlug : deriveSlug(title);

    const payload = {
      title,
      projectName,
      audienceType,
      goal,
      depth,
      status,
      slug,
      subtitle: subtitle || undefined,
      summary: summary || undefined,
      templateId,
      sections,
      assetIds,
      financialModelId: financialModelId || undefined,
      theme,
      published,
      marketingMetadata: Object.keys(marketingMetadata).some(
        (k) => marketingMetadata[k as keyof DeckMarketingMetadata],
      )
        ? marketingMetadata
        : undefined,
    };

    try {
      if (isEdit && deckId) {
        await updateDeck(deckId, payload);
      } else {
        const created = await createDeck(payload);
        setCreatedDeckId(created.id);
        navigate(`/decks/${created.id}/edit`, { replace: true });
        setSaving(false);
        return;
      }
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save deck.");
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  // In edit mode always point at the current route param; in create mode point at the
  // newly-created deck id (only available after the first successful save).
  const resolvedDeckId = deckId ?? createdDeckId;
  const previewUrl = resolvedDeckId ? `/decks/${resolvedDeckId}/preview` : null;
  const exportUrl = resolvedDeckId ? `/exports/${resolvedDeckId}` : null;
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const shareUrl = existingSlug
    ? `${window.location.origin}${baseUrl}/view/${existingSlug}`
    : null;

  const selectedFinancialModel = financialModels.find(
    (model) => model.id === financialModelId,
  );
  const selectedAssets = assets.filter((asset) => assetIds.includes(asset.id));

  async function handleSaveFinancialModel() {
    if (!financialDraft) return;
    setSaving(true);
    setError(null);
    try {
      const payload: Partial<CreateFinancialModelInput> = {
        projectName: financialDraft.projectName,
        minimumInvestment: financialDraft.minimumInvestment,
        targetRaise: financialDraft.targetRaise,
        preferredReturn: financialDraft.preferredReturn,
        equityStructure: financialDraft.equityStructure,
        useOfFunds: financialDraft.useOfFunds,
        forecastRows: financialDraft.forecastRows,
        assumptions: financialDraft.assumptions,
        notes: financialDraft.notes,
      };
      const saved = await updateFinancialModel(financialDraft.id, payload);
      setFinancialModels((prev) =>
        prev.map((item) => (item.id === saved.id ? saved : item)),
      );
      setFinancialDraft(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save financial model.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateFinancialModel() {
    setSaving(true);
    setError(null);
    try {
      const created = await createFinancialModel({
        projectName,
        minimumInvestment: "$50,000",
        targetRaise: "$0",
        preferredReturn: "",
        equityStructure: "",
        useOfFunds: [],
        forecastRows: [],
        assumptions: "",
        notes: "",
      });
      setFinancialModels((prev) => [created, ...prev]);
      setFinancialModelId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create financial model.");
    } finally {
      setSaving(false);
    }
  }

  function applyFinancialModelToSections() {
    if (!selectedFinancialModel) return;
    setSections((prev) =>
      prev.map((section) => {
        if (section.type === "use_of_funds") {
          return {
            ...section,
            content: {
              ...section.content,
              body: selectedFinancialModel.assumptions,
              allocationRows: selectedFinancialModel.useOfFunds,
              totalLabel: "Total Project Cost",
              totalAmount: selectedFinancialModel.targetRaise,
            },
          };
        }

        if (section.type === "projections") {
          return {
            ...section,
            content: {
              ...section.content,
              body: selectedFinancialModel.assumptions,
              rows: selectedFinancialModel.forecastRows,
            },
          };
        }

        if (section.type === "returns") {
          return {
            ...section,
            content: {
              ...section.content,
              body: selectedFinancialModel.notes ?? selectedFinancialModel.assumptions,
              keyMetrics: [
                {
                  value: selectedFinancialModel.preferredReturn ?? "",
                  label: "Preferred Return",
                },
                {
                  value: selectedFinancialModel.targetRaise ?? "",
                  label: "Target Raise",
                },
                {
                  value: selectedFinancialModel.minimumInvestment ?? "",
                  label: "Minimum Investment",
                },
              ].filter((metric) => metric.value),
            },
          };
        }

        return section;
      }),
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Deck" : "New Deck"}
        </h1>
        {(previewUrl || exportUrl) && (
          <div className="flex items-center gap-2">
            {previewUrl && (
              <Link
                to={previewUrl}
                className="inline-flex items-center rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Preview →
              </Link>
            )}
            {exportUrl && (
              <Link
                to={exportUrl}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Export →
              </Link>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {shareUrl && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <strong>Shareable link:</strong>{" "}
          <a href={shareUrl} target="_blank" rel="noreferrer" className="underline break-all">
            {shareUrl}
          </a>
        </div>
      )}

      <div className="sticky top-4 z-10 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                {isEdit ? "Editing" : "New deck"}
              </span>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {completedChecklistCount}/{setupChecklist.length} setup steps complete
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {enabledSectionCount} enabled slides
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {nextChecklistItem
                ? `Next step: ${nextChecklistItem}.`
                : "Core setup is complete. You can save now and keep refining sections."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {previewUrl && (
              <Link
                to={previewUrl}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Preview
              </Link>
            )}
            <button
              type="submit"
              form="deck-form"
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : isEdit ? "Save deck" : "Create deck"}
            </button>
          </div>
        </div>
      </div>

      <form id="deck-form" onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {!isEdit && (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Deck Setup</h2>
              <div className="inline-flex rounded-md border border-slate-300 bg-white p-0.5">
                {WORKFLOW_MODE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setWorkflowMode(option.value)}
                    className={`rounded px-2.5 py-1 text-xs font-medium ${
                      workflowMode === option.value
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Start with your goal, choose the amount of structure you want, then save early. You can revise sections, assets, and financials after the first draft exists.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="goal" className="text-sm font-medium text-gray-700">
                  Goal
                </label>
                <select
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as DeckGoal)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {GOAL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="depth" className="text-sm font-medium text-gray-700">
                  Deck Length
                </label>
                <select
                  id="depth"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value as DeckDepth)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {DEPTH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="starterPack" className="text-sm font-medium text-gray-700">
                  Starter Pack
                </label>
                <select
                  id="starterPack"
                  value={starterPack}
                  onChange={(e) => setStarterPack(e.target.value as StarterPack)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {STARTER_PACK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {starterPack === "clone" && (
              <div className="flex flex-col gap-1">
                <label htmlFor="cloneDeck" className="text-sm font-medium text-gray-700">
                  Clone Source
                </label>
                <select
                  id="cloneDeck"
                  value={cloneDeckId}
                  onChange={(e) => setCloneDeckId(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a deck</option>
                  {existingDecks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                      {deck.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filteredTemplates.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Template Suggestions
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`rounded-md border px-3 py-2 text-left ${
                        selectedTemplateId === template.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Deck Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Pine Tar Sports Complex – Investor Pitch"
          />
          <p className="text-xs text-gray-500">Use the external-facing name you want to show in previews and exports.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Pine Tar Sports Complex"
          />
          <p className="text-xs text-gray-500">This anchors the template copy, section titles, and linked financial model defaults.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="audienceType" className="text-sm font-medium text-gray-700">
              Audience Type
            </label>
            <select
              id="audienceType"
              value={audienceType}
              onChange={(e) => setAudienceType(e.target.value as AudienceType)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AUDIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as DeckStatus)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subtitle" className="text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            id="subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional subtitle"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="summary" className="text-sm font-medium text-gray-700">
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Brief description of this deck"
          />
          <p className="text-xs text-gray-500">Keep this short. A clear 1-2 sentence summary makes review and sharing faster.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="financialModel" className="text-sm font-medium text-gray-700">
            Linked Financial Model
          </label>
          <select
            id="financialModel"
            value={financialModelId}
            onChange={(e) => setFinancialModelId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">None</option>
            {financialModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.projectName}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Link a model to reuse structured use-of-funds and projection data.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCreateFinancialModel}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Create new model from this deck
            </button>
          </div>
          {selectedFinancialModel && (
            <div className="pt-2">
              <button
                type="button"
                onClick={applyFinancialModelToSections}
                className="rounded border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
              >
                Apply model data to financial sections
              </button>
            </div>
          )}
        </div>

        {financialDraft && (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-800">Financial Model Editor</h3>
            <ReturnsForm model={financialDraft} onChange={setFinancialDraft} />
            <ForecastTable model={financialDraft} onChange={setFinancialDraft} />
            <div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveFinancialModel}
                className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Save Financial Model
              </button>
            </div>
          </div>
        )}

        {/* ── Appearance ─────────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Appearance</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="themeBackgroundColor" className="text-sm font-medium text-gray-700">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="themeBackgroundColor"
                  type="color"
                  value={theme.backgroundColor ?? DEFAULT_BG_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, backgroundColor: e.target.value }))}
                  className="h-9 w-14 cursor-pointer rounded border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={theme.backgroundColor ?? DEFAULT_BG_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, backgroundColor: e.target.value }))}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="#4a6b7c"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="themeSlideSpacing" className="text-sm font-medium text-gray-700">
                Slide Spacing
              </label>
              <select
                id="themeSlideSpacing"
                value={theme.slideSpacing ?? "normal"}
                onChange={(e) =>
                  setTheme((t) => ({ ...t, slideSpacing: e.target.value as SlideSpacing }))
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SPACING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="themePrimaryColor" className="text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="themePrimaryColor"
                  type="color"
                  value={theme.primaryColor ?? DEFAULT_PRIMARY_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                  className="h-9 w-14 cursor-pointer rounded border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={theme.primaryColor ?? DEFAULT_PRIMARY_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="#0d2b6b"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="themeAccentColor" className="text-sm font-medium text-gray-700">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="themeAccentColor"
                  type="color"
                  value={theme.accentColor ?? DEFAULT_ACCENT_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                  className="h-9 w-14 cursor-pointer rounded border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={theme.accentColor ?? DEFAULT_ACCENT_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="#c0262d"
                />
              </div>
            </div>
          </div>

          {/* Live colour preview strip */}
          <div
            className="mt-3 flex h-8 overflow-hidden rounded-md border border-gray-200"
            role="img"
            aria-label="Colour preview: background, primary, and accent"
          >
            <div
              className="flex-1"
              style={{ backgroundColor: theme.backgroundColor ?? DEFAULT_BG_COLOR }}
              title="Background"
              aria-label="Background colour preview"
            />
            <div
              className="w-16"
              style={{ backgroundColor: theme.primaryColor ?? DEFAULT_PRIMARY_COLOR }}
              title="Primary"
              aria-label="Primary colour preview"
            />
            <div
              className="w-16"
              style={{ backgroundColor: theme.accentColor ?? DEFAULT_ACCENT_COLOR }}
              title="Accent"
              aria-label="Accent colour preview"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Preview strip: background · primary · accent
          </p>
        </div>

        {/* ── Publish to website ─────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Publish to Website</h3>
          <p className="mb-3 text-xs text-gray-500">
            When published, this deck appears publicly on pinetarsportsfund.com/investments.
          </p>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
            />
            <span className="text-sm font-medium text-gray-700">
              {published ? "Published — visible on marketing site" : "Not published — private / admin only"}
            </span>
          </label>

          {published && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="mktSummary" className="text-sm font-medium text-gray-700">
                  Public summary
                </label>
                <textarea
                  id="mktSummary"
                  rows={2}
                  value={marketingMetadata.summary ?? ""}
                  onChange={(e) =>
                    setMarketingMetadata((m) => ({ ...m, summary: e.target.value }))
                  }
                  placeholder="1–2 sentences shown on the investments listing page"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="mktHeroUrl" className="text-sm font-medium text-gray-700">
                  Hero image URL
                </label>
                <input
                  id="mktHeroUrl"
                  type="url"
                  value={marketingMetadata.heroImageUrl ?? ""}
                  onChange={(e) =>
                    setMarketingMetadata((m) => ({ ...m, heroImageUrl: e.target.value }))
                  }
                  placeholder="https://…"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="mktTags" className="text-sm font-medium text-gray-700">
                  Tags <span className="font-normal text-gray-400">(comma-separated)</span>
                </label>
                <input
                  id="mktTags"
                  type="text"
                  value={(marketingMetadata.tags ?? []).join(", ")}
                  onChange={(e) =>
                    setMarketingMetadata((m) => ({
                      ...m,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="Investor Deck, Baseball, Mixed Use"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="mktExpiry" className="text-sm font-medium text-gray-700">
                  Opportunity window expires
                </label>
                <input
                  id="mktExpiry"
                  type="date"
                  value={
                    marketingMetadata.expiresAt
                      ? new Date(marketingMetadata.expiresAt).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setMarketingMetadata((m) => ({
                      ...m,
                      expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    }))
                  }
                  className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Deck"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/decks")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {previewUrl && (
            <Link
              to={previewUrl}
              className="rounded-md border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Open preview
            </Link>
          )}
        </div>
      </form>

      {/* Section editor — shown once the deck exists (edit mode or after creation) */}
      {sections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Deck Sections</h2>
            <p className="text-xs text-gray-500">
              {workflowMode === "guided"
                ? "Guided mode: complete each slide with inline prompts."
                : "Expert mode: full controls for toggle, reorder, and edit."}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Completion</h3>
              <span className="text-xs font-medium text-slate-600">
                {sectionProgress.complete}/{sectionProgress.total} items complete
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${Math.round(sectionProgress.ratio * 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Storyboard Outline</h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {sections
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((section) => (
                  <div key={section.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-700">
                        {section.title}
                      </p>
                      {!section.isEnabled && (
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          Off
                        </span>
                      )}
                    </div>
                    <ul className="space-y-0.5 text-xs text-slate-600">
                      {getSectionOutline(section).map((point) => (
                        <li key={point}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>

          <DeckSectionEditor
            sections={sections}
            onChange={setSections}
            assetIds={assetIds}
            onAssetIdsChange={setAssetIds}
            mode={workflowMode}
            selectedSectionId={sectionFocusId}
          />

          {assetIds.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">Assets Used by This Deck</h3>
              <div className="space-y-2">
                {assetIds.map((id) => {
                  const asset = selectedAssets.find((item) => item.id === id);
                  return (
                    <div key={id} className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {asset?.name ?? `Asset ${id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {asset?.type ?? "unknown"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAssetIds((prev) => prev.filter((item) => item !== id))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                setError(null);
                const templateId = selectedTemplateId ?? AUDIENCE_TEMPLATE_MAP[audienceType] ?? "";
                const slug = existingSlug || deriveSlug(title);
                const payload = {
                  title, projectName, audienceType, goal, depth, status, slug,
                  subtitle: subtitle || undefined,
                  summary: summary || undefined,
                  templateId,
                  sections,
                  assetIds,
                  financialModelId: financialModelId || undefined,
                  theme,
                };
                try {
                  if (resolvedDeckId) {
                    await updateDeck(resolvedDeckId, payload);
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Failed to save sections.");
                } finally {
                  setSaving(false);
                }
              }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Sections"}
            </button>
            {previewUrl && (
              <Link
                to={previewUrl}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Preview
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
