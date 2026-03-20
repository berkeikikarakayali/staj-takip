import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { BriefcaseBusiness, Loader2, Globe } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError('Geçersiz e-posta veya şifre.'); // Keeping this minimal or we can add it to context later
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Language Selector Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent text-sm border-none focus:ring-0 text-muted-foreground hover:text-foreground cursor-pointer outline-none"
        >
          <option value="en">EN</option>
          <option value="tr">TR</option>
        </select>
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <BriefcaseBusiness className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">StajTakip</span>
        </div>

        <h1 className="text-2xl font-bold mb-1">{t.authLoginTitle}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t.authLoginDesc}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              {t.authEmail}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t.authEmailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="text-sm font-medium">
                {t.authPassword}
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                {t.authForgotPassword}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder={t.authPasswordPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? t.authLoggingIn : t.authLoginBtn}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.authNoAccount}{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            {t.authRegisterLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
