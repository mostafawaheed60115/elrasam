import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLang } from '../hooks/useLang';

export default function NavBar() {
  const { lang, toggleLang, t } = useLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : '/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/15 shadow-[0_1px_20px_rgba(27,42,74,0.04)]">
        <div className="h-[2px] w-full bg-gold-gradient" />

        <nav aria-label="Primary navigation" className="flex justify-between items-center h-20 lg:h-24 px-4 sm:px-6 lg:px-10 w-full max-w-[1440px] mx-auto">
          <Link
            to="/"
            className="flex items-center group"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchTerm('');
            }}
          >
            <img
              src="/logo.jpg"
              alt={lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'}
              width="180"
              height="90"
              fetchPriority="high"
              className="h-16 lg:h-20 w-auto object-contain group-hover:scale-[1.03] drop-shadow-[0_4px_15px_rgba(212,175,55,0.2)] transition-transform duration-300"
            />
          </Link>

          {!isAdmin && (
            <div className="hidden md:flex items-center">
              <Link
                to="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchTerm('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === '/'
                    ? 'bg-primary/5 text-primary'
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                }`}
              >
                {t('nav.home')}
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {!isAdmin && (
              <form
                onSubmit={submitSearch}
                role="search"
                className={`hidden lg:flex items-center bg-surface-container rounded-full border transition-all duration-300 ${
                  searchFocused ? 'border-gold/50 w-72 shadow-lg shadow-gold/5' : 'border-transparent w-56'
                }`}
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] ms-3">search</span>
                <input
                  aria-label={t('nav.search')}
                  className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-on-surface-variant/50 w-full py-2 px-2"
                  placeholder={t('nav.search')}
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </form>
            )}

            <button
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              className="relative h-9 px-1 rounded-full bg-surface-container border border-outline-variant/20 flex items-center gap-0.5 hover:border-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all duration-300"
            >
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${lang === 'en' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}>
                EN
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${lang === 'ar' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}>
                ع
              </span>
            </button>

            {!isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={t('nav.admin')}
                className="hidden sm:flex p-2.5 hover:bg-surface-container rounded-xl text-on-surface-variant hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </Link>
            )}

            {!isAdmin && (
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden p-2 hover:bg-surface-container rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            )}
          </div>
        </nav>
      </header>

      {mobileMenuOpen && !isAdmin && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 w-full bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div id="mobile-navigation" className="absolute top-[82px] inset-x-0 bg-background/95 backdrop-blur-xl border-b border-outline-variant/20 p-5 animate-fade-in-up shadow-2xl">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchTerm('');
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-gold">home</span>
                {t('nav.home')}
              </Link>
              <form onSubmit={submitSearch} className="flex items-center gap-3 px-4 py-3">
                <span className="material-symbols-outlined text-gold text-[20px]">search</span>
                <input
                  aria-label={t('nav.search')}
                  className="bg-surface-container border-none focus:ring-2 focus:ring-gold/30 rounded-lg text-sm placeholder:text-on-surface-variant/50 w-full py-2 px-3"
                  placeholder={t('nav.search')}
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </form>
              <Link
                to="/admin"
                className="flex sm:hidden items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-gold">admin_panel_settings</span>
                {t('nav.admin')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
