"use client";

import { projects } from "@/lib/content";
import Reveal from "./Reveal";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <h1 className="section-title">Projects</h1>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 120}>
            <div className="group overflow-hidden rounded-lg surface-card">
              {/* thumbnail block */}
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-accent/30 to-accent/5">
                <p.icon
                  size={56}
                  strokeWidth={1.5}
                  className="text-accent transition-transform duration-300 group-hover:scale-110"
                />
                <span className="absolute right-3 top-3 tag">{p.category}</span>
              </div>
              <div className="p-5">
                <h2 className="font-sans text-xl font-bold transition-colors group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed muted">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="tag">
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
