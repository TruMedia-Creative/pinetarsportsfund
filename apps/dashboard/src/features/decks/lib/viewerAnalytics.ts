export type ViewerAnalyticsEventType =
  | "session_start"
  | "slide_view"
  | "cta_click"
  | "mode_change";

export interface ViewerAnalyticsEvent {
  deckId: string;
  sessionId: string;
  type: ViewerAnalyticsEventType;
  label?: string;
  timestamp: string;
}

interface ViewerAnalyticsSummary {
  sessions: number;
  slideViews: number;
  ctaClicks: number;
  modeChanges: number;
}

const STORAGE_KEY = "pinetar.viewer-analytics";

function readEvents(): ViewerAnalyticsEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ViewerAnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: ViewerAnalyticsEvent[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-500)));
  } catch {
    return;
  }
}

export function createViewerSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `viewer-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function trackViewerEvent(event: ViewerAnalyticsEvent) {
  const events = readEvents();
  events.push(event);
  writeEvents(events);
}

export function readViewerAnalyticsSummary(deckId: string): ViewerAnalyticsSummary {
  const deckEvents = readEvents().filter((event) => event.deckId === deckId);
  return {
    sessions: new Set(deckEvents.map((event) => event.sessionId)).size,
    slideViews: deckEvents.filter((event) => event.type === "slide_view").length,
    ctaClicks: deckEvents.filter((event) => event.type === "cta_click").length,
    modeChanges: deckEvents.filter((event) => event.type === "mode_change").length,
  };
}
