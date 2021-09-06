# catatan docker

```
location /route {
    proxy_pass  http://127.0.0.1:9000/;
}
```

```
location /route/ {
    rewrite ^/route/?(.*)$ /$1 break;    
    proxy_pass  http://127.0.0.1:9000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```


### command

```
docker start --help
docker start nx
docker exec -it nx nginx -s reload
docker exec -it nx bash
docker ps -a
docker run --name docker-nginx -p 80:80 -d nginx
```

### auto restart

```
run -d --restart unless-stopped -p 8080:80 --name nx  makuro/nx
```

### commit

```
docker commit [dockerid] [docker image]
```
