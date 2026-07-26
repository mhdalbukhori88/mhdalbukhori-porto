"use client";

import { Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";
import { timeline } from "@/lib/content";
import Reveal from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

export default function Timeline() {
  const { language } = useLanguage();
  const tHist = translations[language].history;

  return (
    <section id="history" className="section">
      <Reveal>
        <h1 className="section-title">{tHist.sectionTitle}</h1>
        <p className="-mt-6 mb-12 max-w-2xl text-base muted">
          {tHist.subTitle}
        </p>
      </Reveal>

      <div className="relative mx-auto max-w-4xl">
        {/* Central Vertical Line for md+ screens, left line for mobile */}
        <div className="tl-line absolute left-5 top-2 h-full w-[2px] md:left-1/2 md:-translate-x-1/2" />

        <div className="space-y-10 md:space-y-12">
          {timeline.map((item, i) => {
            const isEdu = item.type === "Education";
            const isEven = i % 2 === 0;

            return (
              <Reveal key={`${item.title}-${i}`} delay={i * 80}>
                <div className="relative flex flex-col md:flex-row items-center">
                  {/* Node icon badge - perfectly centered on line without overlapping card content */}
                  <span
                    className="absolute left-0 top-1.5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg md:left-1/2 md:-translate-x-1/2"
                  >
                    {isEdu ? <GraduationCap size={18} /> : <Briefcase size={18} />}
                  </span>

                  {/* Card Container */}
                  <div
                    className={`w-full pl-14 md:pl-0 md:w-1/2 ${
                      isEven
                        ? "md:mr-auto md:pr-10"
                        : "md:ml-auto md:pl-10"
                    }`}
                  >
                    <div className="rounded-xl p-6 surface-card transition-all hover:border-accent/40 hover:shadow-xl">
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                        <span className="font-mono text-xs font-semibold text-accent">
                          {item.date}
                        </span>
                        {item.type && (
                          <span className="tag text-[0.7rem] uppercase tracking-wider">
                            {item.type}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 font-sans text-xl font-bold tracking-tight">
                        {item.title}
                      </h3>
                      <h4 className="mt-1 text-sm font-semibold text-accent/90">
                        {item.place}
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed muted">{item.description}</p>

                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="mt-4 space-y-2 border-t border-[var(--border)] pt-3 text-sm muted">
                          {item.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" />
                              <span className="leading-snug">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}


