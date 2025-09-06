import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action) {
      const list = Array.isArray(action.payload) ? action.payload : [];
      state.items = list;
    },
    addFavorite(state, action) {
      const user = action.payload;
      if (!user || !user.id) return;
      if (!state.items.find((u) => u.id === user.id)) {
        state.items.push({
          id: user.id,
          login: user.login,
          avatar_url: user.avatar_url,
          html_url: user.html_url,
        });
      }
    },
    removeFavorite(state, action) {
      const id = action.payload;
      state.items = state.items.filter((u) => u.id !== id);
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;

export const selectFavorites = (state) => state.favorites.items;
export const isFavoriteSelector = (id) => (state) => state.favorites.items.some((u) => u.id === id);

