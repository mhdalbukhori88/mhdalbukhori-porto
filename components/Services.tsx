"use client";

import { Check, ArrowRight } from "lucide-react";
import { services } from "@/lib/content";
import { SectionHeading, FadeIn } from "./Section";

export default function Services() {
  return (
    <section id="services" className="section-pad section-glow">
      <div className="container-px">
        <SectionHeading
          eyebrow="Services"
          title="What I Can Do For You"
          description="From a single landing page to a complete fullstack platform, I deliver end-to-end."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={(i % 3) * 0.08}>
              <div className="card group flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/15 text-brand-300 transition-colors group-hover:bg-brand-600/25">
                  <s.icon size={24} />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                  {s.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <Check size={15} className="text-brand-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-600/15 to-brand-400/5 p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Need a website for your business or community?
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Tell me what you need and I&apos;ll get back to you with a plan.
              </p>
            </div>
            <a href="#order" className="btn-primary shrink-0">
              Order Now
              <ArrowRight size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
