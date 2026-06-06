export type ApiDocsHttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type ApiDocsQueryParam = {
  name: string;
  description: string;
  required?: boolean;
};

export type ApiDocsRequestBody = {
  contentType: string;
  example: unknown;
};

export type ApiDocsResponse = {
  status: number;
  description: string;
  example: unknown;
};

export type ApiDocsEndpoint = {
  method: ApiDocsHttpMethod;
  path: string;
  summary: string;
  description?: string;
  queryParams?: ApiDocsQueryParam[];
  requestBody?: ApiDocsRequestBody;
  responses: ApiDocsResponse[];
};

export type ApiDocsGroup = {
  name: string;
  description?: string;
  endpoints: ApiDocsEndpoint[];
};

export type ApiDocsCatalog = {
  version: string;
  baseUrl: string;
  responseEnvelope: string;
  groups: ApiDocsGroup[];
};
