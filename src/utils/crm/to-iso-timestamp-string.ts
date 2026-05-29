/**
 * Normalizes Postgres timestamptz / ISO strings for CRM API responses.
 */
export const toIsoTimestampString = (value: string | null | undefined): string => {
  if (value == null || value === "") {
    return "";
  }
  return value;
};
