"use client";

import WaveCanvas, { HERO_WAVES } from "./WaveCanvas";

/**
 * HeroWaveBackground — Smooth animated flowing wave lines for the Hero section.
 * Uses quadratic Bézier curves for perfectly smooth rendering.
 */
export default function HeroWaveBackground() {
  return <WaveCanvas groups={HERO_WAVES} />;
}
