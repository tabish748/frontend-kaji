import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from 'next/router';
import { generateDateTranslations } from "@/libs/utils";

type LanguageContextType = {
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
};

type LanguageProviderProps = {
  children: ReactNode;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const router = useRouter();
  const [language, setLanguage] = useState<string>("jp"); // Set to 'jp' by default
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Check if 'lang' query parameter exists
    const queryLang = router.query.lang as string;

    // If 'lang' query parameter exists and it's either 'en' or 'jp', use it
    if (queryLang && (queryLang === 'en' || queryLang === 'jp')) {
      setLanguage(queryLang);
    }
  }, [router.query.lang]);

  useEffect(() => {
    const currentYear = new Date().getFullYear() - 20;
    const dynamicTranslations = generateDateTranslations(2000, currentYear + 80); // Generate date translations from 2000 to 20 years in the future

    setLoading(true); // Set loading state to true before loading translations
    import(`./${language}.json`)
      .then((module) => {
        // Combine static translations with dynamically generated date translations
        setTranslations({ ...module.default, ...dynamicTranslations });
      })
      .catch((error) => {
        console.error('Failed to load language file:', error);
        // Fallback to empty translations if the import fails
        setTranslations(dynamicTranslations);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after translations are loaded or if there was an error
      });
  }, [language]);

  const t = (key: string) => translations[key] || key;

  const contextValue = {
    t,
    setLanguage,
  };
  if (loading) {
    return <div className="loading-screen"></div>; // Render a loading screen or spinner
  }
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
