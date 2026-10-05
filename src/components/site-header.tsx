"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/#profile", label: "Profile" },
  { href: "/#work", label: "Work" },
  { href: "/#honors", label: "Honors" },
  { href: "/audit", label: "Site Audit" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-border/80 bg-background/80 pr-2 pl-5 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <Link href="/" className="flex items-baseline gap-1.5 font-display text-xl leading-none">
          Alejandro Valadez
          <span aria-hidden className="size-1.5 rounded-full bg-ember" />
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = link.href === pathname;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    active && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle className="rounded-full" />

          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full md:hidden")}
              aria-label="Open menu"
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl font-normal">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
