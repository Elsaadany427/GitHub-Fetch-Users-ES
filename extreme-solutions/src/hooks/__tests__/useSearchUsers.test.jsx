import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import useSearchUsers from '../useSearchUsers';

function Harness({ query = '', page = 1, perPage = 10 }) {
  const { users, loading, error, total, totalPages } = useSearchUsers(query, page, perPage);
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error || ''}</div>
      <div data-testid="count">{String(users.length)}</div>
      <div data-testid="total">{String(total)}</div>
      <div data-testid="pages">{String(totalPages)}</div>
    </div>
  );
}

describe('useSearchUsers (server mode)', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  test('does nothing when query is empty', async () => {
    render(<Harness query="" page={1} perPage={10} />);
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('fetches search results and computes total pages', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        total_count: 42,
        items: [{ id: 1, login: 'a' }, { id: 2, login: 'b' }],
      }),
    });

    render(<Harness query="octocat" page={2} perPage={10} />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('count').textContent).toBe('2');
      expect(screen.getByTestId('total').textContent).toBe('42');
      expect(screen.getByTestId('pages').textContent).toBe('5');
    });

    const url = String(global.fetch.mock.calls[0][0]);
    expect(url).toMatch(/search\/users/);
    expect(url).toMatch(/q=octocat/);
    expect(url).toMatch(/page=2/);
    expect(url).toMatch(/per_page=10/);
  });

  test('handles non-OK response', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
    render(<Harness query="octocat" page={1} perPage={10} />);
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toMatch('Request failed: 403');
    });
  });
});

