"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, full-screen night rain behind every page: a short, seamless loop of
 * real footage (Pexels, free license), graded navy and blurred at encode time.
 * Also feeds the pointer position to `.glass-interactive` panes so their
 * highlight follows the cursor.
 */
export function RainBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React doesn't reliably render the `muted` attribute, and browsers only
    // autoplay muted video, so set it here and start playback ourselves.
    video.muted = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (reduceMotion || saveData) return;
    video.play().catch(() => {});
  }, []);

  useEffect(() => {
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      if (!last) return;
      const target = (last.target as Element | null)?.closest?.(".glass-interactive");
      if (!(target instanceof HTMLElement)) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      target.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 scale-105 bg-[url(/bg/rain-poster.jpg)] bg-cover bg-center" />
      <video
        ref={videoRef}
        className="rain-video absolute inset-0 size-full scale-105 object-cover"
        poster="/bg/rain-poster.jpg"
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/bg/rain.webm" type="video/webm" />
        <source src="/bg/rain.mp4" type="video/mp4" />
      </video>
      {/* Keeps text readable: darker at the edges and bottom, a little
          cooler light up top. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgb(40_80_160/0.22),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(5_10_22/0.45),rgb(5_10_22/0.62)_45%,rgb(5_10_22/0.78))]" />
      <div className="absolute inset-0 shadow-[inset_0_0_220px_60px_rgb(2_5_12/0.85)]" />
    </div>
  );
}
