"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  WaveCanvas — Ultra-smooth, elegant flowing wavy line artwork.
 *  Recreates the signature curved wave-lines pattern with fluid 60FPS motion
 *  and gentle interactive water-ripple cursor reaction.
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
  frequency: number;
  spread: number;
  rippleRadius: number;
  rippleForce: number;
}

const PRESETS: Record<WavePreset, PresetConfig> = {
  hero: {
    lineCount: 42,
    baseAmplitude: 65,
    speed: 0.35,
    frequency: 0.0018,
    spread: 0.85,
    rippleRadius: 200,
    rippleForce: 28,
  },
  footer: {
    lineCount: 24,
    baseAmplitude: 40,
    speed: 0.25,
    frequency: 0.0022,
    spread: 0.7,
    rippleRadius: 150,
    rippleForce: 18,
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

    // Smoothed mouse position for fluid movement without jumps
    const sm = { x: -9999, y: -9999 };

    const draw = (time: number) => {
      const t = time * 0.001;
      const isDark = themeRef.current === "dark";

      // Smooth cursor position interpolation
      const raw = mouseRef.current;
      if (raw.active) {
        sm.x += (raw.x - sm.x) * 0.06;
        sm.y += (raw.y - sm.y) * 0.06;
      } else {
        sm.x += (-9999 - sm.x) * 0.03;
        sm.y += (-9999 - sm.y) * 0.03;
      }

      ctx.clearRect(0, 0, W, H);

      // Background fill
      ctx.fillStyle = isDark ? "#0d1117" : "#f8f9fa";
      ctx.fillRect(0, 0, W, H);

      const count = cfg.lineCount;
      const numSteps = Math.max(60, Math.floor(W / (12 * dpr)));
      const stepX = W / numSteps;
      const centerY = H * 0.5;

      const rippleR = cfg.rippleRadius * dpr;
      const rippleF = cfg.rippleForce * dpr;

      // Draw concentric curved lines
      for (let i = 0; i < count; i++) {
        const progress = i / (count - 1); // 0 to 1
        const lineOffset = (progress - 0.5) * (H * cfg.spread);

        // Color computation
        let strokeColor: string;
        if (isDark) {
          // Dark mode: slate blue to cyan neon glow
          const alpha = 0.08 + Math.sin(progress * Math.PI) * 0.18;
          const r = Math.round(100 + progress * 60);
          const g = Math.round(160 + progress * 70);
          const b = Math.round(230 + progress * 25);
          strokeColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          // Light mode: elegant dark slate to ocean blue
          const alpha = 0.07 + Math.sin(progress * Math.PI) * 0.16;
          const r = Math.round(30 + progress * 40);
          const g = Math.round(50 + progress * 50);
          const b = Math.round(90 + progress * 80);
          strokeColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = (0.7 + Math.sin(progress * Math.PI) * 0.9) * dpr;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const points: { x: number; y: number }[] = [];

        for (let s = 0; s <= numSteps; s++) {
          const x = s * stepX;

          // Multi-frequency wave calculation for organic swirl effect
          const wave1 =
            Math.sin(x * cfg.frequency + t * cfg.speed + progress * 2.2) *
            cfg.baseAmplitude *
            dpr;
          const wave2 =
            Math.cos(x * cfg.frequency * 1.8 - t * cfg.speed * 0.7 + progress * 1.5) *
            (cfg.baseAmplitude * 0.45) *
            dpr;
          const wave3 =
            Math.sin(x * cfg.frequency * 3.2 + t * 0.5 + i * 0.1) * (12 * dpr);

          // Envelope curve so lines fan out gracefully in the center
          const centerFactor = Math.sin((x / W) * Math.PI);
          const waveTotal = (wave1 + wave2 + wave3) * (0.6 + centerFactor * 0.6);

          let y = centerY + lineOffset + waveTotal;

          // Interactive Gaussian Cursor Ripple Effect
          if (sm.x > -1000) {
            const dx = x - sm.x;
            const dy = y - sm.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < rippleR) {
              const normDist = dist / rippleR;
              // Smooth Gaussian bell curve
              const rippleFactor = Math.exp(-normDist * normDist * 4);
              const waveRipple = Math.cos(dist * 0.04 - t * 4) * rippleF * rippleFactor;
              y += waveRipple;
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

      // Soft radial glow tracking the cursor
      if (sm.x > -1000) {
        const glowRadius = 220 * dpr;
        const glow = ctx.createRadialGradient(
          sm.x,
          sm.y,
          0,
          sm.x,
          sm.y,
          glowRadius
        );
        if (isDark) {
          glow.addColorStop(0, "rgba(56, 189, 248, 0.06)");
          glow.addColorStop(0.5, "rgba(99, 102, 241, 0.025)");
          glow.addColorStop(1, "transparent");
        } else {
          glow.addColorStop(0, "rgba(59, 130, 246, 0.05)");
          glow.addColorStop(0.5, "rgba(99, 102, 241, 0.02)");
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
