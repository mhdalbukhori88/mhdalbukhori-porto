"use client";

import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import MitrivoxIcon from "./MitrivoxIcon";
import ImageWaveCanvas from "./ImageWaveCanvas";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const { language } = useLanguage();
  const tFoot = translations[language].footer;

  return (
    <footer className="relative overflow-hidden px-[5%] py-14 text-center">
      {/* Animated Original Line Artwork Background */}
      <ImageWaveCanvas variant="footer" />

      {/* Footer Content Card with Frosted Backdrop for Perfect Contrast */}
      <div className="relative z-10 mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--bg)]/85 p-6 backdrop-blur-md shadow-xl sm:p-8">
        <div className="mb-5 flex flex-wrap justify-center items-center gap-5">
          <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="GitHub">
            <Github size={22} />
          </a>
          <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="LinkedIn">
            <Linkedin size={22} />
          </a>
          <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="Personal Instagram">
            <Instagram size={22} />
          </a>
          <a
            href={siteConfig.socials.softwareHouse.url}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
            aria-label={siteConfig.socials.softwareHouse.name}
            title={`Software House: ${siteConfig.socials.softwareHouse.name} (${siteConfig.socials.softwareHouse.handle})`}
          >
            <MitrivoxIcon size={22} />
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="transition-colors hover:text-accent" aria-label="Email">
            <Mail size={22} />
          </a>
        </div>
        <p className="text-sm font-medium muted">
          © {new Date().getFullYear()} <strong>{siteConfig.name}</strong>. {tFoot.rights}
        </p>
        <p className="mt-1.5 text-xs muted">
          {tFoot.role}{" "}
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
      </div>
    </footer>
  );
}
