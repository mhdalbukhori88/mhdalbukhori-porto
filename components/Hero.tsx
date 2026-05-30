"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download, MapPin, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const roles = ["Fullstack Web Developer", "Software Engineer", "Data Analyst", "Digital Marketer"];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 sm:pt-36">
      {/* background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:42px_42px] opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />

      <div className="container-px relative grid items-center gap-12 pb-20 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="chip mb-5 gap-2 border-brand-500/30 bg-brand-500/10 text-brand-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {siteConfig.availability}
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hi, I&apos;m{" "}
            <span className="gradient-text">{siteConfig.name}</span>
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((r) => (
              <span key={r} className="chip border-brand-500/20 text-brand-100">
                {r}
              </span>
            ))}
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
            <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute inset-0 -z-10 animate-float rounded-[2rem] bg-gradient-to-tr from-brand-600/40 to-brand-300/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 shadow-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src={siteConfig.profileImage}
                alt={siteConfig.name}
                fill
                priority
                sizes="(max-width: 768px) 80vw, 400px"
                className="object-cover"
              />
            </div>
          </div>

          {/* floating badge */}
          <div className="absolute -bottom-5 -left-5 glass rounded-2xl px-4 py-3 shadow-xl">
            <p className="font-display text-2xl font-bold text-white">STMIK</p>
            <p className="text-xs text-white/60">Kaputama Binjai</p>
          </div>
          <div className="absolute -right-4 top-6 glass rounded-2xl px-4 py-3 shadow-xl">
            <p className="font-display text-lg font-bold gradient-text">Fullstack</p>
            <p className="text-xs text-white/60">Front + Back End</p>
          </div>
        </motion.div>
      </div>
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
