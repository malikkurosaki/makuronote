# HTTP server configuration
server {
    listen 80 http2;
    server_name auto.wibudev.com;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_min_length 256;

    # Optimize connection settings
    keepalive_timeout 65;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    location / {
        # Apply rate limiting
        limit_req zone=one burst=500 nodelay;
        limit_conn addr 200;
        error_page 503 = @rate_limited;

        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Buffer and timeout settings
        proxy_buffering on;
        proxy_buffers 16 64k;
        proxy_buffer_size 128k;
        proxy_busy_buffers_size 256k;
        proxy_max_temp_file_size 2048m;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Caching
        proxy_cache my_cache;
        proxy_cache_valid 200 1m;
        proxy_cache_key $scheme$proxy_host$request_uri;
    }

    # Custom error page for rate limiting
    location @rate_limited {
        return 429;  # Too Many Requests
    }

    # Static content caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|html)$ {
        expires 1y;
        log_not_found off;
        access_log off;
        try_files $uri $uri/ =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Explicitly set the content type for .html files
    location ~* \.html$ {
        add_header Content-Type text/html;
    }
}
