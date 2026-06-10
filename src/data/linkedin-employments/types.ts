export type LinkedInEmployment = {
  id: string;
  linkedinProfileId: string;
  sortOrder: number;
  position: string;
  companyName: string;
  location: string;
  employmentType: string;
  workplaceType: string;
  description: string;
  duration: string;
  companyLinkedinUrl: string;
  startMonth: string;
  startYear: number | null;
  endMonth: string;
  endYear: number | null;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LinkedInEmploymentRow = {
  id: string;
  linkedin_profile_id: string;
  sort_order: number;
  position: string;
  company_name: string;
  location: string;
  employment_type: string;
  workplace_type: string;
  description: string;
  duration: string;
  company_linkedin_url: string;
  start_month: string;
  start_year: number | null;
  end_month: string;
  end_year: number | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

export const LINKEDIN_EMPLOYMENT_SELECT_COLUMNS =
  "id, linkedin_profile_id, sort_order, position, company_name, location, employment_type, workplace_type, description, duration, company_linkedin_url, start_month, start_year, end_month, end_year, is_current, created_at, updated_at";
