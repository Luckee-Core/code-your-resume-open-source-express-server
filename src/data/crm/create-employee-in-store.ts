import { randomUUID } from "node:crypto";
import type { Employee } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmployeeFromSupabase } from "./supabase/get-employee-from-supabase";

/**
 * Inserts a new employee row in Supabase CRM.
 */
export const createEmployeeInStore = async (input: {
  companyId: string;
  name: string;
  role: string;
  email: string;
  linkedinUrl: string;
}): Promise<Employee> => {
  const supabase = requireCrmSupabaseClient();
  const id = randomUUID();
  const now = new Date().toISOString();

  const { error } = await supabase.from("employees").insert({
    id,
    company_id: input.companyId,
    name: input.name.trim(),
    role: input.role.trim(),
    email: input.email.trim(),
    linkedin_url: input.linkedinUrl.trim(),
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ createEmployeeInStore:", error.message);
    throw new Error(error.message);
  }

  const row = await getEmployeeFromSupabase(supabase, id);
  if (!row) {
    throw new Error("Failed to load employee after insert");
  }
  return row;
};
