import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../services/translations';
import { SplashLoadingModal } from '../components/common/SplashLoadingModal';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isKhmer: boolean;
  t: (key: string, replacements?: Record<string, string | number>, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('ciis_language');
      return (stored === 'km' || stored === 'en') ? stored : 'km';
    } catch {
      return 'km';
    }
  });

  const [isSplashOpen, setIsSplashOpen] = useState<boolean>(false);
  const [splashTargetLang, setSplashTargetLang] = useState<Language>(language);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;

    setSplashTargetLang(lang);
    setIsSplashOpen(true);

    // Update DOM & localStorage
    try {
      localStorage.setItem('ciis_language', lang);
      document.documentElement.lang = lang;
      if (lang === 'km') {
        document.documentElement.classList.add('lang-km');
      } else {
        document.documentElement.classList.remove('lang-km');
      }
    } catch (e) {
      console.error(e);
    }

    setLanguageState(lang);

    // Keep splash open for 2.2 seconds to give rich, modern, clean feedback
    setTimeout(() => {
      setIsSplashOpen(false);
    }, 2200);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'km' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'km') {
      document.documentElement.classList.add('lang-km');
    } else {
      document.documentElement.classList.remove('lang-km');
    }
  }, [language]);

  const t = (key: string, replacements?: Record<string, string | number>, defaultText?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = langDict[key] || TRANSLATIONS.en[key] || defaultText || key;

    if (replacements) {
      Object.entries(replacements).forEach(([rKey, rVal]) => {
        text = text.replace(new RegExp(`\\{${rKey}\\}`, 'g'), String(rVal));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isKhmer: language === 'km',
        t,
      }}
    >
      {children}

      {/* Language Switching Splash Loading Modal */}
      <SplashLoadingModal
        isOpen={isSplashOpen}
        type="language"
        title={
          splashTargetLang === 'km'
            ? 'កំពុងផ្លាស់ប្តូរទៅភាសាខ្មែរ...'
            : 'Switching to English Language...'
        }
        subtitle={
          splashTargetLang === 'km'
            ? 'ប្រព័ន្ធកំពុងដំណើរការផ្លាស់ប្តូរភាសា និងរៀបចំចំណុចប្រទាក់ (System is working...)'
            : 'Please wait a moment, updating system language and components (System is working...)'
        }
      />
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
