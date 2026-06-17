export type ProjectNotesSynthesisRequest = {
  id: string;
  projectId: string;
  provider: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  requestPayloadJson: Record<string, unknown>;
  createdAt: string;
};

export type ProjectNotesSynthesisResponse = {
  id: string;
  requestId: string;
  model: string;
  status: "success" | "error";
  rawResponse: string;
  parsedResponseJson: { notes: string[] } | null;
  errorMessage: string;
  usageInputTokens: number | null;
  usageOutputTokens: number | null;
  createdAt: string;
};

export type ProjectNotesSynthesisExchange = {
  id: string;
  projectId: string;
  requestId: string;
  responseId: string;
  createdAt: string;
};
