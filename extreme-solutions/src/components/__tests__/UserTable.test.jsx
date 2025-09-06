import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { favoritesReducer } from '../../store/Reducer/favoritesReducer';

import UserTable from '../UserTable.jsx';

function renderWithStore(ui, { preloadedState } = {}) {
  const store = configureStore({ reducer: { favorites: favoritesReducer }, preloadedState });
  const view = render(<Provider store={store}>{ui}</Provider>);
  return { store, ...view };
}

describe('UserTable', () => {
  afterEach(() => cleanup());

  const users = [
    { id: 1, login: 'octocat', avatar_url: 'a', html_url: 'https://github.com/octocat' },
  ];

  test('renders GitHub profile link', () => {
    renderWithStore(<UserTable users={users} />);
    // Tooltip adds aria-label, so accessible name is the tooltip title
    const link = screen.getByRole('link', { name: /open profile on github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/octocat');
  });

  test('toggles favorite on click and updates store', async () => {
    const { store } = renderWithStore(<UserTable users={users} />);

    // Initially should show "Favorite" button
    const favBtn = await screen.findByRole('button', { name: /favorite/i });
    fireEvent.click(favBtn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
      expect(screen.getByRole('button', { name: /unfavorite/i })).toBeInTheDocument();
    });

    // Toggle back
    fireEvent.click(screen.getByRole('button', { name: /unfavorite/i }));
    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items).toHaveLength(0);
      expect(screen.getByRole('button', { name: /favorite/i })).toBeInTheDocument();
    });
  });
});

