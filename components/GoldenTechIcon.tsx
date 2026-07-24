"use client";

import React from "react";

interface GoldenTechIconProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "currentColor" | "gold";
}

/**
 * GoldenTechIcon - Ultra-Professional Custom Logo Icon for Golden Tech Indonesia (@goldentech.id)
 * Combines Hexagonal Tech Frame, GT Monogram, Terminal Brackets (< />) and a Glowing Core.
 */
export default function GoldenTechIcon({
  size = 20,
  className = "",
  variant = "gradient",
}: GoldenTechIconProps) {
  if (variant === "currentColor") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M16 3L27.25 9.5V22.5L16 29L4.75 22.5V9.5L16 3Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 11.5H22M16 11.5V21.5M10.5 18L8 16.5L10.5 15M21.5 18L24 16.5L21.5 15"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16.5" r="1.8" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Golden Tech Logo"
    >
      <defs>
        {/* Main Golden Tech Gradient: Electric Amber Gold (#F59E0B) -> Royal Purple (#8B5CF6) -> Neon Cyan (#06B6D4) */}
        <linearGradient
          id="gtMainGrad"
          x1="2"
          y1="2"
          x2="30"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="45%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <linearGradient
          id="gtGoldGrad"
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient
          id="gtPurpleGrad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>

      {/* Hexagonal Shield Base */}
      <path
        d="M16 2.8L27.5 9.4V22.6L16 29.2L4.5 22.6V9.4L16 2.8Z"
        stroke={variant === "gold" ? "url(#gtGoldGrad)" : "url(#gtMainGrad)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(147, 51, 234, 0.08)"
      />

      {/* Inner Tech Monogram: GT Header */}
      <path
        d="M9.5 11H22.5"
        stroke={variant === "gold" ? "url(#gtGoldGrad)" : "url(#gtMainGrad)"}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Central Stem */}
      <path
        d="M16 11V21"
        stroke={variant === "gold" ? "#F59E0B" : "url(#gtPurpleGrad)"}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Code Brackets: Left '<' */}
      <path
        d="M11 14.5L8.5 16.5L11 18.5"
        stroke="#FBBF24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Code Brackets: Right '>' */}
      <path
        d="M21 14.5L23.5 16.5L21 18.5"
        stroke="#A855F7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Core Node */}
      <circle
        cx="16"
        cy="16.5"
        r="1.8"
        fill="#FDE047"
      />
    </svg>
  );
}
