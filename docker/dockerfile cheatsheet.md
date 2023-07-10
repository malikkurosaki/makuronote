Here is a Dockerfile cheat sheet that includes a detailed description of each instruction along with an example:

1. FROM:
   - Description: Specifies the base image to build upon.
   - Syntax: `FROM <base_image>[:<tag>]`
   - Example: `FROM ubuntu:20.04`

2. LABEL:
   - Description: Adds metadata to the image.
   - Syntax: `LABEL <key>=<value> [<key>=<value> ...]`
   - Example: `LABEL maintainer="John Doe" version="1.0"`

3. RUN:
   - Description: Executes a command during the build process.
   - Syntax: `RUN <command>`
   - Example: `RUN apt-get update && apt-get install -y curl`

4. CMD:
   - Description: Provides the default command to run when a container is started.
   - Syntax: `CMD ["<executable>", "<param1>", "<param2>", ...]` or `CMD <command>`
   - Example: `CMD ["python", "app.py"]`

5. EXPOSE:
   - Description: Informs Docker that the container listens on specified ports at runtime.
   - Syntax: `EXPOSE <port> [<port>/<protocol> ...]`
   - Example: `EXPOSE 8080`

6. ENV:
   - Description: Sets environment variables in the image.
   - Syntax: `ENV <key>=<value> [<key>=<value> ...]`
   - Example: `ENV MY_VAR=value`

7. ADD:
   - Description: Copies files, directories, or remote URLs and adds them to the image. It can also extract compressed files.
   - Syntax: `ADD <src> <dest>`
   - Example: `ADD app.py /app/`

8. COPY:
   - Description: Copies files or directories from the build context into the image.
   - Syntax: `COPY <src> <dest>`
   - Example: `COPY requirements.txt /app/`

9. WORKDIR:
   - Description: Sets the working directory for subsequent instructions in the Dockerfile.
   - Syntax: `WORKDIR <path>`
   - Example: `WORKDIR /app`

10. VOLUME:
    - Description: Creates a mount point and marks it as externally mountable.
    - Syntax: `VOLUME <path>`
    - Example: `VOLUME /data`

11. USER:
    - Description: Sets the user or UID that will run the subsequent instructions in the Dockerfile.
    - Syntax: `USER <user>[:<group>]` or `USER <UID>[:<GID>]`
    - Example: `USER appuser`

12. ENTRYPOINT:
    - Description: Provides the main command to run as an executable when a container is started.
    - Syntax: `ENTRYPOINT ["<executable>", "<param1>", "<param2>", ...]` or `ENTRYPOINT <command>`
    - Example: `ENTRYPOINT ["python", "app.py"]`

13. HEALTHCHECK:
    - Description: Configures a health check for the container.
    - Syntax: `HEALTHCHECK [--interval=<duration>] [--timeout=<duration>] [--start-period=<duration>] [--retries=<num>] CMD <command>`
    - Example: `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost/ || exit 1`

14. ARG:
    - Description: Defines build-time variables that can be passed to the builder with the `docker build` command.
    - Syntax: `ARG <name>[=<default_value>]`
    - Example: `ARG version=1.0`

15. RUN vs CMD vs ENTRYPOINT:
    - `RUN` executes commands during the build process.
    - `CMD` specifies the default command to run when a container is started.
    - `ENTRYPOINT` provides the main command to run as an executable when a container is started.

This cheat sheet provides an overview of common Dockerfile instructions along with examples. It's important to adapt the instructions to your specific project requirements and consult the Docker documentation for further details and advanced usage.
