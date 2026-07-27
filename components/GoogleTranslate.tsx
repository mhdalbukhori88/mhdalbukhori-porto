"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage, Language } from "./LanguageProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  Language Switcher Component — Fast, 100% reliable 2-language toggle (EN / ID)
 *  Updates site content instantly in 0ms without external script errors.
 * ────────────────────────────────────────────────────────────────────────── */

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
];

export default function GoogleTranslate() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const changeLanguage = (langCode: Language) => {
    setLanguage(langCode);
    setOpen(false);
  };

  const selectedObj =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      {/* Clean Language Selector Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full bg-[var(--bg-alt)]/80 px-2.5 py-1 text-xs font-mono font-semibold text-[var(--text)] border border-[var(--border)] hover:border-accent hover:text-accent transition-all"
        title="Change Website Language (English / Indonesia)"
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
          <div className="absolute right-0 mt-2 z-50 w-40 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/95 p-1.5 shadow-2xl backdrop-blur-2xl animate-[fadeInUp_0.2s_ease]">
            <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] tracking-wider">
              Select Language
            </div>
            <div className="space-y-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code as Language)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                    language === lang.code
                      ? "bg-accent text-white font-semibold"
                      : "text-[var(--text)] hover:bg-[var(--bg-alt)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {language === lang.code && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
