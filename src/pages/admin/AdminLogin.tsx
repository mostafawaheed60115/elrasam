import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { useLang } from '../../contexts/LanguageContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #1B2A4A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 mb-5">
            <span className="text-gold text-2xl font-black">ق</span>
          </div>
          <h2 className="text-xl font-extrabold text-primary">
            {lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1 tracking-widest uppercase font-medium">
            {lang === 'ar' ? 'El Rasam Palace' : 'قصر الرسام'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-primary/5 border border-outline-variant/15 gradient-border">
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
              <div className="relative">
                <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low ps-10 pe-4 py-3 focus:border-gold focus:ring-gold/30 text-sm transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">{t('admin.password')}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-outline-variant/20 bg-surface-container-low ps-10 pe-4 py-3 focus:border-gold focus:ring-gold/30 text-sm transition-all"
                  required
                />
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
        </div>
      </div>
    </main>
  );
}
