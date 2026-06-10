export type LinkedInEducation = {
  id: string;
  linkedinProfileId: string;
  sortOrder: number;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  period: string;
  schoolLinkedinUrl: string;
  startYear: number | null;
  endYear: number | null;
  createdAt: string;
  updatedAt: string;
};

export type LinkedInEducationRow = {
  id: string;
  linkedin_profile_id: string;
  sort_order: number;
  school_name: string;
  degree: string;
  field_of_study: string;
  period: string;
  school_linkedin_url: string;
  start_year: number | null;
  end_year: number | null;
  created_at: string;
  updated_at: string;
};

export const LINKEDIN_EDUCATION_SELECT_COLUMNS =
  "id, linkedin_profile_id, sort_order, school_name, degree, field_of_study, period, school_linkedin_url, start_year, end_year, created_at, updated_at";
