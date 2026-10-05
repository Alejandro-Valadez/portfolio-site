import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Fetches a public URL on behalf of a visitor. Every hop (including redirects)
// is re-validated so the audit can't be pointed at localhost, cloud metadata
// endpoints, or anything else on a private network.

const MAX_REDIRECTS = 5;
const MAX_BYTES = 3 * 1024 * 1024;
const USER_AGENT =
  "Mozilla/5.0 (compatible; AVSiteAudit/1.0; +https://alejandrovaladez.me/audit)";

export class AuditInputError extends Error {}

export type FetchedPage = {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  headers: Headers;
  body: string;
  bytes: number;
  ttfbMs: number;
  redirects: string[];
};

function ipv4ToInt(ip: string) {
  return ip.split(".").reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

function inV4Range(ip: string, cidr: string) {
  const [base, bits] = cidr.split("/");
  const mask = Number(bits) === 0 ? 0 : (~0 << (32 - Number(bits))) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

const PRIVATE_V4 = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.0.0.0/24",
  "192.0.2.0/24",
  "192.168.0.0/16",
  "198.18.0.0/15",
  "198.51.100.0/24",
  "203.0.113.0/24",
  "224.0.0.0/3",
];

function isPrivateAddress(ip: string) {
  if (isIP(ip) === 4) return PRIVATE_V4.some((cidr) => inV4Range(ip, cidr));
  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateAddress(mapped[1]);
  return (
    v6 === "::" ||
    v6 === "::1" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe8") ||
    v6.startsWith("fe9") ||
    v6.startsWith("fea") ||
    v6.startsWith("feb") ||
    v6.startsWith("ff")
  );
}

export function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) throw new AuditInputError("Enter a website address.");
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new AuditInputError("That doesn't look like a valid web address.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new AuditInputError("Only http:// and https:// sites can be audited.");
  }
  if (url.username || url.password) {
    throw new AuditInputError("URLs with embedded credentials aren't allowed.");
  }
  if (!url.hostname.includes(".") && isIP(url.hostname) === 0) {
    throw new AuditInputError("Use a full domain name, like example.com.");
  }
  url.hash = "";
  return url;
}

async function assertPublicHost(url: URL) {
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new AuditInputError("Only standard web ports (80 and 443) are allowed.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (/^localhost$|\.localhost$|\.local$|\.internal$/i.test(host)) {
    throw new AuditInputError("Private and local addresses can't be audited.");
  }
  const addresses = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true }).catch(() => {
        throw new AuditInputError(`Couldn't find a server for ${host}.`);
      });
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new AuditInputError("Private and local addresses can't be audited.");
  }
}

async function readCapped(response: Response) {
  if (!response.body) return { text: "", bytes: 0 };
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) {
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(Math.min(bytes, MAX_BYTES));
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { text: new TextDecoder().decode(merged), bytes };
}

export async function safeFetch(
  input: URL,
  { timeoutMs = 9000, readBody = true }: { timeoutMs?: number; readBody?: boolean } = {}
): Promise<FetchedPage> {
  const signal = AbortSignal.timeout(timeoutMs);
  const redirects: string[] = [];
  let current = new URL(input);
  const started = performance.now();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicHost(current);
    const response = await fetch(current, {
      redirect: "manual",
      signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
      },
      cache: "no-store",
    });
    // Time to headers, including any redirect hops before this one.
    const ttfbMs = Math.round(performance.now() - started);

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      redirects.push(current.toString());
      current = new URL(location, current);
      if (current.protocol !== "http:" && current.protocol !== "https:") {
        throw new AuditInputError("The site redirected to an unsupported address.");
      }
      continue;
    }

    const { text, bytes } = readBody
      ? await readCapped(response)
      : (await response.body?.cancel(), { text: "", bytes: 0 });
    return {
      requestedUrl: input.toString(),
      finalUrl: current.toString(),
      status: response.status,
      headers: response.headers,
      body: text,
      bytes,
      ttfbMs,
      redirects,
    };
  }
  throw new AuditInputError("The site redirected too many times.");
}
