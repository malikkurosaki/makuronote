```yml
services:
  seafile-mysql:
    image: mariadb:10.11
    container_name: seafile-mysql
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=Production_123
      - MYSQL_DATABASE=seafile
      - MYSQL_USER=bip
      - MYSQL_PASSWORD=Production_123
      - MYSQL_LOG_CONSOLE=true
      - MARIADB_AUTO_UPGRADE=1
    volumes:
      - ./data/mysql:/var/lib/mysql
    networks:
      - makuro-network

  seafile-memcached:
    image: memcached:1.6
    container_name: seafile-memcached
    entrypoint: memcached -m 256
    restart: unless-stopped
    networks:
      - makuro-network

  seafile:
    image: seafileltd/seafile-mc:latest
    container_name: seafile
    restart: unless-stopped
    volumes:
      - ./data/seafile:/shared
    environment:
      - DB_HOST=seafile-mysql
      - DB_ROOT_PASSWD=Production_123
      - SEAFILE_SERVER_HOSTNAME=office2-seafile.wibudev.com
      - SEAFILE_SERVER_PROTOCOL=https
      - SEAFILE_ADMIN_EMAIL=wibu@bip.com
      - SEAFILE_ADMIN_PASSWORD=Production_123
      - SEAFILE_SERVER_LETSENCRYPT=false
      - SEAFILE_USE_HTTPS=true
      - FORCE_HTTPS_IN_CONF=true
      - TIME_ZONE=Asia/Makassar
      - SERVICE_URL=https://office2-seafile.wibudev.com
    depends_on:
      - seafile-mysql
      - seafile-memcached
    networks:
      - makuro-network

networks:
  makuro-network:
    external: true
```

#penanganann error  403
# Enter the seafile container
# `docker exec -it seafile bash`

# Edit the seahub_settings.py file
# `vi /opt/seafile/conf/seahub_settings.py`

# tambahkan
#ALLOWED_HOSTS = ['office2-seafile.wibudev.com', 'localhost', '127.0.0.1']
#CSRF_TRUSTED_ORIGINS = ['https://office2-seafile.wibudev.com']
