import { useEffect, useState } from 'react';
import {
  getLanguage as getStoredLanguage,
  setLanguage as persistLanguage,
} from '../data/database';
import type { Language } from '../i18n';
import { logError } from '../logger';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    let isMounted = true;
    getStoredLanguage()
      .then((storedLanguage) => {
        if (isMounted) {
          setLanguageState(storedLanguage);
        }
      })
      .catch((error) => {
        logError('Failed to load stored language, using default', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguageState(next);
    persistLanguage(next).catch((error) => {
      logError('Failed to persist language change', error);
    });
  };

  return { language, changeLanguage };
}
