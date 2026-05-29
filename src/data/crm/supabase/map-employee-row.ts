import type { Employee } from "../types";
import { toIsoTimestampString } from "../../../utils/crm/to-iso-timestamp-string";

type EmployeeRow = {
  id: string;
  company_id: string;
  name: string;
  role: string | null;
  email: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Maps a Supabase `employees` row to the CRM `Employee` type.
 */
export const mapEmployeeRow = (row: EmployeeRow): Employee => {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    role: row.role ?? "",
    email: row.email ?? "",
    linkedinUrl: row.linkedin_url ?? "",
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  };
};
