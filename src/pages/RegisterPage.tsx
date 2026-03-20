import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { BriefcaseBusiness, Loader2, Globe } from 'lucide-react';

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !passwordConfirm) {
      setError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await signUp(email, password, fullName);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

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

        <h1 className="text-2xl font-bold mb-1">{t.authRegisterTitle}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t.authRegisterDesc}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">{t.authFullName}</label>
            <input id="fullName" type="text" placeholder={t.authFullNamePlaceholder} value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">{t.authEmail}</label>
            <input id="email" type="email" placeholder={t.authEmailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">{t.authPassword}</label>
              <input id="password" type="password" placeholder={t.authPasswordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1">{t.authPasswordConfirm}</label>
              <input id="passwordConfirm" type="password" placeholder={t.authPasswordPlaceholder} value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="university" className="block text-sm font-medium mb-1">{t.authUniversity} <span className="text-muted-foreground font-normal">{t.authOptional}</span></label>
            <input id="university" type="text" placeholder={t.authUniversityPlaceholder} value={university} onChange={e => setUniversity(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium mb-1">{t.authDepartment} <span className="text-muted-foreground font-normal">{t.authOptional}</span></label>
            <input id="department" type="text" placeholder={t.authDepartmentPlaceholder} value={department} onChange={e => setDepartment(e.target.value)} className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? t.authRegistering : t.authRegisterBtn}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.authHasAccount}{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">{t.authLoginLink}</Link>
        </p>
      </div>
    </div>
  );
}
