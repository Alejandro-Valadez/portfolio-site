import type { Metadata } from "next";
import Link from "next/link";
import { PROFILE } from "@/lib/content";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Privacy Policy | ${PROFILE.name}`,
  description: `Privacy policy for ${PROFILE.name}'s portfolio site: no analytics or ads. Covers the YouTube-powered music player, the website audit tool, and email.`,
  path: "/privacy",
});

export default function PrivacyPolicy() {
  return (
    <main id="main-content" className="glass mx-auto my-10 w-[calc(100%-2rem)] max-w-2xl rounded-[2rem] px-6 py-14 sm:px-10">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: October 5, 2026
      </p>

      <div className="mt-10 space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Overview
          </h2>
          <p className="mt-2">
            This is a personal portfolio site for {PROFILE.name}. It doesn&apos;t
            run ads, doesn&apos;t sell anything, and doesn&apos;t use analytics.
            The site itself sets no cookies. This page explains the little bit
            of data that does pass through it, including the one third-party
            service it uses: YouTube, for the music player.
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
              <span className="font-medium text-foreground">Music player:</span>{" "}
              the song streams from YouTube&apos;s embedded player, using
              YouTube&apos;s privacy-enhanced mode (youtube-nocookie.com). The
              embed only loads after you interact with the page, by scrolling,
              clicking, typing, or pointing at the player. Once it loads,
              YouTube receives your IP address and browser details like any
              video embed, and Google&apos;s privacy policy applies to that
              data. Your track, volume, and playback position are saved in
              your own browser&apos;s local storage so the music can resume
              where you left off. That data never leaves your device.
            </li>
            <li>
              <span className="font-medium text-foreground">Website audit tool:</span>{" "}
              when you run an audit, the address you enter is sent to this
              site&apos;s server, which fetches that public page to check it.
              Results are cached in memory for about two minutes and are not
              stored or logged by me. To prevent abuse, the server keeps a
              short-lived, in-memory count of requests per IP address that is
              never written to disk.
            </li>
            <li>
              <span className="font-medium text-foreground">No analytics or ads:</span>{" "}
              this site doesn&apos;t run analytics or embed any advertising
              scripts.
            </li>
            <li>
              <span className="font-medium text-foreground">Fonts:</span> this
              site uses Google Fonts (Geist, Geist Mono, and Instrument Serif),
              self-hosted at build time rather than loaded from Google&apos;s
              servers, so font loading doesn&apos;t share any data with Google.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Third-party links
          </h2>
          <p className="mt-2">
            This site links out to GitHub, LinkedIn, and YouTube, and offers a
            downloadable résumé and CV as PDFs. Once you leave this site, the destination&apos;s own privacy
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
