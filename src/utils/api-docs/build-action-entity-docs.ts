import type { ApiDocsEndpoint } from "../../services/api-docs/types";

const successEnvelope = <T>(data: T) => ({ success: true, data });
const errorEnvelope = (error: string) => ({ success: false, error });

export type BuildActionEntityDocsInput = {
  entityName: string;
  basePath: string;
  entityExample: unknown;
  createBodyExample?: unknown;
  patchBodyExample?: unknown;
  includeGet?: boolean;
  includeMutations?: boolean;
};

/**
 * Builds standard action-route endpoint docs for `/api/data/{entity}/list|get|create|update|delete`.
 */
export const buildActionEntityDocs = (input: BuildActionEntityDocsInput): ApiDocsEndpoint[] => {
  const {
    entityName,
    basePath,
    entityExample,
    createBodyExample,
    patchBodyExample,
    includeGet = true,
    includeMutations = true,
  } = input;

  const endpoints: ApiDocsEndpoint[] = [
    {
      method: "GET",
      path: `${basePath}/list`,
      summary: `List ${entityName}`,
      responses: [
        {
          status: 200,
          description: "Array of entities",
          example: successEnvelope([entityExample]),
        },
        {
          status: 500,
          description: "Server error",
          example: errorEnvelope("Failed to list"),
        },
      ],
    },
  ];

  if (includeGet) {
    endpoints.push({
      method: "GET",
      path: `${basePath}/get`,
      summary: `Get ${entityName} by id`,
      queryParams: [{ name: "id", description: "Entity UUID", required: true }],
      responses: [
        {
          status: 200,
          description: "Single entity",
          example: successEnvelope(entityExample),
        },
        {
          status: 400,
          description: "Missing id",
          example: errorEnvelope("id is required"),
        },
        {
          status: 404,
          description: "Not found",
          example: errorEnvelope("Not found"),
        },
        {
          status: 500,
          description: "Server error",
          example: errorEnvelope("Failed to get"),
        },
      ],
    });
  }

  if (!includeMutations) {
    return endpoints;
  }

  if (createBodyExample !== undefined) {
    endpoints.push({
      method: "POST",
      path: `${basePath}/create`,
      summary: `Create ${entityName}`,
      requestBody: {
        contentType: "application/json",
        example: createBodyExample,
      },
      responses: [
        {
          status: 200,
          description: "Created entity",
          example: successEnvelope(entityExample),
        },
        {
          status: 400,
          description: "Validation error",
          example: errorEnvelope("name is required"),
        },
        {
          status: 500,
          description: "Server error",
          example: errorEnvelope("Failed to create"),
        },
      ],
    });
  }

  endpoints.push(
    {
      method: "PATCH",
      path: `${basePath}/update`,
      summary: `Update ${entityName}`,
      requestBody: {
        contentType: "application/json",
        example: patchBodyExample ?? { id: "uuid", name: "Updated name" },
      },
      responses: [
        {
          status: 200,
          description: "Updated entity",
          example: successEnvelope(entityExample),
        },
        {
          status: 400,
          description: "Invalid id or body",
          example: errorEnvelope("id is required"),
        },
        {
          status: 500,
          description: "Server error",
          example: errorEnvelope("Failed to update"),
        },
      ],
    },
    {
      method: "DELETE",
      path: `${basePath}/delete`,
      summary: `Delete ${entityName}`,
      queryParams: [{ name: "id", description: "Entity UUID", required: true }],
      responses: [
        {
          status: 200,
          description: "Deleted entity",
          example: successEnvelope(entityExample),
        },
        {
          status: 400,
          description: "Missing id",
          example: errorEnvelope("id is required"),
        },
        {
          status: 500,
          description: "Server error",
          example: errorEnvelope("Failed to delete"),
        },
      ],
    },
  );

  return endpoints;
};
