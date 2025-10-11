'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'fr' | 'en' | 'it' | 'es';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
  fr: {},
  en: {},
  it: {},
  es: {},
};

// Function to load translations dynamically
const loadTranslations = async (locale: Locale) => {
  try {
    const translation = await import(`@/locales/${locale}.json`);
    translations[locale] = translation.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale && ['fr', 'en', 'it', 'es'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    setIsLoaded(true);
  }, []);

  // Load translations when locale changes
  useEffect(() => {
    loadTranslations(locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to French if translation not found
        value = translations['fr'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found
          }
        }
        return value || key;
      }
    }

    return value || key;
  };

  if (!isLoaded) {
    return null; // Prevent hydration mismatch
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
