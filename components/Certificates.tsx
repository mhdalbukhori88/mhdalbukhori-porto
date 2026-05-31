"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, ExternalLink, FileText, X, Download } from "lucide-react";
import { certificates } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import Reveal from "./Reveal";

export default function Certificates() {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <section id="certificates" className="section">
      <Reveal>
        <h1 className="section-title">Certificates</h1>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <Reveal key={cert.title} delay={i * 100}>
            <div className="flex h-full flex-col overflow-hidden rounded-lg surface-card">
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
                {cert.type === "image" && cert.image ? (
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 360px"
                    className="object-cover"
                  />
                ) : (
                  <FileText size={52} strokeWidth={1.5} className="text-accent" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-accent">
                  <Award size={16} />
                  <span className="font-mono text-xs muted">{cert.issuer}</span>
                </div>
                <h3 className="mt-1 font-sans text-lg font-bold">{cert.title}</h3>
                <div className="mt-4 flex gap-2">
                  {cert.type === "image" ? (
                    <button onClick={() => setPreview(cert.image!)} className="btn-outline !px-4 !py-2 text-xs">
                      <ExternalLink size={14} /> View
                    </button>
                  ) : (
                    <a href={cert.file} target="_blank" rel="noreferrer" className="btn-outline !px-4 !py-2 text-xs">
                      <ExternalLink size={14} /> Open PDF
                    </a>
                  )}
                  <a href={cert.file} download className="btn-outline !px-4 !py-2 text-xs">
                    <Download size={14} /> Download
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ))}

        {/* CV card */}
        <Reveal delay={certificates.length * 100}>
          <div className="flex h-full flex-col items-center justify-center rounded-lg p-8 text-center surface-card">
            <FileText size={48} strokeWidth={1.5} className="text-accent" />
            <h3 className="mt-4 font-sans text-lg font-bold">Curriculum Vitae</h3>
            <p className="mt-1 text-sm muted">Full CV with detailed experience and skills.</p>
            <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer" className="btn-accent mt-4 !px-5 !py-2.5 text-xs">
              <Download size={14} /> Download CV
            </a>
          </div>
        </Reveal>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
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
            className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={preview} alt="Certificate preview" width={1200} height={900} className="h-auto w-full object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
