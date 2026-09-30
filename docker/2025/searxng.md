<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```yml
services:
  search:
    image: searxng/searxng:latest
    container_name: search
    restart: unless-stopped
    environment:
      - BASE_URL=https://search.wibudev.com
      - INSTANCE_NAME=WibuSearch
      - AUTOCOMPLETE=google
    volumes:
      - ./searxng:/etc/searxng
    networks:
      - makuro-network
networks:
  makuro-network:
    external: true
```


pada searxng/settings.yml cari search tambahkan - json

```yml
search:
  safe_search: 0
  formats:
    - html
    - json
```
