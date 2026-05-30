"use client";

import { skillCategories } from "@/lib/content";
import { SectionHeading, FadeIn } from "./Section";

export default function Skills() {
  return (
    <section id="skills" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="Skills"
          title="Tools & Technologies"
          description="A broad, practical skill set spanning development, data, and digital growth."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((cat, i) => (
            <FadeIn key={cat.title} delay={(i % 4) * 0.08}>
              <div className="card h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-brand-300">
                  <cat.icon size={22} />
                </div>
                <h3 className="font-display text-base font-semibold text-white">
                  {cat.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
