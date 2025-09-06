import { favoritesReducer, addFavorite, removeFavorite, setFavorites } from '../favoritesReducer';

describe('favoritesReducer', () => {
  test('setFavorites replaces items', () => {
    const initial = { items: [{ id: 1 }] };
    const next = favoritesReducer(initial, setFavorites([{ id: 2 }, { id: 3 }]));
    expect(next.items.map((u) => u.id)).toEqual([2, 3]);
  });

  test('addFavorite adds unique users only', () => {
    const initial = { items: [] };
    const user = { id: 1, login: 'u', avatar_url: 'a', html_url: 'h' };
    let state = favoritesReducer(initial, addFavorite(user));
    state = favoritesReducer(state, addFavorite(user)); // duplicate
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(1);
  });

  test('removeFavorite removes by id', () => {
    const initial = { items: [{ id: 1 }, { id: 2 }] };
    const next = favoritesReducer(initial, removeFavorite(1));
    expect(next.items.map((u) => u.id)).toEqual([2]);
  });
});
