"use client";

import WaveCanvas from "./WaveCanvas";

/**
 * HeroWaveBackground — Animated flowing wave lines for the Hero section.
 * Every individual line moves and undulates continuously with 60FPS precision.
 */
export default function HeroWaveBackground() {
  return <WaveCanvas preset="hero" />;
}
