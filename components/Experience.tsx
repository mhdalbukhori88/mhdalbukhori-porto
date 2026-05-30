"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import { experiences, education } from "@/lib/content";
import { SectionHeading, FadeIn } from "./Section";

export default function Experience() {
  return (
    <section id="experience" className="section-pad section-glow">
      <div className="container-px">
        <SectionHeading
          eyebrow="Journey"
          title="Experience & Education"
          description="A path built on hands-on operational discipline and a passion for technology."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-2 text-brand-300">
              <Briefcase size={20} />
              <h3 className="font-display text-lg font-semibold text-white">Experience</h3>
            </div>
            <div className="relative space-y-6 border-l border-white/10 pl-6">
              {experiences.map((exp, i) => (
                <FadeIn key={exp.role} delay={i * 0.08}>
                  <TimelineItem
                    title={exp.role}
                    subtitle={exp.org}
                    period={exp.period}
                    current={exp.current}
                  >
                    {exp.description}
                  </TimelineItem>
                </FadeIn>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-2 text-brand-300">
              <GraduationCap size={20} />
              <h3 className="font-display text-lg font-semibold text-white">Education</h3>
            </div>
            <div className="relative space-y-6 border-l border-white/10 pl-6">
              {education.map((edu, i) => (
                <FadeIn key={edu.school} delay={i * 0.08}>
                  <TimelineItem
                    title={edu.degree}
                    subtitle={edu.school}
                    period={edu.period}
                    current
                  >
                    {edu.description}
                  </TimelineItem>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  title,
  subtitle,
  period,
  current,
  children,
}: {
  title: string;
  subtitle: string;
  period: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span
        className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 ${
          current
            ? "border-brand-400 bg-brand-500"
            : "border-white/30 bg-ink-900"
        }`}
      />
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-display text-base font-semibold text-white">{title}</h4>
        {current && (
          <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            Current
          </span>
        )}
      </div>
      <p className="mt-0.5 text-sm font-medium text-brand-300">{subtitle}</p>
      <p className="text-xs text-white/40">{period}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{children}</p>
    </div>
  );
}
