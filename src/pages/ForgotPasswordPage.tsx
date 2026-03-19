import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BriefcaseBusiness, Mail, Loader2, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Sıfırlama linki e-posta adresinize gönderildi. Lütfen spam kutunuzu da kontrol edin.');
    } catch (err: any) {
      setError('Hata oluştu. Lütfen e-posta adresinizin doğru olduğundan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto space-y-8 p-8 border border-border bg-card rounded-2xl shadow-sm">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-2xl inline-block">
              <BriefcaseBusiness className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Şifremi Unuttum</h2>
          <p className="text-muted-foreground mt-2 text-sm">Hesabınıza kayıtlı e-posta adresini girin, şifre sıfırlama linki gönderelim.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-md">
              {message}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
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
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
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
                Gönderiliyor...
              </>
            ) : (
              'Sıfırlama Linki Gönder'
            )}
          </button>
        </form>

        <div className="text-center text-sm">
          <Link to="/login" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
}
