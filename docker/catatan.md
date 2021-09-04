# catatan docker

```
location /route {
    proxy_pass  http://127.0.0.1:9000/;
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
