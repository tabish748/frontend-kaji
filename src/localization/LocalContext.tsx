import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { generateDateTranslations } from "@/libs/utils";

type LanguageContextType = {
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
  currentLanguage: string;
};

type LanguageProviderProps = {
  children: ReactNode;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Supported languages
const supportedLanguages = ["en", "jp"];

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const router = useRouter();
  const [language, setLanguageState] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("preferredLanguage", lang);

    // Only update URL if the language is actually different
    const currentQueryLang = router.query.lang as string;
    if (currentQueryLang !== lang) {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, lang },
      },
      undefined,
      { shallow: true }
    );
    }
  };

  useEffect(() => {
    if (!loading) {
      if (language) {
        document.documentElement.lang = language;
      }
    }
  }, [language, loading]);

  useEffect(() => {
    if (!router.isReady) return;

    const queryLang = router.query.lang as string;
    const storedLang = localStorage.getItem("preferredLanguage");
    const browserLang = navigator.language?.slice(0, 2); // e.g. "en-US" → "en"

    let selectedLang = "en"; // default

    if (queryLang && ["en", "jp"].includes(queryLang)) {
      selectedLang = queryLang;
    } else if (storedLang && ["en", "jp"].includes(storedLang)) {
      selectedLang = storedLang;
    } else if (["en", "jp"].includes(browserLang)) {
      selectedLang = browserLang;
    }

    // Only update URL if lang parameter is missing or different
    if (!queryLang || queryLang !== selectedLang) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, lang: selectedLang },
        },
        undefined,
        { shallow: true }
      );
    }

    // Set the language state
    setLanguageState(selectedLang);
    localStorage.setItem("preferredLanguage", selectedLang);
  }, [router.isReady, router]);

  useEffect(() => {
    if (!language) return; // Guard clause to prevent importing when language is null
    
    const currentYear = new Date().getFullYear() - 20;
    const dynamicTranslations = generateDateTranslations(
      2000,
      currentYear + 80
    );

    setLoading(true);
    import(`./${language}.json`)
      .then((module) => {
        setTranslations({ ...module.default, ...dynamicTranslations });
      })
      .catch((error) => {
        console.error("Failed to load language file:", error);
        setTranslations(dynamicTranslations);
      })
      .finally(() => setLoading(false));
  }, [language]);

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return value;
  };

  const contextValue = {
    t,
    setLanguage,
    currentLanguage: language || "en", // fallback so it's never null
  };

  if (loading) {
    return <div className="loading-screen"></div>;
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
