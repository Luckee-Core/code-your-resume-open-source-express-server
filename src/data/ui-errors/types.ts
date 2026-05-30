export type UiErrorSeverity = "fatal" | "error" | "warning";

export type InsertUiErrorInput = {
  event: string;
  severity: UiErrorSeverity;
  message: string;
  stack: string | null;
  routePath: string;
  componentName: string | null;
  digest: string | null;
  appSlug: string;
  environment: string;
  release: string | null;
};
