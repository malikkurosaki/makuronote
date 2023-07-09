Tentu! Berikut adalah cheat sheet Docker lengkap dengan contoh-contoh dan penjelasan untuk berbagai operasi dan perintah yang umum digunakan:

## Image Operations

- Build an image from a Dockerfile:
  ```bash
  docker build -t image_name .
  ```

  Contoh:
  ```bash
  docker build -t myimage .
  ```

- List all images:
  ```bash
  docker images
  ```

- Remove an image:
  ```bash
  docker rmi image_name
  ```

  Contoh:
  ```bash
  docker rmi myimage
  ```

- Pull an image from a registry:
  ```bash
  docker pull image_name
  ```

  Contoh:
  ```bash
  docker pull nginx
  ```

## Container Operations

- Run a container from an image:
  ```bash
  docker run -d --name container_name image_name
  ```

  Contoh:
  ```bash
  docker run -d --name mycontainer nginx
  ```

- List all running containers:
  ```bash
  docker ps
  ```

- List all containers (including stopped ones):
  ```bash
  docker ps -a
  ```

- Stop a running container:
  ```bash
  docker stop container_name
  ```

  Contoh:
  ```bash
  docker stop mycontainer
  ```

- Start a stopped container:
  ```bash
  docker start container_name
  ```

  Contoh:
  ```bash
  docker start mycontainer
  ```

- Remove a container:
  ```bash
  docker rm container_name
  ```

  Contoh:
  ```bash
  docker rm mycontainer
  ```

- Execute a command inside a running container:
  ```bash
  docker exec container_name command
  ```

  Contoh:
  ```bash
  docker exec mycontainer ls -l
  ```

## Container Logs and Monitoring

- View logs of a running container:
  ```bash
  docker logs container_name
  ```

  Contoh:
  ```bash
  docker logs mycontainer
  ```

- Monitor resource usage of containers:
  ```bash
  docker stats
  ```

## Networking

- List all Docker networks:
  ```bash
  docker network ls
  ```

- Create a Docker network:
  ```bash
  docker network create network_name
  ```

  Contoh:
  ```bash
  docker network create mynetwork
  ```

- Connect a container to a network:
  ```bash
  docker network connect network_name container_name
  ```

  Contoh:
  ```bash
  docker network connect mynetwork mycontainer
  ```

- Disconnect a container from a network:
  ```bash
  docker network disconnect network_name container_name
  ```

  Contoh:
  ```bash
  docker network disconnect mynetwork mycontainer
  ```

## Docker Compose

- Start services defined in a Compose file:
  ```bash
  docker-compose up
  ```

- Start services in the background:
  ```bash
  docker-compose up -d
  ```

- Stop services defined in a Compose file:
  ```bash
  docker-compose down
  ```

Ini adalah beberapa contoh perintah dan operasi Docker yang umum digunakan. Docker menyediakan berbagai fungsionalitas dan opsi yang luas. Untuk lebih lengkapnya dan penggunaan lanjutan, silakan merujuk ke dokumentasi Docker atau menggunakan perintah `docker --help` untuk menjelajahi opsi yang tersedia.
