"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "id";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("preferred_lang") as Language | null;
      if (stored === "en" || stored === "id") {
        setLanguageState(stored);
        document.documentElement.lang = stored;
        return;
      }

      // Auto-detect browser language
      const userLang = navigator.language || (navigator as any).userLanguage || "";
      if (userLang.toLowerCase().startsWith("id")) {
        setLanguageState("id");
        document.documentElement.lang = "id";
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    const validLang: Language = lang === "id" ? "id" : "en";
    setLanguageState(validLang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("preferred_lang", validLang);
      document.documentElement.lang = validLang;
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  const t = (key: string) => key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
