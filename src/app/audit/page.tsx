import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditTool } from "@/components/audit/audit-tool";
import { CATEGORY_META, SEVERITY_PENALTY } from "@/lib/audit/types";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Free Website Audit: SEO, Security & Speed | Alejandro Valadez",
  description:
    "Paste any URL and get a graded report on SEO, security headers, accessibility, and performance, with a specific fix for every issue. Free, no sign-up.",
  path: "/audit",
});

const FAQ = [
  {
    q: "What does it check?",
    a: "About 45 things across four areas: SEO (title, description, headings, canonical, Open Graph, structured data, robots.txt, sitemap), security (HTTPS, HSTS, clickjacking, CSP, cookie flags, mixed content), accessibility (viewport, zoom, language, alt text, labels, landmarks), and performance (response time, compression, page weight, caching, blocking scripts).",
  },
  {
    q: "How is the grade calculated?",
    a: `Each category starts at 100. A critical issue costs ${SEVERITY_PENALTY.critical} points, a warning ${SEVERITY_PENALTY.warning}, and a suggestion ${SEVERITY_PENALTY.info}. The overall score weights ${Object.values(
      CATEGORY_META
    )
      .map((m) => `${m.label} at ${Math.round(m.weight * 100)}%`)
      .join(", ")}. 90+ is an A, 80+ a B, 70+ a C, 60+ a D.`,
  },
  {
    q: "Is it the same as Lighthouse?",
    a: "No. Lighthouse loads the page in a real browser and measures rendering. This tool reads the HTML and HTTP headers your server sends, which is faster and catches header and markup problems Lighthouse doesn't focus on. Use both.",
  },
  {
    q: "Do you store what I scan?",
    a: "No. The audit runs on request and the result lives in your browser tab. The server keeps a two-minute cache so repeat scans of the same URL are instant, then it's gone.",
  },
  {
    q: "Why can't I scan localhost or a private IP?",
    a: "The scanner runs on my server, so it blocks private and internal addresses on purpose. That keeps it from being used to poke at networks it shouldn't reach.",
  },
];

export default function AuditPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-5 pt-16 pb-28 sm:pt-24">
      <header className="text-center">
        <p className="text-label text-brand">Free tool</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] font-normal tracking-tight sm:text-7xl">
          What&apos;s wrong with <em className="text-muted-foreground">your</em> website?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
          Paste a URL. In a few seconds you get a graded report on SEO, security headers,
          accessibility, and performance, with the exact fix for every issue.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<div className="mx-auto h-12 max-w-xl rounded-full border border-white/15 bg-black/30" />}>
          <AuditTool />
        </Suspense>
      </div>

      <section aria-labelledby="checks-title" className="mt-24">
        <h2 id="checks-title" className="text-label text-center text-muted-foreground">
          What gets checked
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Object.entries(CATEGORY_META).map(([key, meta], i) => (
            <div key={key} className="glass glass-interactive rounded-3xl p-6">
              <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
              <h3 className="mt-2 font-display text-2xl font-normal">{meta.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-title" className="mt-24">
        <h2 id="faq-title" className="font-display text-4xl font-normal">
          Questions
        </h2>
        <div className="glass mt-6 rounded-3xl px-6">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-white/10 py-5 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="text-xl text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-16 text-center text-sm text-muted-foreground">
        Built by Alejandro Valadez with Next.js. The scanner fetches each page server-side and
        parses its HTML and headers.
      </p>
    </main>
  );
}
