import type { Tenant } from "../../../features/tenants/model";
import { supabase } from "../../supabase";

interface DbTenantRow {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  branding: {
    logoUrl?: string;
    primaryColor: string;
    fontFamily?: string;
  };
  created_at: string;
  updated_at: string;
}

function mapRow(row: DbTenantRow): Tenant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    domain: row.domain ?? undefined,
    branding: row.branding,
  };
}

export async function getTenants(): Promise<Tenant[]> {
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data as DbTenantRow[]).map(mapRow);
}

export async function getTenantBySlug(slug: string): Promise<Tenant | undefined> {
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as DbTenantRow) : undefined;
}

export async function getTenantById(id: string): Promise<Tenant | undefined> {
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data as DbTenantRow) : undefined;
}
