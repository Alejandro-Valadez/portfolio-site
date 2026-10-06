"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, Info, Loader2, OctagonAlert } from "lucide-react";
import {
  CATEGORY_META,
  type AuditReport,
  type CategoryResult,
  type CheckResult,
  type Grade,
} from "@/lib/audit/types";
import { cn } from "@/lib/utils";

const STEPS = [
  "Resolving the domain",
  "Fetching the page",
  "Reading security headers",
  "Checking SEO tags",
  "Testing accessibility",
  "Measuring performance",
];

const gradeTone: Record<Grade, string> = {
  A: "text-success",
  B: "text-success",
  C: "text-warning",
  D: "text-brand",
  F: "text-destructive",
};

function ScoreRing({ score, grade }: { score: number; grade: Grade }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--muted)" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", gradeTone[grade])}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl leading-none">{score}</span>
        <span className="mt-1 font-mono text-[11px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function StatusIcon({ check }: { check: CheckResult }) {
  if (check.passed) return <Check aria-label="Passed" className="size-4 text-success" />;
  if (check.severity === "critical")
    return <OctagonAlert aria-label="Critical" className="size-4 text-destructive" />;
  if (check.severity === "warning")
    return <AlertTriangle aria-label="Warning" className="size-4 text-warning" />;
  return <Info aria-label="Suggestion" className="size-4 text-muted-foreground" />;
}

