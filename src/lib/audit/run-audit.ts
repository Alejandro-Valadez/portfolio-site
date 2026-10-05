import "server-only";
import { parse, type HTMLElement } from "node-html-parser";
import { safeFetch, type FetchedPage } from "./safe-fetch";
import {
  CATEGORY_META,
  SEVERITY_PENALTY,
  toGrade,
  type AuditReport,
  type CategoryKey,
  type CategoryResult,
  type CheckResult,
  type Severity,
} from "./types";

type Ctx = {
  page: FetchedPage;
  root: HTMLElement;
  head: HTMLElement | null;
  url: URL;
  robotsTxt: string | null;
  sitemapFound: boolean;
  faviconFound: boolean;
  httpRedirectsToHttps: boolean | null;
};

const pass = (id: string, title: string, detail: string): CheckResult => ({
  id,
  title,
  passed: true,
  detail,
});

const fail = (
  id: string,
  title: string,
  severity: Severity,
  detail: string,
  fix: string
): CheckResult => ({ id, title, passed: false, severity, detail, fix });

const meta = (root: HTMLElement, key: string) =>
  root
    .querySelector(`meta[name="${key}" i], meta[property="${key}" i]`)
    ?.getAttribute("content")
    ?.trim() ?? null;

const clip = (text: string, max = 90) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Picks the verb form that agrees with n ("1 image has", "2 images have"). */
const agree = (n: number, one: string, many: string) => (n === 1 ? one : many);

// ---------- SEO ----------

