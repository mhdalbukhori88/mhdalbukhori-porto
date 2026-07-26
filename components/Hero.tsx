"use client";

import Image from "next/image";
import { Github, Linkedin, Instagram, Mail, Download, Rocket } from "lucide-react";
import MitrivoxIcon from "@/components/MitrivoxIcon";
import HeroWaveBackground from "@/components/HeroWaveBackground";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section id="home" className="hero-bg relative flex min-h-[720px] items-center px-[8%] pt-20 sm:px-[12%]">
      {/* Interactive Animated Wave Background Canvas */}
      <HeroWaveBackground />

      {/* Main Content (z-10 to stay strictly above animated background) */}
      <div className="relative z-10 flex w-full flex-col items-center gap-10 py-16 sm:flex-row sm:items-center sm:gap-12 sm:py-0">
        {/* Profile Avatar — Clean & Professional */}
        <div className="shrink-0">
          <div className="rounded-full bg-gradient-to-br from-accent to-accent-light p-[3px] shadow-xl">
            <div className="overflow-hidden rounded-full border-4 border-[var(--bg)]">
              <Image
                src={siteConfig.profileImage}
                alt={siteConfig.name}
                width={180}
                height={180}
                priority
                quality={100}
                className="h-[160px] w-[160px] object-cover sm:h-[180px] sm:w-[180px]"
              />
            </div>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Social href={siteConfig.socials.github} title="GitHub"><Github size={26} /></Social>
            <Social href={siteConfig.socials.linkedin} title="LinkedIn"><Linkedin size={26} /></Social>
            <Social href={siteConfig.socials.instagram} title="Personal Instagram"><Instagram size={26} /></Social>
            <Social href={siteConfig.socials.softwareHouse.url} title={`Software House: ${siteConfig.socials.softwareHouse.name} (${siteConfig.socials.softwareHouse.handle})`}>
              <MitrivoxIcon size={26} />
            </Social>
            <Social href={`mailto:${siteConfig.contact.email}`} title="Email"><Mail size={26} /></Social>
          </div>

          <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            Hello, I&apos;m
          </p>
          <h1 className="font-sans text-4xl font-black leading-none tracking-tight sm:text-6xl bg-gradient-to-r from-[var(--text)] via-[var(--text)] to-accent/90 bg-clip-text">
            {siteConfig.name}
          </h1>
          <p className="mt-2.5 text-xl font-light muted sm:text-3xl font-sans">{siteConfig.role}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed muted">
            {siteConfig.tagline} Founder &amp; Full Stack Lead at{" "}
            <a
              href={siteConfig.socials.softwareHouse.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent hover:underline inline-flex items-center gap-1"
            >
              {siteConfig.socials.softwareHouse.name}
            </a>
            .
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3.5 sm:justify-start">
            <a
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-accent flex items-center gap-2"
            >
              <Rocket size={18} /> Start a Project
            </a>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-outline flex items-center gap-2"
            >
              <Download size={18} /> Download Resume
            </a>
          </div>

          {/* Quick Highlight Metrics Pills */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-mono text-muted">
            <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-alt)]/60 px-3 py-1.5 border border-[var(--border)]">
              <span className="h-2 w-2 rounded-full bg-accent" /> 250+ Delivered Projects
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-alt)]/60 px-3 py-1.5 border border-[var(--border)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Software House Founder
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-alt)]/60 px-3 py-1.5 border border-[var(--border)]">
              <span className="h-2 w-2 rounded-full bg-slate-400" /> Full Stack &amp; Mobile
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Social({ href, title, children }: { href: string; title?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      className="transition-colors hover:text-accent"
    >
      {children}
    </a>
  );
}
