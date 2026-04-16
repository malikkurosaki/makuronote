services:
  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    restart: unless-stopped
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - public-net
    configs:
      - source: frpc_config
        target: /etc/frp/frpc.toml
    mem_limit: 64m
    cpus: "0.25"
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: "3"

  ollama-proxy:
    image: oven/bun:1-alpine
    container_name: ollama-proxy
    restart: unless-stopped
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - public-net
    environment:
      TOKEN: sk-wibu-rahasia123
      UPSTREAM: http://host.docker.internal:11434
    command:
      - bun
      - -e
      - |
        Bun.serve({
          port: 8080,
          async fetch(req) {
            if (req.headers.get("authorization") !== "Bearer " + process.env.TOKEN) {
              return new Response("Unauthorized", { status: 401 });
            }
            const url = new URL(req.url);
            const target = process.env.UPSTREAM + url.pathname + url.search;
            return fetch(target, {
              method: req.method,
              headers: req.headers,
              body: ["GET","HEAD"].includes(req.method) ? undefined : req.body,
              duplex: "half"
            });
          }
        });
        console.log("Proxy on :8080 → " + process.env.UPSTREAM);

configs:
  frpc_config:
    content: |
      serverAddr = "connect.wibudev.com"
      serverPort = 443
      auth.token = "f435b971b48495e07f3c0a9295ff0c7b242c5078c191879cef42154effeaeb7e"
      transport.protocol = "wss"
      transport.heartbeatInterval = 30
      transport.heartbeatTimeout = 90

      [[proxies]]
      name = "claude-local"
      type = "http"
      localIP = "host.docker.internal"
      localPort = 8317
      customDomains = ["claude-localx.wibudev.com"]

      [[proxies]]
      name = "openweb"
      type = "http"
      localIP = "host.docker.internal"
      localPort = 3080
      customDomains = ["openweb-ui.wibudev.com"]

      [[proxies]]
      name = "ollama"
      type = "http"
      localIP = "ollama-proxy"
      localPort = 8080
      customDomains = ["ollama.wibudev.com"]

      transport.proxyProtocolVersion = ""

networks:
  public-net:
    external: true
