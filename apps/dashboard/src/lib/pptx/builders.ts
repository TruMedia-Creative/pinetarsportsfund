/**
 * PPTX builder — maps a Deck to a downloadable PptxGenJS presentation.
 *
 * Each enabled DeckSection becomes one slide.
 * Typed section shapes get purpose-built layouts; everything else
 * falls back to a generic title + body + bullets layout.
 */

import PptxGenJS from "pptxgenjs";
import type { Deck, DeckSection, DeckTheme } from "../../features/decks/model/types";
import { DECK_THEME_DEFAULTS } from "../../features/decks/model/themeDefaults";
import type { FinancialModel } from "../../features/financials/model";
import type {
  CoverContent,
  ExecutiveSummaryContent,
  UseOfFundsContent,
  ReturnsContent,
  TeamContent,
  ProjectionsContent,
  GenericSectionContent,
} from "../../features/decks/model/contentTypes";

// ─── Type aliases ─────────────────────────────────────────────────────────────
type Sl = PptxGenJS.Slide;
type TRow = PptxGenJS.TableRow;

// ─── Slide layout constants (all values in inches) ────────────────────────────
const W  = 13.33; // slide width  (LAYOUT_WIDE)
const H  = 7.5;   // slide height
const MX = 0.6;   // left/right content margin
const CW = W - MX * 2; // = 12.13"

/** Header bar + divider total height. Content starts immediately after. */
const HEADER_H  = 0.72;
const DIVIDER_H = 0.04;
const CY = HEADER_H + DIVIDER_H + 0.08; // ≈ 0.84"

// ─── Theme ────────────────────────────────────────────────────────────────────
interface PptxTheme {
  primary: string; // 6-char uppercase hex, no "#"
  accent:  string;
  header:  string;
}

interface BuildPptxOptions {
  financialModel?: FinancialModel;
}

function toHex(color: string | undefined, fallback: string): string {
  const c = (color ?? fallback).replace("#", "").toUpperCase();
  return /^[0-9A-F]{6}$/.test(c) ? c : fallback.replace("#", "").toUpperCase();
}

