"use client";

import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
 *  GoogleTranslate Component — Embeds Google Translate API with custom
 *  styled language selector supporting 100+ languages worldwide for
 *  international remote job recruiters & clients.
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
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // 1. Define global init callback for Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,id,es,de,fr,ja,zh-CN,ar,ko,pt,nl,it,ru,ja,hi,tr,th,vi",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // 2. Dynamically load script if not already added
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setOpen(false);

    // Trigger Google Translate native select element
    const selectEl = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement | null;

    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    }
  };

  const selectedObj =
    LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      {/* Hidden element where Google embeds its native widget */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Custom Clean Language Selector Trigger Button */}
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
              Select Language / Google Translate
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
