"use client";

import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import GoldenTechIcon from "./GoldenTechIcon";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="px-[5%] py-12 text-center">
      <div className="mb-4 flex flex-wrap justify-center items-center gap-5">
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
          <GoldenTechIcon size={22} />
        </a>
        <a href={`mailto:${siteConfig.contact.email}`} className="transition-colors hover:text-accent" aria-label="Email">
          <Mail size={22} />
        </a>
      </div>
      <p className="text-sm muted">
        © {new Date().getFullYear()} {siteConfig.name} — Founder of{" "}
        <a
          href={siteConfig.socials.softwareHouse.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-accent hover:underline"
        >
          {siteConfig.socials.softwareHouse.name}
        </a>
        .
      </p>
      <p className="mt-1 text-xs muted">
        Full Stack Development, UI/UX Design, Cloud Systems &amp; Data Analytics.
      </p>
    </footer>
  );
}
