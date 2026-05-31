"use client";

import { Mail, Phone, MapPin, Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import Reveal from "./Reveal";

export default function Contact() {
  const waLink = `https://wa.me/${siteConfig.contact.phoneRaw}?text=${encodeURIComponent(
    `Hi ${siteConfig.name}, I'd like to connect with you.`
  )}`;

  const items = [
    { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: Phone, label: "Phone / WhatsApp", value: siteConfig.contact.whatsappDisplay, href: waLink },
    { icon: MapPin, label: "Location", value: siteConfig.location, href: undefined },
    { icon: Github, label: "GitHub", value: "mhdalbukhori88", href: siteConfig.socials.github },
    { icon: Linkedin, label: "LinkedIn", value: "mhd-al-bukhori", href: siteConfig.socials.linkedin },
    { icon: Instagram, label: "Instagram", value: siteConfig.socials.instagramHandle, href: siteConfig.socials.instagram },
  ];

  return (
    <section id="contact" className="section">
      <Reveal>
        <h1 className="section-title">Contact Me</h1>
        <p className="-mt-6 mb-10 max-w-2xl text-base muted">
          Got a project waiting to be realized, or a role to fill? Let&apos;s connect and make it happen.
        </p>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const inner = (
            <div className="flex h-full items-center gap-4 rounded-lg p-5 surface-card transition-colors hover:border-accent">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <item.icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-xs muted">{item.label}</p>
                <p className="truncate text-sm font-semibold">{item.value}</p>
              </div>
            </div>
          );
          return (
            <Reveal key={item.label} delay={(i % 3) * 100}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="block h-full">{inner}</a>
              ) : (
                inner
              )}
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-accent !bg-emerald-600 hover:!bg-emerald-500">
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="btn-outline">
            <Mail size={18} /> Send an Email
          </a>
        </div>
      </Reveal>
    </section>
  );
}
