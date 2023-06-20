### create new mysql container

```bash
docker run --name mysql1 -p 3307:3306 -e MYSQL_ROOT_PASSWORD=Makuro_123 -e MYSQL_USER=bip -e MYSQL_PASSWORD=Production_123 -d mysql:latest
```

