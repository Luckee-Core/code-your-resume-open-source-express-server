/**
 * Normalizes Postgres timestamptz / ISO strings for CRM API responses.
 */
export const toIsoTimestampString = (value: string | Date | null | undefined): string => {
  if (value == null || value === "") {
    return "";
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  }
  return value;
};
