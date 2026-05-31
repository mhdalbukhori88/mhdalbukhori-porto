"use client";

import { expertise } from "@/lib/content";
import Reveal from "./Reveal";

export default function Expertise() {
  return (
    <section id="expertise" className="section">
      <Reveal>
        <h1 className="section-title">Expertise</h1>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-3">
        {expertise.map((e, i) => (
          <Reveal key={e.title} delay={i * 120}>
            <div>
              <e.icon size={48} className="text-accent" strokeWidth={1.5} />
              <h3 className="mt-5 font-sans text-xl font-bold">{e.title}</h3>
              <p className="mt-3 text-base leading-relaxed muted">{e.description}</p>
              <div className="mt-5 leading-loose">
                <span className="mr-2 font-mono text-sm muted">Tech stack:</span>
                {e.stack.map((label) => (
                  <span key={label} className="tag mb-1 mr-1.5">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
