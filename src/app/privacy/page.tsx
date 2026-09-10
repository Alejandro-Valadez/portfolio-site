import type { Metadata } from "next";
import Link from "next/link";
import { PROFILE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy — Alejandro Valadez",
  description: "What information this site collects, and what it doesn't.",
};

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: September 10, 2026
      </p>

      <div className="mt-10 space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Overview
          </h2>
          <p className="mt-2">
            This is a personal portfolio site for {PROFILE.name}. It doesn&apos;t
            run ads, doesn&apos;t sell anything, and doesn&apos;t use analytics,
            tracking scripts, or cookies of any kind. This page explains the
            little bit of data that does pass through it.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Information collected
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-foreground">
                If you email me:
              </span>{" "}
              the &quot;Email Me&quot; link opens your own email client and
              sends the message directly to my inbox. I receive your email
              address and whatever you choose to write. I don&apos;t use it
              for anything besides replying to you.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Standard hosting logs:
              </span>{" "}
              this site is hosted on Vercel. Like almost any web host, Vercel&apos;s
              infrastructure may briefly log basic technical data (e.g. IP
              address, browser type, request timestamps) for security and
              reliability. I don&apos;t access, store, or use this data myself.
            </li>
            <li>
              <span className="font-medium text-foreground">
                No cookies, no analytics, no trackers:
              </span>{" "}
              this site doesn&apos;t set cookies, run analytics, or embed any
              third-party tracking or advertising scripts.
            </li>
            <li>
              <span className="font-medium text-foreground">Fonts:</span> this
              site uses Google Fonts (Archivo and Space Grotesk), but they are
              self-hosted at build time rather than loaded from Google&apos;s
              servers at runtime — so visiting this site doesn&apos;t share any
              data with Google through font loading.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Third-party links
          </h2>
          <p className="mt-2">
            This site links out to GitHub, LinkedIn, and a downloadable résumé
            PDF. Once you leave this site, the destination&apos;s own privacy
            policy applies.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Children&apos;s privacy
          </h2>
          <p className="mt-2">
            This site isn&apos;t directed at children and doesn&apos;t
            knowingly collect personal information from anyone, including
            children under 13.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Changes
          </h2>
          <p className="mt-2">
            If what this site collects ever changes (for example, if analytics
            or a contact form is added later), this page will be updated to
            reflect that before the change goes live.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Contact
          </h2>
          <p className="mt-2">
            Questions about this policy can go to{" "}
            <a
              href={`mailto:${PROFILE.email}`}
              className="font-medium text-primary hover:underline"
            >
              {PROFILE.email}
            </a>
            .
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-12 inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to home
      </Link>
    </main>
  );
}
