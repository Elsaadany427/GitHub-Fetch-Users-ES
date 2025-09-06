# GitHub Users – Extreme Solutions

A React + Vite app that lists GitHub users with pagination, debounced search, favorites (Redux + persisted), routing (Home/Favorites), dark mode, and unit tests (Jest + Testing Library).

The Home page supports two data modes (selectable from the UI):
- Client mode: fetch once (50/75/100 users), search inside the fetched data, then paginate the filtered results (First/Prev/Next/Last).
- Server mode: page through GitHub data via the API
  - Browse: `/users?per_page=&since=` cursor paging (First/Prev/Next)
  - Search: `/search/users?q=&page=&per_page=` (First/Prev/Next/Last)

## Setup Instructions

- Requirements: Node 18+ and npm
- Install dependencies: `npm install`
- Run the dev server: `npm run dev` (http://localhost:5173)
- Lint code: `npm run lint`
- Run tests: `npm test` or `npm run test:watch`

Optional: create `.env` with a token to increase GitHub API limits:

```
VITE_GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Technical Design Rationale

- Data strategies
  - Client mode: satisfies “search inside the already fetched paginated data.” Fetch once (50/75/100), filter in-memory by `login`, then paginate the filtered results. Full First/Prev/Next/Last controls.
  - Server mode: supports very large datasets using GitHub paging.
    - Browse: `/users?per_page&since` (cursor) → First/Prev/Next (no true Last).
    - Search: `/search/users?q&page&per_page` → numeric pages with total → First/Prev/Next/Last.
- UI/UX
  - MUI DataGrid for accessible, consistent tables; custom cell renderers for GitHub link and favorite toggle.
  - Debounced input (SearchBar) + `useDeferredValue` + `startTransition` for responsive typing.
  - Dark mode persisted in `localStorage` and mirrored to `data-theme`.
- State & persistence
  - Redux Toolkit slice for favorites (simple, serializable), with a small `useFavoritesStorageSync` hook for localStorage.
- Testing approach
  - Jest + Babel for ESM, jsdom environment.
  - Mocks for CSS and MUI DataGrid keep tests fast and deterministic.

## Code Review Notes

- Strengths
  - Clear separation of concerns: hooks for data/persistence, components for UI, Redux for favorites state.
  - Debounced search and deferring keep UX snappy.
  - Favorites reuse the same table UI for consistency across pages.
  - Unit tests cover utils, hooks (success/error/abort), reducer, and UI interactions.
- Trade‑offs
  - Client mode is intentionally limited to the fetched slice; use Server mode for complete results at scale.
  - Cursor browse cannot offer a true “Last” page (API limitation).
- Improvements
  - Add MSW for API mocking in tests/local dev.
  - Consider React Query for caching/refetch strategies.
  - Add search + pagination to Favorites for full parity with Home.

## Features Overview

- Fetch & display: GitHub public API with optional auth header.
- Data modes (Home): Client (local) and Server (API paging) selectable.
- Pagination controls: Client (First/Prev/Next/Last), Server browse (First/Prev/Next), Server search (First/Prev/Next/Last).
- Search: Debounced, client filters in-memory; server queries Search API.
- Favorites: add/remove, global Redux store, persists to `localStorage`.
- Routing: Home (`/`) and Favorites (`/favorites`).
- UI: MUI components with DataGrid.
- Dark mode: toggle and persistence.

## Directory Guide

- Pages
  - `src/pages/Home.jsx` — mode selector (Client/Server), search + pagination.
  - `src/pages/Favorites.jsx` — saved users with the same table UI.
- Components
  - `src/components/UserTable.jsx` — MUI DataGrid with GitHub link and favorite toggle.
  - `src/components/SearchBar.jsx` — debounced search input.
  - `src/components/Pagination.jsx` — numeric pagination control.
  - `src/components/CursorPager.jsx` — First/Prev/Next controls for cursor paging.
  - `src/components/Layout/Navbar.jsx` — navigation, dark mode toggle, favorites badge.
- Hooks
  - `src/hooks/useFetchUsers.js` — fetch once (Client mode).
  - `src/hooks/useUsersCursor.js` — server cursor paging for `/users`.
  - `src/hooks/useSearchUsers.js` — server page-number search for `/search/users`.
  - `src/hooks/useFavoritesStorageSync.jsx` — persist favorites to `localStorage`.
- Store
  - `src/store/store.jsx` — Redux store setup.
  - `src/store/Reducer/favoritesReducer.js` — favorites slice.
- Utils
  - `src/utils/github.js` — GitHub headers (Accept, API version, optional token).
  - `src/utils/debounce.js` — debounce helper.

## Testing

- Run: `npm test` or `npm run test:watch`.
- Config: `jest.config.mjs`, `babel.config.cjs`, `jest.setup.cjs`.
- Mocks: `test/styleMock.cjs` (CSS), `test/mocks/mui-x-data-grid.cjs` (DataGrid).
- Suites:
  - `src/utils/__tests__/debounce.test.js`
  - `src/hooks/__tests__/useFetchUsers.test.js`
  - `src/hooks/__tests__/useSearchUsers.test.js`
  - `src/hooks/__tests__/useUsersCursor.test.js`
  - `src/store/Reducer/__tests__/favoritesReducer.test.js`
  - `src/components/__tests__/UserTable.test.js`
