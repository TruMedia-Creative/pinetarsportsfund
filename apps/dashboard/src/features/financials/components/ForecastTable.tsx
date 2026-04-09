import type {
  FinancialForecastRow,
  FinancialModel,
  FinancialUseOfFundsRow,
} from "../model";

interface ForecastTableProps {
  model: FinancialModel;
  onChange: (next: FinancialModel) => void;
}

export function ForecastTable({ model, onChange }: ForecastTableProps) {
  function setUseOfFunds(nextRows: FinancialUseOfFundsRow[]) {
    onChange({ ...model, useOfFunds: nextRows });
  }

  function setForecastRows(nextRows: FinancialForecastRow[]) {
    onChange({ ...model, forecastRows: nextRows });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Use of Funds Rows
          </h4>
          <button
            type="button"
            onClick={() =>
              setUseOfFunds([
                ...model.useOfFunds,
                { category: "", amount: "" },
              ])
            }
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            + Add row
          </button>
        </div>
        <div className="space-y-2">
          {model.useOfFunds.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={row.category}
                onChange={(e) => {
                  const next = model.useOfFunds.map((item, i) =>
                    i === idx ? { ...item, category: e.target.value } : item,
                  );
                  setUseOfFunds(next);
                }}
                placeholder="Category"
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
              <input
                type="text"
                value={row.amount}
                onChange={(e) => {
                  const next = model.useOfFunds.map((item, i) =>
                    i === idx ? { ...item, amount: e.target.value } : item,
                  );
                  setUseOfFunds(next);
                }}
                placeholder="$0"
                className="w-44 rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setUseOfFunds(model.useOfFunds.filter((_, i) => i !== idx))
                }
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Forecast Rows
          </h4>
          <button
            type="button"
            onClick={() =>
              setForecastRows([
                ...model.forecastRows,
                { label: "", value: "" },
              ])
            }
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            + Add row
          </button>
        </div>
        <div className="space-y-2">
          {model.forecastRows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={row.label}
                onChange={(e) => {
                  const next = model.forecastRows.map((item, i) =>
                    i === idx ? { ...item, label: e.target.value } : item,
                  );
                  setForecastRows(next);
                }}
                placeholder="Label"
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => {
                  const next = model.forecastRows.map((item, i) =>
                    i === idx ? { ...item, value: e.target.value } : item,
                  );
                  setForecastRows(next);
                }}
                placeholder="$0"
                className="w-44 rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setForecastRows(model.forecastRows.filter((_, i) => i !== idx))
                }
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
