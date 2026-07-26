"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  ImageWaveCanvas — Renders the EXACT original background image artwork
 *  (bg-light.png & bg-dark.png) on a Canvas and applies dynamic multi-slice
 *  sinusoidal wave distortion + cursor interaction so that EVERY SINGLE LINE
 *  in the original artwork moves and undulates continuously in 60 FPS.
 * ────────────────────────────────────────────────────────────────────────── */

interface ImageWaveCanvasProps {
  variant?: "hero" | "footer";
  className?: string;
  style?: React.CSSProperties;
}

export default function ImageWaveCanvas({
  variant = "hero",
  className = "",
  style,
}: ImageWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef<number>(0);

  // Preloaded image references
  const lightImgRef = useRef<HTMLImageElement | null>(null);
  const darkImgRef = useRef<HTMLImageElement | null>(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Preload images on mount
  useEffect(() => {
    if (!lightImgRef.current) {
      const lightImg = new Image();
      lightImg.src = "/bg-light.png";
      lightImgRef.current = lightImg;
    }
    if (!darkImgRef.current) {
      const darkImg = new Image();
      darkImg.src = "/bg-dark.png";
      darkImgRef.current = darkImg;
    }
  }, []);

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
      const currentImg = isDark ? darkImgRef.current : lightImgRef.current;

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

      // Solid background fill
      ctx.fillStyle = isDark ? "#0d1117" : "#f8f9fa";
      ctx.fillRect(0, 0, W, H);

      if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        const imgW = currentImg.naturalWidth;
        const imgH = currentImg.naturalHeight;

        // Calculate aspect fill cover dimensions
        const scale = Math.max(W / imgW, H / imgH) * 1.1; // slightly larger for movement
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const startX = (W - drawW) * 0.5;
        const startY = (H - drawH) * 0.5;

        // Number of slice columns across the image
        const NUM_SLICES = variant === "hero" ? 100 : 70;
        const sliceWidth = drawW / NUM_SLICES;
        const srcSliceW = imgW / NUM_SLICES;

        const rippleR = (variant === "hero" ? 220 : 150) * dpr;
        const rippleF = (variant === "hero" ? 26 : 15) * dpr;
        const waveAmp = (variant === "hero" ? 16 : 9) * dpr;

        for (let i = 0; i < NUM_SLICES; i++) {
          const sx = i * srcSliceW;
          const dx = startX + i * sliceWidth;
          const progress = i / NUM_SLICES;

          // Continuous multi-harmonic wave displacement for each slice
          const waveOffsetY =
            Math.sin(progress * Math.PI * 4 + t * 1.6) * waveAmp +
            Math.cos(progress * Math.PI * 7 - t * 1.1) * (waveAmp * 0.45) +
            Math.sin(t * 0.9 + i * 0.15) * (6 * dpr);

          const waveOffsetX =
            Math.cos(progress * Math.PI * 3 + t * 1.2) * (waveAmp * 0.4);

          let dy = startY + waveOffsetY;
          let currentDx = dx + waveOffsetX;

          // Interactive Gaussian Cursor Ripple Displacement
          if (sm.x > -1000) {
            const dist = Math.abs(currentDx - sm.x);
            if (dist < rippleR) {
              const normDist = dist / rippleR;
              const rippleFactor = Math.exp(-normDist * normDist * 3);
              const cursorY = Math.sin(dist * 0.04 - t * 4) * rippleF * rippleFactor;
              dy += cursorY;
            }
          }

          // Draw vertical slice of original artwork
          ctx.drawImage(
            currentImg,
            sx,
            0,
            srcSliceW,
            imgH,
            currentDx,
            dy,
            sliceWidth + 0.6, // slight overlap to prevent seam gaps
            drawH
          );
        }
      }

      // Soft linear gradient overlay for text readability
      const overlay = ctx.createLinearGradient(0, 0, 0, H);
      if (isDark) {
        overlay.addColorStop(0, "rgba(13, 17, 22, 0.2)");
        overlay.addColorStop(0.5, "rgba(13, 17, 22, 0.08)");
        overlay.addColorStop(1, "rgba(13, 17, 22, 0.55)");
      } else {
        overlay.addColorStop(0, "rgba(248, 249, 250, 0.3)");
        overlay.addColorStop(0.5, "rgba(248, 249, 250, 0.12)");
        overlay.addColorStop(1, "rgba(248, 249, 250, 0.6)");
      }
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, W, H);

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
  }, [variant, onMove, onLeave]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0, pointerEvents: "auto", ...style }}
      aria-hidden="true"
    />
  );
}
