const REDIRECT_TRACKER_HOST_SUFFIXES = [
  "matcha.fm",
  "link.matcha.fm",
  "bit.ly",
  "t.co",
  "lnkd.in",
];

/**
 * True when the source URL is likely to use client-side redirect chains (email trackers, shorteners).
 */
export const shouldWaitForJobListingRedirects = (href: string): boolean => {
  try {
    const host = new URL(href).hostname.toLowerCase();
    return REDIRECT_TRACKER_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
};
