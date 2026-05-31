"use client";

import { useEffect, useRef, useState } from "react";

// Scroll reveal that is safe on mobile GPUs.
//
// Key detail: after the entrance animation finishes we REMOVE the inline
// transform/transition entirely (the "settled" state). Leaving a permanent
// transform/transition on an element keeps it promoted to a GPU compositing
// layer, which on some Android Chrome devices repaints incorrectly and causes
// the torn / ghosted text glitch. Settling drops the layer and fixes it.

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    // Respect users who prefer reduced motion — show immediately, no animation.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      setSettled(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
          // After the transition completes, drop the GPU layer.
          window.setTimeout(() => setSettled(true), delay + 700);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  // Once settled, render with NO transform/transition/will-change at all.
  const style: React.CSSProperties = settled
    ? {}
    : {
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        willChange: "opacity, transform",
      };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
