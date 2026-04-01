'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { en } from '@/lib/locales/en';
import { es } from '@/lib/locales/es';

type Locale = 'en' | 'es';

const translations = {
  en,
  es,
};

// Simple interpolation
const interpolate = (str: string, values: Record<string, any>) => {
  return str.replace(/{(\w+)}/g, (_, key) => values[key] || `{${key}}`);
};


interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof en, values?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  // Update html lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: keyof typeof en, values?: Record<string, any>) => {
    const translation = (translations[locale] as any)[key] || (translations['en'] as any)[key];
    if (values) {
        return interpolate(translation, values);
    }
    return translation;
  }, [locale]);

  const value = {
    locale,
    setLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
