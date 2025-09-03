import index from "./index.html";
import { cors } from "@elysiajs/cors";
import Elysia, { t } from "elysia";
import { fetch, Agent } from "undici";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ✅ Agent hanya dipakai di dev/testing (hindari di production)
const agent =
  NODE_ENV === "production"
    ? undefined
    : new Agent({ connect: { rejectUnauthorized: false } });

// ✅ Cache sederhana untuk response (optional)
const responseCache = new Map<string, { data: any; headers: any; timestamp: number; status: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

// ✅ Allowlist domain (opsional untuk keamanan)
const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS?.split(",") || [];
const USE_DOMAIN_ALLOWLIST = ALLOWED_DOMAINS.length > 0;

// ✅ Helper untuk validasi URL yang lebih robust
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Hanya izinkan HTTP/HTTPS
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    
    // Hindari localhost/internal IPs di production
    if (NODE_ENV === "production") {
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "0.0.0.0" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.")
      ) {
        return false;
      }
    }
    
    // Cek allowlist jika diaktifkan
    if (USE_DOMAIN_ALLOWLIST) {
      const domain = parsed.hostname;
      return ALLOWED_DOMAINS.some(allowed => 
        domain === allowed || domain.endsWith(`.${allowed}`)
      );
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
    "set-cookie", // Hindari cookie dari target site
    "www-authenticate",
  ]);

  const out: Record<string, string> = {};
  headers.forEach((value: string, key: string) => {
    const lowerKey = key.toLowerCase();
    if (!forbidden.has(lowerKey)) {
      out[key] = value;
    }
  });
  
  // Tambah header keamanan
  out["x-content-type-options"] = "nosniff";
  out["x-frame-options"] = "SAMEORIGIN";
  
  return out;
}

// ✅ Helper untuk cache
function getCachedResponse(url: string) {
  const cached = responseCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached;
  }
  responseCache.delete(url);
  return null;
}

function setCachedResponse(url: string, data: any, headers: any, status: number) {
  // Batasi ukuran cache
  if (responseCache.size > 100) {
    const oldestKey = responseCache.keys().next().value;
    // responseCache.delete(oldestKey);
  }
  
  responseCache.set(url, {
    data,
    headers,
    status,
    timestamp: Date.now()
  });
}

