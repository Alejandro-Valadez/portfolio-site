"use client";

import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

export function WorkList({ projects }: { projects: readonly Project[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ol className="border-t border-border">
      {projects.map((project, i) => {
        const expanded = open === i;
        const panelId = `work-panel-${i}`;
        return (
          <li key={project.title} className="border-b border-border">
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-5 text-left sm:grid-cols-[3.5rem_1fr_auto_auto] sm:gap-x-6"
              >
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl leading-tight transition-colors group-hover:text-ember sm:text-3xl">
                  {project.title}
                </span>
                <span className="text-label hidden text-muted-foreground sm:inline">
                  {project.kind}
                </span>
                <Plus
                  aria-hidden
                  className={cn(
                    "size-4 self-center text-muted-foreground transition-transform duration-300",
                    expanded && "rotate-45 text-foreground"
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-label={project.title}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden" inert={!expanded}>
                <div className="grid gap-5 pb-7 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6">
                  <div className="hidden sm:block" />
                  <div className="max-w-2xl">
                    {project.highlight ? (
                      <p className="text-label mb-3 text-ember">{project.highlight}</p>
                    ) : null}
                    <p className="leading-relaxed text-muted-foreground">{project.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <ul className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                      {project.links?.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-ember"
                        >
                          {link.label}
                          <ArrowUpRight aria-hidden className="size-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
