"use client";

import WaveCanvas from "./WaveCanvas";

/**
 * HeroWaveBackground — Ultra-smooth flowing concentric wave lines for the Hero section.
 * Features 60FPS fluid motion and soft Gaussian cursor ripple interaction.
 */
export default function HeroWaveBackground() {
  return <WaveCanvas preset="hero" />;
}
