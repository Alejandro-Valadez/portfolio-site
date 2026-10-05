import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { ProfileBento } from "@/components/profile-bento";
import { Reveal } from "@/components/reveal";
import { WorkList } from "@/components/work-list";
import { ACTIVITIES, HONORS, PROFILE, PROJECTS } from "@/lib/content";
import { PLAYLIST } from "@/lib/playlist";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  KNOWS_ABOUT,
  SAME_AS,
  SITE_NAME,
  SITE_URL,
  pageMetadata,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      url: SITE_URL,
      image: `${SITE_URL}${PROFILE.photo}`,
      description: HOME_DESCRIPTION,
      jobTitle: "Student",
      affiliation: {
        "@type": "HighSchool",
        name: "Illinois Mathematics and Science Academy",
        url: "https://www.imsa.edu",
      },
      knowsAbout: KNOWS_ABOUT,
      knowsLanguage: ["English", "Spanish"],
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: HOME_DESCRIPTION,
      inLanguage: "en-US",
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

const STATS = [
  { value: "8", label: "rocket workshops at INSA Toulouse" },
  { value: "$3,000", label: "raised by a dance I helped get approved" },
  { value: "5,000+", label: "followers for my shaved ice stand" },
  { value: "4.0", label: "unweighted GPA, freshman year" },
];

