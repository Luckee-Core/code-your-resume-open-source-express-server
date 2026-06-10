/**
 * Returns true when the string looks like a LinkedIn profile URL.
 */
export const isLinkedInProfileUrl = (url: string): boolean =>
  /linkedin\.com\/in\//i.test(url.trim());

/**
 * Trims a LinkedIn profile URL.
 */
export const normalizeLinkedInProfileUrl = (url: string): string => url.trim();
