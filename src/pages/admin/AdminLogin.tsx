import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { useLang } from '../../contexts/LanguageContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data } = await supabase
      .schema('public')
      .from('admin')
      .select('*')
      .eq('admin', username)
      .eq('password', password)
      .single();

    if (data) {
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError(t('admin.login_error'));
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface-container-low to-background" />
      <div className="orb w-[600px] h-[600px] bg-gold -top-40 -end-40" />
      <div className="orb w-[400px] h-[400px] bg-primary -bottom-32 -start-32" />
      <div className="orb w-[200px] h-[200px] bg-gold/50 top-1/2 start-1/4 animate-float" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #1B2A4A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Decorative lines */}
      <div className="absolute top-20 start-10 w-32 h-px bg-gradient-to-r from-gold/30 to-transparent" />
      <div className="absolute bottom-20 end-10 w-32 h-px bg-gradient-to-l from-gold/30 to-transparent" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-2xl shadow-primary/30 animate-glow-pulse-gold">
              <span className="text-gold text-3xl font-black">ق</span>
            </div>
            {/* Gold corner accents */}
            <div className="absolute -top-1 -start-1 w-3 h-3 border-t-2 border-s-2 border-gold/40 rounded-tl-lg" />
            <div className="absolute -top-1 -end-1 w-3 h-3 border-t-2 border-e-2 border-gold/40 rounded-tr-lg" />
            <div className="absolute -bottom-1 -start-1 w-3 h-3 border-b-2 border-s-2 border-gold/40 rounded-bl-lg" />
            <div className="absolute -bottom-1 -end-1 w-3 h-3 border-b-2 border-e-2 border-gold/40 rounded-br-lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-primary">
            {lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1.5 tracking-widest uppercase font-medium">
            {lang === 'ar' ? 'El Rasam Palace' : 'قصر الرسام'}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-[1px] w-8 bg-gold-gradient rounded-full" />
            <span className="text-[10px] text-gold-dark font-bold uppercase tracking-[0.2em]">
              {lang === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
            </span>
            <div className="h-[1px] w-8 bg-gold-gradient rounded-full" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-primary/5 border border-outline-variant/15 gradient-border">
          <h1 className="text-2xl font-bold mb-2 text-primary">{t('admin.login_title')}</h1>
          <p className="text-sm text-on-surface-variant mb-8">{t('admin.subtitle')}</p>

          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.username')}</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px] group-focus-within:text-gold transition-colors duration-200">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low ps-10 pe-4 py-3.5 focus:border-gold focus:ring-gold/30 text-sm transition-all hover:border-outline-variant/40"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.password')}</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px] group-focus-within:text-gold transition-colors duration-200">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low ps-10 pe-12 py-3.5 focus:border-gold focus:ring-gold/30 text-sm transition-all hover:border-outline-variant/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-primary-dim transition-all duration-300 shadow-xl shadow-primary/15 hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  {t('admin.login_btn')}
                </>
              )}
            </button>
          </form>

          {/* Decorative bottom */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-outline-variant/10">
            <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            <span className="text-[10px] text-on-surface-variant/50 font-medium tracking-wider uppercase">
              {lang === 'ar' ? 'محمي بالتشفير' : 'Secure Access'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          </div>
        </div>
      </div>
    </main>
  );
}
