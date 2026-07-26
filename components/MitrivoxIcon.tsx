"use client";

import React from "react";

interface MitrivoxIconProps {
  size?: number;
  className?: string;
}

/**
 * MitrivoxIcon - Logo icon for Mitrivox Digital (@mitrivoxdigital.official).
 * Styled with fill="currentColor" to blend seamlessly with Lucide icon sets.
 */
export default function MitrivoxIcon({
  size = 24,
  className = "",
}: MitrivoxIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-label="Mitrivox Digital Software House Logo"
    >
      {/* Left Tower */}
      <path d="M3 21V10.2L7 8.8V21H3Z" />
      {/* Central Skyscraper Tower */}
      <path d="M8.5 21V1.5L15 4.2V8H12.5V21H8.5Z" />
      {/* Right Tower */}
      <path d="M13.5 21V9.2L21 6.8V21H13.5Z" />
    </svg>
  );
}
