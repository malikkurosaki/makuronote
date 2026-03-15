import { watch } from "fs"
import { clients } from "./allowed.toml"

type ClientConfig = { ssh: string; web: string[] }

let ALLOWED_DOMAINS = buildAllowedSet(clients)

function buildAllowedSet(clients: ClientConfig[]) {
  return new Set(
    clients.flatMap((c) => [c.ssh, ...c.web].filter(Boolean))
  )
}

// Hot reload saat allowed.toml berubah
watch("./allowed.toml", () => {
  console.log("[config] file changed, reloading...")
  import("./allowed.toml?t=" + Date.now()).then((m) => {
    ALLOWED_DOMAINS = buildAllowedSet(m.clients)
    console.log(`[config] reloaded, ${ALLOWED_DOMAINS.size} allowed domains`)
  })
})

const ALLOWED_TYPES = new Set(["tcpmux", "http", "https"])

Bun.serve({
  port: 7200,
  async fetch(req) {
    const body = await req.json()
    const { op, content } = body

    if (op === "NewProxy") {
      const proxyType: string = content?.proxy_type
      const domain: string = content?.custom_domains?.[0]

      console.log(`[NewProxy] type=${proxyType} domain=${domain}`)

      if (!domain)
        return Response.json({ reject: true, reject_reason: "Domain required", unchange: true })

      if (!ALLOWED_DOMAINS.has(domain))
        return Response.json({ reject: true, reject_reason: `Domain '${domain}' not allowed`, unchange: true })

      if (!ALLOWED_TYPES.has(proxyType))
        return Response.json({ reject: true, reject_reason: `Proxy type '${proxyType}' not allowed`, unchange: true })
    }

    return Response.json({ reject: false, unchange: true })
  },
})

console.log("frp plugin running on :7200")
