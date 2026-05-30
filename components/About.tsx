"use client";

import Image from "next/image";
import { GraduationCap, Briefcase, MapPin, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { valueProps } from "@/lib/content";
import { SectionHeading, FadeIn } from "./Section";

export default function About() {
  return (
    <section id="about" className="section-pad section-glow">
      <div className="container-px">
        <SectionHeading
          eyebrow="About Me"
          title="Who I Am"
          description="A fullstack developer who turns ideas into reliable, well-built digital products."
        />

        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <FadeIn>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.3rem]">
                  <Image
                    src={siteConfig.profileImage}
                    alt={siteConfig.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 380px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-5 text-[15px] leading-relaxed text-white/70">
              <p>{siteConfig.about.summary}</p>
              <p>{siteConfig.about.extended}</p>
              <p>{siteConfig.about.closing}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard icon={GraduationCap} label="Education">
                Informatics Engineering, STMIK Kaputama Binjai
              </InfoCard>
              <InfoCard icon={Briefcase} label="Current Role">
                Freelance Web Developer & Data Analyst
              </InfoCard>
              <InfoCard icon={MapPin} label="Location">
                {siteConfig.location}
              </InfoCard>
              <InfoCard icon={Sparkles} label="Focus">
                Fullstack, Data & Digital Solutions
              </InfoCard>
            </div>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {valueProps.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div className="card h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-brand-300">
                  <v.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-white/60">{v.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof GraduationCap;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-brand-300">
        <Icon size={18} />
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-white/85">{children}</p>
    </div>
  );
}
