Certainly! Here's a Docker cheat sheet with commonly used commands and operations:

## Image Operations

- Build an image from a Dockerfile:
  ```bash
  docker build -t image_name .
  ```

- List all images:
  ```bash
  docker images
  ```

- Remove an image:
  ```bash
  docker rmi image_name
  ```

- Pull an image from a registry:
  ```bash
  docker pull image_name
  ```

## Container Operations

- Run a container from an image:
  ```bash
  docker run -d --name container_name image_name
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

- Start a stopped container:
  ```bash
  docker start container_name
  ```

- Remove a container:
  ```bash
  docker rm container_name
  ```

- Execute a command inside a running container:
  ```bash
  docker exec container_name command
  ```

## Container Logs and Monitoring

- View logs of a running container:
  ```bash
  docker logs container_name
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

- Connect a container to a network:
  ```bash
  docker network connect network_name container_name
  ```

- Disconnect a container from a network:
  ```bash
  docker network disconnect network_name container_name
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

These are just a few examples of Docker commands and operations. Docker provides a wide range of functionalities and options. For more details and advanced usage, refer to the Docker documentation or use the `docker --help` command to explore available options.
