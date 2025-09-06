import { useEffect, useMemo, useState } from 'react';
import { getGitHubHeaders } from '../utils/github.js';

export default function useSearchUsers(query, page = 1, perPage = 30) {
  const q = (query || '').trim();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q) {
      setUsers([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const size = Math.max(1, Math.min(100, Number(perPage) || 30));
        const p = Math.max(1, Number(page) || 1);
        const res = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(q)}&page=${p}&per_page=${size}`, {
          signal: ctrl.signal,
          headers: getGitHubHeaders(),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        setUsers(items);
        setTotal(Number(data?.total_count) || 0);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to search users');
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [q, page, perPage]);

  const totalPages = useMemo(() => {
    const size = Math.max(1, Math.min(100, Number(perPage) || 30));
    return Math.max(1, Math.ceil((total || 0) / size));
  }, [total, perPage]);

  return { users, loading, error, total, totalPages };
}

