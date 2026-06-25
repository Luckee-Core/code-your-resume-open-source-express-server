import { extractCompanyWebsiteHostname } from "./normalize-company-website-url";

/**
 * Derive a display company name from a website URL (e.g. `stripe.com` → `Stripe`).
 *
 * @param raw - Company website URL
 * @returns Title-cased label from the primary domain segment
 */
export const deriveCompanyNameFromWebsiteUrl = (raw: string): string => {
  const host = extractCompanyWebsiteHostname(raw);
  if (!host) {
    return "Company";
  }
  const label = host.split(".")[0]?.trim() ?? "";
  if (!label) {
    return "Company";
  }
  return label.charAt(0).toUpperCase() + label.slice(1);
};
