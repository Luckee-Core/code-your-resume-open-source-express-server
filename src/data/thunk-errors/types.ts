export type ThunkErrorSeverity = "fatal" | "error" | "warning";

export type InsertThunkErrorInput = {
  event: string;
  severity: ThunkErrorSeverity;
  message: string;
  stack: string | null;
  thunkName: string | null;
  collection: string | null;
  entityId: string | null;
  userId: string | null;
  appSlug: string;
  environment: string;
  release: string | null;
};
