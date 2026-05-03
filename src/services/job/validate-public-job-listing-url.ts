/**
 * Validates a URL for server-side listing fetch (http/https, no obvious SSRF targets).
 */
export const validatePublicJobListingUrl = (raw: string): { ok: true; href: string } | { ok: false; error: string } => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "URL is empty" };
  }
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "URL is not valid" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are allowed" };
  }
  const host = url.hostname.toLowerCase();
  if (host === "169.254.169.254") {
    return { ok: false, error: "Link-local / metadata URLs are not allowed" };
  }
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host === "[::1]"
  ) {
    return { ok: false, error: "Loopback URLs are not allowed" };
  }
  if (host.endsWith(".local") || host.endsWith(".localhost")) {
    return { ok: false, error: "Local hostnames are not allowed" };
  }
  if (/^10\./.test(host)) {
    return { ok: false, error: "Private network URLs are not allowed" };
  }
  if (/^192\.168\./.test(host)) {
    return { ok: false, error: "Private network URLs are not allowed" };
  }
  const m172 = host.match(/^172\.(\d{1,3})\./);
  if (m172) {
    const oct = Number(m172[1]);
    if (oct >= 16 && oct <= 31) {
      return { ok: false, error: "Private network URLs are not allowed" };
    }
  }
  return { ok: true, href: url.href };
};
