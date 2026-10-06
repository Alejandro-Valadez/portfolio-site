"use client";

import { useEffect, useRef } from "react";
import type { TimelineEntry } from "@/lib/content";

/**
 * Scroll-linked timeline: years stick beside their entries while a beam fills
 * the rail as you read down, and each dot lights up once the beam reaches it.
 * The scroll math writes straight to the DOM so scrolling never re-renders.
 */
export function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const beam = beamRef.current;
    if (!container || !beam) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the list's top reaches 10% of the viewport, 1 when its bottom
      // reaches the middle.
      const span = Math.max(1, rect.height - vh * 0.4);
      const progress = Math.min(1, Math.max(0, (vh * 0.1 - rect.top) / span));
      const filled = progress * rect.height;
      beam.style.height = `${filled}px`;
      beam.style.opacity = progress > 0 ? "1" : "0";
      for (const dot of dotRefs.current) {
        if (!dot) continue;
        const dotTop =
          dot.getBoundingClientRect().top - rect.top + dot.offsetHeight / 2;
        dot.dataset.lit = String(filled >= dotTop);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Rail and the beam that fills it. */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 left-[19px] w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,transparent,rgb(160_190_240/0.22)_8%,rgb(160_190_240/0.22)_92%,transparent)] md:left-[27px]"
      >
        <div
          ref={beamRef}
          className="absolute inset-x-0 top-0 h-0 rounded-full bg-[linear-gradient(to_top,var(--brand),#a9ccff_40%,transparent)] opacity-0 shadow-[0_0_12px_1px_rgb(111_168_255/0.6)] transition-opacity duration-300"
        />
      </div>

      <ol>
        {entries.map((entry, i) => (
          <li
            key={entry.period}
            className="relative flex justify-start pt-12 first:pt-2 md:gap-10 md:pt-32 md:first:pt-4"
          >
            <div className="sticky top-32 z-10 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                data-lit="false"
                aria-hidden
                className="glass group absolute left-0 flex size-10 items-center justify-center rounded-full md:left-2"
              >
                <span className="size-3.5 rounded-full border border-white/25 bg-white/15 transition-[background-color,box-shadow,border-color] duration-500 group-data-[lit=true]:border-transparent group-data-[lit=true]:bg-brand group-data-[lit=true]:shadow-[0_0_14px_3px_rgb(111_168_255/0.65)]" />
              </span>
              <h3 className="hidden font-display text-5xl leading-none font-normal tracking-tight text-foreground/45 md:block md:pl-20">
                {entry.period}
              </h3>
            </div>

            <div className="relative w-full pl-16 md:pl-4">
              <h3 className="mb-4 block font-display text-3xl leading-none text-foreground/55 md:hidden">
                {entry.period}
              </h3>
              <article className="glass glass-interactive rounded-3xl p-6 sm:p-7">
                <p className="text-label text-brand">{entry.title}</p>
                <p className="mt-3 leading-relaxed text-foreground/85">
                  {entry.body}
                </p>
                {entry.stats ? (
                  <dl className="mt-6 grid grid-cols-2 gap-3">
                    {entry.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col-reverse justify-end rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <dt className="mt-1.5 text-xs leading-snug text-muted-foreground">
                          {stat.label}
                        </dt>
                        <dd className="font-display text-3xl leading-none">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </article>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
