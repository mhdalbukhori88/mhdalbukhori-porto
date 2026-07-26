"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * HeroWaveBackground — GPU-accelerated animated flowing wave lines
 * that respond to mouse/cursor movement with smooth parallax.
 * Adapts colors for dark and light themes automatically.
 */
export default function HeroWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const animRef = useRef<number>(0);
  const themeRef = useRef(theme);

  // Keep themeRef in sync
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Wave configuration — 3 groups of flowing lines
    const waveGroups = [
      { lines: 18, baseY: 0.25, amplitude: 60, speed: 0.4, wavelength: 1.2, spread: 140 },
      { lines: 22, baseY: 0.55, amplitude: 80, speed: 0.25, wavelength: 0.9, spread: 180 },
      { lines: 16, baseY: 0.8, amplitude: 50, speed: 0.35, wavelength: 1.5, spread: 120 },
    ];

    // Smoothed mouse position for fluid cursor tracking
    const smoothMouse = { x: 0.5, y: 0.5 };

    const draw = (time: number) => {
      const t = time * 0.001;
      const isDark = themeRef.current === "dark";

      // Smooth mouse interpolation
      const target = mouseRef.current;
      const lerpFactor = target.active ? 0.04 : 0.015;
      smoothMouse.x += (target.x - smoothMouse.x) * lerpFactor;
      smoothMouse.y += (target.y - smoothMouse.y) * lerpFactor;

      // If mouse not active, gently drift back to center
      if (!target.active) {
        smoothMouse.x += (0.5 - smoothMouse.x) * 0.008;
        smoothMouse.y += (0.5 - smoothMouse.y) * 0.008;
      }

      ctx.clearRect(0, 0, w, h);

      // Background fill
      if (isDark) {
        ctx.fillStyle = "#0d1117";
      } else {
        ctx.fillStyle = "#f8f9fa";
      }
      ctx.fillRect(0, 0, w, h);

      // Draw each wave group
      for (const group of waveGroups) {
        for (let li = 0; li < group.lines; li++) {
          const lineProgress = li / (group.lines - 1); // 0..1
          const yOffset = (lineProgress - 0.5) * group.spread;

          // Color calculation
          let alpha: number;
          let color: string;
          if (isDark) {
            // Dark mode: silver-to-blue gradient lines
            const hue = 210 + lineProgress * 30; // 210 (blue) → 240 (indigo)
            const sat = 25 + lineProgress * 35;
            const light = 55 + lineProgress * 15;
            alpha = 0.08 + lineProgress * 0.14;
            color = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
          } else {
            // Light mode: slate-to-blue-gray gradient lines
            const hue = 215 + lineProgress * 20;
            const sat = 15 + lineProgress * 25;
            const light = 30 + lineProgress * 25;
            alpha = 0.06 + lineProgress * 0.12;
            color = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
          }

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.6 + lineProgress * 0.8;

          const baseY = group.baseY * h + yOffset;
          const segments = Math.max(80, Math.floor(w / 8));
          const step = w / segments;

          // Mouse influence — waves bend toward cursor
          const mouseInfluenceX = (smoothMouse.x - 0.5) * 40;
          const mouseInfluenceY = (smoothMouse.y - 0.5) * 25;

          for (let s = 0; s <= segments; s++) {
            const x = s * step;
            const xNorm = x / w; // 0..1

            // Primary wave
            const wave1 = Math.sin(
              xNorm * Math.PI * 2 * group.wavelength + t * group.speed + li * 0.3
            ) * group.amplitude * (0.5 + lineProgress * 0.5);

            // Secondary harmonic for organic feel
            const wave2 = Math.sin(
              xNorm * Math.PI * 4 * group.wavelength + t * group.speed * 1.3 - li * 0.2
            ) * group.amplitude * 0.25;

            // Tertiary micro-wave for detail
            const wave3 = Math.sin(
              xNorm * Math.PI * 7 + t * 0.8 + li * 0.5
            ) * 8;

            // Cursor proximity distortion
            const dx = xNorm - smoothMouse.x;
            const dy = (baseY + wave1) / h - smoothMouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const cursorPull = Math.max(0, 1 - dist * 2.5);
            const cursorEffect = cursorPull * cursorPull * 45;

            const y =
              baseY +
              wave1 +
              wave2 +
              wave3 +
              mouseInfluenceY * cursorPull +
              cursorEffect * Math.sign(dy || 0.01);

            if (s === 0) {
              ctx.moveTo(x + mouseInfluenceX * cursorPull, y);
            } else {
              ctx.lineTo(x + mouseInfluenceX * cursorPull, y);
            }
          }

          ctx.stroke();
        }
      }

      // Radial glow following cursor
      const glowX = smoothMouse.x * w;
      const glowY = smoothMouse.y * h;
      const glowRadius = Math.min(w, h) * 0.35;
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      if (isDark) {
        glow.addColorStop(0, "rgba(59, 130, 246, 0.06)");
        glow.addColorStop(0.5, "rgba(99, 102, 241, 0.03)");
        glow.addColorStop(1, "transparent");
      } else {
        glow.addColorStop(0, "rgba(59, 130, 246, 0.04)");
        glow.addColorStop(0.5, "rgba(99, 102, 241, 0.02)");
        glow.addColorStop(1, "transparent");
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Overlay gradient for readability
      const overlay = ctx.createLinearGradient(0, 0, 0, h);
      if (isDark) {
        overlay.addColorStop(0, "rgba(13, 17, 22, 0.15)");
        overlay.addColorStop(0.5, "rgba(13, 17, 22, 0.05)");
        overlay.addColorStop(1, "rgba(13, 17, 22, 0.5)");
      } else {
        overlay.addColorStop(0, "rgba(248, 249, 250, 0.25)");
        overlay.addColorStop(0.5, "rgba(248, 249, 250, 0.1)");
        overlay.addColorStop(1, "rgba(248, 249, 250, 0.55)");
      }
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(draw);
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "auto" }}
      aria-hidden="true"
    />
  );
}
