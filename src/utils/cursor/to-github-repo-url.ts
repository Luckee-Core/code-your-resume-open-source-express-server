/**
 * Normalize a GitHub repo slug or URL to the full https URL expected by Cursor v1 API.
 *
 * @param repository - `owner/repo` slug or full GitHub URL
 * @returns Canonical GitHub repository URL
 */
export const toGithubRepoUrl = (repository: string): string => {
  const trimmed = repository.trim();
  if (trimmed.startsWith('https://github.com/')) {
    return trimmed.replace(/\/+$/, '');
  }
  if (trimmed.startsWith('github.com/')) {
    return `https://${trimmed.replace(/\/+$/, '')}`;
  }
  return `https://github.com/${trimmed.replace(/^\/+|\/+$/g, '')}`;
};
