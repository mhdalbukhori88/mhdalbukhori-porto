"use client";

import { projects } from "@/lib/content";
import Reveal from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

export default function Projects() {
  const { language } = useLanguage();
  const tProj = translations[language].projects;

  return (
    <section id="projects" className="section">
      <Reveal>
        <h1 className="section-title">{tProj.sectionTitle}</h1>
        <p className="-mt-6 mb-10 text-sm muted max-w-xl">{tProj.subTitle}</p>
      </Reveal>

      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 120}>
            <div className="group overflow-hidden rounded-2xl surface-card h-full flex flex-col justify-between">
              <div>
                {/* thumbnail block */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-accent/25 via-accent/10 to-transparent">
                  <p.icon
                    size={64}
                    strokeWidth={1.5}
                    className="text-accent transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:text-accent-light"
                  />
                  <span className="absolute right-3.5 top-3.5 tag font-semibold text-xs border border-white/20 shadow-md">
                    {p.category}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="font-sans text-xl font-bold transition-colors group-hover:text-accent">
                    {p.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed muted">{p.description}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <div className="flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-4">
                  {p.tech.map((t) => (
                    <span key={t} className="tag text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-10 text-center text-sm muted">
          More code and repositories on{" "}
          <a
            href="https://github.com/mhdalbukhori88"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            my GitHub
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
