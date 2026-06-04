import type { Employee } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmployeeFromSupabase } from "./supabase/get-employee-from-supabase";

/**
 * Updates an existing employee row in Supabase CRM.
 */
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
