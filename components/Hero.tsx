"use client";

import Image from "next/image";
import { Github, Linkedin, Instagram, Mail, Building2, Download, Rocket } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section id="home" className="hero-bg flex min-h-[720px] items-center px-[8%] pt-20 sm:px-[15%]">
      <div className="flex w-full flex-col items-center gap-8 py-16 sm:flex-row sm:items-center sm:gap-10 sm:py-0">
        <div className="shrink-0">
          <div className="rounded-full bg-gradient-to-br from-accent to-accent-light p-[3px] shadow-2xl">
            <div className="overflow-hidden rounded-full border-4 border-[var(--bg)]">
              <Image
                src={siteConfig.profileImage}
                alt={siteConfig.name}
                width={170}
                height={170}
                priority
                quality={100}
                className="h-[150px] w-[150px] object-cover sm:h-[170px] sm:w-[170px]"
              />
            </div>
          </div>
        </div>

        <div className="text-center sm:text-left">
          {/* Animated Open to Remote Work Status Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span>Open to Remote Work • Full Stack Developer</span>
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Social href={siteConfig.socials.github} title="GitHub"><Github size={26} /></Social>
            <Social href={siteConfig.socials.linkedin} title="LinkedIn"><Linkedin size={26} /></Social>
            <Social href={siteConfig.socials.instagram} title="Personal Instagram"><Instagram size={26} /></Social>
            <Social href={siteConfig.socials.softwareHouse.url} title={`Software House: ${siteConfig.socials.softwareHouse.name}`}>
              <span className="flex items-center gap-1.5 text-accent font-semibold text-xs rounded-full bg-accent/15 px-3 py-1 border border-accent/40 hover:bg-accent/25 transition-colors">
                <Building2 size={16} /> {siteConfig.socials.softwareHouse.handle}
              </span>
            </Social>
            <Social href={`mailto:${siteConfig.contact.email}`} title="Email"><Mail size={26} /></Social>
          </div>

          <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Hello, I&apos;m
          </p>
          <h1 className="font-sans text-4xl font-black leading-none tracking-tight sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-2.5 text-xl font-light muted sm:text-3xl">{siteConfig.role}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed muted">
            {siteConfig.tagline} Founder &amp; Full Stack Lead at{" "}
            <a
              href={siteConfig.socials.softwareHouse.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent hover:underline"
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
              <Rocket size={18} /> Start a Project / Software House
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
