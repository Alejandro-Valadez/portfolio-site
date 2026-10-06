import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectCover } from "@/lib/content";

/** Side view of a model rocket in the style of an OpenRocket design sheet. */
function RocketCover() {
  return (
    <svg viewBox="0 0 320 140" aria-hidden className="size-full">
      <defs>
        <pattern id="grid-rocket" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="rgb(160 190 240 / 0.08)" />
        </pattern>
      </defs>
      <rect width="320" height="140" fill="url(#grid-rocket)" />
      <line x1="20" x2="300" y1="70" y2="70" stroke="rgb(160 190 240 / 0.35)" strokeDasharray="4 5" />
      <g fill="rgb(111 168 255 / 0.12)" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 46 70 C 66 56, 88 57, 104 58 L 104 82 C 88 83, 66 84, 46 70 Z" />
        <rect x="104" y="58" width="150" height="24" />
        <path d="M 222 58 L 252 34 L 262 34 L 254 58 Z" />
        <path d="M 222 82 L 252 106 L 262 106 L 254 82 Z" />
        <rect x="254" y="62" width="12" height="16" />
      </g>
      <line x1="150" x2="150" y1="58" y2="82" stroke="rgb(160 190 240 / 0.4)" />
      <g fontFamily="var(--font-mono)" fontSize="9" fill="rgb(200 215 240 / 0.7)">
        <circle cx="168" cy="70" r="6" fill="none" stroke="#a9ccff" />
        <path d="M 162 70 H 174 M 168 64 V 76" stroke="#a9ccff" />
        <text x="161" y="50">CG</text>
        <circle cx="206" cy="70" r="4" fill="#ff8f86" />
        <text x="199" y="50">CP</text>
        <path d="M 46 118 H 266" stroke="rgb(160 190 240 / 0.4)" />
        <path d="M 46 114 V 122 M 266 114 V 122" stroke="rgb(160 190 240 / 0.4)" />
        <text x="140" y="132">OPENROCKET</text>
      </g>
    </svg>
  );
}

/** A request to Claude and the MCP tools it calls (real tool names). */
function TerminalCover() {
  const calls = ["list_courses", "get_upcoming_assignments", "get_rubric", "submit_assignment"];
  return (
    <div aria-hidden className="flex size-full flex-col justify-center gap-1.5 px-5 font-mono text-[11px] leading-tight sm:text-xs">
      <div className="text-foreground/90">
        <span className="text-brand">&gt;</span> what&apos;s due this week?
      </div>
      {calls.map((call, i) => (
        <div key={call} className="text-muted-foreground" style={{ opacity: 1 - i * 0.16 }}>
          <span className="mr-2 inline-block size-1.5 rounded-full bg-success align-middle" />
          canvas-lms · {call}
        </div>
      ))}
    </div>
  );
}

/** A winding board-game track with player tokens. */
function BoardCover() {
  const spaces = [
    [40, 104], [72, 108], [104, 100], [130, 82], [150, 60], [178, 44],
    [210, 40], [242, 48], [266, 66], [280, 90],
  ];
  const tokens = [
    { at: 2, color: "#6fa8ff" },
    { at: 5, color: "#5dd39e" },
    { at: 7, color: "#f5c26b" },
  ];
  return (
    <svg viewBox="0 0 320 140" aria-hidden className="size-full">
      <path
        d={`M ${spaces.map(([x, y]) => `${x} ${y}`).join(" L ")}`}
        fill="none"
        stroke="rgb(160 190 240 / 0.25)"
        strokeWidth="2"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      {spaces.map(([x, y], i) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={i === spaces.length - 1 ? 11 : 8}
          fill="rgb(255 255 255 / 0.06)"
          stroke={i === spaces.length - 1 ? "var(--brand)" : "rgb(160 190 240 / 0.4)"}
        />
      ))}
      {tokens.map(({ at, color }) => (
        <circle key={color} cx={spaces[at][0]} cy={spaces[at][1] - 14} r="5" fill={color} />
      ))}
      <text x="262" y="122" fontFamily="var(--font-mono)" fontSize="9" fill="rgb(200 215 240 / 0.7)">
        FIN
      </text>
    </svg>
  );
}

