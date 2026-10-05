// Shared between the audit API route and the client UI.

export type CategoryKey = "seo" | "security" | "accessibility" | "performance";

export type Severity = "critical" | "warning" | "info";

export type CheckResult = {
  id: string;
  title: string;
  passed: boolean;
  /** Only meaningful when `passed` is false. */
  severity?: Severity;
  detail: string;
  fix?: string;
};

export type CategoryResult = {
  key: CategoryKey;
  label: string;
  score: number;
  grade: Grade;
  checks: CheckResult[];
};

export type Grade = "A" | "B" | "C" | "D" | "F";

export type AuditReport = {
  url: string;
  finalUrl: string;
  scannedAt: string;
  durationMs: number;
  score: number;
  grade: Grade;
  verdict: string;
  categories: CategoryResult[];
  totals: { issues: number; critical: number; passing: number; checks: number };
};

export const CATEGORY_META: Record<CategoryKey, { label: string; weight: number; blurb: string }> = {
  seo: {
    label: "SEO",
    weight: 0.35,
    blurb: "Titles, descriptions, headings, social previews, structured data, robots.txt, and sitemap.",
  },
  security: {
    label: "Security",
    weight: 0.25,
    blurb: "HTTPS, HSTS, clickjacking protection, CSP, and the other headers browsers rely on.",
  },
  accessibility: {
    label: "Accessibility",
    weight: 0.2,
    blurb: "Viewport, language, alt text, labels, landmarks, and controls a screen reader can name.",
  },
  performance: {
    label: "Performance",
    weight: 0.2,
    blurb: "Server response time, compression, page weight, caching, lazy loading, and blocking scripts.",
  },
};

export const SEVERITY_PENALTY: Record<Severity, number> = {
  critical: 25,
  warning: 10,
  info: 3,
};

export function toGrade(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
