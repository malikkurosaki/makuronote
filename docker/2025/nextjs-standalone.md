<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```Dockerfile
FROM oven/bun:canary-slim AS runner

WORKDIR /app

# Salin hasil build
COPY .next/standalone/ ./      
COPY public ./public           
COPY .next/static ./.next/static

EXPOSE 3000

CMD ["bun", "server.js"]
```
