import { CopyEmail, GreetingCycler, Trajectory } from "@/components/bento-parts";
import { PROFILE, STACK } from "@/lib/content";
import { cn } from "@/lib/utils";

function Tile({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors duration-300 hover:border-foreground/20 sm:p-7",
        className
      )}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-label text-muted-foreground">{children}</p>;
}

// Purely decorative candles; not real price data.
const CANDLES = [
  [62, 40, 70, 34], [50, 44, 66, 40], [46, 30, 52, 24], [34, 38, 44, 28],
  [40, 26, 46, 20], [28, 32, 38, 22], [32, 18, 36, 12], [20, 24, 30, 14],
  [24, 12, 28, 6], [14, 18, 22, 8],
] as const;

function Candles() {
  return (
    <svg viewBox="0 0 280 80" aria-hidden className="mt-4 h-auto w-full">
      {CANDLES.map(([open, close, low, high], i) => {
        const x = 14 + i * 28;
        const up = close < open;
        return (
          <g key={x} className={up ? "text-success" : "text-ember"}>
            <line x1={x} x2={x} y1={high} y2={low} stroke="currentColor" strokeWidth="1.2" />
            <rect
              x={x - 6}
              width="12"
              y={Math.min(open, close)}
              height={Math.max(2, Math.abs(open - close))}
              rx="1.5"
              fill="currentColor"
            />
          </g>
        );
      })}
    </svg>
  );
}

function ReceiptLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex items-baseline gap-2", strong && "font-semibold text-foreground")}>
      <span>{label}</span>
      <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-current opacity-30" />
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function ProfileBento() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {/* Aerospace */}
      <Tile className="md:col-span-2 lg:col-span-4 lg:row-span-2">
        <Label>Aerospace · Toulouse, summer 2026</Label>
        <h3 className="mt-3 max-w-md font-display text-3xl leading-[1.1] font-normal sm:text-4xl">
          I led my team&apos;s rocket build at INSA Toulouse.
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          A month-long, Airbus-partnered program on scholarship. Over eight workshops we designed the
          rocket in OpenRocket and built it. The parachute failed its bench test, so we reinforced the
          heat shield and upgraded the suspension cord. It flew straight.
        </p>
        <Trajectory className="mt-auto w-full pt-6 text-foreground" />
      </Tile>

      {/* Languages */}
      <Tile className="lg:col-span-2">
        <Label>Languages</Label>
        <p className="mt-4 font-display text-5xl">
          <GreetingCycler />
        </p>
        <p className="mt-auto pt-6 text-sm text-muted-foreground">
          English, Spanish (State Seal of Biliteracy), and French III.
        </p>
      </Tile>

      {/* Investing */}
      <Tile className="lg:col-span-2">
        <Label>Investing since age 10</Label>
        <Candles />
        <p className="mt-2 font-display text-2xl leading-tight">
          Every trade gets a take-profit and a stop-loss.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Losing $5,000 to emotional trades taught me that one.
        </p>
      </Tile>

      {/* Business receipt */}
      <Tile className="lg:col-span-3">
        <Label>Business · since 2023</Label>
        <div className="mt-4 rounded-xl border border-dashed border-border bg-background/60 p-4 font-mono text-[12.5px] leading-6 text-muted-foreground">
          <p className="text-center text-[11px] tracking-[0.2em] text-foreground uppercase">
            Shaved ice &amp; caramel apples
          </p>
          <div className="my-2 border-t border-dashed border-border" />
          <ReceiptLine label="Shaved ice, per cup" value="$2.00" />
          <ReceiptLine label="Cost to make" value="$0.60" />
          <ReceiptLine label="Profit, summer day" value="~$150" strong />
          <div className="my-2 border-t border-dashed border-border" />
          <ReceiptLine label="Caramel apple cup" value="$5.00" />
          <ReceiptLine label="Profit, fall day" value="~$200" strong />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          5,000+ followers across four platforms. My younger brother runs it now, and I keep a share.
        </p>
      </Tile>

      {/* Leadership */}
      <Tile className="lg:col-span-3">
        <Label>Leadership · Class of 2029 VP</Label>
        <p className="mt-4 font-display text-6xl leading-none tracking-tight sm:text-7xl">
          $3,000
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          raised by the first underclassmen Spring Dance at Jones College Prep, which I worked with
          administration to get approved.
        </p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-6 text-xs">
          {["6 class events", "Ran the meetings", "Wrote the reports to admin"].map((item) => (
            <li key={item} className="rounded-full border border-border px-3 py-1 text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </Tile>

      {/* Stack */}
      <Tile className="lg:col-span-2">
        <Label>I build with</Label>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {STACK.map((tool) => (
            <li
              key={tool}
              className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-foreground/80"
            >
              {tool}
            </li>
          ))}
        </ul>
      </Tile>

      {/* Now */}
      <Tile className="lg:col-span-2">
        <Label>Now</Label>
        <p className="mt-4 font-display text-2xl leading-tight">
          Tutoring 9th graders in PROMISE, the program that got me into IMSA.
        </p>
      </Tile>

      {/* Contact */}
      <Tile className="bg-ember-soft lg:col-span-2">
        <Label>Questions?</Label>
        <p className="mt-4 font-display text-2xl leading-tight">
          Email is the fastest way to reach me.
        </p>
        <div className="mt-auto pt-5">
          <CopyEmail email={PROFILE.email} />
        </div>
      </Tile>
    </div>
  );
}