function seoChecks({ root, page, url, robotsTxt, sitemapFound }: Ctx): CheckResult[] {
  const out: CheckResult[] = [];
  const title = root.querySelector("title")?.text.trim() ?? "";

  out.push(
    title
      ? pass("title", "Title tag", `“${clip(title)}”`)
      : fail(
          "title",
          "Title tag",
          "critical",
          "The page has no <title>. Search results and browser tabs will show the bare URL.",
          "Add a <title> in <head> that names the page and the site, around 50–60 characters."
        )
  );

  if (title) {
    const n = title.length;
    out.push(
      n >= 25 && n <= 65
        ? pass("title-length", "Title length", `${n} characters, which fits in a search result.`)
        : fail(
            "title-length",
            "Title length",
            "info",
            `${n} characters. ${n < 25 ? "Short titles waste space in results." : "Google truncates titles past about 60 characters."}`,
            "Aim for roughly 30–60 characters."
          )
    );
  }

  const description = meta(root, "description");
  if (!description) {
    out.push(
      fail(
        "description",
        "Meta description",
        "warning",
        "No meta description, so search engines will pick a snippet from the page text.",
        'Add <meta name="description" content="…"> summarizing the page in one or two sentences.'
      )
    );
  } else {
    out.push(pass("description", "Meta description", `“${clip(description)}”`));
    const n = description.length;
    out.push(
      n >= 70 && n <= 160
        ? pass("description-length", "Description length", `${n} characters.`)
        : fail(
            "description-length",
            "Description length",
            "info",
            `${n} characters. ${n > 160 ? "Google cuts descriptions off around 155–160 characters." : "That's short enough that Google may replace it."}`,
            "Rewrite it to land between 120 and 160 characters."
          )
    );
  }

  const h1s = root.querySelectorAll("h1");
  out.push(
    h1s.length === 1
      ? pass("h1", "Single H1", `“${clip(h1s[0].text.trim(), 70)}”`)
      : fail(
          "h1",
          "Single H1",
          "warning",
          h1s.length === 0
            ? "No <h1> found. The main heading tells search engines what the page is about."
            : `${h1s.length} <h1> elements found. Pages read best with one main heading.`,
          h1s.length === 0
            ? "Wrap the page's main heading in a single <h1>."
            : "Keep one <h1> and demote the rest to <h2> or lower."
        )
  );

  const levels = root
    .querySelectorAll("h1, h2, h3, h4, h5, h6")
    .map((h) => Number(h.rawTagName.slice(1)));
  const skip = levels.findIndex((lvl, i) => i > 0 && lvl > levels[i - 1] + 1);
  out.push(
    skip === -1
      ? pass("heading-order", "Heading order", `${plural(levels.length, "heading")}, no skipped levels.`)
      : fail(
          "heading-order",
          "Heading order",
          "info",
          `An <h${levels[skip]}> follows an <h${levels[skip - 1]}>, skipping a level.`,
          "Step headings down one level at a time (h2 → h3 → h4)."
        )
  );

  const canonical = root.querySelector('link[rel="canonical" i]')?.getAttribute("href");
  out.push(
    canonical
      ? pass("canonical", "Canonical URL", clip(canonical))
      : fail(
          "canonical",
          "Canonical URL",
          "info",
          "No canonical link, so duplicate URLs (www, query strings, trailing slashes) can split ranking.",
          'Add <link rel="canonical" href="https://your-site.com/page">.'
        )
  );

  const ogTitle = meta(root, "og:title");
  const ogDescription = meta(root, "og:description");
  const ogImage = meta(root, "og:image");
  const missingOg = [
    !ogTitle && "og:title",
    !ogDescription && "og:description",
    !ogImage && "og:image",
  ].filter(Boolean) as string[];
  out.push(
    missingOg.length === 0
      ? pass("open-graph", "Open Graph tags", "Title, description, and image are set for link previews.")
      : fail(
          "open-graph",
          "Open Graph tags",
          missingOg.includes("og:image") ? "warning" : "info",
          `Missing ${missingOg.join(", ")}. Links shared on iMessage, Discord, or LinkedIn will look bare.`,
          "Add the missing og: meta tags, including a 1200×630 preview image."
        )
  );

  const twitterCard = meta(root, "twitter:card");
  out.push(
    twitterCard
      ? pass("twitter-card", "X / Twitter card", `Card type: ${twitterCard}.`)
      : fail(
          "twitter-card",
          "X / Twitter card",
          "info",
          "No twitter:card tag.",
          'Add <meta name="twitter:card" content="summary_large_image">.'
        )
  );

  const robotsMeta = meta(root, "robots") ?? "";
  const robotsHeader = page.headers.get("x-robots-tag") ?? "";
  const noindex = /noindex/i.test(robotsMeta) || /noindex/i.test(robotsHeader);
  out.push(
    noindex
      ? fail(
          "indexable",
          "Indexable",
          "critical",
          "The page tells search engines not to index it (noindex).",
          "Remove noindex from the robots meta tag or X-Robots-Tag header if this page should show up in search."
        )
      : pass("indexable", "Indexable", "No noindex directive.")
  );

  const jsonLd = root.querySelectorAll('script[type="application/ld+json" i]');
  out.push(
    jsonLd.length
      ? pass("structured-data", "Structured data", `${plural(jsonLd.length, "JSON-LD block")} found.`)
      : fail(
          "structured-data",
          "Structured data",
          "info",
          "No JSON-LD, so search engines get less context about who or what the page represents.",
          "Add a schema.org JSON-LD block (Person, Organization, or LocalBusiness)."
        )
  );

  out.push(
    robotsTxt !== null
      ? pass("robots-txt", "robots.txt", `Found at ${url.origin}/robots.txt.`)
      : fail(
          "robots-txt",
          "robots.txt",
          "info",
          "No robots.txt at the site root.",
          "Serve a robots.txt that allows crawling and links your sitemap."
        )
  );

  out.push(
    sitemapFound
      ? pass("sitemap", "XML sitemap", "Sitemap found.")
      : fail(
          "sitemap",
          "XML sitemap",
          "info",
          "No sitemap at /sitemap.xml or listed in robots.txt.",
          "Generate a sitemap.xml and reference it from robots.txt."
        )
  );

  const body = root.querySelector("body");
  body?.querySelectorAll("script, style, noscript, svg").forEach((n) => n.remove());
  const words = (body?.text ?? "").split(/\s+/).filter((w) => /\w/.test(w)).length;
  out.push(
    words >= 250
      ? pass("content-length", "Content depth", `About ${words.toLocaleString()} words of text.`)
      : fail(
          "content-length",
          "Content depth",
          "info",
          `Only about ${words} words of text in the HTML. Thin pages, or pages that render everything client-side, are harder to rank.`,
          "Add descriptive copy, or render key content on the server."
        )
  );

  return out;
}

// ---------- Security ----------

