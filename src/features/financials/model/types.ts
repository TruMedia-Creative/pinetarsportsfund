export interface FinancialUseOfFundsRow {
  category: string;
  amount: string;
}

export interface FinancialForecastRow {
  label: string;
  value: string;
}

export interface FinancialModel {
  id: string;
  projectName: string;
  minimumInvestment?: string;
  targetRaise?: string;
  preferredReturn?: string;
  equityStructure?: string;
  useOfFunds: FinancialUseOfFundsRow[];
  forecastRows: FinancialForecastRow[];
  assumptions: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFinancialModelInput {
  projectName: string;
  minimumInvestment?: string;
  targetRaise?: string;
  preferredReturn?: string;
  equityStructure?: string;
  useOfFunds: FinancialUseOfFundsRow[];
  forecastRows: FinancialForecastRow[];
  assumptions: string;
  notes?: string;
}
