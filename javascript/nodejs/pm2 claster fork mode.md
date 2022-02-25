
### cluster

```json
{
  "apps": [
    {
      "name": "app_name",
      "script": "/software/app_name/dist/main.js",
      "instances": 2,
      "exec_mode": "cluster",
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/software/app_name/logs/errors.txt",
      "out_file": "/software/app_name/logs/logs.txt",
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 3000,
        "JWT_SEED": "secretKey"
      }
    }
  ]
}
```

### fork

```json
{
  "apps": [
    {
      "name": "app_name",
      "script": "/software/app_name/dist/main.js",
      "instances": 4,
      "exec_mode": "fork",
      "increment_var": "PORT",
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/software/app_name/logs/errors.txt",
      "out_file": "/software/app_name/logs/logs.txt",
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 3000,
        "JWT_SEED": "secret"
      }
    }
  ]
}
```

