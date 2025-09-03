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

        // ✅ Kalau HTML → rewrite
        if (res.headers.get("content-type")?.includes("text/html")) {
          let html = await res.text();
          const base = new URL(targetUrl);

          // Hapus meta CSP
          html = html.replace(
            /<meta[^>]+http-equiv=["']content-security-policy["'][^>]*>/gi,
            ""
          );

          // Inject <base> supaya relative path resolve ke proxy
          html = html.replace(
            /<head([^>]*)>/i,
            `<head$1><base href="/proxy?url=${encodeURIComponent(base.href)}">`
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

          // ✅ Rewrite <a> tags
          html = html.replace(
            /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
            (match, attrs, href) => {
              try {
                const abs = new URL(href, base).href;
                const hasBlank = /\btarget=["']?_blank["']?/i.test(attrs);
                let newAttrs = attrs
                  .replace(/\s*target=["'][^"']*["']/gi, "")
                  .trim();

                return `<a ${newAttrs} href="/proxy?url=${encodeURIComponent(
                  abs
                )}" ${hasBlank ? 'data-proxy-blank="1"' : ""}>`;
              } catch {
                return match;
              }
            }
          );

          // ✅ Rewrite <form> tags
          html = html.replace(
            /<form\s+([^>]*action=["']([^"']+)["'][^>]*)>/gi,
            (match, attrs, action) => {
              try {
                const abs = new URL(action, base).href;
                const hasBlank = /\btarget=["']?_blank["']?/i.test(attrs);
                let newAttrs = attrs
                  .replace(/\s*target=["'][^"']*["']/gi, "")
                  .trim();

                return `<form ${newAttrs} action="/proxy?url=${encodeURIComponent(
                  abs
                )}" ${hasBlank ? 'data-proxy-form-blank="1"' : ""}>`;
              } catch {
                return match;
              }
            }
          );

          // ✅ Rewrite <iframe> tags
          html = html.replace(
            /<iframe\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi,
            (match, attrs, src) => {
              try {
                const abs = new URL(src, base).href;
                return `<iframe ${attrs.replace(
                  /\s*src=["'][^"']*["']/gi,
                  ""
                )} src="/proxy?url=${encodeURIComponent(abs)}">`;
              } catch {
                return match;
              }
            }
          );

          // ✅ Rewrite <script src> tags
          html = html.replace(
            /<script\s+([^>]*src=["']([^"']+)["'][^>]*)><\/script>/gi,
            (match, attrs, src) => {
              try {
                const abs = new URL(src, base).href;
                return `<script ${attrs.replace(
                  /\s*src=["'][^"']*["']/gi,
                  ""
                )} src="/proxy?url=${encodeURIComponent(abs)}"></script>`;
              } catch {
                return match;
              }
            }
          );

          // ✅ Inject script untuk handle _blank (link + form)
          html = html.replace(
            /<\/body>/i,
            `<script>
              document.addEventListener("click", function(e) {
                const a = e.target.closest("a[data-proxy-blank='1']");
                if (a) {
                  e.preventDefault();
                  window.open(a.getAttribute("href"), "_blank");
                }
              });

              document.addEventListener("submit", function(e) {
                const f = e.target.closest("form[data-proxy-form-blank='1']");
                if (f) {
                  e.preventDefault();
                  const formData = new FormData(f);
                  const method = (f.getAttribute("method") || "GET").toUpperCase();
                  const action = f.getAttribute("action");

                  if (method === "GET") {
                    const params = new URLSearchParams(formData).toString();
                    window.open(
                      action + (action.includes("?") ? "&" : "?") + params,
                      "_blank"
                    );
                  } else {
                    const newForm = document.createElement("form");
                    newForm.method = method;
                    newForm.action = action;
                    newForm.target = "_blank";

                    for (const [k, v] of formData.entries()) {
                      const input = document.createElement("input");
                      input.type = "hidden";
                      input.name = k;
                      input.value = v;
                      newForm.appendChild(input);
                    }

                    document.body.appendChild(newForm);
                    newForm.submit();
                    document.body.removeChild(newForm);
                  }
                }
              });
            </script></body>`
          );

          return new Response(html, {
            status: res.status,
            headers: {
              ...proxiedHeaders,
              "content-type": "text/html; charset=utf-8",
            },
          });
        }

        // ✅ Selain HTML → streaming langsung
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
