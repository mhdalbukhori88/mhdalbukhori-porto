"use client";

import Image from "next/image";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section id="home" className="hero-bg flex min-h-[700px] items-center px-[8%] pt-16 sm:px-[15%]">
      <div className="flex w-full flex-col items-center gap-8 py-20 sm:flex-row sm:items-center sm:gap-10 sm:py-0">
        <div className="shrink-0">
          <div className="overflow-hidden rounded-full border-4 border-white/20 shadow-2xl">
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

        <div className="text-center sm:text-left">
          <div className="mb-3 flex justify-center gap-4 sm:justify-start">
            <Social href={siteConfig.socials.github}><Github size={26} /></Social>
            <Social href={siteConfig.socials.linkedin}><Linkedin size={26} /></Social>
            <Social href={siteConfig.socials.instagram}><Instagram size={26} /></Social>
            <Social href={`mailto:${siteConfig.contact.email}`}><Mail size={26} /></Social>
          </div>

          <h1 className="font-sans text-5xl font-black leading-none tracking-tight sm:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="mt-3 text-2xl font-light muted sm:text-3xl">{siteConfig.role}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed muted">
            {siteConfig.tagline}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
            <a
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-accent"
            >
              Order a Website
            </a>
            <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline">
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Social({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="transition-colors hover:text-accent"
    >
      {children}
    </a>
  );
}
