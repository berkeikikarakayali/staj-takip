import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard, CalendarView, Stats, Settings, LoginPage, RegisterPage, ForgotPasswordPage } from './pages';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { GuidePage } from './pages/Guide';
import { useStore } from './store/useStore';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LanguageProvider } from './contexts/LanguageContext';

function AppRoutes() {
  const theme = useStore(state => state.theme);
  const loadApplications = useStore(state => state.loadApplications);
  const clearApplications = useStore(state => state.clearApplications);
  const { session, user } = useAuth();

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'theme-light-blue', 'theme-dark-blue');
    if (theme && theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);

  // Load/clear data on auth state change
  useEffect(() => {
    if (user) {
      loadApplications(user.id);
    } else {
      clearApplications();
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={session ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="app/:id" element={<ApplicationDetail />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="guide" element={<GuidePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