function SectionHeading({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-label text-muted-foreground">
          <span className="text-ember">{index}</span> / {label}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none font-normal tracking-tight sm:text-5xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

const iconLink =
  "inline-flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-5 pt-16 pb-16 sm:pt-24">
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
            <div className="flex items-center gap-3">
              <Image
                src={PROFILE.photo}
                alt={PROFILE.name}
                width={56}
                height={56}
                priority
                className="size-14 rounded-full border border-border object-cover"
              />
              <p className="text-label text-muted-foreground">
                IMSA sophomore
                <span className="mx-2 text-ember">·</span>
                Class of 2029
              </p>
            </div>

            <h1 className="mt-8 font-display text-6xl leading-[0.95] font-normal tracking-tight sm:text-8xl">
              Alejandro
              <br />
              Valadez<span className="text-ember">.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl">
              {PROFILE.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#work"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                See my work <ArrowRight aria-hidden className="size-4" />
              </Link>
              <a
                href={PROFILE.resume}
                target="_blank"
                rel="noopener"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-foreground/30"
              >
                <Download aria-hidden className="size-4" /> Résumé
              </a>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
              <div className="flex gap-3">
                <a href={PROFILE.github} target="_blank" rel="noopener" aria-label="GitHub" className={iconLink}>
                  <GitHubIcon className="size-4" />
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className={iconLink}>
                  <LinkedInIcon className="size-4" />
                </a>
                <a href={`mailto:${PROFILE.email}`} aria-label="Email" className={iconLink}>
                  <Mail aria-hidden className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end bg-background p-5">
                <dt className="mt-2 text-sm leading-snug text-muted-foreground">{stat.label}</dt>
                <dd className="font-display text-4xl leading-none">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Profile bento */}
        <section id="profile" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16">
          <Reveal>
            <SectionHeading index="01" label="Profile" title="The short version" />
            <ProfileBento />
          </Reveal>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-label text-muted-foreground">
                  <span className="text-ember">02</span> / About
                </p>
                <h2 className="mt-3 font-display text-4xl leading-none font-normal tracking-tight sm:text-5xl md:sticky md:top-28">
                  Why I do this
                </h2>
              </div>
              <div className="space-y-5 text-[17px] leading-relaxed text-muted-foreground">
                {PROFILE.bio.map((paragraph, i) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className={i === 0 ? "text-xl leading-relaxed text-foreground" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* Work */}
        <section id="work" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16">
          <Reveal>
            <SectionHeading index="03" label="Work" title="Things I've built and run">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                More on GitHub <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </SectionHeading>
            <WorkList projects={PROJECTS} />
          </Reveal>
        </section>

        {/* Audit teaser */}
        <section aria-labelledby="audit-teaser" className="mx-auto max-w-5xl px-5 py-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-foreground px-6 py-12 text-background sm:px-12 sm:py-16">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 size-72 rounded-full bg-ember opacity-30 blur-3xl"
              />
              <p className="text-label relative opacity-60">Free tool · built by me</p>
              <h2
                id="audit-teaser"
                className="relative mt-4 max-w-xl font-display text-4xl leading-[1.05] font-normal sm:text-5xl"
              >
                How does your website hold up?
              </h2>
              <p className="relative mt-4 max-w-lg opacity-70">
                My audit tool checks about 45 things across SEO, security headers, accessibility, and
                performance, then tells you exactly how to fix each one.
              </p>
              <form action="/audit" method="get" className="relative mt-8 flex max-w-lg flex-col gap-2 sm:flex-row">
                <label htmlFor="teaser-url" className="sr-only">
                  Website address
                </label>
                <input
                  id="teaser-url"
                  name="url"
                  type="text"
                  inputMode="url"
                  required
                  spellCheck={false}
                  placeholder="yourwebsite.com"
                  className="h-12 flex-1 rounded-full border border-background/20 bg-background/10 px-5 text-background outline-none placeholder:text-background/50 focus-visible:border-background/60"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background px-6 font-medium text-foreground transition-transform hover:-translate-y-0.5"
                >
                  Run audit <ArrowRight aria-hidden className="size-4" />
                </button>
              </form>
            </div>
          </Reveal>
        </section>

        {/* Honors */}
        <section id="honors" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16">
          <Reveal>
            <SectionHeading index="04" label="Honors" title="Recognition" />
            <ol className="border-t border-border">
              {HONORS.map((honor) => (
                <li
                  key={`${honor.date}-${honor.title}`}
                  className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1 border-b border-border py-4 sm:grid-cols-[7rem_1fr_auto]"
                >
                  <time className="pt-0.5 font-mono text-xs text-muted-foreground">{honor.date}</time>
                  <div>
                    <p className="font-medium">{honor.title}</p>
                    {honor.org ? <p className="text-sm text-muted-foreground">{honor.org}</p> : null}
                    {honor.note ? (
                      <p className="mt-1 max-w-prose text-sm text-muted-foreground/80">{honor.note}</p>
                    ) : null}
                  </div>
                  {honor.scope ? (
                    <p className="text-label col-start-2 text-muted-foreground sm:col-start-3 sm:pt-1">
                      {honor.scope}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* Activities */}
        <section id="activities" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16">
          <Reveal>
            <SectionHeading index="05" label="Activities" title="Where my time goes" />
            <div className="grid gap-10 md:grid-cols-3">
              {ACTIVITIES.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-display text-2xl leading-tight font-normal">{group.heading}</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{group.note}</p>
                  <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item} className="border-l-2 border-border pl-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-5xl scroll-mt-24 px-5 pt-16 pb-28">
          <Reveal>
            <div className="border-t border-border pt-16 text-center">
              <p className="text-label text-muted-foreground">
                <span className="text-ember">06</span> / Contact
              </p>
              <h2 className="mt-4 font-display text-6xl leading-none font-normal tracking-tight sm:text-8xl">
                Let&apos;s talk.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-muted-foreground">
                A question, an opportunity, or something you want built. Email is the fastest way
                to reach me.
              </p>
              <a
                href={`mailto:${PROFILE.email}`}
                className="mt-8 inline-block font-display text-2xl break-all underline decoration-border decoration-1 underline-offset-8 transition-colors hover:decoration-ember sm:text-3xl"
              >
                {PROFILE.email}
              </a>
              <div className="mt-8 flex justify-center gap-3">
                <a href={PROFILE.github} target="_blank" rel="noopener" aria-label="GitHub" className={iconLink}>
                  <GitHubIcon className="size-4" />
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className={iconLink}>
                  <LinkedInIcon className="size-4" />
                </a>
                <a href={PROFILE.resume} target="_blank" rel="noopener" aria-label="Résumé (PDF)" className={iconLink}>
                  <Download aria-hidden className="size-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 pb-24 text-sm text-muted-foreground sm:pb-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {PROFILE.name}</p>
          <p className="text-center text-xs">
            Music: &ldquo;{PLAYLIST[0].title}&rdquo; by {PLAYLIST[0].artist}. All rights belong to the
            artist.
          </p>
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Privacy
          </Link>
        </div>
      </footer>
    </>
  );
}
