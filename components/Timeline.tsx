"use client";

import { Briefcase } from "lucide-react";
import { timeline } from "@/lib/content";
import Reveal from "./Reveal";

export default function Timeline() {
  return (
    <section id="history" className="section">
      <Reveal>
        <h1 className="section-title">Career History</h1>
      </Reveal>

      <div className="relative mx-auto max-w-3xl">
        {/* vertical line */}
        <div className="tl-line absolute left-4 top-2 h-full w-[2px] sm:left-1/2 sm:-translate-x-1/2" />

        <div className="space-y-10">
          {timeline.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div
                className={`relative flex items-start gap-6 sm:w-1/2 ${
                  i % 2 === 0
                    ? "sm:ml-auto sm:flex-row sm:pl-10"
                    : "sm:mr-auto sm:flex-row-reverse sm:pr-10 sm:text-right"
                }`}
              >
                {/* node */}
                <span
                  className={`absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-lg left-0 sm:left-auto ${
                    i % 2 === 0 ? "sm:-left-[18px]" : "sm:-right-[18px]"
                  }`}
                  style={{ top: 0 }}
                >
                  <Briefcase size={16} />
                </span>

                <div className="ml-14 rounded-lg p-5 surface-card sm:ml-0 sm:w-full">
                  <span className="font-mono text-xs muted">{item.date}</span>
                  <h3 className="mt-1 font-sans text-lg font-bold">{item.title}</h3>
                  <h4 className="text-sm font-semibold text-accent">{item.place}</h4>
                  <p className="mt-2 text-sm leading-relaxed muted">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
