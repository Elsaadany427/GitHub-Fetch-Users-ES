import { useEffect } from 'react';
import { store } from '../store/store';
import { setFavorites } from '../store/Reducer/favoritesReducer';

const STORAGE_KEY = 'favorites';

export function useFavoritesStorageSync() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          store.dispatch(setFavorites(parsed));
        }
      }
    } catch (e) { void e; }

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const list = state.favorites?.items || [];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) { void e; }
    });

    return unsubscribe;
  }, []);
}
