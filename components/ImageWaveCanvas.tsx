"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/* ──────────────────────────────────────────────────────────────────────────
 *  ImageWaveCanvas — Renders the EXACT original background image artwork
 *  (bg-light.png & bg-dark.png) on a Canvas and applies continuous ultra-smooth
 *  multi-slice sinusoidal wave motion.
 *  Cursor interaction is completely disabled so hovering has zero effect.
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

    const draw = (time: number) => {
      const t = time * 0.0008; // Very smooth, gentle time factor
      const isDark = themeRef.current === "dark";
      const currentImg = isDark ? darkImgRef.current : lightImgRef.current;

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
        const scale = Math.max(W / imgW, H / imgH) * (isMobile ? 1.05 : 1.08);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const startX = (W - drawW) * 0.5;
        const startY = (H - drawH) * 0.5;

        // Responsive slice count: broad & smooth on mobile, detailed on desktop
        const NUM_SLICES = isMobile
          ? Math.max(30, Math.floor(W / (12 * dpr)))
          : (variant === "hero" ? 90 : 60);

        const sliceWidth = drawW / NUM_SLICES;
        const srcSliceW = imgW / NUM_SLICES;

        // Responsive wave amplitude for ultra-smooth silky motion
        const maxWaveAmp = isMobile
          ? Math.min(W * 0.006, 5 * dpr)
          : (variant === "hero" ? 12 : 7) * dpr;

        // Apply subtle transparency for footer variant so text remains crystal clear
        ctx.globalAlpha = variant === "footer" ? (isDark ? 0.32 : 0.22) : 1.0;

        for (let i = 0; i < NUM_SLICES; i++) {
          const sx = i * srcSliceW;
          const dx = startX + i * sliceWidth;
          const progress = i / NUM_SLICES;

          // Pure, smooth, silky sinusoidal wave motion (no mouse influence)
          const waveOffsetY = isMobile
            ? Math.sin(progress * Math.PI * 2 + t * 1.1) * maxWaveAmp +
              Math.cos(t * 0.6 + i * 0.12) * (maxWaveAmp * 0.25)
            : Math.sin(progress * Math.PI * 3.0 + t * 1.2) * maxWaveAmp +
              Math.cos(progress * Math.PI * 5.0 - t * 0.8) * (maxWaveAmp * 0.35) +
              Math.sin(t * 0.7 + i * 0.1) * (3 * dpr);

          const waveOffsetX = isMobile
            ? Math.cos(progress * Math.PI * 1.2 + t * 0.7) * (maxWaveAmp * 0.15)
            : Math.cos(progress * Math.PI * 2.0 + t * 0.9) * (maxWaveAmp * 0.25);

          const dy = startY + waveOffsetY;
          const currentDx = dx + waveOffsetX;

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

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0, pointerEvents: "none", ...style }}
      aria-hidden="true"
    />
  );
}
