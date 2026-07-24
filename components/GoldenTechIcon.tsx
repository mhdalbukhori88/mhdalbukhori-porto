"use client";

import React from "react";

interface GoldenTechIconProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "currentColor" | "gold";
}

/**
 * GoldenTechIcon - Custom high-tech logo icon for Golden Tech Indonesia (@goldentech.id)
 * Designed for maximum clarity at small (16px) and large (48px+) resolutions.
 */
export default function GoldenTechIcon({
  size = 20,
  className = "",
  variant = "gradient",
}: GoldenTechIconProps) {
  const strokeWidth = 1.8;

  if (variant === "currentColor") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Hexagon Outer Frame */}
        <path
          d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stylized GT Code Emblem */}
        <path
          d="M7.5 9.5H16.5M12 9.5V16.5M8 14.5L6.5 13L8 11.5M16 14.5L17.5 13L16 11.5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Tech Core Dot */}
        <circle cx="12" cy="13" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Golden Tech Logo"
    >
      <defs>
        {/* Golden Tech Signature Gradient: Vivid Amber Gold to Royal Electric Purple */}
        <linearGradient
          id="gtGradPrimary"
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <linearGradient
          id="gtGradGold"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <linearGradient
          id="gtGradGlow"
          x1="12"
          y1="2"
          x2="12"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>

      {/* Hexagonal Shield Outer Border */}
      <path
        d="M12 2.2L20.5 7.1V16.9L12 21.8L3.5 16.9V7.1L12 2.2Z"
        stroke={variant === "gold" ? "url(#gtGradGold)" : "url(#gtGradPrimary)"}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Modern GT Code & Circuit Architecture */}
      {/* Top Bar (T & G header) */}
      <path
        d="M7.5 9H16.5"
        stroke={variant === "gold" ? "url(#gtGradGold)" : "url(#gtGradPrimary)"}
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {/* Central Stem (T vertical & G base) */}
      <path
        d="M12 9V16"
        stroke={variant === "gold" ? "url(#gtGradGold)" : "url(#gtGradGlow)"}
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {/* Left Code Bracket '<' (G loop) */}
      <path
        d="M8.5 11.5L6.5 13L8.5 14.5"
        stroke={variant === "gold" ? "#FBBF24" : "#F59E0B"}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Code Bracket '>' (Tech arrow) */}
      <path
        d="M15.5 11.5L17.5 13L15.5 14.5"
        stroke={variant === "gold" ? "#F59E0B" : "#8B5CF6"}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Software Core Node */}
      <circle
        cx="12"
        cy="13"
        r="1.25"
        fill={variant === "gold" ? "#FBBF24" : "#C084FC"}
      />
    </svg>
  );
}
