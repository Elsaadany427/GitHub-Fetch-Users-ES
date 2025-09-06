import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import useFetchUsers from '../useFetchUsers';

function TestHarness({ perPage }) {
  const { users, loading, error } = useFetchUsers(perPage);
  return React.createElement(
    'div',
    null,
    React.createElement('div', { 'data-testid': 'loading' }, String(loading)),
    React.createElement('div', { 'data-testid': 'error' }, error || ''),
    React.createElement('div', { 'data-testid': 'count' }, String(users.length)),
  );
}

describe('useFetchUsers', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  test('loads users successfully', async () => {
    const mockUsers = [
      { id: 1, login: 'octocat', avatar_url: 'a', html_url: 'h' },
    ];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });

    render(React.createElement(TestHarness, { perPage: 5 }));

    // Initially loading true
    expect(screen.getByTestId('loading').textContent).toBe('true');

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('count').textContent).toBe('1');
      expect(screen.getByTestId('error').textContent).toBe('');
    });

    // Verify request URL contains per_page clamped properly
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = global.fetch.mock.calls[0][0];
    expect(String(url)).toMatch(/per_page=5/);
  });

  test('sets error on non-OK response', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });

    render(React.createElement(TestHarness, { perPage: 100 }));

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('error').textContent).toMatch('Request failed: 500');
    });
  });

  test('ignores AbortError', async () => {
    const abortErr = new Error('aborted');
    abortErr.name = 'AbortError';
    global.fetch.mockRejectedValue(abortErr);

    render(React.createElement(TestHarness, { perPage: 10 }));

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('error').textContent).toBe('');
      expect(screen.getByTestId('count').textContent).toBe('0');
    });
  });
});
