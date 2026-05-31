"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Sun, Moon, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  ["Expertise", "expertise"],
  ["History", "history"],
  ["Projects", "projects"],
  ["Certificates", "certificates"],
  ["Order", "order"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        id="navigation"
        className="fixed inset-x-0 top-0 z-50 transition-shadow"
        style={{
          backgroundColor: "var(--bg)",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <nav className="flex h-16 items-center justify-between px-[5%] sm:px-[8%]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="sm:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <button onClick={toggle} aria-label="Toggle theme" className="flex items-center">
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <a href="#home" className="hidden items-center gap-2 sm:flex" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>
              <Image src="/logo.svg" alt="MB logo" width={42} height={32} className="h-8 w-auto" priority />
            </a>
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            {navItems.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="rounded px-3 py-2 text-[1.05rem] font-normal transition-colors hover:text-accent"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          {/* dimmed backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* sliding panel with hero background */}
          <div className="drawer-bg absolute left-0 top-0 flex h-full w-[78%] max-w-xs flex-col shadow-2xl animate-[fadeInUp_0.3s_ease]">
            {/* dark overlay so text stays readable on top of the image */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-night/80 to-black/90" />

            <div className="relative flex h-full flex-col p-6 text-white">
              {/* header: logo + close */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <Image src="/logo.svg" alt="MB logo" width={48} height={36} className="h-9 w-auto" />
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* menu items */}
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map(([label, id], i) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="group flex items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-semibold text-white/90 transition-all hover:bg-white/10 hover:pl-5"
                  >
                    <span className="h-5 w-1 rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                    {label}
                  </button>
                ))}
              </nav>

              {/* footer actions */}
              <div className="mt-auto space-y-3 border-t border-white/15 pt-5">
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="btn-accent w-full"
                >
                  Download CV
                </a>
                <div className="flex items-center justify-center gap-5 pt-1">
                  <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-white/80 hover:text-accent">
                    <Github size={20} />
                  </a>
                  <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-white/80 hover:text-accent">
                    <Linkedin size={20} />
                  </a>
                  <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/80 hover:text-accent">
                    <Instagram size={20} />
                  </a>
                  <a href={`mailto:${siteConfig.contact.email}`} aria-label="Email" className="text-white/80 hover:text-accent">
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