/** Stopping distances from the study, in meters. */
const RAMP_DATA = [
  { surface: "Gravel", meters: 0.41 },
  { surface: "Sand", meters: 0.48 },
  { surface: "Concrete", meters: 0.84 },
  { surface: "Glass", meters: 1.21 },
];

function RampsCover() {
  const max = 1.21;
  return (
    <div aria-hidden className="flex size-full flex-col justify-center gap-2 px-5">
      {RAMP_DATA.map((row) => (
        <div key={row.surface} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2 font-mono text-[11px]">
          <span className="text-muted-foreground">{row.surface}</span>
          <span className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <span
              className="block h-full rounded-full bg-[linear-gradient(to_right,var(--brand-deep),var(--brand))]"
              style={{ width: `${(row.meters / max) * 100}%` }}
            />
          </span>
          <span className="text-right text-foreground/80 tabular-nums">{row.meters} m</span>
        </div>
      ))}
    </div>
  );
}

const COVERS: Record<ProjectCover, () => React.ReactNode> = {
  rocket: RocketCover,
  terminal: TerminalCover,
  board: BoardCover,
  ramps: RampsCover,
};

function hostOf(href: string) {
  if (href.startsWith("/")) return "alejandrovaladez.me";
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/**
 * A card that tips back in 3D on hover while a pin rises above it naming
 * where it leads, like a marker dropped on a map.
 */
function PinCard({ project }: { project: Project & { featured: NonNullable<Project["featured"]> } }) {
  const Cover = COVERS[project.featured.cover];
  const link = project.links?.[0] ?? { label: "Read the story", href: "/#journey" };
  const external = !link.href.startsWith("/");

  const card = (
    <>
      {/* The pin. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="glass glass-thick inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap text-foreground">
          {link.label}
          <span className="text-muted-foreground">· {hostOf(link.href)}</span>
          <ArrowUpRight className="size-3.5" />
        </span>
        <span className="h-0 w-px bg-[linear-gradient(to_bottom,var(--brand),transparent)] transition-[height] duration-500 group-hover:h-16 group-focus-visible:h-16" />
        <span className="relative size-0">
          {[0, 1.3, 2.6].map((delay) => (
            <span
              key={delay}
              className="absolute top-1/2 left-1/2 size-28 rounded-full border border-brand/40 bg-brand/[0.06] opacity-0 motion-safe:group-hover:animate-[pin-ring_4s_linear_infinite]"
              style={{ animationDelay: `${delay}s`, transform: "translate(-50%, -50%) rotateX(70deg)" }}
            />
          ))}
          <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_10px_2px_rgb(111_168_255/0.8)]" />
        </span>
      </span>

      {/* The card, tipping back on hover. */}
      <div className="[perspective:1000px]">
        <div className="glass glass-interactive origin-top rounded-3xl p-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:[transform:rotateX(24deg)_scale(0.93)] motion-safe:group-focus-visible:[transform:rotateX(24deg)_scale(0.93)]">
          <div className="h-40 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(120%_120%_at_0%_0%,rgb(111_168_255/0.16),transparent_55%),rgb(4_9_20/0.55)]">
            <Cover />
          </div>
          <div className="px-2 pt-5 pb-2">
            <p className="text-label text-brand">
              {project.kind}
              {project.highlight ? <span className="text-muted-foreground"> · {project.highlight}</span> : null}
            </p>
            <h3 className="mt-2 font-display text-3xl leading-tight font-normal">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.featured.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <li key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-muted-foreground">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );

  const className =
    "group relative block rounded-3xl pt-2 outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background";
  return external ? (
    <a href={link.href} target="_blank" rel="noopener" className={className}>
      {card}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {card}
    </Link>
  );
}

export function ProjectCards({ projects }: { projects: readonly Project[] }) {
  const featured = projects.filter(
    (p): p is Project & { featured: NonNullable<Project["featured"]> } => Boolean(p.featured)
  );
  return (
    <div className="grid gap-x-6 gap-y-10 pt-6 md:grid-cols-2">
      {featured.map((project) => (
        <PinCard key={project.title} project={project} />
      ))}
    </div>
  );
}
