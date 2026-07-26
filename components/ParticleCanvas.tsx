"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  ParticleCanvas — Antigravity-style floating pill/rounded-rect particles.
 *
 *  Particles are arranged in a soft grid, animated with multi-scale simplex
 *  noise turbulence + sinusoidal wave displacement.  They rotate toward
 *  the cursor and are gently pushed away from it.
 *
 *  Exact recreation of the Antigravity website particle behaviour:
 *   • Pill / rounded-rectangle shapes (sdRoundBox style)
 *   • Blue (#2c64ed), Red (#f84242), Yellow (#ffcf03) colour palette
 *   • Noise-driven organic drift
 *   • Cursor repulsion ring + orientation toward cursor
 *   • Works in both dark & light themes
 * ────────────────────────────────────────────────────────────────────────── */

/* ── Simplex-noise helpers (2D & 3D) ─────────────────────────────────── */

// Permutation table
const perm = new Uint8Array(512);
const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];
(function initPerm() {
  const p = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates shuffle with fixed seed for determinism
  let s = 42;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
})();

function dot3(g: number[], x: number, y: number, z: number) {
  return g[0]*x + g[1]*y + g[2]*z;
}

function noise3D(xin: number, yin: number, zin: number): number {
  const F3 = 1/3, G3 = 1/6;
  const s = (xin+yin+zin)*F3;
  const i = Math.floor(xin+s), j = Math.floor(yin+s), k = Math.floor(zin+s);
  const t = (i+j+k)*G3;
  const X0 = i-t, Y0 = j-t, Z0 = k-t;
  const x0 = xin-X0, y0 = yin-Y0, z0 = zin-Z0;
  let i1,j1,k1,i2,j2,k2;
  if(x0>=y0){if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;}else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;}else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;}}
  else{if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;}else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;}else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;}}
  const x1=x0-i1+G3,y1=y0-j1+G3,z1=z0-k1+G3;
  const x2=x0-i2+2*G3,y2=y0-j2+2*G3,z2=z0-k2+2*G3;
  const x3=x0-1+3*G3,y3=y0-1+3*G3,z3=z0-1+3*G3;
  const ii=i&255,jj=j&255,kk=k&255;
  let n0=0,n1=0,n2=0,n3=0;
  let t0=0.6-x0*x0-y0*y0-z0*z0; if(t0>0){t0*=t0;n0=t0*t0*dot3(grad3[perm[ii+perm[jj+perm[kk]]]%12],x0,y0,z0);}
  let t1=0.6-x1*x1-y1*y1-z1*z1; if(t1>0){t1*=t1;n1=t1*t1*dot3(grad3[perm[ii+i1+perm[jj+j1+perm[kk+k1]]]%12],x1,y1,z1);}
  let t2=0.6-x2*x2-y2*y2-z2*z2; if(t2>0){t2*=t2;n2=t2*t2*dot3(grad3[perm[ii+i2+perm[jj+j2+perm[kk+k2]]]%12],x2,y2,z2);}
  let t3=0.6-x3*x3-y3*y3-z3*z3; if(t3>0){t3*=t3;n3=t3*t3*dot3(grad3[perm[ii+1+perm[jj+1+perm[kk+1]]]%12],x3,y3,z3);}
  return 32*(n0+n1+n2+n3); // -1..1
}

/* ── Preset configs ────────────────────────────────────────────────── */
export type ParticlePreset = "hero" | "footer";

interface PresetConfig {
  gridSpacing: number;   // px between grid cells
  particleW: number;     // pill half-width
  particleH: number;     // pill half-height
  particleR: number;     // pill corner radius
  noiseScale: number;    // turbulence scale
  noiseSpeed: number;    // time multiplier for noise
  waveAmp: number;       // sinusoidal wave px amplitude
  waveFreq: number;      // wave spatial frequency
  cursorRadius: number;
  cursorForce: number;
}

const PRESETS: Record<ParticlePreset, PresetConfig> = {
  hero: {
    gridSpacing: 38,
    particleW: 5,
    particleH: 1.8,
    particleR: 1.5,
    noiseScale: 0.0025,
    noiseSpeed: 0.12,
    waveAmp: 18,
    waveFreq: 0.008,
    cursorRadius: 120,
    cursorForce: 55,
  },
  footer: {
    gridSpacing: 44,
    particleW: 4.5,
    particleH: 1.6,
    particleR: 1.3,
    noiseScale: 0.003,
    noiseSpeed: 0.1,
    waveAmp: 14,
    waveFreq: 0.009,
    cursorRadius: 100,
    cursorForce: 45,
  },
};

/* ── Colour palette (Antigravity) ────────────────────────────────── */
const COLORS_LIGHT = [
  [44, 100, 237],   // #2c64ed — blue
  [248, 66, 66],    // #f84242 — red/coral
  [255, 207, 3],    // #ffcf03 — yellow
];
const COLORS_DARK = [
  [80, 140, 255],   // brighter blue for dark bg
  [255, 100, 100],  // brighter red for dark bg
  [255, 220, 60],   // brighter yellow for dark bg
];

/* ── Component ───────────────────────────────────────────────────── */
interface ParticleCanvasProps {
  preset?: ParticlePreset;
  className?: string;
  style?: React.CSSProperties;
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
    let W = 0, H = 0, dpr = 1;

