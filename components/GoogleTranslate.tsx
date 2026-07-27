"use client";

import { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "./LanguageProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  Language Switcher Component — Sleek & Premium 2-language toggle (EN / ID)
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
    <div className="relative inline-block text-left font-sans">
      {/* Clean & Premium Language Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-1.5 rounded-full bg-[var(--bg-alt)]/90 px-3 py-1.5 text-xs font-mono font-bold text-[var(--text)] border border-[var(--border)] hover:border-accent hover:shadow-md hover:shadow-accent/15 transition-all duration-200 active:scale-95"
        title="Change Website Language (English / Indonesia)"
      >
        <Globe size={13} className="text-accent group-hover:rotate-45 transition-transform duration-300" />
        <span className="flex items-center gap-1">
          <span>{selectedObj.flag}</span>
          <span className="tracking-wider">{selectedObj.code.toUpperCase()}</span>
        </span>
        <ChevronDown size={12} className={`text-[var(--text-muted)] transition-transform duration-200 ${open ? "rotate-180 text-accent" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-44 overflow-hidden rounded-2xl border border-accent/30 bg-[var(--bg)]/95 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl animate-[fadeInUp_0.2s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase text-[var(--text-muted)] tracking-widest border-b border-[var(--border)]/50 mb-1">
              Select Language
            </div>
            <div className="space-y-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code as Language)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                    language === lang.code
                      ? "bg-gradient-to-r from-accent to-indigo-600 text-white shadow-md shadow-accent/25"
                      : "text-[var(--text)] hover:bg-[var(--bg-alt)] hover:text-accent"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {language === lang.code && <Check size={14} className="stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
