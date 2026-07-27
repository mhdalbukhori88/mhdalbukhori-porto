"use client";

import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage, Language } from "./LanguageProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  GoogleTranslate Component — Fully integrated custom dropdown connected
 *  directly to Google Translate API & React i18n for 100% reliable
 *  full-page translation across all languages (ID, ES, DE, FR, JP, CN, AR, KR, etc.)
 * ────────────────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", name: "中文 (简体)", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function GoogleTranslate() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("en");

  useEffect(() => {
    // Read existing googtrans cookie or localStorage on initial load
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("preferred_lang");
      const cookies = document.cookie.split(";");
      const match = cookies.find((c) => c.trim().startsWith("googtrans="));

      if (match) {
        const val = match.split("=")[1];
        const code = val.split("/").pop();
        if (code) {
          setCurrentLang(code);
          if (code === "en" || code === "id") {
            setLanguage(code as Language);
          }
        }
      } else if (stored) {
        setCurrentLang(stored);
        if (stored === "en" || stored === "id") {
          setLanguage(stored as Language);
        }
      }
    }

    // 1. Define global init callback for Google Translate API
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,id,es,de,fr,ja,zh-CN,ar,ko,pt,nl,it,ru,hi,tr,th,vi",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // 2. Dynamically load Google Translate script if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setOpen(false);

    if (typeof window !== "undefined") {
      const domain = window.location.hostname;

      // 1. Delete previous googtrans cookie
      document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      document.cookie = `googtrans=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      document.cookie = `googtrans=; path=/; domain=.${domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

      // 2. Set new googtrans cookie if not English
      if (langCode !== "en") {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=${domain}; path=/;`;
      }

      // 3. Save preferred_lang to localStorage
      window.localStorage.setItem("preferred_lang", langCode);

      // 4. Update React Context state if 'id' or 'en'
      if (langCode === "id" || langCode === "en") {
        setLanguage(langCode as Language);
      }

      // 5. Trigger native Google Translate select box if initialized
      const selectEl = document.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement | null;

      if (selectEl) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event("change"));
      }

      // 6. Reload page cleanly so Google Translate transforms all DOM nodes seamlessly
      setTimeout(() => {
        window.location.reload();
      }, 150);
    }
  };

  const selectedObj =
    LANGUAGES.find((l) => l.code === currentLang) ||
    LANGUAGES.find((l) => l.code === language) ||
    LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      {/* 
        Visually hidden container for Google Translate widget.
        Using absolute + opacity-0 instead of display:none so Google JS mounts .goog-te-combo correctly.
      */}
      <div
        id="google_translate_element"
        className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      {/* Clean Custom Language Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full bg-[var(--bg-alt)]/80 px-2.5 py-1 text-xs font-mono font-semibold text-[var(--text)] border border-[var(--border)] hover:border-accent hover:text-accent transition-all"
        title="Change Website Language (Google Translate)"
      >
        <Globe size={13} className="text-accent" />
        <span>{selectedObj.flag} {selectedObj.code.toUpperCase()}</span>
      </button>

      {/* Dropdown Menu for Languages */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-44 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/95 p-1.5 shadow-2xl backdrop-blur-2xl animate-[fadeInUp_0.2s_ease]">
            <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] tracking-wider">
              Select Language
            </div>
            <div className="max-h-56 overflow-y-auto space-y-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                    currentLang === lang.code
                      ? "bg-accent text-white font-semibold"
                      : "text-[var(--text)] hover:bg-[var(--bg-alt)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {currentLang === lang.code && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
