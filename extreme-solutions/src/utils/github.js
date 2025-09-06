export function getGitHubHeaders() {
  const headers = { Accept: 'application/vnd.github+json' };
  const token = import.meta?.env?.VITE_GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  headers['X-GitHub-Api-Version'] = '2022-11-28';
  headers['User-Agent'] = 'extreme-solutions-app';
  return headers;
}

