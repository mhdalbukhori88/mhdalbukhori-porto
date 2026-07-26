"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  WaveCanvas — Animated Concentric Wave Lines Artwork.
 *  Renders an array of individual curved lines that undulate, flow, and
 *  ripple continuously independently, creating a mesmerizing living mesh.
 * ────────────────────────────────────────────────────────────────────────── */

export type WavePreset = "hero" | "footer";

interface WaveCanvasProps {
  preset?: WavePreset;
  className?: string;
  style?: React.CSSProperties;
}

interface PresetConfig {
  lineCount: number;
  baseAmplitude: number;
  speed: number;
  spread: number;
  rippleRadius: number;
  rippleForce: number;
}

const PRESETS: Record<WavePreset, PresetConfig> = {
  hero: {
    lineCount: 46,
    baseAmplitude: 75,
    speed: 0.4,
    spread: 0.9,
    rippleRadius: 220,
    rippleForce: 35,
  },
  footer: {
    lineCount: 26,
    baseAmplitude: 45,
    speed: 0.3,
    spread: 0.75,
    rippleRadius: 160,
    rippleForce: 22,
  },
};

export default function WaveCanvas({
  preset = "hero",
  className = "",
  style,
}: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef<number>(0);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const onMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mouseRef.current = {
      x: (e.clientX - r.left) * dpr,
      y: (e.clientY - r.top) * dpr,
      active: true,
    };
  }, []);

  const onLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999, active: false };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = PRESETS[preset];
    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const cw = parent.clientWidth;
      const ch = parent.clientHeight;
      W = cw * dpr;
      H = ch * dpr;
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Interpolated cursor position
    const sm = { x: -9999, y: -9999 };

    const draw = (time: number) => {
      const t = time * 0.001;
      const isDark = themeRef.current === "dark";

      // Smooth cursor lerp
      const raw = mouseRef.current;
      if (raw.active) {
        sm.x += (raw.x - sm.x) * 0.08;
        sm.y += (raw.y - sm.y) * 0.08;
      } else {
        sm.x += (-9999 - sm.x) * 0.04;
        sm.y += (-9999 - sm.y) * 0.04;
      }

      ctx.clearRect(0, 0, W, H);

      // Background fill
      ctx.fillStyle = isDark ? "#0d1117" : "#f8f9fa";
      ctx.fillRect(0, 0, W, H);

      const count = cfg.lineCount;
      const numSteps = Math.max(80, Math.floor(W / (10 * dpr)));
      const stepX = W / numSteps;
      const centerY = H * 0.5;

      const rippleR = cfg.rippleRadius * dpr;
      const rippleF = cfg.rippleForce * dpr;

      // Render each line with its own individual wave motion & phase displacement
      for (let i = 0; i < count; i++) {
        const progress = i / (count - 1); // 0 to 1
        const lineOffset = (progress - 0.5) * (H * cfg.spread);

        // Independent line parameters
        const lineSpeed = cfg.speed * (0.8 + Math.sin(i * 0.35) * 0.35);
        const linePhase = i * 0.18 + Math.cos(i * 0.25) * 0.5;
        const lineAmpMult = 0.6 + Math.sin(progress * Math.PI) * 0.8;

        // Dynamic alpha pulse for glowing strand effect
        const alphaPulse = Math.sin(t * 1.4 + i * 0.4) * 0.04;

        let strokeColor: string;
        if (isDark) {
          // Dark mode: slate blue to glowing cyan-indigo
          const baseAlpha = 0.1 + Math.sin(progress * Math.PI) * 0.2 + alphaPulse;
          const r = Math.round(100 + progress * 70);
          const g = Math.round(170 + progress * 65);
          const b = Math.round(235 + progress * 20);
          strokeColor = `rgba(${r}, ${g}, ${b}, ${Math.max(0.04, Math.min(0.45, baseAlpha))})`;
        } else {
          // Light mode: elegant deep slate to ocean blue
          const baseAlpha = 0.08 + Math.sin(progress * Math.PI) * 0.18 + alphaPulse;
          const r = Math.round(25 + progress * 45);
          const g = Math.round(45 + progress * 55);
          const b = Math.round(85 + progress * 85);
          strokeColor = `rgba(${r}, ${g}, ${b}, ${Math.max(0.04, Math.min(0.4, baseAlpha))})`;
        }

        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = (0.75 + Math.sin(progress * Math.PI) * 0.85) * dpr;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const points: { x: number; y: number }[] = [];

        for (let s = 0; s <= numSteps; s++) {
          const x = s * stepX;
          const normX = x / W; // 0..1

          // Concentric S-curve envelope matching original wave artwork shape
          const sCurve = Math.sin(normX * Math.PI * 1.6 - 0.4) * (H * 0.15);

          // Individual continuous wave motion equations for each line
          const wave1 =
            Math.sin(normX * Math.PI * 2.2 + t * lineSpeed + linePhase) *
            cfg.baseAmplitude *
            lineAmpMult *
            dpr;

          const wave2 =
            Math.cos(normX * Math.PI * 3.8 - t * lineSpeed * 1.25 + i * 0.12) *
            (cfg.baseAmplitude * 0.35) *
            dpr;

          const wave3 =
            Math.sin(normX * Math.PI * 6.5 + t * 0.9 + i * 0.3) *
            (8 * dpr);

          // Continuous horizontal wave drift so lines flow across the screen
          const driftY = Math.sin(normX * Math.PI * 1.2 + t * 0.6 + i * 0.15) * (15 * dpr);

          let y = centerY + lineOffset + sCurve + wave1 + wave2 + wave3 + driftY;

          // Interactive Gaussian Cursor Impulse (reacts per line)
          if (sm.x > -1000) {
            const dx = x - sm.x;
            const dy = y - sm.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < rippleR) {
              const normDist = dist / rippleR;
              const rippleFactor = Math.exp(-normDist * normDist * 3.5);
              const cursorImpulse =
                Math.sin(dist * 0.035 - t * 4.5 + i * 0.1) * rippleF * rippleFactor;
              y += cursorImpulse;
            }
          }

          points.push({ x, y });
        }

        // Draw ultra-smooth curve using quadratic bezier interpolation
        ctx.moveTo(points[0].x, points[0].y);
        for (let s = 0; s < points.length - 1; s++) {
          const curr = points[s];
          const next = points[s + 1];
          const midX = (curr.x + next.x) * 0.5;
          const midY = (curr.y + next.y) * 0.5;
          ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
        }
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);

        ctx.stroke();
      }

      // Cursor follower radial glow
      if (sm.x > -1000) {
        const glowRadius = 240 * dpr;
        const glow = ctx.createRadialGradient(
          sm.x,
          sm.y,
          0,
          sm.x,
          sm.y,
          glowRadius
        );
        if (isDark) {
          glow.addColorStop(0, "rgba(56, 189, 248, 0.065)");
          glow.addColorStop(0.5, "rgba(99, 102, 241, 0.02)");
          glow.addColorStop(1, "transparent");
        } else {
          glow.addColorStop(0, "rgba(59, 130, 246, 0.05)");
          glow.addColorStop(0.5, "rgba(99, 102, 241, 0.018)");
          glow.addColorStop(1, "transparent");
        }
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [preset, onMove, onLeave]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0, pointerEvents: "auto", ...style }}
      aria-hidden="true"
    />
  );
}
