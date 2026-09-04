import Link from "next/link";
import {
  Code,
  Briefcase,
  Mail,
  ExternalLink,
  Download,
  GraduationCap,
  Award,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ACTIVITIES, HONORS, PROFILE, PROJECTS, SKILLS } from "@/lib/content";

function SectionDivider() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <hr className="border-border" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section
          id="home"
          className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center"
        >
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Hi, I&apos;m
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-6xl">
            {PROFILE.name}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            {PROFILE.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {PROFILE.badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="#projects" className={cn(buttonVariants({ size: "lg" }))}>
              View My Work
            </Link>
            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noopener"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <Download /> Résumé
            </a>
          </div>
        </section>

        <SectionDivider />

        {/* About */}
        <section id="about" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            About Me
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
            <Avatar className="mx-auto size-28 border border-border">
              <AvatarFallback className="bg-secondary font-heading text-xl text-secondary-foreground">
                AV
              </AvatarFallback>
            </Avatar>
            <div className="space-y-4 text-center sm:text-left">
              {PROFILE.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <h3 className="mt-14 text-center font-heading text-lg font-semibold">
            What I Work With
          </h3>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {SKILLS.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-4 py-1.5 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            Projects &amp; Experience
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Engineering, software, research, service, and one small business —
            the things I&apos;ve actually built and done.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <Card key={project.title} className="gap-4">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    {project.kind}
                  </Badge>
                  <CardTitle className="mt-2 font-heading">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.highlight ? (
                    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      <Award className="size-4 shrink-0" />
                      {project.highlight}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                {project.links?.length ? (
                  <CardFooter className="gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {link.label} <ExternalLink className="size-3.5" />
                      </a>
                    ))}
                  </CardFooter>
                ) : null}
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            More code — including a Python utility library and this site — lives on{" "}
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener"
              className="font-medium text-primary hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <SectionDivider />

        {/* Honors */}
        <section id="honors" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            Honors &amp; Awards
          </h2>
          <ol className="mx-auto mt-10 max-w-3xl border-l border-border">
            {HONORS.map((honor) => (
              <li
                key={`${honor.date}-${honor.title}`}
                className="relative py-4 pl-6"
              >
                <span
                  aria-hidden
                  className="absolute top-6 -left-[4.5px] size-2 rounded-full bg-primary"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <time className="font-mono text-xs text-muted-foreground">
                    {honor.date}
                  </time>
                  {honor.scope ? (
                    <Badge variant="outline" className="text-xs">
                      {honor.scope}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 font-medium">{honor.title}</p>
                {honor.org ? (
                  <p className="text-sm text-muted-foreground">{honor.org}</p>
                ) : null}
                {honor.note ? (
                  <p className="mt-1 max-w-prose text-sm text-muted-foreground/80">
                    {honor.note}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <SectionDivider />

        {/* Activities */}
        <section id="activities" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            Activities
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((group) => (
              <Card key={group.heading} className="gap-4">
                <CardHeader>
                  <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Users className="size-4" />
                  </div>
                  <CardTitle className="font-heading">{group.heading}</CardTitle>
                  <CardDescription>{group.note}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden className="text-primary">
                          &bull;
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Contact */}
        <section
          id="contact"
          className="mx-auto max-w-5xl px-6 py-20 text-center"
        >
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Get In Touch
          </h2>
          <p className="mt-3 text-muted-foreground">
            Have a question, an opportunity, or something to build? Reach out.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${PROFILE.email}`}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <Mail /> Email Me
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <Code /> GitHub
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <Briefcase /> LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-1.5">
          <GraduationCap className="size-4" />
          &copy; {new Date().getFullYear()} {PROFILE.name}
        </p>
      </footer>
    </>
  );
}
