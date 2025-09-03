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
  ]);

  const out: Record<string, string> = {};

  // @ts-ignore → baik undici.Headers maupun native Headers support .forEach
  headers.forEach((value: string, key: string) => {
    if (!forbidden.has(key.toLowerCase())) {
      out[key] = value;
    }
  });

  return out;
}

const AppServer = new Elysia()
  .use(cors())
  .get("*", index)
  .get(
    "/proxy",
    async ({ query }) => {
      try {
        const targetUrl = query.url;
        if (!targetUrl.startsWith("http")) {
          return new Response(JSON.stringify({ error: "Invalid URL" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const res = await fetch(targetUrl, { dispatcher: agent });
        const proxiedHeaders = sanitizeHeaders(res.headers);

        // ✅ HTML → rewrite
        if (res.headers.get("content-type")?.includes("text/html")) {
          let html = await res.text();
          const base = new URL(targetUrl);

          // Hapus meta CSP
          html = html.replace(
            /<meta[^>]+http-equiv=["']content-security-policy["'][^>]*>/gi,
            ""
          );

          // Inject <base>
          html = html.replace(
            /<head([^>]*)>/i,
            `<head$1><base href="${base.origin}/">`
          );

          // Rewrite href, src, action
          html = html.replace(
            /\b(href|src|action)=["']([^"']+)["']/gi,
            (match, attr, value) => {
              try {
                const abs = new URL(value, base).href;
                return `${attr}="/proxy?url=${encodeURIComponent(abs)}"`;
              } catch {
                return match;
              }
            }
          );

          // Rewrite srcset
          html = html.replace(/\bsrcset=["']([^"']+)["']/gi, (match, value) => {
            const parts = value.split(",").map((v: string) => {
              const [url, size] = v.trim().split(" ");
              try {
                const abs = new URL(url || "", base).href;
                return `/proxy?url=${encodeURIComponent(abs)} ${size || ""}`;
              } catch {
                return v;
              }
            });
            return `srcset="${parts.join(", ")}"`;
          });

          // Rewrite formaction
          html = html.replace(
            /\bformaction=["']([^"']+)["']/gi,
            (match, value) => {
              try {
                const abs = new URL(value, base).href;
                return `formaction="/proxy?url=${encodeURIComponent(abs)}"`;
              } catch {
                return match;
              }
            }
          );

          // Rewrite CSS url()
          html = html.replace(/url\(["']?([^"')]+)["']?\)/gi, (match, url) => {
            try {
              const abs = new URL(url, base).href;
              return `url("/proxy?url=${encodeURIComponent(abs)}")`;
            } catch {
              return match;
            }
          });

          return new Response(html, {
            status: res.status,
            headers: {
              ...proxiedHeaders,
              "content-type": "text/html; charset=utf-8",
            },
          });
        }

        // ✅ Selain HTML → streaming langsung (cast biar TS nggak error)
        return new Response(res.body as unknown as BodyInit, {
          status: res.status,
          headers: proxiedHeaders,
        });
      } catch (err) {
        console.error("Proxy error:", err);
        return new Response(
          JSON.stringify({
            error: err instanceof Error ? err.message : String(err),
          }),
          {
            status: 500,
            headers: { "content-type": "application/json" },
          }
        );
      }
    },
    {
      query: t.Object({
        url: t.String(),
      }),
    }
  )
  .listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

export type AppServer = typeof AppServer;
