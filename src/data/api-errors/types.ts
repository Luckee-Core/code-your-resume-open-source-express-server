export type ApiErrorSeverity = "fatal" | "error" | "warning";

export type InsertApiErrorInput = {
  event: string;
  severity: ApiErrorSeverity;
  message: string;
  stack: string | null;
  httpMethod: string;
  routePath: string;
  statusCode: number | null;
  upstream: string | null;
  appSlug: string;
  environment: string;
  release: string | null;
};
