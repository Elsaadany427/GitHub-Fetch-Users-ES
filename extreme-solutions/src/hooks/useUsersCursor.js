import { useCallback, useEffect, useRef, useState } from 'react';
import { getGitHubHeaders } from '../utils/github.js';

export default function useUsersCursor(perPage = 30) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1); // 1-based page index for UI
  const sinceStackRef = useRef([0]); // stack of since cursors; first page = 0


  const fetchPage = useCallback(async (since) => {
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    try {
      const size = Math.max(1, Math.min(100, Number(perPage) || 30));
      const res = await fetch(`https://api.github.com/users?per_page=${size}&since=${since}`, {
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
    return () => ctrl.abort();
  }, [perPage]);

  // initial load and when perPage changes
  useEffect(() => {
    sinceStackRef.current = [0];
    setPageIndex(1);
    let cleanup;
    (async () => { cleanup = await fetchPage(0); })();
    return () => { if (typeof cleanup === 'function') cleanup(); };
  }, [perPage, fetchPage]);

  const hasNext = users.length >= Math.max(1, Math.min(100, Number(perPage) || 30));

  const next = useCallback(() => {
    if (!users || users.length === 0) return;
    const lastId = users[users.length - 1]?.id;
    if (!lastId) return;
    sinceStackRef.current = [...sinceStackRef.current, lastId];
    setPageIndex((p) => p + 1);
    fetchPage(lastId);
  }, [users, fetchPage]);

  const prev = useCallback(() => {
    if (sinceStackRef.current.length <= 1) return;
    // pop the current since
    const stack = [...sinceStackRef.current];
    stack.pop();
    const prevSince = stack[stack.length - 1] ?? 0;
    sinceStackRef.current = stack;
    setPageIndex((p) => Math.max(1, p - 1));
    fetchPage(prevSince);
  }, [fetchPage]);

  const reset = useCallback(() => {
    sinceStackRef.current = [0];
    setPageIndex(1);
    fetchPage(0);
  }, [fetchPage]);

  return {
    mode: 'cursor',
    users,
    loading,
    error,
    pageIndex,
    hasPrev: sinceStackRef.current.length > 1,
    hasNext,
    next,
    prev,
    reset,
  };
}
