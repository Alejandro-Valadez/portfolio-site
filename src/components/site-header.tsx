"use client";

import Link from "next/link";
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

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#honors", label: "Honors" },
  { href: "#activities", label: "Activities" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="#home" className="font-heading text-base font-bold tracking-tight">
          Alejandro Valadez
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
            aria-label="Open menu"
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="font-heading">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
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
    </header>
  );
}
