"use client";

import { expertise } from "@/lib/content";
import Reveal from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

export default function Expertise() {
  const { language } = useLanguage();
  const tExp = translations[language].expertise;

  return (
    <section id="expertise" className="section">
      <Reveal>
        <h1 className="section-title">{tExp.sectionTitle}</h1>
        <p className="mb-10 text-sm muted max-w-xl">{tExp.subTitle}</p>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-3">
        {expertise.map((e, i) => (
          <Reveal key={e.title} delay={i * 120}>
            <div className="group h-full rounded-2xl p-7 surface-card">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                <e.icon size={32} strokeWidth={1.8} />
              </div>
              <h3 className="mt-6 font-sans text-xl font-bold transition-colors group-hover:text-accent">{e.title}</h3>
              <p className="mt-3 text-sm leading-relaxed muted">{e.description}</p>
              <div className="mt-6 leading-loose border-t border-[var(--border)] pt-4">
                <span className="mr-2 block mb-2 font-mono text-xs text-accent font-semibold">Tech Stack &amp; Tools:</span>
                <div className="flex flex-wrap gap-1.5">
                  {e.stack.map((label) => (
                    <span key={label} className="tag text-xs font-medium">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
