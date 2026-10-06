"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const GREETINGS = [
  { word: "Hello", lang: "en" },
  { word: "Hola", lang: "es" },
  { word: "Bonjour", lang: "fr" },
];

export function GreetingCycler() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative block h-[1.3em] overflow-hidden leading-[1.3]" aria-label="Hello, Hola, Bonjour">
      {GREETINGS.map((g, n) => (
        <span
          key={g.word}
          lang={g.lang}
          aria-hidden
          className={cn(
            "absolute inset-0 transition-all duration-500 ease-out",
            n === i
              ? "translate-y-0 opacity-100"
              : n === (i + GREETINGS.length - 1) % GREETINGS.length
                ? "-translate-y-full opacity-0"
                : "translate-y-full opacity-0"
          )}
        >
          {g.word}
        </span>
      ))}
    </span>
  );
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium transition-colors hover:border-white/30 hover:bg-white/10"
    >
      {copied ? (
        <Check aria-hidden className="size-4 text-success" />
      ) : (
        <Copy aria-hidden className="size-4" />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy my email"}</span>
    </button>
  );
}

/** Rocket flight path that draws itself once it scrolls into view. */
export function Trajectory({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const path = "M 24 196 C 120 20, 250 6, 330 60 S 420 170, 456 196";

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 220"
      fill="none"
      aria-hidden
      className={className}
    >
      {[48, 96, 144].map((y) => (
        <line key={y} x1="0" x2="480" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.07" />
      ))}
      <line x1="0" x2="480" y1="196" y2="196" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 6" />
      <path d={path} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
      <path
        d={path}
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray="1000"
        className="motion-reduce:transition-none!"
        style={{
          strokeDashoffset: shown ? 0 : 1000,
          transition: "stroke-dashoffset 2.2s cubic-bezier(0.33, 1, 0.68, 1)",
        }}
      />
      <g
        style={{
          opacity: shown ? 1 : 0,
          transition: "opacity 0.4s ease 1.2s",
        }}
      >
        <line x1="239.4" x2="239.4" y1="32" y2="196" stroke="var(--brand)" strokeOpacity="0.35" strokeDasharray="3 4" />
        <circle cx="239.4" cy="32.1" r="4" fill="var(--brand)" />
        <text x="249" y="24" fill="currentColor" fillOpacity="0.55" fontSize="11" fontFamily="var(--font-mono)">
          APOGEE
        </text>
      </g>
      <g style={{ opacity: shown ? 1 : 0, transition: "opacity 0.4s ease 2s" }}>
        <circle cx="456" cy="196" r="4" fill="currentColor" fillOpacity="0.7" />
        <text x="392" y="186" fill="currentColor" fillOpacity="0.55" fontSize="11" fontFamily="var(--font-mono)">
          LANDING
        </text>
      </g>
      <circle cx="24" cy="196" r="4" fill="currentColor" fillOpacity="0.7" />
      <text x="34" y="214" fill="currentColor" fillOpacity="0.55" fontSize="11" fontFamily="var(--font-mono)">
        LIFTOFF
      </text>
    </svg>
  );
}
