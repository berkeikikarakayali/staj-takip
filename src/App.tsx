import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard, CalendarView, Stats, Settings } from './pages';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { useStore } from './store/useStore';

function App() {
  const theme = useStore(state => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'theme-light-blue', 'theme-dark-blue');
    if (theme && theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="app/:id" element={<ApplicationDetail />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
