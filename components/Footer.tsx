"use client";

import Image from "next/image";
import { Github, Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="container-px py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-ink-900">
                <Image src="/logo.svg" alt="MAB logo" width={28} height={28} className="h-7 w-7" />
              </span>
              <span className="font-display text-base font-semibold text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-white/55">
              {siteConfig.role} — proficient in Java, Python, JavaScript, TypeScript, PHP, and SQL.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FooterIcon href={siteConfig.socials.github} label="GitHub">
              <Github size={18} />
            </FooterIcon>
            <FooterIcon href={siteConfig.socials.linkedin} label="LinkedIn">
              <Linkedin size={18} />
            </FooterIcon>
            <FooterIcon href={siteConfig.socials.instagram} label="Instagram">
              <Instagram size={18} />
            </FooterIcon>
            <FooterIcon href={`mailto:${siteConfig.contact.email}`} label="Email">
              <Mail size={18} />
            </FooterIcon>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href="#home"
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-brand-300"
          >
            Back to top
            <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterIcon({
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
