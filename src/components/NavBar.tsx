import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';

export default function NavBar() {
  const { lang, toggleLang, t } = useLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/15 shadow-[0_1px_20px_rgba(27,42,74,0.04)]">
        {/* Gold accent line at very top */}
        <div className="h-[2px] w-full bg-gold-gradient" />

        <nav className="flex justify-between items-center h-28 md:h-40 px-5 md:px-12 w-full max-w-[1440px] mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
            <img 
              src="/logo.jpg" 
              alt={lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'} 
              className="h-24 md:h-36 w-auto object-contain scale-100 group-hover:scale-105 group-hover:-translate-y-1 drop-shadow-[0_4px_15px_rgba(212,175,55,0.2)] group-hover:drop-shadow-[0_12px_30px_rgba(212,175,55,0.6)] group-hover:brightness-110 transition-all duration-500"
            />
          </Link>

          {/* Desktop Nav Links */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${location.pathname === '/'
                    ? 'bg-primary/5 text-primary'
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                  }`}
              >
                {t('nav.home')}
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search bar (desktop) */}
            {!isAdmin && (
              <div className={`hidden lg:flex items-center bg-surface-container rounded-full border transition-all duration-300 ${searchFocused ? 'border-gold/50 w-72 shadow-lg shadow-gold/5' : 'border-transparent w-56'}`}>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] ms-3">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-on-surface-variant/50 w-full py-2 px-2"
                  placeholder={t('nav.search')}
                  type="text"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="relative h-9 px-1 rounded-full bg-surface-container border border-outline-variant/20 flex items-center gap-0.5 hover:border-gold/30 transition-all duration-300 group"
              title="Switch Language"
            >
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${lang === 'en' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}>
                EN
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${lang === 'ar' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}>
                عر
              </span>
            </button>

            {/* Admin link */}
            {!isAdmin && (
              <Link
                to="/admin"
                className="p-2.5 hover:bg-surface-container transition-colors duration-200 rounded-xl text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            {!isAdmin && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-surface-container rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && !isAdmin && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-[114px] inset-x-0 bg-background/95 backdrop-blur-xl border-b border-outline-variant/20 p-6 animate-fade-in-up shadow-2xl">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-gold">home</span>
                {t('nav.home')}
              </Link>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="material-symbols-outlined text-gold text-[20px]">search</span>
                <input
                  className="bg-surface-container border-none focus:ring-0 rounded-lg text-sm placeholder:text-on-surface-variant/50 w-full py-2 px-3"
                  placeholder={t('nav.search')}
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
