import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import useUsersCursor from '../useUsersCursor';

function CursorHarness({ perPage = 2 }) {
  const { users, loading, error, pageIndex, hasNext, hasPrev, next, prev, reset } = useUsersCursor(perPage);
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error || ''}</div>
      <div data-testid="count">{String(users.length)}</div>
      <div data-testid="page">{String(pageIndex)}</div>
      <div data-testid="hasNext">{String(hasNext)}</div>
      <div data-testid="hasPrev">{String(hasPrev)}</div>
      <button onClick={next}>next</button>
      <button onClick={prev}>prev</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

describe('useUsersCursor (server mode)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  test('loads first page and navigates next/prev', async () => {
    // First page (since=0) returns 2 users (perPage=2)
    const page1 = [
      { id: 10, login: 'u1' },
      { id: 20, login: 'u2' },
    ];
    // Second page (since=20) returns 1 user to mark end
    const page2 = [
      { id: 30, login: 'u3' },
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => page1 })
      .mockResolvedValueOnce({ ok: true, json: async () => page2 })
      .mockResolvedValueOnce({ ok: true, json: async () => page1 }); // when going back (since=0)

    render(<CursorHarness perPage={2} />);

    // First page loaded
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('page').textContent).toBe('1');
      expect(screen.getByTestId('count').textContent).toBe('2');
      expect(screen.getByTestId('hasNext').textContent).toBe('true');
      expect(screen.getByTestId('hasPrev').textContent).toBe('false');
    });

    // Next → loads page 2
    fireEvent.click(screen.getByText('next'));
    await waitFor(() => {
      expect(screen.getByTestId('page').textContent).toBe('2');
      expect(screen.getByTestId('count').textContent).toBe('1');
      expect(screen.getByTestId('hasNext').textContent).toBe('false');
      expect(screen.getByTestId('hasPrev').textContent).toBe('true');
    });

    // Prev → back to page 1
    fireEvent.click(screen.getByText('prev'));
    await waitFor(() => {
      expect(screen.getByTestId('page').textContent).toBe('1');
      expect(screen.getByTestId('count').textContent).toBe('2');
      expect(screen.getByTestId('hasNext').textContent).toBe('true');
      expect(screen.getByTestId('hasPrev').textContent).toBe('false');
    });
  });

  test('sets error on non-OK', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    render(<CursorHarness perPage={2} />);
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toMatch('Request failed: 500');
    });
  });
});

