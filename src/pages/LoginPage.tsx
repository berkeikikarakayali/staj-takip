import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BriefcaseBusiness, Mail, Lock, Loader2 } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

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
      setError('Geçersiz e-posta veya şifre.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Left Form Section */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="bg-primary/10 p-2 rounded-xl">
                <BriefcaseBusiness className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl">StajTakip</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Hoş Geldiniz</h2>
            <p className="text-muted-foreground mt-2">Hesabınıza giriş yaparak staj başvurularınızı yönetmeye devam edin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="ornek@posta.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Şifre
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Şifrenizi mi unuttunuz?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Hesabınız yok mu? </span>
            <Link to="/register" className="text-primary font-medium hover:underline">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>

      {/* Right Decorative Section */}
      <div className="hidden lg:flex w-1/2 p-4">
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-12 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm mb-6 shadow-xl">
              <BriefcaseBusiness className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
              StajTakip
            </h1>
            
            <p className="text-xl text-white/90 max-w-md font-medium px-4">
              Staj başvurularını tek yerden takip et, mülakatlarını kaçırma ve kariyerini inşa et.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
