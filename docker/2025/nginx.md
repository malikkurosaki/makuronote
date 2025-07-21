# NGINX

docker-compose.yml

```yml
services:
  nginx:
    image: nginx:latest
    container_name: nginx-router
    restart: always
    ports:
      - "4000:80"  
    volumes:
       - ./default.conf:/etc/nginx/conf.d/default.conf:ro
       - ./html:/usr/share/nginx/html:ro
    networks:
      - makuro-network

networks:
  makuro-network:
    external: true
```

default.conf

```conf
# Mapping subdomain ke container:port
map $subdomain $upstream_url {
    # container langsung
    wibugit     wibugit:3000;

    # semua subdomain lain ke FRP reverse proxy
    default     frps:4080;
}

server {
    listen 80;
    server_name ~^(?<subdomain>[^.]+)\.wibudev\.com$;

    resolver 127.0.0.11 valid=10s;
    client_max_body_size 200M;

    location / {
        proxy_pass http://$upstream_url;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;

        proxy_intercept_errors on;  # <- penting

        error_page 502 503 504 = /err_5x.html;
        error_page 404 = /err_404.html;
    }
    
    location = /err_5x.html {
        root /usr/share/nginx/html;
        internal;
    }

    location = /err_404.html {
        root /usr/share/nginx/html;
        internal;
    }

}
```

html/err_5x.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Service Unavailable</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    </style>
</head>
<body>
    <h1>Oops! Service unavailable.</h1>
    <p>The service is currently down or not responding.</p>
    <p><em>Faithfully yours, nginx.</em></p>
</body>
</html>
```

html/err_404.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Service Unavailable</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    </style>
</head>
<body>
    <h1>Oops! Service unavailable.</h1>
    <p>The service is currently down or not responding.</p>
    <p><em>404 | Not Found</em></p>
</body>
</html>
```
