import { randomUUID } from "node:crypto";
import type { Employee } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmployeeFromSupabase } from "./supabase/get-employee-from-supabase";
import { listEmployeesFromSupabase } from "./supabase/list-employees-from-supabase";

export const listEmployeesFromStore = async (): Promise<Employee[]> => {
  return listEmployeesFromSupabase(requireCrmSupabaseClient());
};

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

export const getEmployeeFromStore = async (id: string): Promise<Employee | null> => {
  return getEmployeeFromSupabase(requireCrmSupabaseClient(), id);
};

export const updateEmployeeInStore = async (
  id: string,
  patch: Partial<Pick<Employee, "companyId" | "name" | "role" | "email" | "linkedinUrl">>,
): Promise<Employee | null> => {
  const supabase = requireCrmSupabaseClient();
  const prev = await getEmployeeFromSupabase(supabase, id);
  if (!prev) {
    return null;
  }

  const next: Employee = {
    ...prev,
    companyId: patch.companyId !== undefined ? patch.companyId : prev.companyId,
    name: patch.name !== undefined ? patch.name.trim() : prev.name,
    role: patch.role !== undefined ? patch.role.trim() : prev.role,
    email: patch.email !== undefined ? patch.email.trim() : prev.email,
    linkedinUrl: patch.linkedinUrl !== undefined ? patch.linkedinUrl.trim() : prev.linkedinUrl,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("employees")
    .update({
      company_id: next.companyId,
      name: next.name,
      role: next.role,
      email: next.email,
      linkedin_url: next.linkedinUrl,
      updated_at: next.updatedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("❌ updateEmployeeInStore:", error.message);
    throw new Error(error.message);
  }

  return next;
};

export const deleteEmployeeFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("employees").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteEmployeeFromStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
