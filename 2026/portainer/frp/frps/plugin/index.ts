import { readFileSync, watchFile } from "fs"

const CONFIG_PATH = "./allowed.json"

type ClientConfig = { ssh: string; web: string[] }

let ALLOWED_DOMAINS = new Set<string>()

function loadConfig() {
  const raw = readFileSync(CONFIG_PATH, "utf-8")
  const config = JSON.parse(raw) as { clients: ClientConfig[] }

  ALLOWED_DOMAINS = new Set(
    config.clients.flatMap((c) => [c.ssh, ...c.web].filter(Boolean))
  )

  console.log(`[config] loaded ${config.clients.length} clients, ${ALLOWED_DOMAINS.size} allowed domains`)
}

loadConfig()

watchFile(CONFIG_PATH, () => {
  console.log("[config] file changed, reloading...")
  loadConfig()
})

const ALLOWED_TYPES = new Set(["tcpmux", "http", "https"])

Bun.serve({
  port: 7200,
  async fetch(req) {
    const body = await req.json()
    const { op, content } = body

    console.log(`[RAW] op=${op}`, JSON.stringify(content))

    if (op === "NewProxy") {
      const proxyType: string = content?.proxy_type
      const domain: string = content?.custom_domains?.[0]

      console.log(`[NewProxy] type=${proxyType} domain=${domain}`)

      if (!domain) {
        return Response.json({ reject: true, reject_reason: "Domain required", unchange: true })
      }

      if (!ALLOWED_DOMAINS.has(domain)) {
        return Response.json({ reject: true, reject_reason: `Domain '${domain}' not allowed`, unchange: true })
      }

      if (!ALLOWED_TYPES.has(proxyType)) {
        return Response.json({ reject: true, reject_reason: `Proxy type '${proxyType}' not allowed`, unchange: true })
      }
    }

    // ← tambah unchange: true di sini
    return Response.json({ reject: false, unchange: true })
  },
})

console.log("frp plugin running on :7200")
