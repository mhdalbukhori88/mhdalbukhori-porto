"use client";

import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="px-[5%] py-12 text-center">
      <div className="mb-4 flex justify-center gap-5">
        <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="GitHub">
          <Github size={22} />
        </a>
        <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="LinkedIn">
          <Linkedin size={22} />
        </a>
        <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label="Instagram">
          <Instagram size={22} />
        </a>
        <a href={`mailto:${siteConfig.contact.email}`} className="transition-colors hover:text-accent" aria-label="Email">
          <Mail size={22} />
        </a>
      </div>
      <p className="text-sm muted">
        © {new Date().getFullYear()} {siteConfig.name} — {siteConfig.role}.
      </p>
      <p className="mt-1 text-xs muted">
        Proficient in Java, Python, JavaScript, TypeScript, PHP &amp; SQL.
      </p>
    </footer>
  );
}
