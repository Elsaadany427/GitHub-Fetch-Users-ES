// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { favoritesReducer } from './Reducer/favoritesReducer';

export const store = configureStore({
    reducer: {
        favorites: favoritesReducer,
    },
    devTools: true,
});


