import type { Employment } from "../types";
import { normalizeEmployment } from "../normalize-employment";
import { toIsoTimestampString } from "../../../utils/crm/to-iso-timestamp-string";

type EmploymentRow = {
  id: string;
  company_id: string;
  job_id: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Maps a Supabase `employments` row to the CRM `Employment` type.
 */
export const mapEmploymentRow = (row: EmploymentRow): Employment => {
  return normalizeEmployment({
    id: row.id,
    companyId: row.company_id,
    jobId: row.job_id,
    startDate: row.start_date,
    endDate: row.end_date ?? "",
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  });
};
