import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDecks } from "../../../lib/api/mock/decks";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Pine Tar Sports Fund</p>
        </div>
        <Link
          to="/decks/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
        >
          + Create New Deck
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Decks */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Decks
          </h2>
          <Link
            to="/decks"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-gray-500">
            No decks yet.{" "}
            <Link to="/decks/new" className="text-indigo-600 hover:underline">
              Create your first deck
            </Link>
          </p>
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
      </div>
    </div>
  );
}