function CategoryPanel({ category }: { category: CategoryResult }) {
  const [showPassing, setShowPassing] = useState(false);
  const issues = category.checks.filter((c) => !c.passed);
  const passing = category.checks.filter((c) => c.passed);
  const order = { critical: 0, warning: 1, info: 2 } as const;
  issues.sort((a, b) => order[a.severity ?? "info"] - order[b.severity ?? "info"]);

  return (
    <section
      id={`audit-${category.key}`}
      aria-labelledby={`audit-${category.key}-title`}
      className="glass scroll-mt-24 rounded-3xl"
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <h3 id={`audit-${category.key}-title`} className="font-display text-2xl font-normal">
            {category.label}
          </h3>
          <p className="text-sm text-muted-foreground">
            {issues.length === 0
              ? `All ${passing.length} checks passing`
              : `${issues.length} to fix · ${passing.length} passing`}
          </p>
        </div>
        <div className="text-right">
          <p className={cn("font-display text-4xl leading-none", gradeTone[category.grade])}>
            {category.grade}
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">{category.score}/100</p>
        </div>
      </header>

      <ul className="divide-y divide-border">
        {issues.map((check) => (
          <li key={check.id} className="grid grid-cols-[1.25rem_1fr] gap-3 px-6 py-4">
            <span className="mt-0.5">
              <StatusIcon check={check} />
            </span>
            <div>
              <p className="flex flex-wrap items-center gap-2 font-medium">
                {check.title}
                <span
                  className={cn(
                    "rounded-full px-2 py-px font-mono text-[10px] tracking-wider uppercase",
                    check.severity === "critical" && "bg-destructive/10 text-destructive",
                    check.severity === "warning" && "bg-warning/15 text-warning",
                    check.severity === "info" && "bg-muted text-muted-foreground"
                  )}
                >
                  {check.severity === "info" ? "suggestion" : check.severity}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{check.detail}</p>
              {check.fix ? (
                <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm">
                  <span className="text-label mr-2 text-brand">Fix</span>
                  {check.fix}
                </p>
              ) : null}
            </div>
          </li>
        ))}

        {passing.length > 0 ? (
          <li className="px-6 py-3">
            <button
              type="button"
              onClick={() => setShowPassing((s) => !s)}
              aria-expanded={showPassing}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {showPassing ? "Hide" : "Show"} {passing.length} passing check
              {passing.length === 1 ? "" : "s"}
            </button>
          </li>
        ) : null}

        {showPassing
          ? passing.map((check) => (
              <li key={check.id} className="grid grid-cols-[1.25rem_1fr] gap-3 px-6 py-3">
                <span className="mt-0.5">
                  <StatusIcon check={check} />
                </span>
                <div>
                  <p className="text-sm font-medium">{check.title}</p>
                  <p className="text-sm break-words text-muted-foreground">{check.detail}</p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </section>
  );
}

export function AuditTool() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("url") ?? "";

  const [input, setInput] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  async function run(target: string) {
    if (!target.trim() || loading) return;
    setLoading(true);
    setError(null);
    setReport(null);
    setStep(0);
    const ticker = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 650);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setReport(data as AuditReport);
      router.replace(`/audit?url=${encodeURIComponent(target.trim())}`, { scroll: false });
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      clearInterval(ticker);
      setLoading(false);
    }
  }

  // Shared links like /audit?url=example.com run straight away.
  useEffect(() => {
    if (initial && !ran.current) {
      ran.current = true;
      void run(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(input);
        }}
        className="mx-auto flex max-w-xl flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="audit-url" className="sr-only">
          Website address
        </label>
        <input
          id="audit-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="yourwebsite.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-12 flex-1 rounded-full border border-white/15 bg-black/30 px-5 backdrop-blur-md text-base outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
          {loading ? "Scanning" : "Run audit"}
          {loading ? null : <ArrowRight aria-hidden className="size-4" />}
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Free, no sign-up. Nothing you scan is stored.
      </p>

      <div aria-live="polite" className="sr-only">
        {loading ? "Scanning, please wait." : report ? `Audit finished. Score ${report.score} out of 100.` : ""}
      </div>

      {loading ? (
        <ol className="mx-auto mt-10 max-w-sm space-y-2 font-mono text-sm">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 transition-opacity",
                i > step ? "opacity-30" : "opacity-100"
              )}
            >
              {i < step ? (
                <Check aria-hidden className="size-3.5 text-success" />
              ) : i === step ? (
                <Loader2 aria-hidden className="size-3.5 animate-spin text-brand" />
              ) : (
                <span className="size-3.5" />
              )}
              {label}
            </li>
          ))}
        </ol>
      ) : null}

      {error ? (
        <p role="alert" className="mx-auto mt-6 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-3 text-center text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {report ? (
        <div ref={resultsRef} className="mt-14 scroll-mt-24 space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
          <div className="glass flex flex-col items-center gap-6 rounded-3xl p-6 sm:flex-row sm:p-8">
            <ScoreRing score={report.score} grade={report.grade} />
            <div className="min-w-0 text-center sm:text-left">
              <p className={cn("text-label", gradeTone[report.grade])}>Grade {report.grade}</p>
              <h2 className="mt-1 font-display text-3xl leading-tight font-normal">{report.verdict}</h2>
              <a
                href={report.finalUrl}
                target="_blank"
                rel="noopener nofollow"
                className="mt-1 block truncate text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {report.finalUrl}
              </a>
              <dl className="mt-4 flex justify-center gap-6 sm:justify-start">
                {[
                  ["To fix", report.totals.issues, ""],
                  ["Critical", report.totals.critical, report.totals.critical ? "text-destructive" : ""],
                  ["Passing", report.totals.passing, "text-success"],
                ].map(([label, value, tone]) => (
                  <div key={label as string} className="flex flex-col-reverse">
                    <dt className="text-label mt-1 text-muted-foreground">{label}</dt>
                    <dd className={cn("font-display text-3xl leading-none", tone as string)}>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 font-mono text-[11px] text-muted-foreground">
                {report.totals.checks} checks · {(report.durationMs / 1000).toFixed(1)}s ·{" "}
                {new Date(report.scannedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {report.categories.map((c) => (
              <a
                key={c.key}
                href={`#audit-${c.key}`}
                className="glass glass-interactive rounded-2xl p-4 text-center"
              >
                <p className="text-label text-muted-foreground">{c.label}</p>
                <p className={cn("mt-2 font-display text-4xl leading-none", gradeTone[c.grade])}>
                  {c.grade}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{c.score}/100</p>
              </a>
            ))}
          </div>

          {report.categories.map((c) => (
            <CategoryPanel key={c.key} category={c} />
          ))}

          <p className="text-center text-xs text-muted-foreground">
            Category weights:{" "}
            {Object.values(CATEGORY_META)
              .map((m) => `${m.label} ${Math.round(m.weight * 100)}%`)
              .join(" · ")}
            . Critical issues cost 25 points, warnings 10, suggestions 3.
          </p>
        </div>
      ) : null}
    </div>
  );
}