function securityChecks({ page, root, httpRedirectsToHttps }: Ctx): CheckResult[] {
  const out: CheckResult[] = [];
  const h = page.headers;
  const https = page.finalUrl.startsWith("https://");

  out.push(
    https
      ? pass("https", "HTTPS", "The page is served over an encrypted connection.")
      : fail(
          "https",
          "HTTPS",
          "critical",
          "The page loads over plain HTTP. Browsers mark it “Not secure”.",
          "Install a TLS certificate (free from Let's Encrypt or your host) and redirect HTTP to HTTPS."
        )
  );

  if (httpRedirectsToHttps !== null) {
    out.push(
      httpRedirectsToHttps
        ? pass("http-redirect", "HTTP → HTTPS redirect", "Plain-HTTP visitors are sent to HTTPS.")
        : fail(
            "http-redirect",
            "HTTP → HTTPS redirect",
            "warning",
            "Visiting the http:// address doesn't redirect to HTTPS.",
            "Add a permanent (301/308) redirect from HTTP to HTTPS."
          )
    );
  }

  const hsts = h.get("strict-transport-security");
  const maxAge = Number(hsts?.match(/max-age=(\d+)/i)?.[1] ?? 0);
  out.push(
    hsts && maxAge >= 15552000
      ? pass("hsts", "HSTS", `max-age=${maxAge.toLocaleString()} seconds.`)
      : fail(
          "hsts",
          "HSTS",
          "warning",
          hsts
            ? `HSTS is set but max-age is only ${maxAge} seconds.`
            : "No Strict-Transport-Security header, so a first visit could be downgraded to HTTP.",
          "Send Strict-Transport-Security: max-age=63072000; includeSubDomains; preload"
        )
  );

  const csp = h.get("content-security-policy") ?? "";
  const xfo = h.get("x-frame-options");
  const frameAncestors = /frame-ancestors/i.test(csp);
  out.push(
    xfo || frameAncestors
      ? pass(
          "clickjacking",
          "Clickjacking protection",
          frameAncestors ? "CSP frame-ancestors is set." : `X-Frame-Options: ${xfo}.`
        )
      : fail(
          "clickjacking",
          "Clickjacking protection",
          "warning",
          "Any site can load this page in an invisible iframe and trick visitors into clicking it.",
          "Send X-Frame-Options: DENY, or add frame-ancestors 'none' to your CSP."
        )
  );

  out.push(
    /nosniff/i.test(h.get("x-content-type-options") ?? "")
      ? pass("nosniff", "MIME sniffing", "X-Content-Type-Options: nosniff.")
      : fail(
          "nosniff",
          "MIME sniffing",
          "warning",
          "Without nosniff, browsers may guess file types, which attackers can abuse.",
          "Send X-Content-Type-Options: nosniff"
        )
  );

  if (!csp) {
    out.push(
      fail(
        "csp",
        "Content Security Policy",
        "warning",
        "No CSP header, so the browser will run scripts from anywhere if an attacker injects them.",
        "Start with a policy like default-src 'self' and loosen it only for the sources you use."
      )
    );
  } else {
    out.push(pass("csp", "Content Security Policy", "A CSP header is set."));
    const weak = [
      /'unsafe-eval'/i.test(csp) && "'unsafe-eval'",
      /script-src[^;]*\*(?![.\w])/i.test(csp) && "wildcard script sources",
    ].filter(Boolean) as string[];
    out.push(
      weak.length === 0
        ? pass("csp-strength", "CSP strength", "No unsafe-eval or wildcard script sources.")
        : fail(
            "csp-strength",
            "CSP strength",
            "info",
            `The policy allows ${weak.join(" and ")}, which weakens its protection.`,
            "Remove unsafe-eval and wildcard script sources, or switch to nonces."
          )
    );
  }

  out.push(
    h.get("referrer-policy")
      ? pass("referrer", "Referrer-Policy", h.get("referrer-policy")!)
      : fail(
          "referrer",
          "Referrer-Policy",
          "info",
          "No Referrer-Policy, so full URLs (including query strings) can leak to other sites.",
          "Send Referrer-Policy: strict-origin-when-cross-origin"
        )
  );

  out.push(
    h.get("permissions-policy")
      ? pass("permissions", "Permissions-Policy", "Browser features are restricted.")
      : fail(
          "permissions",
          "Permissions-Policy",
          "info",
          "No Permissions-Policy limiting camera, microphone, or location access.",
          "Send Permissions-Policy: camera=(), microphone=(), geolocation=()"
        )
  );

  const cookies = h.getSetCookie?.() ?? [];
  const weakCookies = cookies.filter(
    (c) => !/;\s*secure/i.test(c) || !/;\s*samesite/i.test(c)
  );
  out.push(
    weakCookies.length === 0
      ? pass(
          "cookies",
          "Cookie flags",
          cookies.length ? `${plural(cookies.length, "cookie")}, all Secure with SameSite.` : "No cookies set on this page."
        )
      : fail(
          "cookies",
          "Cookie flags",
          "warning",
          `${plural(weakCookies.length, "cookie")} ${agree(weakCookies.length, "is", "are")} missing Secure or SameSite.`,
          "Set cookies with Secure; HttpOnly; SameSite=Lax (or Strict)."
        )
  );

  const server = h.get("server") ?? "";
  const poweredBy = h.get("x-powered-by");
  const leaks = [/\d/.test(server) && `Server: ${server}`, poweredBy && `X-Powered-By: ${poweredBy}`].filter(
    Boolean
  ) as string[];
  out.push(
    leaks.length === 0
      ? pass("disclosure", "Server details hidden", "No software versions exposed in headers.")
      : fail(
          "disclosure",
          "Server details hidden",
          "info",
          `Headers reveal ${leaks.join(" and ")}, which tells attackers what to target.`,
          "Strip version numbers from Server and remove X-Powered-By."
        )
  );

  if (https) {
    const insecure = root
      .querySelectorAll("script[src], img[src], iframe[src], link[rel=stylesheet][href], source[src], video[src], audio[src]")
      .filter((el) => /^http:\/\//i.test(el.getAttribute("src") ?? el.getAttribute("href") ?? ""));
    out.push(
      insecure.length === 0
        ? pass("mixed-content", "Mixed content", "Every resource loads over HTTPS.")
        : fail(
            "mixed-content",
            "Mixed content",
            "warning",
            `${plural(insecure.length, "resource")} ${agree(insecure.length, "loads", "load")} over plain HTTP on an HTTPS page.`,
            "Change those URLs to https://."
          )
    );
  }

  const origin = new URL(page.finalUrl).origin;
  const thirdParty = root.querySelectorAll("script[src]").filter((s) => {
    try {
      return new URL(s.getAttribute("src")!, page.finalUrl).origin !== origin;
    } catch {
      return false;
    }
  });
  const noSri = thirdParty.filter((s) => !s.getAttribute("integrity"));
  out.push(
    noSri.length === 0
      ? pass(
          "sri",
          "Subresource integrity",
          thirdParty.length ? "Third-party scripts are pinned with integrity hashes." : "No third-party scripts."
        )
      : fail(
          "sri",
          "Subresource integrity",
          "info",
          `${plural(noSri.length, "third-party script")} ${agree(noSri.length, "loads", "load")} without an integrity hash.`,
          "Add integrity and crossorigin attributes to CDN scripts so a compromised CDN can't swap them."
        )
  );

  return out;
}

// ---------- Accessibility ----------

function accessibleName(el: HTMLElement) {
  if (el.getAttribute("aria-label")?.trim()) return true;
  if (el.getAttribute("aria-labelledby")?.trim()) return true;
  if (el.getAttribute("title")?.trim()) return true;
  if (el.text.trim()) return true;
  return el.querySelectorAll("img[alt], svg[aria-label], [aria-label]").some(
    (child) => (child.getAttribute("alt") ?? child.getAttribute("aria-label") ?? "").trim()
  );
}

function accessibilityChecks({ root, faviconFound }: Ctx): CheckResult[] {
  const out: CheckResult[] = [];

  const viewport = meta(root, "viewport");
  out.push(
    viewport
      ? pass("viewport", "Mobile viewport", viewport)
      : fail(
          "viewport",
          "Mobile viewport",
          "critical",
          "No viewport meta tag, so phones render the desktop layout zoomed out.",
          'Add <meta name="viewport" content="width=device-width, initial-scale=1">.'
        )
  );

  if (viewport) {
    const blocksZoom =
      /user-scalable\s*=\s*(no|0)/i.test(viewport) || /maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport);
    out.push(
      blocksZoom
        ? fail(
            "zoom",
            "Pinch to zoom",
            "warning",
            "The viewport blocks zooming, which locks out low-vision visitors.",
            "Remove user-scalable=no and maximum-scale=1 from the viewport tag."
          )
        : pass("zoom", "Pinch to zoom", "Visitors can zoom in.")
    );
  }

  const lang = root.querySelector("html")?.getAttribute("lang");
  out.push(
    lang
      ? pass("lang", "Page language", `lang="${lang}".`)
      : fail(
          "lang",
          "Page language",
          "warning",
          "No lang attribute on <html>, so screen readers may pronounce the page in the wrong language.",
          'Add lang="en" (or the right language code) to the <html> tag.'
        )
  );

  const images = root.querySelectorAll("img");
  const noAlt = images.filter((img) => img.getAttribute("alt") === undefined);
  out.push(
    noAlt.length === 0
      ? pass(
          "alt",
          "Image alt text",
          images.length === 0
            ? "No <img> elements."
            : images.length === 1
              ? "The page's one image has an alt attribute."
              : `All ${images.length} images have alt attributes.`
        )
      : fail(
          "alt",
          "Image alt text",
          "warning",
          `${noAlt.length} of ${plural(images.length, "image")} ${agree(noAlt.length, "has", "have")} no alt attribute.`,
          'Describe each meaningful image in alt="…"; use alt="" for decorative ones.'
        )
  );

  const controls = root.querySelectorAll("a[href], button");
  const unnamed = controls.filter((el) => !accessibleName(el));
  out.push(
    unnamed.length === 0
      ? pass(
          "control-names",
          "Named links and buttons",
          controls.length ? `${plural(controls.length, "control")}, all with readable names.` : "No links or buttons."
        )
      : fail(
          "control-names",
          "Named links and buttons",
          "warning",
          `${unnamed.length} ${unnamed.length === 1 ? "link or button has" : "links or buttons have"} no text or aria-label, so screen readers announce them as just “link” or “button”.`,
          "Add visible text or an aria-label to icon-only controls."
        )
  );

  const inputs = root
    .querySelectorAll("input, select, textarea")
    .filter((el) => !/^(hidden|submit|button|reset|image)$/i.test(el.getAttribute("type") ?? ""));
  const labelled = new Set(
    root.querySelectorAll("label[for]").map((l) => l.getAttribute("for"))
  );
  const unlabeled = inputs.filter(
    (el) =>
      !el.getAttribute("aria-label") &&
      !el.getAttribute("aria-labelledby") &&
      !(el.id && labelled.has(el.id)) &&
      !el.closest("label")
  );
  out.push(
    unlabeled.length === 0
      ? pass(
          "labels",
          "Form labels",
          inputs.length === 0
            ? "No form fields on this page."
            : inputs.length === 1
              ? "The page's one form field is labeled."
              : `All ${inputs.length} form fields are labeled.`
        )
      : fail(
          "labels",
          "Form labels",
          "warning",
          `${plural(unlabeled.length, "form field")} ${agree(unlabeled.length, "has", "have")} no label.`,
          "Connect each field to a <label for=…>, or give it an aria-label."
        )
  );

  const skipLink = root
    .querySelectorAll('a[href^="#"]')
    .slice(0, 5)
    .some((a) => /skip|main|content/i.test(a.text + (a.getAttribute("href") ?? "")));
  out.push(
    skipLink
      ? pass("skip-link", "Skip link", "Keyboard users can jump past the navigation.")
      : fail(
          "skip-link",
          "Skip link",
          "info",
          "No “skip to content” link near the top of the page.",
          'Add <a href="#main">Skip to content</a> as the first focusable element.'
        )
  );

  out.push(
    root.querySelector('main, [role="main"]')
      ? pass("landmark", "Main landmark", "<main> found.")
      : fail(
          "landmark",
          "Main landmark",
          "info",
          "No <main> element, so screen-reader users can't jump straight to the content.",
          "Wrap the primary content in <main>."
        )
  );

  out.push(
    faviconFound
      ? pass("favicon", "Favicon", "The site has a tab icon.")
      : fail(
          "favicon",
          "Favicon",
          "info",
          "No favicon found.",
          'Add a favicon.ico at the site root or a <link rel="icon">.'
        )
  );

  return out;
}

