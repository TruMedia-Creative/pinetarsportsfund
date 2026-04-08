import type {
  CreateFinancialModelInput,
  FinancialModel,
} from "../../../features/financials/model";

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

function loadFinancialModels(): FinancialModel[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as FinancialModel[];
  } catch {
    // ignore storage errors
  }
  return [...mockFinancialModels];
}

function saveFinancialModels(data: FinancialModel[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

const financialModels = loadFinancialModels();

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getFinancialModels(): Promise<FinancialModel[]> {
  await delay();
  return [...financialModels];
}

export async function getFinancialModelById(
  id: string,
): Promise<FinancialModel | undefined> {
  await delay();
  return financialModels.find((model) => model.id === id);
}

export async function createFinancialModel(
  data: CreateFinancialModelInput,
): Promise<FinancialModel> {
  await delay();
  const now = new Date().toISOString();
  const model: FinancialModel = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  financialModels.unshift(model);
  saveFinancialModels(financialModels);
  return model;
}

export async function updateFinancialModel(
  id: string,
  data: Partial<CreateFinancialModelInput>,
): Promise<FinancialModel> {
  await delay();
  const idx = financialModels.findIndex((model) => model.id === id);
  if (idx === -1) {
    throw new Error(`Financial model not found: ${id}`);
  }
  financialModels[idx] = {
    ...financialModels[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveFinancialModels(financialModels);
  return financialModels[idx];
}

export async function deleteFinancialModel(id: string): Promise<void> {
  await delay();
  const idx = financialModels.findIndex((model) => model.id === id);
  if (idx === -1) {
    throw new Error(`Financial model not found: ${id}`);
  }
  financialModels.splice(idx, 1);
  saveFinancialModels(financialModels);
}
