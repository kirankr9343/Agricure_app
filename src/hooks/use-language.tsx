
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import all locale files
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import kn from '@/locales/kn.json';
import bn from '@/locales/bn.json';
import gu from '@/locales/gu.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';


type Translations = { [key: string]: any };

const locales: { [key: string]: Translations } = {
  en, hi, kn, bn, gu, ta, te
};

export const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi (हिंदी)' },
    { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
    { value: 'bn', label: 'Bengali (বাংলা)' },
    { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
    { value: 'ta', label: 'Tamil (தமிழ்)' },
    { value: 'te', label: 'Telugu (తెలుగు)' },
];


interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Translations;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  
  useEffect(() => {
    // This effect runs once on mount to set the initial language from localStorage or default to 'en'
    const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('userLanguage') : 'en';
    if (storedLanguage && locales[storedLanguage]) {
      setLanguageState(storedLanguage);
    } else {
      setLanguageState('en');
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (locales[lang]) {
      if (typeof window !== "undefined") {
        localStorage.setItem('userLanguage', lang);
      }
      setLanguageState(lang);
    } else {
        const fallbackLang = 'en';
        if (typeof window !== "undefined") {
          localStorage.setItem('userLanguage', fallbackLang);
        }
        setLanguageState(fallbackLang);
    }
  };

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    const translations = locales[language] || locales.en;
    const keyParts = key.split('.');
    let result: any = translations;
    
    for (const part of keyParts) {
        if (result && typeof result === 'object' && part in result) {
            result = result[part];
        } else {
            // Fallback to English if key not found in current language
            let fallbackResult: any = locales.en;
            for (const p of keyParts) {
                if (fallbackResult && typeof fallbackResult === 'object' && p in fallbackResult) {
                    fallbackResult = fallbackResult[p];
                } else {
                    return key; // Return the key itself if not found in English either
                }
            }
            result = fallbackResult;
            break;
        }
    }

    if (typeof result !== 'string') {
        return key;
    }

    // Replace placeholders
    if (options) {
        result = Object.entries(options).reduce((acc, [optKey, optValue]) => {
            return acc.replace(new RegExp(`{{${optKey}}}`, 'g'), String(optValue));
        }, result);
    }

    return result;
  }, [language]);
  
  const translations = locales[language] || locales.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook for using translations
export const useTranslation = () => {
    const { t } = useLanguage();
    return { t };
}
