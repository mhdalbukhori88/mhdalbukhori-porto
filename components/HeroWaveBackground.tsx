"use client";

import ImageWaveCanvas from "./ImageWaveCanvas";

/**
 * HeroWaveBackground — Renders the exact original line artwork image (bg-light.png & bg-dark.png)
 * and animates every single line dynamically with 60FPS wave distortion & cursor interaction.
 */
export default function HeroWaveBackground() {
  return <ImageWaveCanvas variant="hero" />;
}
