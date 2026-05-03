import {
  JOB_LISTING_FETCH_TIMEOUT_MS,
  JOB_LISTING_FETCH_USER_AGENT,
  JOB_LISTING_MAX_RESPONSE_BYTES,
} from "./job-listing-constants";

export type FetchJobListingDocumentResult =
  | { ok: true; httpStatus: number; bytesRead: number; bodyText: string }
  | { ok: false; httpStatus: number | null; error: string };

const bufferToUtf8 = (buf: ArrayBuffer): string => {
  try {
    return new TextDecoder("utf-8", { fatal: false }).decode(buf);
  } catch {
    return "";
  }
};

/**
 * GETs a job listing URL with timeout and response size cap.
 */
export const fetchJobListingDocument = async (href: string): Promise<FetchJobListingDocumentResult> => {
  let res: Response;
  try {
    res = await fetch(href, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(JOB_LISTING_FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": JOB_LISTING_FETCH_USER_AGENT,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { ok: false, httpStatus: null, error: msg };
  }

  const httpStatus = res.status;
  if (!res.ok) {
    return { ok: false, httpStatus, error: `HTTP ${httpStatus}` };
  }

  const reader = res.body?.getReader();
  if (!reader) {
    const ab = await res.arrayBuffer();
    const slice = ab.byteLength > JOB_LISTING_MAX_RESPONSE_BYTES ? ab.slice(0, JOB_LISTING_MAX_RESPONSE_BYTES) : ab;
    return {
      ok: true,
      httpStatus,
      bytesRead: slice.byteLength,
      bodyText: bufferToUtf8(slice),
    };
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    if (total + value.length > JOB_LISTING_MAX_RESPONSE_BYTES) {
      const rest = JOB_LISTING_MAX_RESPONSE_BYTES - total;
      if (rest > 0) {
        chunks.push(value.subarray(0, rest));
        total += rest;
      }
      await reader.cancel();
      break;
    }
    chunks.push(value);
    total += value.length;
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  const ab = merged.buffer.slice(merged.byteOffset, merged.byteOffset + merged.byteLength);
  return {
    ok: true,
    httpStatus,
    bytesRead: total,
    bodyText: bufferToUtf8(ab),
  };
};
