"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  AnimatedImageBackground — Uses the EXACT original background line artwork
 *  (bg-light.png & bg-dark.png) and animates it with:
 *    1. Continuous smooth floating & breathing motion (24s cycle)
 *    2. Smooth mouse-follow parallax shift as the cursor moves
 *    3. Theme-aware dark/light mode image switching
 * ────────────────────────────────────────────────────────────────────────── */

interface AnimatedImageBackgroundProps {
  variant?: "hero" | "footer";
}

export default function AnimatedImageBackground({
  variant = "hero",
}: AnimatedImageBackgroundProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  // Target and current mouse offset for smooth lerp
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number>(0);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      // Parallax intensity (pixels)
      const maxParallax = variant === "hero" ? 35 : 20;
      mouseTarget.current = {
        x: relativeX * maxParallax,
        y: relativeY * maxParallax,
      };
    };

    const handleMouseLeave = () => {
      mouseTarget.current = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    // Smooth animation loop using linear interpolation (lerp)
    const animate = () => {
      const lerpFactor = 0.04; // Smooth lag factor
      mouseCurrent.current.x +=
        (mouseTarget.current.x - mouseCurrent.current.x) * lerpFactor;
      mouseCurrent.current.y +=
        (mouseTarget.current.y - mouseCurrent.current.y) * lerpFactor;

      if (layerRef.current) {
        layerRef.current.style.transform = `translate3d(${mouseCurrent.current.x}px, ${mouseCurrent.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [variant]);

  const isDark = theme === "dark";

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Outer wrapper that applies cursor parallax */}
      <div
        ref={layerRef}
        className="absolute inset-[-8%] w-[116%] h-[116%] transition-transform duration-75 ease-out"
        style={{ willChange: "transform" }}
      >
        {/* Inner element that applies continuous floating CSS animation */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
            variant === "hero" ? "animate-hero-bg-float" : "animate-footer-bg-float"
          }`}
          style={{
            backgroundImage: mounted
              ? isDark
                ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(13, 17, 22, 0.7)), url('/bg-dark.png')`
                : `linear-gradient(rgba(255, 255, 255, 0.2), rgba(248, 249, 250, 0.6)), url('/bg-light.png')`
              : "none",
          }}
        />
      </div>

      {/* Subtle radial ambient glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30 transition-opacity duration-500"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 40%, rgba(59, 130, 246, 0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
