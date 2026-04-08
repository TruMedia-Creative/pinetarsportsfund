import { z } from "zod/v4";

export const financialUseOfFundsRowSchema = z.object({
  category: z.string().min(1),
  amount: z.string().min(1),
});

export const financialForecastRowSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const financialModelSchema = z.object({
  id: z.string(),
  projectName: z.string().min(1),
  minimumInvestment: z.string().optional(),
  targetRaise: z.string().optional(),
  preferredReturn: z.string().optional(),
  equityStructure: z.string().optional(),
  useOfFunds: z.array(financialUseOfFundsRowSchema),
  forecastRows: z.array(financialForecastRowSchema),
  assumptions: z.string().min(1),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createFinancialModelSchema = financialModelSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type FinancialModelInput = z.infer<typeof financialModelSchema>;
export type CreateFinancialModelInput = z.infer<typeof createFinancialModelSchema>;
