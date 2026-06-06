/**
 * Cursor Cloud Agents API Client (v1)
 *
 * @see https://cursor.com/docs/cloud-agent/api/endpoints
 */

import { formatCursorApiError } from '../../utils/cursor/format-cursor-api-error';
import { toGithubRepoUrl } from '../../utils/cursor/to-github-repo-url';

export type RunStatus = 'CREATING' | 'RUNNING' | 'FINISHED' | 'ERROR' | 'CANCELLED' | 'EXPIRED';

export type LaunchAgentRequest = {
  prompt: {
    text: string;
    images?: Array<{
      data: string;
      dimension: { width: number; height: number };
    }>;
  };
  source: {
    repository: string;
    ref?: string;
  };
  target?: {
    autoCreatePr?: boolean;
    openAsCursorGithubApp?: boolean;
    skipReviewerRequest?: boolean;
    branchName?: string;
  };
  model?: string;
  webhook?: {
    url: string;
    secret?: string;
  };
};

/** Launched agent + initial run IDs returned from POST /v1/agents. */
export type Agent = {
  id: string;
  runId: string;
  summary?: string;
};

export type AgentRun = {
  id: string;
  agentId: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  durationMs?: number;
  result?: string;
};

type CreateAgentResponse = {
  agent: {
    id: string;
    latestRunId?: string;
  };
  run: {
    id: string;
    agentId: string;
    status: RunStatus;
  };
};

export class CursorApiClient {
  private baseUrl = 'https://api.cursor.com';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Cursor API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Build Basic Auth header value.
   */
  private getAuthHeader(): string {
    const encoded = Buffer.from(`${this.apiKey}:`).toString('base64');
    return `Basic ${encoded}`;
  }

  /**
   * Make an authenticated request to the Cursor API.
   */
  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: this.getAuthHeader(),
    };
    if (body) {
      headers['Content-Type'] = 'application/json';
    }
    const options: RequestInit = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const fallback = `Cursor API request failed with status ${response.status}`;
      let errorMessage = fallback;
      try {
        const errorData: unknown = await response.json();
        errorMessage = formatCursorApiError(errorData, fallback);
        console.error('❌ Cursor API error response:', JSON.stringify(errorData));
      } catch { /* ignore JSON parse errors */ }

      if (response.status === 429) throw new Error(`Rate limit exceeded: ${errorMessage}`);
      if (response.status === 401) throw new Error(`Authentication failed: ${errorMessage}`);
      if (response.status === 403) throw new Error(`Forbidden: ${errorMessage}`);
      if (response.status === 404) throw new Error(`Not found: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    if (response.status === 204) return {} as T;
    return response.json() as Promise<T>;
  }

  /**
   * Launch a new code generation agent via Cursor v1 API.
   *
   * @param request - Agent configuration including prompt, source repo, and target options
   * @returns Agent and run IDs for polling
   */
  async launchAgent(request: LaunchAgentRequest): Promise<Agent> {
    const repoUrl = toGithubRepoUrl(request.source.repository);
    const response = await this.request<CreateAgentResponse>('POST', '/v1/agents', {
      prompt: request.prompt,
      repos: [
        {
          url: repoUrl,
          startingRef: request.source.ref ?? 'main',
        },
      ],
      autoCreatePR: request.target?.autoCreatePr ?? false,
    });

    return {
      id: response.agent.id,
      runId: response.run.id,
    };
  }

  /**
   * Get run status and final result text.
   *
   * @param agentId - Durable agent ID
   * @param runId - Run ID from launchAgent
   * @returns Run details including status and result when terminal
   */
  async getRun(agentId: string, runId: string): Promise<AgentRun> {
    return this.request<AgentRun>('GET', `/v1/agents/${agentId}/runs/${runId}`);
  }
}
