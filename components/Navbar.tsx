"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Sun, Moon, Github, Linkedin, Instagram, Mail } from "lucide-react";
import MitrivoxIcon from "./MitrivoxIcon";
import { useTheme } from "./ThemeProvider";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  ["Expertise", "expertise"],
  ["History", "history"],
  ["Projects", "projects"],
  ["Resume", "resume"],
  ["Certificates", "certificates"],
  ["Order", "order"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 30;
      setScrolled(isScrolled);

      // Section scrollSpy for animated active indicator
      const sectionIds = navItems.map(([, id]) => id);
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        id="navigation"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg)]/85 backdrop-blur-md border-b border-[var(--border)] shadow-lg shadow-black/10"
            : "bg-[var(--bg)] border-b border-transparent"
        }`}
      >
        <nav className="flex h-16 items-center justify-between px-[5%] sm:px-[8%]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="sm:hidden nav-icon-animate p-1"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="nav-icon-animate flex items-center p-1 rounded-full hover:bg-[var(--bg-alt)] transition-all"
            >
              {theme === "dark" ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-slate-700" />}
            </button>
            <a
              href="#home"
              className="hidden items-center gap-2 sm:flex nav-logo-animate"
              onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
            >
              <Image src="/logo.svg" alt="MB logo" width={42} height={32} className="h-8 w-auto" priority />
            </a>
            <a
              href={siteConfig.socials.softwareHouse.url}
              target="_blank"
              rel="noreferrer"
              aria-label={siteConfig.socials.softwareHouse.name}
              title={`Software House: ${siteConfig.socials.softwareHouse.name}`}
              className="hidden sm:flex items-center text-[var(--text)] nav-icon-animate p-1"
            >
              <MitrivoxIcon size={22} />
            </a>
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            {navItems.map(([label, id]) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`nav-link-item rounded-lg px-3.5 py-1.5 text-[0.98rem] font-medium transition-all ${
                    isActive ? "active-nav font-semibold" : "text-[var(--text-muted)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
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
                  className="btn-accent w-full flex items-center justify-center gap-2"
                >
                  Download Resume
                </a>
                <div className="flex items-center justify-center gap-4 pt-1">
                  <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-white/80 hover:text-accent">
                    <Github size={20} />
                  </a>
                  <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-white/80 hover:text-accent">
                    <Linkedin size={20} />
                  </a>
                  <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/80 hover:text-accent">
                    <Instagram size={20} />
                  </a>
                  <a href={siteConfig.socials.softwareHouse.url} target="_blank" rel="noreferrer" aria-label={siteConfig.socials.softwareHouse.name} title={siteConfig.socials.softwareHouse.name} className="text-white/80 hover:text-accent">
                    <MitrivoxIcon size={20} />
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
