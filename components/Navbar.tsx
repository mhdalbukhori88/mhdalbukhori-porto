"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Sun, Moon, List } from "lucide-react";
import { useTheme } from "./ThemeProvider";

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
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-60 bg-white p-4 text-night shadow-xl">
            <p className="mb-3 flex items-center justify-center gap-2 font-bold text-night">
              <List size={18} /> Menu
            </p>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-night"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
            <div className="mt-4 border-t border-black/10 pt-2">
              {navItems.map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="block w-full py-3 text-center text-night transition-colors hover:text-accent"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