// ---------- Performance ----------

function performanceChecks({ page, root, head }: Ctx): CheckResult[] {
  const out: CheckResult[] = [];

  out.push(
    page.ttfbMs <= 800
      ? pass("ttfb", "Server response", `First byte in ${page.ttfbMs} ms.`)
      : fail(
          "ttfb",
          "Server response",
          page.ttfbMs > 1800 ? "warning" : "info",
          `First byte took ${page.ttfbMs.toLocaleString()} ms${page.redirects.length ? `, including ${plural(page.redirects.length, "redirect")}` : ""}.`,
          "Cache pages at the edge or on a CDN, and cut redirect chains."
        )
  );

  const encoding = page.headers.get("content-encoding");
  out.push(
    encoding && /br|gzip|zstd|deflate/i.test(encoding)
      ? pass("compression", "Compression", `Served with ${encoding}.`)
      : fail(
          "compression",
          "Compression",
          "warning",
          "The HTML isn't compressed, so visitors download several times more data than needed.",
          "Turn on Brotli or gzip compression on the server or CDN."
        )
  );

  const kb = Math.round(page.bytes / 1024);
  out.push(
    kb <= 250
      ? pass("html-size", "HTML size", `${kb} KB of HTML.`)
      : fail(
          "html-size",
          "HTML size",
          kb > 800 ? "warning" : "info",
          `${kb.toLocaleString()} KB of HTML, which is heavy before any images or scripts load.`,
          "Move inline data and SVG into separate cached files and paginate long lists."
        )
  );

  const imgs = root.querySelectorAll("img");
  const lazy = imgs.filter((i) => i.getAttribute("loading") === "lazy");
  out.push(
    imgs.length <= 3 || lazy.length > 0
      ? pass(
          "lazy",
          "Lazy-loaded images",
          imgs.length <= 3 ? `${plural(imgs.length, "image")}, so lazy loading isn't needed.` : `${lazy.length} of ${imgs.length} images load lazily.`
        )
      : fail(
          "lazy",
          "Lazy-loaded images",
          "info",
          `None of the ${imgs.length} images use lazy loading.`,
          'Add loading="lazy" to images below the fold.'
        )
  );

  const unsized = imgs.filter((i) => !i.getAttribute("width") || !i.getAttribute("height"));
  out.push(
    unsized.length === 0
      ? pass("dimensions", "Image dimensions", "Images reserve their space before loading.")
      : fail(
          "dimensions",
          "Image dimensions",
          "info",
          `${plural(unsized.length, "image")} ${agree(unsized.length, "has", "have")} no width/height, which makes the layout jump as they load.`,
          "Set width and height attributes (or a CSS aspect-ratio) on every image."
        )
  );

  const cacheControl = page.headers.get("cache-control");
  const etag = page.headers.get("etag") || page.headers.get("last-modified");
  out.push(
    cacheControl || etag
      ? pass("caching", "Caching headers", cacheControl ? `Cache-Control: ${cacheControl}` : "Validators (ETag/Last-Modified) present.")
      : fail(
          "caching",
          "Caching headers",
          "info",
          "No Cache-Control, ETag, or Last-Modified header.",
          "Send Cache-Control (and an ETag) so repeat visits can skip the download."
        )
  );

  const blocking = (head?.querySelectorAll("script[src]") ?? []).filter(
    (s) =>
      s.getAttribute("async") === undefined &&
      s.getAttribute("defer") === undefined &&
      !/module/i.test(s.getAttribute("type") ?? "")
  );
  out.push(
    blocking.length === 0
      ? pass("blocking-scripts", "Render-blocking scripts", "No blocking scripts in <head>.")
      : fail(
          "blocking-scripts",
          "Render-blocking scripts",
          "warning",
          `${plural(blocking.length, "script")} in <head> without async or defer, so the browser waits on them before drawing anything.`,
          "Add defer (or async for independent scripts)."
        )
  );

  const stylesheets = head?.querySelectorAll('link[rel="stylesheet" i]').length ?? 0;
  out.push(
    stylesheets <= 4
      ? pass("stylesheets", "Stylesheet count", `${plural(stylesheets, "stylesheet")} in <head>.`)
      : fail(
          "stylesheets",
          "Stylesheet count",
          "info",
          `${stylesheets} separate stylesheets block the first paint.`,
          "Bundle CSS into fewer files."
        )
  );

  const hints = root.querySelectorAll(
    'link[rel~="preconnect" i], link[rel~="dns-prefetch" i], link[rel~="preload" i]'
  ).length;
  out.push(
    hints > 0
      ? pass("hints", "Resource hints", `${plural(hints, "preload/preconnect hint")}.`)
      : fail(
          "hints",
          "Resource hints",
          "info",
          "No preload or preconnect hints for fonts, hero images, or third-party origins.",
          'Add <link rel="preconnect"> for third-party origins and preload the hero image and fonts.'
        )
  );

  return out;
}

