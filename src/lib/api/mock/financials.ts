import type {
  CreateFinancialModelInput,
  FinancialModel,
} from "../../../features/financials/model";
import {
  deleteRowById,
  getRowById,
  listRows,
  seedTableFromLegacyOrDefaults,
  upsertRow,
} from "./sqlite";

const STORAGE_KEY = "mock.financial-models";

const mockFinancialModels: FinancialModel[] = [
  {
    id: "fm-1",
    projectName: "Pine Tar Sports Complex",
    minimumInvestment: "$50,000",
    targetRaise: "$4,200,000",
    preferredReturn: "8%",
    equityStructure: "LP/GP 70/30 after pref",
    useOfFunds: [
      { category: "Land & Site Work", amount: "$1.8M" },
      { category: "Construction", amount: "$7.2M" },
      { category: "Equipment", amount: "$1.4M" },
      { category: "Working Capital", amount: "$0.95M" },
      { category: "Soft Costs", amount: "$1.15M" },
    ],
    forecastRows: [
      { label: "Year 1 Revenue", value: "$1.84M" },
      { label: "Year 2 Revenue", value: "$2.61M" },
      { label: "Year 3 Revenue", value: "$3.18M" },
      { label: "Stabilized NOI", value: "$1.43M" },
    ],
    assumptions:
      "Assumes conservative occupancy ramp, market-rate memberships, and regional tournament calendar utilization.",
    notes: "Prepared for investor and lender decks.",
    createdAt: "2025-01-20T09:00:00Z",
    updatedAt: "2025-01-20T09:00:00Z",
  },
];

let seeded = false;

async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  await seedTableFromLegacyOrDefaults(
    "financial_models",
    STORAGE_KEY,
    mockFinancialModels,
  );
  seeded = true;
}

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getFinancialModels(): Promise<FinancialModel[]> {
  await delay();
  await ensureSeeded();
  const financialModels = await listRows<FinancialModel>("financial_models");
  return [...financialModels];
}

export async function getFinancialModelById(
  id: string,
): Promise<FinancialModel | undefined> {
  await delay();
  await ensureSeeded();
  return getRowById<FinancialModel>("financial_models", id);
}

export async function createFinancialModel(
  data: CreateFinancialModelInput,
): Promise<FinancialModel> {
  await delay();
  await ensureSeeded();
  const now = new Date().toISOString();
  const model: FinancialModel = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await upsertRow("financial_models", model);
  return model;
}

export async function updateFinancialModel(
  id: string,
  data: Partial<CreateFinancialModelInput>,
): Promise<FinancialModel> {
  await delay();
  await ensureSeeded();
  const existing = await getRowById<FinancialModel>("financial_models", id);
  if (!existing) {
    throw new Error(`Financial model not found: ${id}`);
  }
  const updated: FinancialModel = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await upsertRow("financial_models", updated);
  return updated;
}

export async function deleteFinancialModel(id: string): Promise<void> {
  await delay();
  await ensureSeeded();
  const existing = await getRowById<FinancialModel>("financial_models", id);
  if (!existing) {
    throw new Error(`Financial model not found: ${id}`);
  }
  await deleteRowById("financial_models", id);
}
