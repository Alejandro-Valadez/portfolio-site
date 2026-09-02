import Link from "next/link";
import {
  Code,
  Briefcase,
  Mail,
  ExternalLink,
  Folder,
  GraduationCap,
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

const PROJECTS = [
  {
    title: "Project One",
    description:
      "Short description of what this project does and what you used to build it.",
    tags: ["React", "TypeScript"],
  },
  {
    title: "Project Two",
    description:
      "Short description of what this project does and what you used to build it.",
    tags: ["Python", "Data"],
  },
  {
    title: "Project Three",
    description:
      "Short description of what this project does and what you used to build it.",
    tags: ["Next.js", "Tailwind"],
  },
];

const SKILLS = [
  "HTML & CSS",
  "JavaScript",
  "Python",
  "Git & GitHub",
  "React",
  "Add your own…",
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section id="home" className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Hi, I&apos;m
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-6xl">
            Alejandro Valadez
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            Student, STEM competitor, and builder — Jones College Prep &amp; IMSA
            PROMISE. Turning classroom math and science into things that actually run.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary">Jones College Prep</Badge>
            <Badge variant="secondary">IMSA PROMISE</Badge>
            <Badge variant="secondary">Math Team</Badge>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="#projects" className={cn(buttonVariants({ size: "lg" }))}>
              View My Work
            </Link>
            <Link
              href="#contact"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Get In Touch
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6">
          <hr className="border-border" />
        </div>

        {/* About */}
        <section id="about" className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            About Me
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
            <Avatar className="mx-auto size-28 border border-border">
              <AvatarFallback className="bg-secondary font-heading text-xl text-secondary-foreground">
                AV
              </AvatarFallback>
            </Avatar>
            <div className="space-y-4 text-center sm:text-left">
              <p className="text-muted-foreground">
                Replace this paragraph with a short bio — who you are, what you do,
                and what you&apos;re interested in. A couple of sentences is plenty;
                visitors skim this section.
              </p>
              <p className="text-muted-foreground">
                Mention your background, current focus (student, job, hobby
                projects), and anything that makes you distinct — languages you
                speak, tools you love, or a fun fact.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6">
          <hr className="border-border" />
        </div>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            Projects
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project) => (
              <Card key={project.title} className="gap-4">
                <CardHeader>
                  <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Folder className="size-4" />
                  </div>
                  <CardTitle className="font-heading">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </CardContent>
                <CardFooter className="gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Live Demo <ExternalLink className="size-3.5" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Source <ExternalLink className="size-3.5" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6">
          <hr className="border-border" />
        </div>

        {/* Skills */}
        <section id="skills" className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
            Skills
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {SKILLS.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-4 py-1.5 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6">
          <hr className="border-border" />
        </div>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Get In Touch
          </h2>
          <p className="mt-3 text-muted-foreground">
            Have a question or want to work together? Reach out below.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:alejandrovaladezmail@gmail.com"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <Mail /> Email Me
            </a>
            <a
              href="https://github.com/f1alej"
              target="_blank"
              rel="noopener"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <Code /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/alejandro-valadez"
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
          &copy; {new Date().getFullYear()} Alejandro Valadez
        </p>
      </footer>
    </>
  );
}
