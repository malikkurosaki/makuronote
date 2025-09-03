import index from "./index.html";
import { cors } from "@elysiajs/cors";
import Elysia, { t } from "elysia";
import { fetch, Agent } from "undici";

const PORT = process.env.PORT || 3000;

// ✅ Agent hanya dipakai di dev/testing (hindari di production)
const agent =
  process.env.NODE_ENV === "production"
    ? undefined
    : new Agent({ connect: { rejectUnauthorized: false } });

// 🔒 Security: Domain whitelist
const ALLOWED_DOMAINS = new Set([
  "example.com",
  "httpbin.org",
  "jsonplaceholder.typicode.com",
  // Add your allowed domains here
]);

// 🔒 Security: Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (limit.count >= RATE_LIMIT) {
    return false;
  }

  limit.count++;
  return true;
}

// 🔒 Security: URL validation
function isUrlAllowed(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    const domain = parsedUrl.hostname.toLowerCase();
    if (process.env.NODE_ENV === "production" && !ALLOWED_DOMAINS.has(domain)) {
      return false;
    }

    if (process.env.NODE_ENV === "production") {
      if (
        domain === "localhost" ||
        domain.startsWith("127.") ||
        domain.startsWith("192.168.") ||
        domain.startsWith("10.") ||
        domain.startsWith("172.")
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

// ✅ Helper untuk bersihin header & convert ke HeadersInit
function sanitizeHeaders(headers: any): Record<string, string> {
  const forbidden = new Set([
    "content-security-policy",
    "x-frame-options",
    "strict-transport-security",
    "cross-origin-opener-policy",
    "cross-origin-embedder-policy",
    "content-encoding",
    "content-length",
    "cache-control",
    "set-cookie",
  ]);

  const out: Record<string, string> = {};
  headers.forEach((value: string, key: string) => {
    if (!forbidden.has(key.toLowerCase())) {
      out[key] = value;
    }
  });

  return out;
}

const AppServer = new Elysia()
  .use(cors())
  .get("/", index)
  .all(
    "/proxy",
    async ({ query, request }) => {
      try {
        const clientIP =
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown";

        if (!checkRateLimit(clientIP)) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded" }),
            {
              status: 429,
              headers: {
                "content-type": "application/json",
                "retry-after": "3600",
              },
            }
          );
        }

        let targetUrl = query.url;

        // 🔑 fallback dari referer jika url kosong
        if (!targetUrl) {
          const ref = request.headers.get("referer");
          if (ref) {
            const refUrl = new URL(ref, `http://${request.headers.get("host")}`);
            const refTarget = refUrl.searchParams.get("url");
            if (refTarget) {
              targetUrl = refTarget;
            }
          }
        }

        if (!targetUrl) {
          return new Response(
            JSON.stringify({ error: "Missing url param" }),
            { status: 400, headers: { "content-type": "application/json" } }
          );
        }

        const parsed = new URL(targetUrl);
        const incomingParams = new URL(request.url).searchParams;
        for (const [key, value] of incomingParams.entries()) {
          if (key !== "url") {
            parsed.searchParams.set(key, value);
          }
        }
        targetUrl = parsed.toString();

        if (!isUrlAllowed(targetUrl)) {
          return new Response(JSON.stringify({ error: "URL not allowed" }), {
            status: 403,
            headers: { "content-type": "application/json" },
          });
        }

        const res = await fetch(targetUrl, {
          dispatcher: agent,
          signal: AbortSignal.timeout(30000),
        });

        const proxiedHeaders = sanitizeHeaders(res.headers);

        if (res.headers.get("content-type")?.includes("text/html")) {
          let html = await res.text();
          const base = new URL(targetUrl);

          html = html.replace(
            /<meta[^>]+http-equiv=["']content-security-policy["'][^>]*>/gi,
            ""
          );

          const securityMetas = `
            <meta http-equiv="X-Content-Type-Options" content="nosniff">
            <meta http-equiv="Referrer-Policy" content="no-referrer">
          `;

          html = html.replace(
            /<head([^>]*)>/i,
            `<head$1>
            ${securityMetas}
            <base href="/proxy?url=${encodeURIComponent(base.href)}">`
          );

          html = html.replace(
            /\b(href|src|action)=["']([^"']+)["']/gi,
            (match, attr, value) => {
              try {
                const abs = new URL(value, base).href;
                if (!isUrlAllowed(abs)) {
                  return `${attr}="#blocked-url"`;
                }
                return `${attr}="/proxy?url=${encodeURIComponent(abs)}"`;
              } catch {
                return match;
              }
            }
          );

          html = html.replace(/\bsrcset=["']([^"']+)["']/gi, (match, value) => {
            const parts = value.split(",").map((v: string) => {
              const [url, size] = v.trim().split(" ");
              try {
                const abs = new URL(url || "", base).href;
                if (!isUrlAllowed(abs)) {
                  return `#blocked-url ${size || ""}`;
                }
                return `/proxy?url=${encodeURIComponent(abs)} ${size || ""}`;
              } catch {
                return v;
              }
            });
            return `srcset="${parts.join(", ")}"`;
          });

          html = html.replace(
            /\bformaction=["']([^"']+)["']/gi,
            (match, value) => {
              try {
                const abs = new URL(value, base).href;
                if (!isUrlAllowed(abs)) return `formaction="#blocked-url"`;
                return `formaction="/proxy?url=${encodeURIComponent(abs)}"`;
              } catch {
                return match;
              }
            }
          );

          html = html.replace(/url\(["']?([^"')]+)["']?\)/gi, (match, url) => {
            try {
              const abs = new URL(url, base).href;
              if (!isUrlAllowed(abs)) return `url("#blocked-url")`;
              return `url("/proxy?url=${encodeURIComponent(abs)}")`;
            } catch {
              return match;
            }
          });

          html = html.replace(/<form([^>]*)>/gi, (match, attrs) => {
            const actionMatch = attrs.match(/\baction=["']?([^"'>\s]+)["']?/i);
            let action = actionMatch ? actionMatch[1] : "";

            try {
              if (!action || action === "/") {
                action = base.href;
              }
              const abs = new URL(action, base).href;
              if (!isUrlAllowed(abs)) {
                return `<form${attrs.replace(
                  actionMatch?.[0] || "",
                  ""
                )} action="#blocked-url">`;
              }

              const newAction = `/proxy?url=${encodeURIComponent(abs)}`;
              return `<form${attrs.replace(
                actionMatch?.[0] || "",
                ""
              )} action="${newAction}">`;
            } catch {
              return match;
            }
          });

          return new Response(html, {
            status: res.status,
            headers: {
              ...proxiedHeaders,
              "content-type": "text/html; charset=utf-8",
              "X-Frame-Options": "SAMEORIGIN",
              "X-Content-Type-Options": "nosniff",
            },
          });
        }

        return new Response(res.body as unknown as BodyInit, {
          status: res.status,
          headers: {
            ...proxiedHeaders,
            "X-Content-Type-Options": "nosniff",
          },
        });
      } catch (err) {
        console.error("Proxy error:", err);

        return new Response(
          JSON.stringify({
            error: "Proxy request failed",
            details:
              process.env.NODE_ENV === "development"
                ? err instanceof Error
                  ? err.message
                  : String(err)
                : undefined,
          }),
          {
            status: 500,
            headers: { "content-type": "application/json" },
          }
        );
      }
    },
    {
      body: t.Optional(t.Any()),
    }
  )
  .listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    if (process.env.NODE_ENV === "production") {
      console.log(`Allowed domains: ${Array.from(ALLOWED_DOMAINS).join(", ")}`);
    }
  });

export type AppServer = typeof AppServer;
