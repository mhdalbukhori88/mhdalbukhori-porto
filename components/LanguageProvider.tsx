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
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem("preferred_lang")) as Language | null;
    if (stored === "en" || stored === "id") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("preferred_lang", lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  // Helper placeholder fallback
  const t = (key: string) => key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