function buildTheme(theme: DeckTheme | undefined): PptxTheme {
  return {
    primary: toHex(theme?.primaryColor, DECK_THEME_DEFAULTS.primaryColor),
    accent:  toHex(theme?.accentColor,  DECK_THEME_DEFAULTS.accentColor),
    header:  "3D6B7C",
  };
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * Adds the standard teal header bar + accent divider to a content slide.
 * margin is in POINTS (1pt = 1/72"). 43pt ≈ 0.6" left inset matches MX.
 */
function addHeader(sl: Sl, title: string, t: PptxTheme): void {
  sl.addText("", {
    x: 0, y: 0, w: W, h: HEADER_H,
    fill: { color: t.header },
  });
  sl.addText(title.toUpperCase(), {
    x: MX, y: 0, w: W - MX * 2, h: HEADER_H,
    color: "FFFFFF", fontFace: "Calibri", fontSize: 16, bold: true,
    valign: "middle",
  });
  sl.addText("", {
    x: 0, y: HEADER_H, w: W, h: DIVIDER_H,
    fill: { color: t.accent },
  });
}

function bodyText(
  sl: Sl,
  text: string,
  x: number, y: number, w: number, h: number,
  opts: Partial<PptxGenJS.TextPropsOptions> = {},
): void {
  sl.addText(text, {
    x, y, w, h,
    fontFace: "Calibri", fontSize: 12, color: "374151",
    wrap: true, valign: "top",
    ...opts,
  });
}

// ─── Section renderers ────────────────────────────────────────────────────────

function renderCover(prs: PptxGenJS, deck: Deck, section: DeckSection, t: PptxTheme): void {
  const sl = prs.addSlide();
  const c = section.content as CoverContent;

  // Left panel: brand navy
  sl.addText("", { x: 0, y: 0, w: W * 0.62, h: H, fill: { color: t.primary } });
  // Right panel: deeper navy
  sl.addText("", { x: W * 0.62, y: 0, w: W * 0.38, h: H, fill: { color: "0A1E52" } });
  // Bottom accent bar on right
  sl.addText("", { x: W * 0.62, y: H - 0.38, w: W * 0.38, h: 0.38, fill: { color: t.accent } });

  // Brand name (top left)
  sl.addText("PINE TAR SPORTS FUND", {
    x: MX, y: 0.35, w: W * 0.62 - MX, h: 0.3,
    fontFace: "Calibri", fontSize: 9, bold: true, color: "94A3B8",
    charSpacing: 3,
  });
  // Accent rule
  sl.addText("", { x: MX, y: 0.75, w: 1.6, h: 0.04, fill: { color: t.accent } });

  // Project name
  sl.addText(deck.projectName.toUpperCase(), {
    x: MX, y: 1.05, w: W * 0.62 - MX * 1.5, h: 2.2,
    fontFace: "Calibri", fontSize: 32, bold: true, color: "FFFFFF",
    wrap: true, valign: "top",
  });

  if (c.tagline) {
    sl.addText(c.tagline, {
      x: MX, y: 3.4, w: W * 0.62 - MX * 1.5, h: 0.52,
      fontFace: "Calibri", fontSize: 13, bold: true, color: "FCA5A5",
    });
  }

  if (c.body) {
    sl.addText(c.body, {
      x: MX, y: 4.05, w: W * 0.62 - MX * 1.5, h: 1.8,
      fontFace: "Calibri", fontSize: 11, color: "CBD5E1",
      wrap: true, valign: "top",
    });
  }

  // Contact info strip at bottom left
  const contactParts = [c.contactName, c.contactTitle, c.company, c.address].filter(Boolean);
  if (contactParts.length > 0) {
    sl.addText(contactParts.join("  ·  "), {
      x: MX, y: 6.55, w: W * 0.62 - MX, h: 0.55,
      fontFace: "Calibri", fontSize: 10, color: "64748B",
    });
  }

  // Right panel: "INVESTMENT OPPORTUNITY" label
  sl.addText("INVESTMENT\nOPPORTUNITY", {
    x: W * 0.62 + 0.15, y: 2.6, w: W * 0.38 - 0.3, h: 2.0,
    fontFace: "Calibri", fontSize: 20, bold: true, color: "FFFFFF",
    align: "center", valign: "middle",
  });
}

function renderExecutiveSummary(
  prs: PptxGenJS,
  _deck: Deck,
  section: DeckSection,
  t: PptxTheme,
): void {
  const sl = prs.addSlide();
  sl.background = { color: "F4F7FA" };
  addHeader(sl, section.title, t);

  const c = section.content as ExecutiveSummaryContent;
  const returnRows = c.returnsTableRows ?? [];

  if (c.body) {
    bodyText(sl, c.body, MX, CY, returnRows.length > 0 ? CW * 0.55 : CW, H - CY - 0.3);
  }

  if (returnRows.length > 0) {
    const tableX = MX + CW * 0.57;
    const tableW = CW * 0.42;

    if (c.returnsTableTitle) {
      sl.addText(c.returnsTableTitle.toUpperCase(), {
        x: tableX, y: CY, w: tableW, h: 0.28,
        fontFace: "Calibri", fontSize: 9, bold: true, color: t.primary, charSpacing: 2,
      });
    }

    const yT = CY + (c.returnsTableTitle ? 0.32 : 0);
    const tableRows: TRow[] = returnRows.map((row) => [
      {
        text: row.label,
        options: { color: "374151", fontSize: 10, fontFace: "Calibri", margin: 0.06 },
      },
      {
        text: row.value,
        options: {
          color: row.highlight ? t.accent : t.primary,
          fontSize: 10,
          bold: row.highlight,
          fontFace: "Calibri",
          align: "right" as const,
          margin: 0.06,
        },
      },
    ]);

    sl.addTable(tableRows, {
      x: tableX, y: yT, w: tableW,
      colW: [tableW * 0.62, tableW * 0.38],
      border: { type: "solid", color: "E2E8F0", pt: 1 },
    });
  }
}

function renderUseOfFunds(
  prs: PptxGenJS,
  _deck: Deck,
  section: DeckSection,
  t: PptxTheme,
  financialModel?: FinancialModel,
): void {
  const sl = prs.addSlide();
  sl.background = { color: "F4F7FA" };
  addHeader(sl, section.title, t);

  const c = section.content as UseOfFundsContent;
  const rows =
    c.allocationRows && c.allocationRows.length > 0
      ? c.allocationRows
      : financialModel?.useOfFunds?.map((row) => ({
          category: row.category,
          amount: row.amount,
        })) ?? [];
  const highlights = c.highlights ?? [];

  if (c.body) {
    bodyText(sl, c.body, MX, CY, CW, 0.5, { fontSize: 11 });
  }

  const tableY = CY + (c.body ? 0.58 : 0);
  const tableW = highlights.length > 0 ? CW * 0.52 : CW * 0.75;

  if (rows.length > 0) {
    const headerRow: TRow = [
      { text: "Allocation Category", options: { bold: true, color: "FFFFFF", fill: { color: t.primary }, fontSize: 10, fontFace: "Calibri", margin: 0.06 } },
      { text: "Amount (USD)",        options: { bold: true, color: "FFFFFF", fill: { color: t.primary }, fontSize: 10, fontFace: "Calibri", align: "right" as const, margin: 0.06 } },
    ];
    const dataRows: TRow[] = rows.map((r) => [
      { text: r.category, options: { color: "374151", fontSize: 10, fontFace: "Calibri", margin: 0.06 } },
      { text: r.amount,   options: { color: t.accent,  fontSize: 10, fontFace: "Calibri", bold: true, align: "right" as const, margin: 0.06 } },
    ]);
    const allRows: TRow[] = [headerRow, ...dataRows];

    if (c.totalLabel || c.totalAmount) {
      allRows.push([
        { text: c.totalLabel ?? "Total", options: { bold: true, color: t.primary, fontSize: 10, fontFace: "Calibri", fill: { color: "EEF2FF" }, margin: 0.06 } },
        { text: c.totalAmount ?? "",     options: { bold: true, color: t.primary, fontSize: 10, fontFace: "Calibri", fill: { color: "EEF2FF" }, align: "right" as const, margin: 0.06 } },
      ]);
    }

    sl.addTable(allRows, {
      x: MX, y: tableY, w: tableW,
      colW: [tableW * 0.68, tableW * 0.32],
      border: { type: "solid", color: "E2E8F0", pt: 1 },
    });
  }

  if (highlights.length > 0) {
    const hX = MX + tableW + 0.2;
    const hW = CW - tableW - 0.2;
    let hY = tableY;

    for (const h of highlights) {
      sl.addText(h.title.toUpperCase(), {
        x: hX, y: hY, w: hW, h: 0.25,
        fontFace: "Calibri", fontSize: 9, bold: true, color: t.primary, charSpacing: 1,
      });
      sl.addText("", { x: hX, y: hY + 0.25, w: hW, h: 0.03, fill: { color: t.header } });
      sl.addText(h.body, {
        x: hX, y: hY + 0.32, w: hW, h: 1.2,
        fontFace: "Calibri", fontSize: 10, color: "374151", wrap: true, valign: "top",
      });
      hY += 1.65;
    }
  }
}

function renderReturns(
  prs: PptxGenJS,
  _deck: Deck,
  section: DeckSection,
  t: PptxTheme,
  financialModel?: FinancialModel,
): void {
  const sl = prs.addSlide();
  sl.background = { color: "F4F7FA" };
  addHeader(sl, section.title, t);

  const c = section.content as ReturnsContent;
  let yCur = CY;

  const body = c.body || financialModel?.notes || financialModel?.assumptions;
  if (body) {
    bodyText(sl, body, MX, yCur, CW, 0.55, { fontSize: 11 });
    yCur += 0.62;
  }

  // Timeline items
  const timeline = c.timelineItems ?? [];
  if (timeline.length > 0) {
    const count = Math.min(timeline.length, 4);
    const itemW = CW / count;

    timeline.slice(0, 4).forEach((item, i) => {
      const ix = MX + i * itemW;
      // Period header
      sl.addText(item.period, {
        x: ix, y: yCur, w: itemW - 0.1, h: 0.35,
        fontFace: "Calibri", fontSize: 16, bold: true, color: t.accent,
      });
      sl.addText(item.phase.toUpperCase(), {
        x: ix, y: yCur + 0.35, w: itemW - 0.1, h: 0.25,
        fontFace: "Calibri", fontSize: 9, bold: true, color: t.primary, charSpacing: 1,
      });
      sl.addText(item.description, {
        x: ix, y: yCur + 0.65, w: itemW - 0.15, h: 1.1,
        fontFace: "Calibri", fontSize: 10, color: "374151", wrap: true, valign: "top",
      });
    });
    yCur += 1.85;
  }

  // Key metrics
  const metrics =
    c.keyMetrics && c.keyMetrics.length > 0
      ? c.keyMetrics
      : [
          {
            value: financialModel?.preferredReturn ?? "",
            label: "Preferred Return",
          },
          {
            value: financialModel?.targetRaise ?? "",
            label: "Target Raise",
          },
          {
            value: financialModel?.minimumInvestment ?? "",
            label: "Minimum Investment",
          },
        ].filter((metric) => metric.value);
  if (metrics.length > 0) {
    const count = Math.min(metrics.length, 4);
    const mW = Math.min(2.8, CW / count);

    metrics.slice(0, 4).forEach((m, i) => {
      sl.addText([
        { text: m.value, options: { fontSize: 26, bold: true, color: t.primary, breakLine: true } },
        { text: m.label.toUpperCase(), options: { fontSize: 9, bold: false, color: "6B7280" } },
      ], {
        x: MX + i * (mW + 0.15), y: yCur, w: mW, h: 1.2,
        fontFace: "Calibri", align: "center", valign: "middle",
        fill: { color: "EBF0FF" },
      });
    });
    yCur += 1.3;
  }

  // Exit strategy
  if (c.exitStrategyTitle) {
    sl.addText([
      { text: c.exitStrategyTitle + "  ", options: { bold: true, color: t.accent, fontSize: 11 } },
      { text: c.exitStrategyBody ?? "", options: { color: "374151", fontSize: 11 } },
    ], {
      x: MX, y: yCur + 0.1, w: CW, h: H - yCur - 0.4,
      fontFace: "Calibri", wrap: true, valign: "top",
    });
  }
}

function renderTeam(
  prs: PptxGenJS,
  _deck: Deck,
  section: DeckSection,
  t: PptxTheme,
): void {
  const sl = prs.addSlide();
  sl.background = { color: "F4F7FA" };
  addHeader(sl, section.title, t);

  const c = section.content as TeamContent;
  const members = c.members ?? [];
  let yCur = CY;

  if (c.body) {
    bodyText(sl, c.body, MX, yCur, CW, 0.55, { fontSize: 11 });
    yCur += 0.62;
  }

  if (members.length > 0) {
    const cols = Math.min(members.length, 3);
    const cardW = CW / cols;

    members.slice(0, 6).forEach((m, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const mx = MX + col * cardW;
      const my = yCur + row * 2.1;

      // Card background
      sl.addText("", {
        x: mx + 0.05, y: my, w: cardW - 0.15, h: 1.95,
        fill: { color: "FFFFFF" },
        line: { color: "E2E8F0", width: 1 },
      });

      // Avatar circle (initial)
      sl.addText(m.name.charAt(0).toUpperCase(), {
        x: mx + 0.2, y: my + 0.15, w: 0.7, h: 0.7,
        fontFace: "Calibri", fontSize: 18, bold: true, color: "FFFFFF",
        align: "center", valign: "middle",
        fill: { color: t.primary },
      });

      // Name, title, bio
      sl.addText([
        { text: m.name, options: { bold: true, color: t.primary, fontSize: 12, breakLine: true } },
        { text: m.title, options: { color: t.accent, fontSize: 10, breakLine: !!m.bio } },
        ...(m.bio ? [{ text: m.bio, options: { color: "6B7280", fontSize: 9 } } as PptxGenJS.TextProps] : []),
      ], {
        x: mx + 1.05, y: my + 0.15, w: cardW - 1.2, h: 1.65,
        fontFace: "Calibri", wrap: true, valign: "top",
      });
    });
  }
}

function renderProjections(
  prs: PptxGenJS,
  _deck: Deck,
  section: DeckSection,
  t: PptxTheme,
  financialModel?: FinancialModel,
): void {
  const sl = prs.addSlide();
  sl.background = { color: "F4F7FA" };
  addHeader(sl, section.title, t);

  const c = section.content as ProjectionsContent;
  let yCur = CY;

  const body = c.body || financialModel?.assumptions;
  if (body) {
    bodyText(sl, body, MX, yCur, CW, 0.55, { fontSize: 11 });
    yCur += 0.62;
  }

  const rows =
    c.rows && c.rows.length > 0
      ? c.rows
      : financialModel?.forecastRows?.map((row) => ({
          label: row.label,
          value: row.value,
        })) ?? [];
  const metrics = c.metrics ?? [];

  const tableW = metrics.length > 0 ? CW * 0.6 : CW * 0.75;

  if (rows.length > 0) {
    const tableRows: TRow[] = rows.map((r) => [
      { text: r.label, options: { color: "374151", fontSize: 11, fontFace: "Calibri", margin: 0.06 } },
      { text: r.value, options: { color: t.primary, fontSize: 11, fontFace: "Calibri", bold: true, align: "right" as const, margin: 0.06 } },
    ]);

    sl.addTable(tableRows, {
      x: MX, y: yCur, w: tableW,
      colW: [tableW * 0.72, tableW * 0.28],
      border: { type: "solid", color: "E2E8F0", pt: 1 },
    });
  }

  if (metrics.length > 0) {
    const mX = MX + tableW + 0.3;
    const mW = CW - tableW - 0.3;
    const mH = 1.2;

    metrics.slice(0, 4).forEach((m, i) => {
      sl.addText([
        { text: m.value, options: { fontSize: 24, bold: true, color: t.primary, breakLine: true } },
        { text: m.label.toUpperCase(), options: { fontSize: 9, color: "6B7280" } },
      ], {
        x: mX, y: yCur + i * (mH + 0.1), w: mW, h: mH,
        fontFace: "Calibri", align: "center", valign: "middle",
        fill: { color: "EBF0FF" },
      });
    });
  }
}

function renderGeneric(
  prs: PptxGenJS,
  _deck: Deck,
  section: DeckSection,
  t: PptxTheme,
): void {
  const sl = prs.addSlide();
  sl.background = { color: "F4F7FA" };
  addHeader(sl, section.title, t);

  const c = section.content as GenericSectionContent;
  let yCur = CY;

  if (c.body) {
    const bulletCount = (c.bullets ?? []).length;
    const bodyH = bulletCount > 0 ? Math.min(2.2, H - CY - 0.3) : H - CY - 0.3;
    bodyText(sl, c.body, MX, yCur, CW, bodyH);
    yCur += bodyH + 0.1;
  }

  const bullets = c.bullets ?? [];
  if (bullets.length > 0) {
    const bulletH = H - yCur - 0.3;
    sl.addText(
      bullets.map((b) => `• ${b}`).join("\n"),
      {
        x: MX, y: yCur, w: CW, h: Math.max(bulletH, 0.5),
        fontFace: "Calibri", fontSize: 12, color: "374151",
        wrap: true, valign: "top",
      },
    );
  }
}

// ─── Section dispatcher ───────────────────────────────────────────────────────

function renderSection(
  prs: PptxGenJS,
  deck: Deck,
  section: DeckSection,
  t: PptxTheme,
  financialModel?: FinancialModel,
): void {
  switch (section.type) {
    case "cover":
      return renderCover(prs, deck, section, t);
    case "executive_summary":
      return renderExecutiveSummary(prs, deck, section, t);
    case "use_of_funds":
      return renderUseOfFunds(prs, deck, section, t, financialModel);
    case "returns":
      return renderReturns(prs, deck, section, t, financialModel);
    case "team":
      return renderTeam(prs, deck, section, t);
    case "projections":
      return renderProjections(prs, deck, section, t, financialModel);
    default:
      return renderGeneric(prs, deck, section, t);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Builds a PPTX presentation from a Deck and triggers a browser download.
 * Skips disabled sections and respects sortOrder.
 */
export async function buildPptx(deck: Deck, options: BuildPptxOptions = {}): Promise<void> {
  const prs = new PptxGenJS();
  prs.layout  = "LAYOUT_WIDE";
  prs.author  = "Pine Tar Sports Fund";
  prs.company = "Pine Tar Sports Fund";
  prs.subject = deck.title;
  prs.title   = deck.title;

  const t = buildTheme(deck.theme);

  const sections = [...deck.sections]
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (sections.length === 0) {
    // Generate a placeholder slide so the file is not empty
    const sl = prs.addSlide();
    sl.background = { color: "F4F7FA" };
    sl.addText(deck.title, {
      x: 1, y: 2.5, w: W - 2, h: 1.5,
      fontFace: "Calibri", fontSize: 24, bold: true, color: "374151",
      align: "center",
    });
    sl.addText("No sections enabled.", {
      x: 1, y: 4, w: W - 2, h: 0.5,
      fontFace: "Calibri", fontSize: 12, color: "9CA3AF", align: "center",
    });
  } else {
    for (const section of sections) {
      renderSection(prs, deck, section, t, options.financialModel);
    }
  }

  await prs.writeFile({ fileName: `${deck.slug}.pptx` });
}
