import type { Metadata } from "next";
import { PROFILE } from "@/lib/content";

// Primary (canonical) origin. www.alejandrovaladez.me redirects here via
// Vercel's domain settings. Override with NEXT_PUBLIC_SITE_URL if needed.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://alejandrovaladez.me"
).replace(/\/$/, "");

export const SITE_NAME = PROFILE.name;

export const HOME_TITLE = `${PROFILE.name} | IMSA Student, Developer & Researcher`;

export const HOME_DESCRIPTION = `${PROFILE.name} is a sophomore at the Illinois Mathematics and Science Academy (IMSA) building software, doing STEM research, and competing in math.`;

// Public profiles that belong to Alejandro, used for JSON-LD `sameAs`.
// TODO(Alejandro): add any other public profiles here (e.g. a ResearchGate
// author profile, ORCID, X/Twitter, Instagram) — profile pages only, not
// individual posts or publications.
export const SAME_AS: readonly string[] = [PROFILE.github, PROFILE.linkedin];

export const KNOWS_ABOUT: readonly string[] = [
  "Software development",
  "TypeScript",
  "Python",
  "Model Context Protocol",
  "Aerospace engineering",
  "Quantum computing",
  "Competition mathematics",
  "Physics research",
  "Experimental design",
  "Policy debate",
];

const SHARE_IMAGE = {
  width: 1200,
  height: 630,
  alt: `${PROFILE.name} — IMSA student, developer, and researcher`,
};

// Builds per-page metadata. Open Graph / Twitter objects are replaced (not
// merged) by child segments, which also drops the root opengraph-image, so
// every page supplies the full set including images.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: path === "/" ? "profile" : "website",
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      images: [{ url: "/opengraph-image", ...SHARE_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/twitter-image", ...SHARE_IMAGE }],
    },
  };
}
