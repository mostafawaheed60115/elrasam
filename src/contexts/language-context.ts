import { createContext } from 'react';

export interface LanguageContextValue {
  lang: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  toggleLang: () => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
