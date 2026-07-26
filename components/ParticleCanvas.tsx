"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/* ────────────────────────────────────────────────────────────────────────
 *  ParticleCanvas — Floating dash/line particles that drift gracefully,
 *  inspired by the Antigravity website style. Particles gently repel
 *  from cursor creating an elegant interactive feel.
 *  Supports dark & light themes with beautiful color palettes.
 * ──────────────────────────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  angle: number;
  rotSpeed: number;
  hue: number;
  sat: number;
  light: number;
  alpha: number;
  lineWidth: number;
}

export type ParticlePreset = "hero" | "footer";

interface ParticleCanvasProps {
  preset?: ParticlePreset;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Preset configs ──────────────────────────────── */
const PRESETS = {
  hero: {
    count: 120,
    speedRange: [0.15, 0.45] as [number, number],
    lengthRange: [8, 28] as [number, number],
    alphaRange: [0.12, 0.45] as [number, number],
    lineWidthRange: [1, 2.2] as [number, number],
    cursorRadius: 160,
    cursorForce: 0.6,
  },
  footer: {
    count: 70,
    speedRange: [0.1, 0.3] as [number, number],
    lengthRange: [6, 20] as [number, number],
    alphaRange: [0.1, 0.35] as [number, number],
    lineWidthRange: [0.8, 1.8] as [number, number],
    cursorRadius: 130,
    cursorForce: 0.4,
  },
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function ParticleCanvas({
  preset = "hero",
  className = "",
  style,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef<number>(0);
  const themeRef = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  const onMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      active: true,
    };
  }, []);

  const onLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999, active: false };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const cfg = PRESETS[preset];
    let w = 0, h = 0;
    let particles: Particle[] = [];

    const createParticle = (startRandom = true): Particle => {
      const isDark = themeRef.current === "dark";
      // Color palette — blue/indigo/cyan spectrum
      const palettes = isDark
        ? [
            { hue: 215, sat: 65, light: 65 },  // blue
            { hue: 230, sat: 55, light: 70 },  // indigo
            { hue: 195, sat: 70, light: 60 },  // cyan
            { hue: 250, sat: 45, light: 72 },  // violet
            { hue: 200, sat: 40, light: 80 },  // light blue
          ]
        : [
            { hue: 220, sat: 60, light: 50 },  // blue
            { hue: 235, sat: 50, light: 55 },  // indigo
            { hue: 200, sat: 65, light: 45 },  // cyan
            { hue: 255, sat: 40, light: 60 },  // violet
            { hue: 210, sat: 35, light: 65 },  // light blue
          ];

      const pal = palettes[Math.floor(Math.random() * palettes.length)];

      return {
        x: startRandom ? rand(0, w) : rand(-50, w + 50),
        y: startRandom ? rand(0, h) : rand(-50, h + 50),
        vx: rand(-1, 1) * rand(cfg.speedRange[0], cfg.speedRange[1]),
        vy: rand(-1, 1) * rand(cfg.speedRange[0], cfg.speedRange[1]),
        length: rand(cfg.lengthRange[0], cfg.lengthRange[1]),
        angle: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.008, 0.008),
        hue: pal.hue + rand(-10, 10),
        sat: pal.sat + rand(-5, 5),
        light: pal.light + rand(-8, 8),
        alpha: rand(cfg.alphaRange[0], cfg.alphaRange[1]),
        lineWidth: rand(cfg.lineWidthRange[0], cfg.lineWidthRange[1]),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const p = canvas.parentElement;
      if (!p) return;
      w = p.clientWidth;
      h = p.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Recreate particles on resize
      particles = [];
      for (let i = 0; i < cfg.count; i++) {
        particles.push(createParticle(true));
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      const isDark = themeRef.current === "dark";
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = isDark ? "#0d1117" : "#f8f9fa";
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cursorR = cfg.cursorRadius;
      const cursorF = cfg.cursorForce;

      ctx.lineCap = "round";

      for (const p of particles) {
        // ── Cursor interaction: gentle push away ──
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < cursorR && dist > 0) {
          const force = (1 - dist / cursorR) * cursorF;
          const pushX = (dx / dist) * force;
          const pushY = (dy / dist) * force;
          p.vx += pushX * 0.3;
          p.vy += pushY * 0.3;
        }

        // ── Update position ──
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.rotSpeed;

        // Gentle friction to prevent runaway speeds
        p.vx *= 0.997;
        p.vy *= 0.997;

        // Ensure minimum drift speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < cfg.speedRange[0] * 0.5) {
          const a = rand(0, Math.PI * 2);
          p.vx += Math.cos(a) * 0.02;
          p.vy += Math.sin(a) * 0.02;
        }

        // Wrap around edges with margin
        const margin = 60;
        if (p.x < -margin) p.x = w + margin * 0.5;
        if (p.x > w + margin) p.x = -margin * 0.5;
        if (p.y < -margin) p.y = h + margin * 0.5;
        if (p.y > h + margin) p.y = -margin * 0.5;

        // ── Draw dash/line particle ──
        const halfLen = p.length * 0.5;
        const cosA = Math.cos(p.angle);
        const sinA = Math.sin(p.angle);
        const x1 = p.x - cosA * halfLen;
        const y1 = p.y - sinA * halfLen;
        const x2 = p.x + cosA * halfLen;
        const y2 = p.y + sinA * halfLen;

        // Cursor proximity glow — particles near cursor get brighter
        let glowAlpha = p.alpha;
        if (dist < cursorR * 1.5) {
          const glow = (1 - dist / (cursorR * 1.5)) * 0.35;
          glowAlpha = Math.min(p.alpha + glow, 0.8);
        }

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${glowAlpha})`;
        ctx.lineWidth = p.lineWidth;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Small dot at one end for extra sparkle (30% chance per particle)
        if (p.alpha > 0.25) {
          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, ${p.sat + 10}%, ${p.light + 15}%, ${glowAlpha * 0.6})`;
          ctx.arc(x2, y2, p.lineWidth * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Subtle radial glow at cursor ──
      if (mouseRef.current.active) {
        const gr = cursorR * 1.2;
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, gr);
        if (isDark) {
          glow.addColorStop(0, "rgba(59, 130, 246, 0.04)");
          glow.addColorStop(0.6, "rgba(99, 102, 241, 0.015)");
          glow.addColorStop(1, "transparent");
        } else {
          glow.addColorStop(0, "rgba(59, 130, 246, 0.03)");
          glow.addColorStop(0.6, "rgba(99, 102, 241, 0.01)");
          glow.addColorStop(1, "transparent");
        }
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
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
