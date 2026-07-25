"use client";

import React from "react";

interface GoldenTechIconProps {
  size?: number;
  className?: string;
}

/**
 * GoldenTechIcon - Corporate Company Skyscraper Headquarters logo icon for Golden Tech Indonesia (@goldentech.id).
 * Specifically styled with stroke="currentColor" and 2px stroke-width to blend seamlessly with Lucide icon sets.
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
      aria-label="Golden Tech Software House Logo"
    >
      {/* Ground Foundation Line */}
      <path d="M2 21H22" />
      {/* Central Skyscraper Tower */}
      <path d="M9 21V5L15 2V21" />
      {/* Left Office Tower */}
      <path d="M4 21V10L9 7" />
      {/* Left Tower Windows */}
      <path d="M6 11H8" />
      <path d="M6 14H8" />
      <path d="M6 17H8" />
      {/* Right Office Tower */}
      <path d="M15 9L20 12V21" />
      {/* Right Tower Windows */}
      <path d="M16 13H18" />
      <path d="M16 16H18" />
    </svg>
  );
}

