import { runAudit } from "@/lib/audit/run-audit";
import { AuditInputError, normalizeUrl } from "@/lib/audit/safe-fetch";
import type { AuditReport } from "@/lib/audit/types";

export const maxDuration = 30;

// Best-effort limits. Serverless instances don't share memory, so this only
// slows down a single abusive client hitting a warm instance, which is enough
// for a portfolio tool.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const CACHE_MS = 2 * 60_000;

const hits = new Map<string, number[]>();
const cache = new Map<string, { at: number; report: AuditReport }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  let rawUrl: unknown;
  try {
    rawUrl = (await request.json())?.url;
  } catch {
    return Response.json({ error: "Send JSON like {\"url\": \"example.com\"}." }, { status: 400 });
  }
  if (typeof rawUrl !== "string" || rawUrl.length > 2048) {
    return Response.json({ error: "Enter a website address." }, { status: 400 });
  }

  let target: URL;
  try {
    target = normalizeUrl(rawUrl);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }

  const key = target.toString();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return Response.json(cached.report);
  }

  if (rateLimited(ip)) {
    return Response.json(
      { error: "That's a lot of audits in a minute. Give it a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const report = await runAudit(target);
    cache.set(key, { at: Date.now(), report });
    if (cache.size > 200) cache.delete(cache.keys().next().value!);
    return Response.json(report);
  } catch (error) {
    const err = error as Error;
    const timedOut = err.name === "TimeoutError" || err.name === "AbortError";
    const message =
      error instanceof AuditInputError
        ? err.message
        : timedOut
          ? "The site took too long to respond."
          : err.message.startsWith("The site") || err.message.startsWith("That address")
            ? err.message
            : "Couldn't reach that site. Check the address and try again.";
    return Response.json({ error: message }, { status: error instanceof AuditInputError ? 400 : 502 });
  }
}