// ---------- Orchestration ----------

async function probe(url: string, readBody = true) {
  try {
    const res = await safeFetch(new URL(url), { timeoutMs: 5000, readBody });
    return res.status >= 200 && res.status < 300 ? res : null;
  } catch {
    return null;
  }
}

function scoreCategory(key: CategoryKey, checks: CheckResult[]): CategoryResult {
  const penalty = checks.reduce(
    (sum, c) => sum + (c.passed ? 0 : SEVERITY_PENALTY[c.severity ?? "info"]),
    0
  );
  const score = Math.max(0, 100 - penalty);
  return { key, label: CATEGORY_META[key].label, score, grade: toGrade(score), checks };
}

function verdictFor(score: number) {
  if (score >= 95) return "Excellent. This site gets the fundamentals right.";
  if (score >= 90) return "Strong site with a couple of small fixes left.";
  if (score >= 80) return "Good base, with a few gaps worth closing.";
  if (score >= 70) return "Decent, but several fixable issues are holding it back.";
  if (score >= 60) return "Needs work in more than one area.";
  return "Lots of room to improve. Start with the critical issues.";
}

export async function runAudit(target: URL): Promise<AuditReport> {
  const started = performance.now();
  const page = await safeFetch(target);

  const contentType = page.headers.get("content-type") ?? "";
  if (page.status >= 400) {
    throw new Error(`The site responded with HTTP ${page.status}.`);
  }
  if (!/html/i.test(contentType)) {
    throw new Error("That address doesn't return an HTML page.");
  }

  const finalUrl = new URL(page.finalUrl);
  const root = parse(page.body, { comment: false, blockTextElements: { script: true, style: true, pre: true } });

  const [robots, sitemap, favicon, httpProbe] = await Promise.all([
    probe(`${finalUrl.origin}/robots.txt`),
    probe(`${finalUrl.origin}/sitemap.xml`, false),
    root.querySelector('link[rel~="icon" i]')
      ? Promise.resolve(true)
      : probe(`${finalUrl.origin}/favicon.ico`, false).then(Boolean),
    finalUrl.protocol === "https:"
      ? safeFetch(new URL(`http://${finalUrl.host}${finalUrl.pathname}`), {
          timeoutMs: 5000,
          readBody: false,
        })
          .then((r) => r.finalUrl.startsWith("https://"))
          .catch(() => null)
      : Promise.resolve(false),
  ]);

  const robotsTxt = robots?.body ?? null;
  const ctx: Ctx = {
    page,
    root,
    head: root.querySelector("head"),
    url: finalUrl,
    robotsTxt,
    sitemapFound: Boolean(sitemap) || /^\s*sitemap:/im.test(robotsTxt ?? ""),
    faviconFound: Boolean(favicon),
    httpRedirectsToHttps: httpProbe,
  };

  // Accessibility and security read the full tree, so they run before SEO,
  // which strips scripts and styles out of <body> to count words.
  const security = scoreCategory("security", securityChecks(ctx));
  const accessibility = scoreCategory("accessibility", accessibilityChecks(ctx));
  const performanceResult = scoreCategory("performance", performanceChecks(ctx));
  const seo = scoreCategory("seo", seoChecks(ctx));
  const categories = [seo, security, accessibility, performanceResult];

  const score = Math.round(
    categories.reduce((sum, c) => sum + c.score * CATEGORY_META[c.key].weight, 0)
  );
  const all = categories.flatMap((c) => c.checks);

  return {
    url: target.toString(),
    finalUrl: page.finalUrl,
    scannedAt: new Date().toISOString(),
    durationMs: Math.round(performance.now() - started),
    score,
    grade: toGrade(score),
    verdict: verdictFor(score),
    categories,
    totals: {
      issues: all.filter((c) => !c.passed).length,
      critical: all.filter((c) => !c.passed && c.severity === "critical").length,
      passing: all.filter((c) => c.passed).length,
      checks: all.length,
    },
  };
}
