import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Lang } from '../utils/translations';

interface LanguageContextType {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.style.fontFamily = lang === 'ar'
      ? '"Noto Kufi Arabic", "Inter", sans-serif'
      : '"Inter", "Noto Kufi Arabic", sans-serif';
  }, [lang, dir]);

  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
}
