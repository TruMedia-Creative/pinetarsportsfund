import type { FinancialModel } from "../model";

interface ReturnsFormProps {
  model: FinancialModel;
  onChange: (next: FinancialModel) => void;
}

export function ReturnsForm({ model, onChange }: ReturnsFormProps) {
  function setField<K extends keyof FinancialModel>(key: K, value: FinancialModel[K]) {
    onChange({ ...model, [key]: value });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Minimum Investment
          </label>
          <input
            type="text"
            value={model.minimumInvestment ?? ""}
            onChange={(e) => setField("minimumInvestment", e.target.value)}
            placeholder="$50,000"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Target Raise
          </label>
          <input
            type="text"
            value={model.targetRaise ?? ""}
            onChange={(e) => setField("targetRaise", e.target.value)}
            placeholder="$4,200,000"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Preferred Return
          </label>
          <input
            type="text"
            value={model.preferredReturn ?? ""}
            onChange={(e) => setField("preferredReturn", e.target.value)}
            placeholder="8%"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Equity Structure
        </label>
        <input
          type="text"
          value={model.equityStructure ?? ""}
          onChange={(e) => setField("equityStructure", e.target.value)}
          placeholder="LP/GP split after preferred return"
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Assumptions
        </label>
        <textarea
          value={model.assumptions}
          onChange={(e) => setField("assumptions", e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Notes</label>
        <textarea
          value={model.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          rows={2}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
    </div>
  );
}
