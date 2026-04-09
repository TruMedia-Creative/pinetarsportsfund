import type {
  CreateFinancialModelInput,
  FinancialModel,
} from "../../../features/financials/model";
import { supabase } from "../../supabase";

interface DbFinancialModelRow {
  id: string;
  project_name: string;
  minimum_investment: string | null;
  target_raise: string | null;
  preferred_return: string | null;
  equity_structure: string | null;
  use_of_funds: FinancialModel["useOfFunds"];
  forecast_rows: FinancialModel["forecastRows"];
  assumptions: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: DbFinancialModelRow): FinancialModel {
  return {
    id: row.id,
    projectName: row.project_name,
    minimumInvestment: row.minimum_investment ?? undefined,
    targetRaise: row.target_raise ?? undefined,
    preferredReturn: row.preferred_return ?? undefined,
    equityStructure: row.equity_structure ?? undefined,
    useOfFunds: row.use_of_funds ?? [],
    forecastRows: row.forecast_rows ?? [],
    assumptions: row.assumptions,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getFinancialModels(): Promise<FinancialModel[]> {
  const { data, error } = await supabase
    .from("financial_models")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbFinancialModelRow[]).map(mapRow);
}

export async function getFinancialModelById(
  id: string,
): Promise<FinancialModel | undefined> {
  const { data, error } = await supabase
    .from("financial_models")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as DbFinancialModelRow) : undefined;
}

export async function createFinancialModel(
  input: CreateFinancialModelInput,
): Promise<FinancialModel> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("financial_models")
    .insert({
      project_name: input.projectName,
      minimum_investment: input.minimumInvestment ?? null,
      target_raise: input.targetRaise ?? null,
      preferred_return: input.preferredReturn ?? null,
      equity_structure: input.equityStructure ?? null,
      use_of_funds: input.useOfFunds ?? [],
      forecast_rows: input.forecastRows ?? [],
      assumptions: input.assumptions,
      notes: input.notes ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as DbFinancialModelRow);
}

export async function updateFinancialModel(
  id: string,
  input: Partial<FinancialModel>,
): Promise<FinancialModel> {
  const changes: Record<string, unknown> = {};

  if (input.projectName !== undefined) changes.project_name = input.projectName;
  if (input.minimumInvestment !== undefined) changes.minimum_investment = input.minimumInvestment;
  if (input.targetRaise !== undefined) changes.target_raise = input.targetRaise;
  if (input.preferredReturn !== undefined) changes.preferred_return = input.preferredReturn;
  if (input.equityStructure !== undefined) changes.equity_structure = input.equityStructure;
  if (input.useOfFunds !== undefined) changes.use_of_funds = input.useOfFunds;
  if (input.forecastRows !== undefined) changes.forecast_rows = input.forecastRows;
  if (input.assumptions !== undefined) changes.assumptions = input.assumptions;
  if (input.notes !== undefined) changes.notes = input.notes;

  const { data, error } = await supabase
    .from("financial_models")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as DbFinancialModelRow);
}

export async function deleteFinancialModel(id: string): Promise<void> {
  const { error } = await supabase
    .from("financial_models")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
