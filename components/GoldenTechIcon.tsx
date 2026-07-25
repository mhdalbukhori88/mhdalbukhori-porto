"use client";

import React from "react";

interface GoldenTechIconProps {
  size?: number;
  className?: string;
}

/**
 * GoldenTechIcon - Minimalist, professional line-stroke logo icon for Golden Tech Indonesia (@goldentech.id).
 * Specifically styled with stroke="currentColor" and 2px stroke-width to match Lucide icons (GitHub, LinkedIn, Instagram).
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
      {/* Outer Tech Hexagon Shield */}
      <path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" />
      {/* Monogram T & G Header */}
      <path d="M8 9.5H16M12 9.5V16.5" />
      {/* Code Brackets < / > */}
      <path d="M8 14.5L6.5 13L8 11.5" />
      <path d="M16 14.5L17.5 13L16 11.5" />
    </svg>
  );
}
