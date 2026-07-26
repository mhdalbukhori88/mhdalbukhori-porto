"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  ImageWaveCanvas — Renders the EXACT original background image artwork
 *  (bg-light.png & bg-dark.png) on a Canvas and applies dynamic multi-slice
 *  sinusoidal wave distortion + cursor interaction so that EVERY SINGLE LINE
 *  in the original artwork moves and undulates continuously in 60 FPS.
 *  Optimized for ultra-smooth rendering on both mobile & desktop devices.
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

  const onMove = useCallback((e: MouseEvent | TouchEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let clientX = -9999;
    let clientY = -9999;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (clientX > -9000) {
      mouseRef.current = {
        x: (clientX - r.left) * dpr,
        y: (clientY - r.top) * dpr,
        active: true,
      };
    }
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
        sm.x += (raw.x - sm.x) * 0.06;
        sm.y += (raw.y - sm.y) * 0.06;
      } else {
        sm.x += (-9999 - sm.x) * 0.03;
        sm.y += (-9999 - sm.y) * 0.03;
      }

      ctx.clearRect(0, 0, W, H);

      // Solid background fill
      ctx.fillStyle = isDark ? "#0d1117" : "#f8f9fa";
      ctx.fillRect(0, 0, W, H);

      if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        const imgW = currentImg.naturalWidth;
        const imgH = currentImg.naturalHeight;

        // Determine if mobile view (< 768px width)
        const isMobile = W < 768 * dpr;

        // Aspect fill cover dimensions with slight padding for movement
        const scale = Math.max(W / imgW, H / imgH) * (isMobile ? 1.06 : 1.1);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const startX = (W - drawW) * 0.5;
        const startY = (H - drawH) * 0.5;

        // Responsive slice count: broad & smooth on mobile, detailed on desktop
        const NUM_SLICES = isMobile
          ? Math.max(35, Math.floor(W / (10 * dpr)))
          : (variant === "hero" ? 95 : 65);

        const sliceWidth = drawW / NUM_SLICES;
        const srcSliceW = imgW / NUM_SLICES;

        // Responsive wave amplitude to keep motion silky smooth on small screens
        const maxWaveAmp = isMobile
          ? Math.min(W * 0.008, 6 * dpr)
          : (variant === "hero" ? 14 : 8) * dpr;

        const rippleR = (isMobile ? 140 : (variant === "hero" ? 220 : 150)) * dpr;
        const rippleF = (isMobile ? 10 : (variant === "hero" ? 22 : 14)) * dpr;

        // Apply subtle transparency for footer variant so text remains crystal clear
        ctx.globalAlpha = variant === "footer" ? (isDark ? 0.32 : 0.22) : 1.0;

        for (let i = 0; i < NUM_SLICES; i++) {
          const sx = i * srcSliceW;
          const dx = startX + i * sliceWidth;
          const progress = i / NUM_SLICES;

          // Smooth multi-harmonic wave displacement
          const waveOffsetY = isMobile
            ? Math.sin(progress * Math.PI * 2.5 + t * 1.2) * maxWaveAmp +
              Math.cos(t * 0.7 + i * 0.1) * (maxWaveAmp * 0.3)
            : Math.sin(progress * Math.PI * 3.5 + t * 1.4) * maxWaveAmp +
              Math.cos(progress * Math.PI * 6 - t * 0.9) * (maxWaveAmp * 0.4) +
              Math.sin(t * 0.8 + i * 0.12) * (4 * dpr);

          const waveOffsetX = isMobile
            ? Math.cos(progress * Math.PI * 1.5 + t * 0.9) * (maxWaveAmp * 0.2)
            : Math.cos(progress * Math.PI * 2.5 + t * 1.1) * (maxWaveAmp * 0.35);

          let dy = startY + waveOffsetY;
          let currentDx = dx + waveOffsetX;

          // Interactive Gaussian Cursor Ripple Displacement
          if (sm.x > -1000) {
            const dist = Math.abs(currentDx - sm.x);
            if (dist < rippleR) {
              const normDist = dist / rippleR;
              const rippleFactor = Math.exp(-normDist * normDist * 3);
              const cursorY = Math.sin(dist * 0.04 - t * 3.5) * rippleF * rippleFactor;
              dy += cursorY;
            }
          }

          // Draw vertical slice of original artwork with seam-overlap buffer
          ctx.drawImage(
            currentImg,
            sx,
            0,
            srcSliceW,
            imgH,
            currentDx,
            dy,
            sliceWidth + (isMobile ? 1.2 * dpr : 0.8 * dpr), // overlap buffer to prevent seam gaps
            drawH
          );
        }
        ctx.globalAlpha = 1.0;
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
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("touchend", onLeave);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onLeave);
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
