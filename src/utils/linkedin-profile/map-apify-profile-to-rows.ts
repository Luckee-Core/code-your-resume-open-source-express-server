export type ApifyProfileItem = Record<string, unknown>;

export type ApifyDatePart = {
  month?: string;
  year?: number;
  text?: string;
};

export type LinkedInProfileUpdateFields = {
  publicIdentifier: string;
  apifyProfileId: string;
  name: string;
  headline: string;
  location: string;
  syncedAt: string;
};

export type LinkedInEmploymentInsert = {
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
};

export type LinkedInEducationInsert = {
  sortOrder: number;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  period: string;
  schoolLinkedinUrl: string;
  startYear: number | null;
  endYear: number | null;
};

export type LinkedInCertificationInsert = {
  sortOrder: number;
  title: string;
  issuedAt: string;
  issuedBy: string;
  issuedByLink: string;
};

export type MapApifyProfileToRowsResult = {
  profile: LinkedInProfileUpdateFields;
  employments: LinkedInEmploymentInsert[];
  educations: LinkedInEducationInsert[];
  certifications: LinkedInCertificationInsert[];
};

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

const asNumberOrNull = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

/**
 * Extracts display location text from Apify profile location object.
 */
export const extractApifyProfileLocation = (item: ApifyProfileItem): string => {
  const location = asRecord(item.location);
  if (!location) return "";
  const linkedinText = asString(location.linkedinText);
  if (linkedinText) return linkedinText;
  const parsed = asRecord(location.parsed);
  return parsed ? asString(parsed.text) : "";
};

/**
 * Builds full name from Apify firstName and lastName.
 */
export const buildApifyProfileName = (item: ApifyProfileItem): string => {
  const first = asString(item.firstName).trim();
  const last = asString(item.lastName).trim();
  return [first, last].filter(Boolean).join(" ").trim();
};

const mapApifyDatePart = (value: unknown): ApifyDatePart => {
  const obj = asRecord(value);
  if (!obj) return {};
  return {
    month: asString(obj.month) || undefined,
    year: asNumberOrNull(obj.year) ?? undefined,
    text: asString(obj.text) || undefined,
  };
};

/**
 * Maps Apify experience entries to employment insert DTOs.
 */
export const mapApifyExperienceToEmployments = (
  experience: unknown,
): LinkedInEmploymentInsert[] => {
  return asArray(experience).map((entry, index) => {
    const row = asRecord(entry) ?? {};
    const startDate = mapApifyDatePart(row.startDate);
    const endDate = mapApifyDatePart(row.endDate);
    const endText = endDate.text ?? "";
    const isCurrent = endText.toLowerCase() === "present";

    return {
      sortOrder: index,
      position: asString(row.position),
      companyName: asString(row.companyName),
      location: asString(row.location),
      employmentType: asString(row.employmentType),
      workplaceType: asString(row.workplaceType),
      description: asString(row.description),
      duration: asString(row.duration),
      companyLinkedinUrl: asString(row.companyLinkedinUrl),
      startMonth: startDate.month ?? "",
      startYear: startDate.year ?? null,
      endMonth: isCurrent ? "" : (endDate.month ?? ""),
      endYear: isCurrent ? null : (endDate.year ?? null),
      isCurrent,
    };
  });
};

/**
 * Maps Apify education entries to education insert DTOs.
 */
export const mapApifyEducationToEducations = (education: unknown): LinkedInEducationInsert[] => {
  return asArray(education).map((entry, index) => {
    const row = asRecord(entry) ?? {};
    const startDate = mapApifyDatePart(row.startDate);
    const endDate = mapApifyDatePart(row.endDate);

    return {
      sortOrder: index,
      schoolName: asString(row.schoolName),
      degree: asString(row.degree),
      fieldOfStudy: asString(row.fieldOfStudy),
      period: asString(row.period),
      schoolLinkedinUrl: asString(row.schoolLinkedinUrl),
      startYear: startDate.year ?? null,
      endYear: endDate.year ?? null,
    };
  });
};

/**
 * Maps Apify certification entries to certification insert DTOs.
 */
export const mapApifyCertificationsToCertifications = (
  certifications: unknown,
): LinkedInCertificationInsert[] => {
  return asArray(certifications).map((entry, index) => {
    const row = asRecord(entry) ?? {};
    return {
      sortOrder: index,
      title: asString(row.title),
      issuedAt: asString(row.issuedAt),
      issuedBy: asString(row.issuedBy),
      issuedByLink: asString(row.issuedByLink),
    };
  });
};

/**
 * Maps one Apify profile object to profile update fields and child row DTOs.
 */
export const mapApifyProfileToRows = (item: ApifyProfileItem): MapApifyProfileToRowsResult => {
  const syncedAt = new Date().toISOString();

  return {
    profile: {
      publicIdentifier: asString(item.publicIdentifier),
      apifyProfileId: asString(item.id),
      name: buildApifyProfileName(item),
      headline: asString(item.headline),
      location: extractApifyProfileLocation(item),
      syncedAt,
    },
    employments: mapApifyExperienceToEmployments(item.experience),
    educations: mapApifyEducationToEducations(item.education),
    certifications: mapApifyCertificationsToCertifications(item.certifications),
  };
};
