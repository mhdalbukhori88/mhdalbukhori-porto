"use client";

import { Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";
import { timeline } from "@/lib/content";
import Reveal from "./Reveal";

export default function Timeline() {
  return (
    <section id="history" className="section">
      <Reveal>
        <h1 className="section-title">Career & Education History</h1>
        <p className="-mt-6 mb-12 max-w-2xl text-base muted">
          A track record of professional roles in software development, inventory operations, production, and academic achievements.
        </p>
      </Reveal>

      <div className="relative mx-auto max-w-4xl">
        {/* vertical line */}
        <div className="tl-line absolute left-4 top-2 h-full w-[2px] sm:left-1/2 sm:-translate-x-1/2" />

        <div className="space-y-12">
          {timeline.map((item, i) => {
            const isEdu = item.type === "Education";
            return (
              <Reveal key={`${item.title}-${i}`} delay={i * 80}>
                <div
                  className={`relative flex items-start gap-6 sm:w-1/2 ${
                    i % 2 === 0
                      ? "sm:ml-auto sm:flex-row sm:pl-10"
                      : "sm:mr-auto sm:flex-row-reverse sm:pr-10 sm:text-left"
                  }`}
                >
                  {/* node icon */}
                  <span
                    className={`absolute z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg left-0 sm:left-auto ${
                      i % 2 === 0 ? "sm:-left-[20px]" : "sm:-right-[20px]"
                    }`}
                    style={{ top: 0 }}
                  >
                    {isEdu ? <GraduationCap size={18} /> : <Briefcase size={18} />}
                  </span>

                  <div className="ml-14 rounded-xl p-6 surface-card sm:ml-0 sm:w-full transition-all hover:border-accent/40 hover:shadow-xl">
                    <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                      <span className="font-mono text-xs font-medium text-accent">
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

