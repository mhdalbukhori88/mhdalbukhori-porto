"use client";

import { Mail, Phone, MapPin, Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import MitrivoxIcon from "./MitrivoxIcon";
import { siteConfig } from "@/lib/site-config";
import Reveal from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

export default function Contact() {
  const { language } = useLanguage();
  const tContact = translations[language].contact;

  const waLink = `https://wa.me/${siteConfig.contact.phoneRaw}?text=${encodeURIComponent(
    `Hi ${siteConfig.name}, I'd like to connect with you regarding a project for ${siteConfig.socials.softwareHouse.name}.`
  )}`;

  const items = [
    {
      icon: MitrivoxIcon,
      label: "Software House",
      value: siteConfig.socials.softwareHouse.name,
      subValue: siteConfig.socials.softwareHouse.handle,
      href: siteConfig.socials.softwareHouse.url,
      highlight: true,
    },
    { icon: Mail, label: "Email", value: siteConfig.contact.email, subValue: undefined, href: `mailto:${siteConfig.contact.email}` },
    { icon: Phone, label: "Phone / WhatsApp", value: siteConfig.contact.whatsappDisplay, subValue: undefined, href: waLink },
    { icon: MapPin, label: "Location", value: siteConfig.location, subValue: undefined, href: undefined },
    { icon: Github, label: "GitHub", value: "mhdalbukhori88", subValue: undefined, href: siteConfig.socials.github },
    { icon: Linkedin, label: "LinkedIn", value: "mhd-al-bukhori", subValue: undefined, href: siteConfig.socials.linkedin },
    { icon: Instagram, label: "Personal Instagram", value: siteConfig.socials.instagramHandle, subValue: undefined, href: siteConfig.socials.instagram },
  ];

  return (
    <section id="contact" className="section">
      <Reveal>
        <h1 className="section-title">{tContact.sectionTitle}</h1>
        <p className="-mt-6 mb-10 max-w-2xl text-base muted">
          {tContact.subTitle}
        </p>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const inner = (
            <div className={`flex h-full items-center gap-4 rounded-xl p-5 surface-card transition-all hover:border-accent ${
              item.highlight ? "border border-accent/40 bg-accent/5 shadow-md" : ""
            }`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <item.icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-mono text-xs muted">{item.label}</p>
                  {item.highlight && (
                    <span className="tag text-[0.65rem] !bg-accent !text-white font-semibold uppercase">
                      New
                    </span>
                  )}
                </div>
                <p className="truncate text-sm font-semibold">{item.value}</p>
                {item.subValue && (
                  <p className="truncate text-xs font-medium text-accent">{item.subValue}</p>
                )}
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
          <a href={siteConfig.socials.softwareHouse.url} target="_blank" rel="noreferrer" className="btn-accent !text-white hover:!text-white flex items-center gap-2">
            <Instagram size={18} /> {siteConfig.socials.softwareHouse.name} ({siteConfig.socials.softwareHouse.handle})
          </a>
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-accent !bg-emerald-600 hover:!bg-emerald-500 !text-white hover:!text-white flex items-center gap-2">
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="btn-outline flex items-center gap-2">
            <Mail size={18} /> Send an Email
          </a>
        </div>
      </Reveal>
    </section>
  );
}
