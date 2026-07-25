"use client";

import React from "react";

interface GoldenTechIconProps {
  size?: number;
  className?: string;
}

/**
 * GoldenTechIcon - Modern, ultra-professional corporate logo icon for Golden Tech Indonesia (@goldentech.id).
 * Styled with stroke="currentColor" and 2px stroke-width to blend seamlessly with Lucide icon sets.
 */
export default function GoldenTechIcon({
  size = 24,
  className = "",
}: GoldenTechIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Golden Tech Logo"
    >
      {/* Corporate Geometric 'GT' Tech Emblem */}
      <path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" />
      <path d="M12 6V18" />
      <path d="M8 8.5L12 6L16 8.5" />
      <path d="M7 13.5H12H17" />
    </svg>
  );
}

