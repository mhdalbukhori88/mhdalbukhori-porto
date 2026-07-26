"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/* ────────────────────────────────────────────────────
 *  WaveCanvas — Reusable animated flowing wave lines
 *  drawn with smooth quadratic Bézier curves.
 *  Responds to cursor movement with gentle parallax.
 *  Works in both dark and light themes.
 * ──────────────────────────────────────────────────── */

export interface WaveGroup {
  lines: number;
  baseY: number;       // 0‒1 relative
  amplitude: number;   // px
  speed: number;       // radians/sec
  wavelength: number;  // multiplier
  spread: number;      // px total spread of lines in group
}

interface WaveCanvasProps {
  /** Pre-configured wave groups. Defaults to Hero preset. */
  groups?: WaveGroup[];
  /** Extra CSS class on the <canvas> */
  className?: string;
  style?: React.CSSProperties;
}

/* ── Default presets ───────────────────────────────── */
export const HERO_WAVES: WaveGroup[] = [
  { lines: 20, baseY: 0.22, amplitude: 55, speed: 0.3, wavelength: 1.1, spread: 150 },
  { lines: 24, baseY: 0.52, amplitude: 70, speed: 0.2, wavelength: 0.85, spread: 190 },
  { lines: 18, baseY: 0.82, amplitude: 45, speed: 0.28, wavelength: 1.4, spread: 130 },
];

export const FOOTER_WAVES: WaveGroup[] = [
  { lines: 14, baseY: 0.3, amplitude: 30, speed: 0.2, wavelength: 1.3, spread: 90 },
  { lines: 16, baseY: 0.65, amplitude: 35, speed: 0.15, wavelength: 1.0, spread: 100 },
];

