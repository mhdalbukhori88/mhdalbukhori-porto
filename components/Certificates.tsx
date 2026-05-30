"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, ExternalLink, FileText, X, Download } from "lucide-react";
import { certificates } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading, FadeIn } from "./Section";

export default function Certificates() {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <section id="certificates" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="Certificates"
          title="Credentials & Achievements"
          description="Verified certificates that back up my skills and continuous learning."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <FadeIn key={cert.title} delay={i * 0.08}>
              <div className="card group flex h-full flex-col">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-ink-900">
                  {cert.type === "image" && cert.image ? (
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 360px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-300">
                      <FileText size={40} />
                      <span className="text-xs font-medium text-white/50">PDF Document</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-brand-300">
                  <Award size={18} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    {cert.issuer}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  {cert.title}
                </h3>

                <div className="mt-4 flex gap-2">
                  {cert.type === "image" ? (
                    <button
                      onClick={() => setPreview(cert.image!)}
                      className="btn-ghost !px-4 !py-2 text-xs"
                    >
                      <ExternalLink size={14} />
                      View
                    </button>
                  ) : (
                    <a
                      href={cert.file}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost !px-4 !py-2 text-xs"
                    >
                      <ExternalLink size={14} />
                      Open PDF
                    </a>
                  )}
                  <a
                    href={cert.file}
                    download
                    className="btn-ghost !px-4 !py-2 text-xs"
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}

          {/* CV card */}
          <FadeIn delay={certificates.length * 0.08}>
            <div className="card flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/15 text-brand-300">
                <FileText size={28} />
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                Curriculum Vitae
              </h3>
              <p className="mt-1 text-sm text-white/55">
                Full CV with detailed experience and skills.
              </p>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-4 !px-5 !py-2.5 text-xs"
              >
                <Download size={14} />
                Download CV
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Image preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <button
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setPreview(null)}
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={preview}
              alt="Certificate preview"
              width={1200}
              height={900}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
