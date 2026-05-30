"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const roles = [
  "Fullstack Web Developer",
  "Software Engineer",
  "Data Analyst",
  "Digital Marketer",
];

function useRotatingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return roles[index];
}

export default function Hero() {
  const role = useRotatingRole();

  return (
    <section id="home" className="relative overflow-hidden pt-28 sm:pt-36">
      {/* background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:42px_42px] opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[130px]" />
      <div className="pointer-events-none absolute -top-20 right-0 h-[380px] w-[380px] rounded-full bg-brand-400/10 blur-[120px]" />

      <div className="container-px relative grid items-center gap-12 pb-24 lg:grid-cols-[1.12fr_0.88fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-display text-lg font-medium text-white/60">
            Hi, I&apos;m{" "}
            <span className="font-semibold text-white">{siteConfig.name}</span>
          </p>

          {/* Prominent role headline */}
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="gradient-text">Fullstack</span> Web
            <br className="hidden sm:block" /> Developer
          </h1>

          {/* Animated rotating sub-role */}
          <div className="mt-4 flex h-8 items-center gap-2 text-base font-medium text-white/70 sm:text-lg">
            <Sparkles size={18} className="text-brand-400" />
            <span>Also working as</span>
            <motion.span
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-semibold text-brand-300"
            >
              {role}
            </motion.span>
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {siteConfig.tagline}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
            <MapPin size={16} className="text-brand-400" />
            {siteConfig.location}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#order" className="btn-primary">
              Order a Website
              <ArrowRight size={16} />
            </a>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <Download size={16} />
              Download CV
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <SocialIcon href={siteConfig.socials.github} label="GitHub">
              <Github size={18} />
            </SocialIcon>
            <SocialIcon href={siteConfig.socials.linkedin} label="LinkedIn">
              <Linkedin size={18} />
            </SocialIcon>
            <SocialIcon href={siteConfig.socials.instagram} label="Instagram">
              <Instagram size={18} />
            </SocialIcon>
            <SocialIcon href={`mailto:${siteConfig.contact.email}`} label="Email">
              <Mail size={18} />
            </SocialIcon>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[380px]"
        >
          {/* soft ambient backdrop (subtle, not neon) */}
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand-700/20 via-brand-500/10 to-transparent blur-3xl" />

          {/* clean framed portrait */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/50">
            <div className="relative aspect-[4/5]">
              <Image
                src={siteConfig.profileImage}
                alt={`${siteConfig.name} — ${siteConfig.role}`}
                fill
                priority
                quality={100}
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
              {/* gentle grounding gradient for the caption */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
              {/* subtle edge vignette to blend with the theme */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/20" />

              {/* name + role caption */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-lg font-bold text-white">
                  {siteConfig.name}
                </p>
                <p className="text-sm font-medium text-brand-300">{siteConfig.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="container-px relative -mt-2 pb-6"
      >
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-4 sm:gap-4">
          {siteConfig.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-lg font-bold text-white sm:text-xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-white/55">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-all hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-200"
    >
      {children}
    </a>
  );
}
