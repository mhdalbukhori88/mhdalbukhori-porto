"use client";

import { useEffect, useRef, useCallback } from "react";

// Google reCAPTCHA v2 ("I'm not a robot" checkbox).
// Renders only when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set. Exposes the token
// via onChange (null when expired/unchecked).

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "dark" | "light";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (id?: number) => void;
      getResponse: (id?: number) => string;
    };
    onRecaptchaLoad?: () => void;
  }
}

const SCRIPT_ID = "recaptcha-script";

export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function ReCaptcha({
  onChange,
  theme = "dark",
}: {
  onChange: (token: string | null) => void;
  theme?: "dark" | "light";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  const renderWidget = useCallback(() => {
    if (
      !window.grecaptcha ||
      !containerRef.current ||
      widgetId.current !== null ||
      !RECAPTCHA_SITE_KEY
    ) {
      return;
    }
    widgetId.current = window.grecaptcha.render(containerRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme,
      callback: (token: string) => onChange(token),
      "expired-callback": () => onChange(null),
      "error-callback": () => onChange(null),
    });
  }, [onChange, theme]);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    // Already loaded
    if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
      renderWidget();
      return;
    }

    window.onRecaptchaLoad = renderWidget;

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [renderWidget]);

  if (!RECAPTCHA_SITE_KEY) return null;

  return <div ref={containerRef} className="g-recaptcha" />;
}