    // Grid particles
    interface PData { gx: number; gy: number; }
    let particles: PData[] = [];

    const rebuild = () => {
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

      // Build grid
      particles = [];
      const sp = cfg.gridSpacing * dpr;
      const cols = Math.ceil(W / sp) + 2;
      const rows = Math.ceil(H / sp) + 2;
      const offsetX = (W - (cols - 1) * sp) * 0.5;
      const offsetY = (H - (rows - 1) * sp) * 0.5;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          particles.push({
            gx: offsetX + c * sp,
            gy: offsetY + r * sp,
          });
        }
      }
    };

    rebuild();
    window.addEventListener("resize", rebuild, { passive: true });

    // Smoothed cursor
    const sm = { x: -9999, y: -9999 };

    const draw = (time: number) => {
      const t = time * 0.001;
      const isDark = themeRef.current === "dark";
      const palette = isDark ? COLORS_DARK : COLORS_LIGHT;

      // Smooth cursor lerp
      const raw = mouseRef.current;
      if (raw.active) {
        sm.x += (raw.x - sm.x) * 0.08;
        sm.y += (raw.y - sm.y) * 0.08;
      } else {
        sm.x += (-9999 - sm.x) * 0.03;
        sm.y += (-9999 - sm.y) * 0.03;
      }

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = isDark ? "#0d1117" : "#f8f9fa";
      ctx.fillRect(0, 0, W, H);

      const ns = cfg.noiseScale;
      const nt = t * cfg.noiseSpeed;
      const pw = cfg.particleW * dpr;
      const ph = cfg.particleH * dpr;
      const pr = cfg.particleR * dpr;
      const cr = cfg.cursorRadius * dpr;
      const cf = cfg.cursorForce * dpr;

      for (const p of particles) {
        // ── Noise-driven displacement ──
        const n1 = noise3D(p.gx * ns, p.gy * ns, nt);
        const n2 = noise3D(p.gx * ns + 100, p.gy * ns + 100, nt + 50);
        // Multi-scale: add a second octave
        const n3 = noise3D(p.gx * ns * 2.5, p.gy * ns * 2.5, nt * 1.5) * 0.35;
        const n4 = noise3D(p.gx * ns * 2.5 + 200, p.gy * ns * 2.5 + 200, nt * 1.5 + 50) * 0.35;

        const displaceX = (n1 + n3) * cfg.gridSpacing * dpr * 0.6;
        const displaceY = (n2 + n4) * cfg.gridSpacing * dpr * 0.6;

        // ── Sinusoidal wave ──
        const waveX = Math.sin(p.gy * cfg.waveFreq + t * 0.5) * cfg.waveAmp * dpr;
        const waveY = Math.cos(p.gx * cfg.waveFreq + t * 0.4) * cfg.waveAmp * dpr;

        let x = p.gx + displaceX + waveX;
        let y = p.gy + displaceY + waveY;

        // ── Cursor repulsion ──
        const dx = x - sm.x;
        const dy = y - sm.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let angle = n1 * Math.PI; // default rotation from noise

        if (dist < cr && dist > 0) {
          const pushFactor = (1 - dist / cr);
          const push = pushFactor * pushFactor * cf;
          x += (dx / dist) * push;
          y += (dy / dist) * push;
          // Rotate toward cursor direction (atan2)
          const cursorAngle = Math.atan2(dy, dx);
          angle += (cursorAngle - angle) * pushFactor * 0.6;
        }

        // ── Colour from noise (blend 3 colors) ──
        const cn = (noise3D(p.gx * ns * 0.8, p.gy * ns * 0.8, nt * 0.5) + 1) * 0.5; // 0..1
        let c0: number[], c1: number[], blend: number;
        if (cn < 0.5) {
          c0 = palette[0]; c1 = palette[1]; blend = cn * 2;
        } else {
          c0 = palette[1]; c1 = palette[2]; blend = (cn - 0.5) * 2;
        }
        const r = Math.round(c0[0] + (c1[0] - c0[0]) * blend);
        const g = Math.round(c0[1] + (c1[1] - c0[1]) * blend);
        const b = Math.round(c0[2] + (c1[2] - c0[2]) * blend);

        // Alpha — slightly vary with noise, brighter near cursor
        let alpha = isDark ? 0.45 : 0.5;
        alpha += noise3D(p.gx * ns * 3, p.gy * ns * 3, nt * 2) * 0.15;
        if (dist < cr * 1.5 && dist > 0) {
          alpha += (1 - dist / (cr * 1.5)) * 0.3;
        }
        alpha = Math.max(0.1, Math.min(0.85, alpha));

        // ── Draw rounded rectangle (pill) ──
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        // Rounded rect path
        ctx.beginPath();
        ctx.moveTo(-pw + pr, -ph);
        ctx.lineTo(pw - pr, -ph);
        ctx.arcTo(pw, -ph, pw, -ph + pr, pr);
        ctx.lineTo(pw, ph - pr);
        ctx.arcTo(pw, ph, pw - pr, ph, pr);
        ctx.lineTo(-pw + pr, ph);
        ctx.arcTo(-pw, ph, -pw, ph - pr, pr);
        ctx.lineTo(-pw, -ph + pr);
        ctx.arcTo(-pw, -ph, -pw + pr, -ph, pr);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", rebuild);
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