export default function WaveCanvas({
  groups = HERO_WAVES,
  className = "",
  style,
}: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const animRef = useRef<number>(0);
  const themeRef = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  /* ── Mouse handlers ────────────────────────────── */
  const onMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
      active: true,
    };
  }, []);

  const onLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  /* ── Animation loop ────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;

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
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Smooth interpolated mouse
    const sm = { x: 0.5, y: 0.5 };

    // Helper: compute Y for a point on a wave line
    const waveY = (
      xNorm: number,
      t: number,
      g: WaveGroup,
      lineIdx: number,
      lineProgress: number,
      baseYpx: number,
    ): number => {
      const amp = g.amplitude * (0.4 + lineProgress * 0.6);
      // Primary sine
      const w1 = Math.sin(xNorm * Math.PI * 2 * g.wavelength + t * g.speed + lineIdx * 0.28) * amp;
      // Harmonic
      const w2 = Math.sin(xNorm * Math.PI * 3.5 * g.wavelength + t * g.speed * 1.4 - lineIdx * 0.18) * amp * 0.22;
      // Micro-detail
      const w3 = Math.sin(xNorm * Math.PI * 6 + t * 0.6 + lineIdx * 0.45) * 5;

      // Gentle cursor influence — smooth Gaussian-like falloff
      const dx = xNorm - sm.x;
      const dy = (baseYpx + w1) / h - sm.y;
      const distSq = dx * dx + dy * dy;
      const influence = Math.exp(-distSq * 8); // smooth Gaussian bell
      const cursorY = influence * 28 * Math.sign(dy || 0.001);
      const cursorX = influence * (sm.x - 0.5) * 18;

      return baseYpx + w1 + w2 + w3 + cursorY + (sm.y - 0.5) * influence * 12 + cursorX * 0; // cursorX used below in x
    };

    // Helper: compute X offset for cursor
    const cursorXOffset = (xNorm: number, baseYpx: number, w1: number): number => {
      const dx = xNorm - sm.x;
      const dy = (baseYpx + w1) / h - sm.y;
      const distSq = dx * dx + dy * dy;
      const influence = Math.exp(-distSq * 8);
      return influence * (sm.x - 0.5) * 18;
    };

    const draw = (time: number) => {
      const t = time * 0.001;
      const isDark = themeRef.current === "dark";

      // Smooth mouse lerp — very gentle for fluid feel
      const target = mouseRef.current;
      const lerp = target.active ? 0.035 : 0.012;
      sm.x += (target.x - sm.x) * lerp;
      sm.y += (target.y - sm.y) * lerp;
      if (!target.active) {
        sm.x += (0.5 - sm.x) * 0.006;
        sm.y += (0.5 - sm.y) * 0.006;
      }

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = isDark ? "#0d1117" : "#f8f9fa";
      ctx.fillRect(0, 0, w, h);

      // Number of control points for Bézier (fewer = smoother curves)
      const POINTS = 32;

      for (const g of groups) {
        for (let li = 0; li < g.lines; li++) {
          const lp = g.lines > 1 ? li / (g.lines - 1) : 0.5; // lineProgress 0‒1
          const yOff = (lp - 0.5) * g.spread;
          const baseYpx = g.baseY * h + yOff;

          // ── Color ──
          let color: string;
          if (isDark) {
            const hue = 210 + lp * 25;
            const sat = 20 + lp * 40;
            const lit = 55 + lp * 15;
            const a = 0.07 + lp * 0.13;
            color = `hsla(${hue}, ${sat}%, ${lit}%, ${a})`;
          } else {
            const hue = 215 + lp * 18;
            const sat = 12 + lp * 28;
            const lit = 32 + lp * 22;
            const a = 0.05 + lp * 0.11;
            color = `hsla(${hue}, ${sat}%, ${lit}%, ${a})`;
          }

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5 + lp * 0.7;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";

          // Build array of smooth points
          const pts: { x: number; y: number }[] = [];
          for (let i = 0; i <= POINTS; i++) {
            const xNorm = i / POINTS;
            const x = xNorm * w;
            const y = waveY(xNorm, t, g, li, lp, baseYpx);

            // X-axis cursor offset
            const amp = g.amplitude * (0.4 + lp * 0.6);
            const w1 = Math.sin(xNorm * Math.PI * 2 * g.wavelength + t * g.speed + li * 0.28) * amp;
            const xOff = cursorXOffset(xNorm, baseYpx, w1);

            pts.push({ x: x + xOff, y });
          }

          // ── Draw smooth curve using quadratic Bézier through midpoints ──
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 0; i < pts.length - 1; i++) {
            const curr = pts[i];
            const next = pts[i + 1];
            // Control point = current point, end point = midpoint
            const mx = (curr.x + next.x) * 0.5;
            const my = (curr.y + next.y) * 0.5;
            ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
          }
          // Final segment to last point
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y);

          ctx.stroke();
        }
      }

      // ── Radial glow following cursor ──
      const gx = sm.x * w, gy = sm.y * h;
      const gr = Math.min(w, h) * 0.38;
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      if (isDark) {
        glow.addColorStop(0, "rgba(59, 130, 246, 0.055)");
        glow.addColorStop(0.5, "rgba(99, 102, 241, 0.025)");
        glow.addColorStop(1, "transparent");
      } else {
        glow.addColorStop(0, "rgba(59, 130, 246, 0.035)");
        glow.addColorStop(0.5, "rgba(99, 102, 241, 0.015)");
        glow.addColorStop(1, "transparent");
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // ── Top/bottom gradient overlay for content readability ──
      const ov = ctx.createLinearGradient(0, 0, 0, h);
      if (isDark) {
        ov.addColorStop(0, "rgba(13, 17, 22, 0.12)");
        ov.addColorStop(0.5, "rgba(13, 17, 22, 0.03)");
        ov.addColorStop(1, "rgba(13, 17, 22, 0.45)");
      } else {
        ov.addColorStop(0, "rgba(248, 249, 250, 0.2)");
        ov.addColorStop(0.5, "rgba(248, 249, 250, 0.08)");
        ov.addColorStop(1, "rgba(248, 249, 250, 0.5)");
      }
      ctx.fillStyle = ov;
      ctx.fillRect(0, 0, w, h);

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
  }, [groups, onMove, onLeave]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0, pointerEvents: "auto", ...style }}
      aria-hidden="true"
    />
  );
}
