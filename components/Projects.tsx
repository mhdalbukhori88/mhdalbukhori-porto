"use client";

import { projects } from "@/lib/content";
import { SectionHeading, FadeIn } from "./Section";

export default function Projects() {
  return (
    <section id="projects" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="Projects"
          title="Featured Work"
          description="A selection of the kinds of solutions I build across web, data, and digital marketing."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <FadeIn key={p.title} delay={(i % 2) * 0.1}>
              <div className="card group h-full overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/15 text-brand-300 transition-transform group-hover:scale-110">
                    <p.icon size={24} />
                  </div>
                  <span className="chip border-brand-500/20 text-brand-200">{p.category}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <p className="mt-10 text-center text-sm text-white/50">
            Want to see more? Check out my{" "}
            <a
              href="https://github.com/mhdalbukhori88"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-300 underline-offset-4 hover:underline"
            >
              GitHub profile
            </a>{" "}
            for code and repositories.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