// ✅ Helper untuk rewrite HTML yang lebih robust
function rewriteHtml(html: string, baseUrl: URL): string {
  // Hapus meta CSP dan security headers
  html = html.replace(
    /<meta[^>]+http-equiv=["'](content-security-policy|x-frame-options)["'][^>]*>/gi,
    ""
  );

  // Inject <base> supaya relative path resolve ke proxy
  html = html.replace(
    /<head([^>]*)>/i,
    `<head$1><base href="/proxy?url=${encodeURIComponent(baseUrl.href)}">`
  );

  // Rewrite href, src, action
  html = html.replace(
    /\b(href|src|action)=["']([^"']+)["']/gi,
    (match, attr, value) => {
      try {
        // Skip javascript:, mailto:, tel:, data: URLs
        if (/^(javascript:|mailto:|tel:|data:)/i.test(value)) {
          return match;
        }
        
        const abs = new URL(value, baseUrl).href;
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
        if (url && !url.startsWith("data:")) {
          const abs = new URL(url, baseUrl).href;
          return `/proxy?url=${encodeURIComponent(abs)} ${size || ""}`;
        }
        return v;
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
        const abs = new URL(value, baseUrl).href;
        return `formaction="/proxy?url=${encodeURIComponent(abs)}"`;
      } catch {
        return match;
      }
    }
  );

  // Rewrite CSS url()
  html = html.replace(/url\(["']?([^"')]+)["']?\)/gi, (match, url) => {
    try {
      if (!url.startsWith("data:")) {
        const abs = new URL(url, baseUrl).href;
        return `url("/proxy?url=${encodeURIComponent(abs)}")`;
      }
      return match;
    } catch {
      return match;
    }
  });

  // ✅ Rewrite <a> tags
  html = html.replace(
    /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
    (match, attrs, href) => {
      try {
        if (/^(javascript:|mailto:|tel:)/i.test(href)) {
          return match;
        }
        
        const abs = new URL(href, baseUrl).href;
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
        const abs = new URL(action, baseUrl).href;
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
        const abs = new URL(src, baseUrl).href;
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
        const abs = new URL(src, baseUrl).href;
        return `<script ${attrs.replace(
          /\s*src=["'][^"']*["']/gi,
          ""
        )} src="/proxy?url=${encodeURIComponent(abs)}"></script>`;
      } catch {
        return match;
      }
    }
  );

  // ✅ Inject script untuk handle _blank (link + form) + console hijack
  const injectedScript = `<script>
    // Prevent console spam
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      if (!args.some(arg => typeof arg === 'string' && arg.includes('proxy'))) {
        originalLog.apply(console, args);
      }
    };
    
    // Handle target=_blank links
    document.addEventListener("click", function(e) {
      const a = e.target.closest("a[data-proxy-blank='1']");
      if (a) {
        e.preventDefault();
        window.open(a.getAttribute("href"), "_blank");
      }
    });
    
    // Handle target=_blank forms
    document.addEventListener("submit", function(e) {
      const f = e.target.closest("form[data-proxy-form-blank='1']");
      if (f) {
        e.preventDefault();
        const formData = new FormData(f);
        const method = (f.getAttribute("method") || "GET").toUpperCase();
        const action = f.getAttribute("action");
        
        if (method === "GET") {
          const params = new URLSearchParams(formData).toString();
          window.open(action + (action.includes("?") ? "&" : "?") + params, "_blank");
        } else {
          const newForm = document.createElement("form");
          newForm.method = method;
          newForm.action = action;
          newForm.target = "_blank";
          
          for (const [k,v] of formData.entries()) {
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
  </script>`;

  html = html.replace(/<\/body>/i, `${injectedScript}</body>`);
  
  return html;
}

const AppServer = new Elysia()
  .use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }))
  .get("/", index)
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .all(
    "/proxy",
    async ({ query, request }) => {
      try {
        const targetUrl = query.url;
        
        // ✅ Validasi URL yang lebih ketat
        if (!targetUrl || typeof targetUrl !== "string") {
          return new Response(
            JSON.stringify({ error: "URL parameter is required" }), 
            {
              status: 400,
              headers: { "content-type": "application/json" },
            }
          );
        }
        
        if (!isValidUrl(targetUrl)) {
          return new Response(
            JSON.stringify({ 
              error: "Invalid URL or domain not allowed",
              allowed: USE_DOMAIN_ALLOWLIST ? ALLOWED_DOMAINS : "all" 
            }), 
            {
              status: 400,
              headers: { "content-type": "application/json" },
            }
          );
        }

        // ✅ Cek cache terlebih dahulu (hanya untuk GET)
        if (request.method === "GET") {
          const cached = getCachedResponse(targetUrl);
          if (cached) {
            console.log(`Cache hit for: ${targetUrl}`);
            return new Response(cached.data, {
              status: cached.status,
              headers: cached.headers,
            });
          }
        }

        // ✅ Forward headers dari request asli (kecuali yang berbahaya)
        const forwardHeaders: Record<string, string> = {};
        const dangerousHeaders = new Set([
          "host", "connection", "upgrade", "proxy-connection",
          "proxy-authorization", "te", "trailer", "transfer-encoding"
        ]);
        
        for (const [key, value] of Object.entries(request.headers)) {
          if (!dangerousHeaders.has(key.toLowerCase()) && value) {
            forwardHeaders[key] = Array.isArray(value) ? value[0] : value;
          }
        }

        // ✅ Fetch dengan timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 detik timeout
        
        try {
          const res = await fetch(targetUrl, {
            method: request.method,
            headers: forwardHeaders,
            body: request.method !== "GET" && request.method !== "HEAD" 
              ? await request.arrayBuffer() 
              : undefined,
            dispatcher: agent,
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          const proxiedHeaders = sanitizeHeaders(res.headers);
          const contentType = res.headers.get("content-type") || "";

          // ✅ Kalau HTML → rewrite
          if (contentType.includes("text/html")) {
            const html = await res.text();
            const baseUrl = new URL(targetUrl);
            const rewrittenHtml = rewriteHtml(html, baseUrl);

            const finalHeaders = {
              ...proxiedHeaders,
              "content-type": "text/html; charset=utf-8",
            };

            // Cache hasil jika GET request
            if (request.method === "GET") {
              setCachedResponse(targetUrl, rewrittenHtml, finalHeaders, res.status);
            }

            return new Response(rewrittenHtml, {
              status: res.status,
              headers: finalHeaders,
            });
          }

          // ✅ Selain HTML → streaming langsung
          const responseHeaders = {
            ...proxiedHeaders,
            "content-type": contentType || "application/octet-stream",
          };

          return new Response(res.body as unknown as BodyInit, {
            status: res.status,
            headers: responseHeaders,
          });
          
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
        
      } catch (err) {
        console.error("Proxy error:", err);
        
        const errorMessage = err instanceof Error ? err.message : String(err);
        const isTimeout = errorMessage.includes("aborted") || errorMessage.includes("timeout");
        
        return new Response(
          JSON.stringify({
            error: isTimeout ? "Request timeout" : errorMessage,
            timestamp: new Date().toISOString(),
          }),
          {
            status: isTimeout ? 408 : 500,
            headers: { "content-type": "application/json" },
          }
        );
      }
    },
    {
      query: t.Object({
        url: t.String({ minLength: 1 }),
      }),
    }
  )
  .onError(({ code, error, set }) => {
    console.error(`Server error [${code}]:`, error);
    
    set.status = 500;
    return { 
      error: "Internal server error",
      timestamp: new Date().toISOString()
    };
  })
  .listen(PORT, () => {
    console.log(`🚀 Proxy Server running at http://localhost:${PORT}`);
    console.log(`📝 Environment: ${NODE_ENV}`);
    console.log(`🔒 Domain allowlist: ${USE_DOMAIN_ALLOWLIST ? ALLOWED_DOMAINS.join(", ") : "disabled"}`);
    console.log(`⚡ Cache TTL: ${CACHE_TTL / 1000}s`);
  });

export type AppServer = typeof AppServer;
