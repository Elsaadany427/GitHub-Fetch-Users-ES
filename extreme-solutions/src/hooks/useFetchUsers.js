import { useEffect, useState } from 'react';
import { getGitHubHeaders } from '../utils/github.js';

export default function useFetchUsers(perPage = 100) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const size = Math.max(1, Math.min(100, Number(perPage) || 100));
        const res = await fetch(`https://api.github.com/users?per_page=${size}`, {
          signal: ctrl.signal,
          headers: getGitHubHeaders(),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ctrl.abort();
  }, [perPage]);

  return { users, loading, error };
}
