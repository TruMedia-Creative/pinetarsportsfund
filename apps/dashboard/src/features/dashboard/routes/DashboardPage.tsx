import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDecks } from "../../../lib/api/mock/decks";
import { LoadingSpinner, SurfacePanel, buttonClassName } from "../../../components/ui";
import type { Deck } from "../../decks/model";

const STATUS_STYLES: Record<Deck["status"], string> = {
  draft: "bg-yellow-100 text-yellow-800",
  ready: "bg-blue-100 text-blue-800",
  exported: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

export function DashboardPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getDecks()
      .then((data) => {
        if (cancelled) return;
        setDecks(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  const ready = decks.filter((d) => d.status === "ready").length;
  const drafts = decks.filter((d) => d.status === "draft").length;
  const recent = decks.slice(0, 3);

  const stats = [
    { label: "Total Decks", value: decks.length, color: "text-indigo-600" },
    { label: "Ready", value: ready, color: "text-green-600" },
    { label: "Drafts", value: drafts, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Pine Tar Sports Fund</p>
          <p className="mt-1 text-sm text-gray-500">Track active work, jump back into recent decks, and start a new deck from the main workflow.</p>
        </div>
        <Link to="/decks/new" className={buttonClassName({ variant: "primary", size: "md" })}>
          + Create New Deck
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <SurfacePanel
            key={s.label}
            padding="lg"
          >
            <p className="text-sm font-medium text-gray-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </SurfacePanel>
        ))}
      </div>

      {/* Recent Decks */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Decks
          </h2>
          <Link to="/decks" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <SurfacePanel tone="subtle" padding="lg" className="mt-4 text-center">
            <p className="text-gray-500">No decks yet. Start with a guided setup and return here once drafts are in motion.</p>
            <Link to="/decks/new" className={`${buttonClassName({ variant: "primary", size: "md" })} mt-4`}>
              Create your first deck
            </Link>
          </SurfacePanel>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
            {recent.map((deck) => (
              <li key={deck.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <Link
                    to={`/decks/${deck.id}/edit`}
                    className="font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {deck.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {deck.projectName} · {deck.audienceType}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[deck.status]}`}
                >
                  {deck.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        {recent.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Link to="/decks" className={buttonClassName({ variant: "secondary", size: "md" })}>
              Open Deck Library
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

