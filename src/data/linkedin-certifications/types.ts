export type LinkedInCertification = {
  id: string;
  linkedinProfileId: string;
  sortOrder: number;
  title: string;
  issuedAt: string;
  issuedBy: string;
  issuedByLink: string;
  createdAt: string;
  updatedAt: string;
};

export type LinkedInCertificationRow = {
  id: string;
  linkedin_profile_id: string;
  sort_order: number;
  title: string;
  issued_at: string;
  issued_by: string;
  issued_by_link: string;
  created_at: string;
  updated_at: string;
};

export const LINKEDIN_CERTIFICATION_SELECT_COLUMNS =
  "id, linkedin_profile_id, sort_order, title, issued_at, issued_by, issued_by_link, created_at, updated_at";
