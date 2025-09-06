// src/App.jsx
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store/store';
import { useFavoritesStorageSync } from './hooks/useFavoritesStorageSync';
import { lightTheme, darkTheme } from './theme';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

function AppContent() {
  const [darkMode, setDarkMode] = React.useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) === true : false;
    } catch (_) {
      return false;
    }
  });
  useFavoritesStorageSync();

  const toggleDarkMode = () => setDarkMode((v) => !v);

  React.useEffect(() => {
    try { localStorage.setItem('darkMode', JSON.stringify(darkMode)); } catch (_) { }
    try { document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); } catch (_) { }
  }, [darkMode]);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
