"use client";

import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import MitrivoxIcon from "./MitrivoxIcon";
import AnimatedImageBackground from "./AnimatedImageBackground";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-[5%] py-14 text-center">
      {/* Animated Flowing Line Artwork Background */}
      <AnimatedImageBackground variant="footer" />

      {/* Footer Content */}
      <div className="relative z-10">
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
          © {new Date().getFullYear()} <strong>{siteConfig.name}</strong>. Hak Cipta Dilindungi Undang-Undang (All Rights Reserved).
        </p>
        <p className="mt-1.5 text-xs muted">
          Founder &amp; Full Stack Lead at{" "}
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
